import type { Page } from "@playwright/test";
import { expect, ME, PARTNER, test } from "./fake-supabase";

test.beforeEach(async ({ context, supabase }) => {
  supabase.link();
  await supabase.signIn(context);
});

const bar = (page: Page) => page.getByRole("region", { name: "Send Ben a reaction" });
// A plain button inside an always-mounted live region (role="status").
const banner = (page: Page) => page.getByRole("button", { name: /^Ben (sent you|is thinking of you)/ });

/** Pretend the tab went to the background (or the phone locked), or came back. */
async function setPageVisible(page: Page, visible: boolean) {
  await page.evaluate((v) => {
    Object.defineProperty(document, "visibilityState", { configurable: true, get: () => (v ? "visible" : "hidden") });
    Object.defineProperty(document, "hidden", { configurable: true, get: () => !v });
    document.dispatchEvent(new Event("visibilitychange"));
  }, visible);
}

test.describe("sending", () => {
  test("a tap sends the reaction and shows it was sent", async ({ page, supabase }) => {
    await page.goto("/");
    await bar(page).getByRole("button", { name: "Hug" }).click();

    await expect(bar(page).getByRole("button", { name: "Sent" })).toBeVisible();
    await expect(bar(page).getByText("Ben will see it right away.")).toBeVisible();
    await expect.poll(() => supabase.reactions[ME]?.kind).toBe("hug");
    const sent = supabase.requests.find((r) => r.url().includes("/rest/v1/reactions") && r.method() === "POST");
    // Only the kind is sent; who and when are decided by the server.
    expect(sent?.postDataJSON()).toEqual({ user_id: ME, kind: "hug" });
  });

  test("buttons rest briefly after sending, then come back", async ({ page }) => {
    await page.goto("/");
    await bar(page).getByRole("button", { name: "Heart" }).click();
    await expect(bar(page).getByRole("button", { name: "Thinking of you" })).toBeDisabled();
    await expect(bar(page).getByRole("button", { name: "Heart" })).toBeEnabled({ timeout: 5_000 });
    await expect(bar(page).getByRole("button", { name: "Thinking of you" })).toBeEnabled();
  });
});

test.describe("receiving", () => {
  test("the partner's reaction pops in live, then goes away by itself", async ({ page, supabase }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
    await expect(banner(page)).toHaveCount(0);

    supabase.benReacts("thinking_of_you");
    await expect(banner(page)).toHaveText(/Ben is thinking of you/);
    await expect(banner(page)).toHaveCount(0, { timeout: 8_000 });
  });

  test("is announced: the banner sits inside a live region", async ({ page, supabase }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
    supabase.benReacts("heart");
    await expect(page.getByRole("status").filter({ has: banner(page) })).toHaveCount(1);
  });

  // Regression: a reaction that arrived while the app was in the background
  // used to count down and be marked seen unseen, so it was never shown.
  test("one that arrives in the background waits until you come back", async ({ page, supabase }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
    await setPageVisible(page, false);
    supabase.benReacts("hug");
    await page.waitForTimeout(6_500); // longer than the 5s it shows for
    expect(await page.evaluate(() => localStorage.getItem("reaction-seen:v1"))).toBeNull();

    await setPageVisible(page, true);
    await expect(banner(page)).toHaveText(/Ben sent you a hug/);
    await expect(banner(page)).toHaveCount(0, { timeout: 8_000 });
    expect(await page.evaluate(() => localStorage.getItem("reaction-seen:v1"))).not.toBeNull();
  });

  test("tapping the banner dismisses it", async ({ page, supabase }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
    supabase.benReacts("heart");
    await banner(page).click();
    await expect(banner(page)).toHaveCount(0);
  });

  test("a recent reaction you haven't seen shows when you open the app, once", async ({ page, supabase }) => {
    supabase.reactions[PARTNER] = {
      user_id: PARTNER,
      kind: "hug",
      sent_at: new Date(Date.now() - 3 * 60_000).toISOString(),
    };
    await page.goto("/");
    await expect(banner(page)).toHaveText(/Ben sent you a hug/);
    await banner(page).click();

    await page.reload();
    await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
    await expect(banner(page)).toHaveCount(0);
  });

  test("an old reaction isn't replayed", async ({ page, supabase }) => {
    supabase.reactions[PARTNER] = {
      user_id: PARTNER,
      kind: "heart",
      sent_at: new Date(Date.now() - 60 * 60_000).toISOString(),
    };
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
    await expect(banner(page)).toHaveCount(0);
  });

  test("a new reaction shows even after the previous one was seen", async ({ page, supabase }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "You & Ben" })).toBeVisible();
    supabase.benReacts("heart");
    await banner(page).click();
    supabase.benReacts("hug", new Date(Date.now() + 1_000));
    await expect(banner(page)).toHaveText(/Ben sent you a hug/);
  });
});
