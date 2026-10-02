import type { Page } from "@playwright/test";
import { expect, ME, PARTNER, PARTNER_CODE, test } from "./fake-supabase";

test.beforeEach(async ({ context, supabase }) => {
  await supabase.signIn(context);
});

const codeInput = (page: Page) => page.getByLabel("Got your partner's code?");
const askButton = (page: Page) => page.getByRole("button", { name: "Ask to link" });
const home = (page: Page) => page.getByRole("heading", { name: "You & Ben" });
const linkRequest = (page: Page) => page.getByRole("group", { name: "Link request" });

test.describe("sharing your code", () => {
  test("a request arrives live; accepting links you", async ({ page, supabase }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Get a code" }).click();
    await expect(page.getByText("K7P 2MX")).toBeVisible();
    await expect(page.getByText(/Works for 24 more hours/)).toBeVisible();

    supabase.requestFromBen();
    const request = linkRequest(page);
    await expect(request.getByText("Ben wants to link with you.")).toBeVisible();
    await expect(request.getByText("ben@example.com")).toBeVisible();
    // Nothing is linked until Ana says yes.
    expect(supabase.profiles[ME].partner_id).toBeNull();

    await request.getByRole("button", { name: "Accept" }).click();
    await expect(home(page)).toBeVisible();
    expect(supabase.profiles[ME].partner_id).toBe(PARTNER);
  });

  test("declining cancels the code", async ({ page, supabase }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Get a code" }).click();
    supabase.requestFromBen();
    await linkRequest(page).getByRole("button", { name: "Decline" }).click();

    await expect(page.getByText("Declined. That code no longer works")).toBeVisible();
    await expect(page.getByRole("button", { name: "Get a code" })).toBeVisible();
    expect(supabase.invite).toBeNull();
    expect(supabase.profiles[ME].partner_id).toBeNull();
  });

  test("a request waiting on reload is still shown", async ({ page, supabase }) => {
    supabase.invite = {
      code: "HJW456",
      expires_at: new Date(Date.now() + 3 * 3_600_000).toISOString(),
      requested_name: "Ben",
      requested_email: "ben@example.com",
    };
    await page.goto("/");
    await expect(linkRequest(page).getByText("Ben wants to link with you.")).toBeVisible();
  });

  test("a new code replaces the old one", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Get a code" }).click();
    await expect(page.getByText("K7P 2MX")).toBeVisible();
    await page.getByRole("button", { name: "Get a new code" }).click();
    await expect(page.getByText("QRS 789")).toBeVisible();
    await expect(page.getByText("K7P 2MX")).toHaveCount(0);
  });

  test("an open code is shown again after a reload", async ({ page, supabase }) => {
    supabase.invite = {
      code: "HJW456",
      expires_at: new Date(Date.now() + 3 * 3_600_000 - 60_000).toISOString(),
      requested_name: null,
      requested_email: null,
    };
    await page.goto("/");
    await expect(page.getByText("HJW 456")).toBeVisible();
    await expect(page.getByText(/Works for 3 more hours/)).toBeVisible();
  });

  test("share copies the code where there's no share sheet", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium", "Clipboard permissions are Chromium-only in Playwright.");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => {
      // @ts-expect-error -- simulate a browser without the Web Share API
      delete Navigator.prototype.share;
    });
    await page.goto("/");
    await page.getByRole("button", { name: "Get a code" }).click();
    await page.getByRole("button", { name: "Share code" }).click();
    await expect(page.getByText("Code copied.")).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("K7P2MX");
  });
});

test.describe("using your partner's code", () => {
  test("sends a request, then moves on once they accept", async ({ page, supabase }) => {
    await page.goto("/");
    await expect(askButton(page)).toBeDisabled();
    await codeInput(page).fill(" ben-234 ");
    await askButton(page).click();

    await expect(page.getByText("Waiting for Ben to accept…")).toBeVisible();
    const sent = supabase.requests.find((r) => r.url().endsWith("/rpc/request_pair"));
    expect(sent?.postDataJSON()).toEqual({ invite_code: " ben-234 " });
    expect(supabase.profiles[ME].partner_id).toBeNull();

    supabase.benApproves();
    await expect(home(page)).toBeVisible();
  });

  test("says so when the request is declined", async ({ page, supabase }) => {
    await page.goto("/");
    await codeInput(page).fill(PARTNER_CODE);
    await askButton(page).click();
    await expect(page.getByText("Waiting for Ben to accept…")).toBeVisible();

    // Ben declines: the request disappears and nobody is linked. Picked up by the poll.
    supabase.myRequest = null;
    await expect(page.getByText("Ben didn't accept, or the code expired.")).toBeVisible({ timeout: 10_000 });
    await expect(askButton(page)).toBeVisible();
  });

  test("a pending request is shown again after a reload, and can be cancelled", async ({ page, supabase }) => {
    supabase.myRequest = { owner_name: "Ben" };
    await page.goto("/");
    await expect(page.getByText("Waiting for Ben to accept…")).toBeVisible();
    await page.getByRole("button", { name: "Cancel request" }).click();
    await expect(askButton(page)).toBeVisible();
    expect(supabase.myRequest).toBeNull();
  });

  test("a wrong code says so and stays on the screen", async ({ page }) => {
    await page.goto("/");
    await codeInput(page).fill("ZZZ999");
    await askButton(page).click();
    await expect(page.getByText("That code doesn't work. Check it, or ask for a new one.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Almost there" })).toBeVisible();
  });

  test("your own code is refused", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Get a code" }).click();
    await expect(page.getByText("K7P 2MX")).toBeVisible();
    await codeInput(page).fill("k7p 2mx");
    await askButton(page).click();
    await expect(page.getByText("That's your own code. Send it to your partner instead.")).toBeVisible();
  });

  test("too many wrong guesses are refused, even with the right code", async ({ page, supabase }) => {
    supabase.misses = 10;
    await page.goto("/");
    await codeInput(page).fill(PARTNER_CODE);
    await askButton(page).click();
    await expect(page.getByText("Too many tries. Wait a bit and try again.")).toBeVisible();
    expect(supabase.myRequest).toBeNull();
  });
});
