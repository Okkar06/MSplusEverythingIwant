import { expect, PARTNER_CODE, test, ME, PARTNER } from "./fake-supabase";

test.beforeEach(async ({ context, supabase }) => {
  await supabase.signIn(context);
});

const codeInput = (page: import("@playwright/test").Page) => page.getByLabel("Got your partner's code?");
const linkButton = (page: import("@playwright/test").Page) => page.getByRole("button", { name: "Link us" });
const home = (page: import("@playwright/test").Page) => page.getByRole("heading", { name: "You & Ben" });

test("shares a code, and moves on by itself when the partner uses it", async ({ page, supabase }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Get a code" }).click();
  await expect(page.getByText("K7P 2MX")).toBeVisible();
  await expect(page.getByText(/Works for 24 more hours/)).toBeVisible();

  // Ben types the code on his phone: the server links both profiles and
  // Realtime tells Ana's app about her changed profile.
  supabase.link();
  supabase.push("profiles", "UPDATE", supabase.profiles[ME]);
  await expect(home(page)).toBeVisible();
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
  supabase.invite = { code: "HJW456", expires_at: new Date(Date.now() + 3 * 3_600_000 - 60_000).toISOString() };
  await page.goto("/");
  await expect(page.getByText("HJW 456")).toBeVisible();
  await expect(page.getByText(/Works for 3 more hours/)).toBeVisible();
});

test("links up with the partner's code, however it's typed", async ({ page, supabase }) => {
  await page.goto("/");
  await expect(linkButton(page)).toBeDisabled();
  await codeInput(page).fill(" ben-234 ");
  await linkButton(page).click();
  await expect(home(page)).toBeVisible();

  const accept = supabase.requests.find((r) => r.url().endsWith("/rpc/accept_pair_invite"));
  expect(accept?.postDataJSON()).toEqual({ invite_code: " ben-234 " });
  expect(supabase.profiles[ME].partner_id).toBe(PARTNER);
});

test("a wrong code says so and stays on the screen", async ({ page }) => {
  await page.goto("/");
  await codeInput(page).fill("ZZZ999");
  await linkButton(page).click();
  await expect(page.getByText("That code doesn't work. Check it, or ask for a new one.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Almost there" })).toBeVisible();
});

test("your own code is refused", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Get a code" }).click();
  await expect(page.getByText("K7P 2MX")).toBeVisible();
  await codeInput(page).fill("k7p 2mx");
  await linkButton(page).click();
  await expect(page.getByText("That's your own code. Send it to your partner instead.")).toBeVisible();
});

test("too many wrong guesses are refused, even with the right code", async ({ page, supabase }) => {
  supabase.misses = 10;
  await page.goto("/");
  await codeInput(page).fill(PARTNER_CODE);
  await linkButton(page).click();
  await expect(page.getByText("Too many tries. Wait a bit and try again.")).toBeVisible();
  await expect(home(page)).toHaveCount(0);
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
