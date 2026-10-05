import type { Page } from "@playwright/test";
import { expect, ME, PARTNER, test } from "./fake-supabase";

const SNAPSHOT_KEY = `couple-snapshot:v1:${ME}`;

test.beforeEach(async ({ context, supabase }) => {
  supabase.link();
  supabase.setMood(PARTNER, "calm", "Reading in the sun");
  await supabase.signIn(context);
});

const home = (page: Page) => page.getByRole("heading", { name: "You & Ben" });
const notice = (page: Page) =>
  page.getByRole("status").filter({ hasText: "Showing what you last saw" });
const bensMood = (page: Page) =>
  page.getByRole("region", { name: "Ben's current mood" });

test("a visit saves a copy on this device", async ({ page }) => {
  await page.goto("/");
  await expect(home(page)).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        (k) => JSON.parse(localStorage.getItem(k) ?? "null")?.moods,
        SNAPSHOT_KEY,
      ),
    )
    .toMatchObject({ [PARTNER]: { mood: "calm" } });
});

test("when Supabase can't be reached, the saved copy shows instead of a spinner", async ({
  page,
  supabase,
}) => {
  await page.goto("/");
  await expect(bensMood(page).getByText("Calm")).toBeVisible();

  supabase.down = true;
  await page.reload();
  await expect(home(page)).toBeVisible();
  await expect(bensMood(page).getByText("Calm")).toBeVisible();
  await expect(notice(page)).toBeVisible();
  await expect(page.getByText(/Something went wrong/)).toHaveCount(0);
});

test("fresh data replaces the saved copy once Supabase is back", async ({
  page,
  supabase,
}) => {
  await page.goto("/");
  await expect(home(page)).toBeVisible();
  supabase.down = true;
  await page.reload();
  await expect(notice(page)).toBeVisible();

  supabase.down = false;
  supabase.setMood(PARTNER, "excited");
  await page.reload();
  await expect(bensMood(page).getByText("Excited")).toBeVisible();
  await expect(notice(page)).toHaveCount(0);
});

test("with no saved copy and no connection, it says so", async ({
  page,
  context,
  supabase,
}) => {
  supabase.down = true;
  await page.goto("/");
  // Let the service worker finish registering first (it needs the network).
  await page.evaluate(() =>
    "serviceWorker" in navigator
      ? Promise.race([
          navigator.serviceWorker.ready,
          new Promise((r) => setTimeout(r, 3_000)),
        ])
      : null,
  );
  await context.setOffline(true);
  await expect(
    page.getByText("You're offline. This will load when you're back online"),
  ).toBeVisible();
  await context.setOffline(false);
});

test("signing out deletes the saved copy", async ({ page }) => {
  await page.goto("/");
  await expect(home(page)).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate((k) => localStorage.getItem(k) !== null, SNAPSHOT_KEY),
    )
    .toBe(true);
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("heading", { name: "Hello, you two" }),
  ).toBeVisible();
  expect(
    await page.evaluate((k) => localStorage.getItem(k), SNAPSHOT_KEY),
  ).toBeNull();
});

test.describe("with the service worker", () => {
  test.use({ serviceWorkers: "allow" });

  test("the installed app opens with no connection at all", async ({
    page,
    context,
    browserName,
    supabase,
  }) => {
    // In WebKit, Playwright can't route requests from a page a service worker
    // controls, so the fake Supabase is unreachable there.
    test.skip(
      browserName !== "chromium",
      "Playwright can only route service-worker-controlled pages in Chromium.",
    );
    await page.goto("/");
    await expect(home(page)).toBeVisible();
    // Wait for the service worker to take over and cache every static file
    // this page loaded (including chunks Next loaded at runtime).
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise((r) =>
          navigator.serviceWorker.addEventListener("controllerchange", r, {
            once: true,
          }),
        );
      }
    });
    await expect
      .poll(
        () =>
          page.evaluate(async () => {
            const loaded = performance
              .getEntriesByType("resource")
              .map((e) => new URL(e.name).pathname)
              .filter((p) => p.startsWith("/_next/static/"));
            const cached = await Promise.all(
              loaded.map((p) => caches.match(p)),
            );
            return cached.filter((hit) => !hit).length;
          }),
        { message: "static files not yet cached" },
      )
      .toBe(0);

    // Offline means Supabase is out of reach too (Playwright's fake would
    // otherwise still answer while the browser is offline).
    supabase.down = true;
    await context.setOffline(true);
    await page.reload();
    await expect(home(page)).toBeVisible();
    await expect(bensMood(page).getByText("Calm")).toBeVisible();
    await expect(notice(page)).toHaveText(/You're offline/);
    await context.setOffline(false);
  });

  /** Waits until the service worker controls the page. */
  async function controlled(page: Page) {
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise((r) => navigator.serviceWorker.addEventListener("controllerchange", r, { once: true }));
      }
    });
  }

  test("only static files can be cached through the worker's message", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Service-worker tests run in Chromium only.");
    await page.goto("/");
    await expect(home(page)).toBeVisible();
    await controlled(page);
    // "/_next/static/../../sw.js" resolves to /sw.js, which exists: it must not be cached.
    await page.evaluate(() =>
      navigator.serviceWorker.controller!.postMessage({ type: "cache-assets", urls: ["/_next/static/../../sw.js"] }),
    );
    await page.waitForTimeout(1_000);
    expect(await page.evaluate(async () => !!(await caches.match("/sw.js")))).toBe(false);
  });

  test("static files from an older deploy are pruned", async ({ page, browserName }) => {
    test.skip(browserName !== "chromium", "Service-worker tests run in Chromium only.");
    await page.goto("/");
    await expect(home(page)).toBeVisible();
    await controlled(page);
    const OLD = "/_next/static/chunks/from-an-older-deploy.js";
    await page.evaluate(async (url) => {
      const name = (await caches.keys()).find((k) => k.startsWith("us-"))!;
      await (await caches.open(name)).put(url, new Response("// old"));
    }, OLD);
    expect(await page.evaluate(async (url) => !!(await caches.match(url)), OLD)).toBe(true);

    await page.reload(); // the page posts its current files, and the rest is pruned
    await expect(home(page)).toBeVisible();
    await expect.poll(() => page.evaluate(async (url) => !!(await caches.match(url)), OLD)).toBe(false);
    // ...while the files the app uses now are still cached.
    const missing = await page.evaluate(async () => {
      const loaded = performance
        .getEntriesByType("resource")
        .map((e) => new URL(e.name).pathname)
        .filter((p) => p.startsWith("/_next/static/"));
      return (await Promise.all(loaded.map((p) => caches.match(p)))).filter((hit) => !hit).length;
    });
    expect(missing).toBe(0);
  });
});

// Regression: an expired session (they last about an hour) used to land on the
// sign-in screen when opened offline, instead of the saved copy.
test("opened offline after the session expired, it still shows the saved copy", async ({ page, context, supabase }) => {
  await page.goto("/");
  await expect(bensMood(page).getByText("Calm")).toBeVisible();

  await supabase.signIn(context, { expired: true }); // runs after the fresh one: wins
  supabase.down = true;
  supabase.setMood(PARTNER, "excited");
  await page.reload();
  await expect(home(page)).toBeVisible();
  await expect(bensMood(page).getByText("Calm")).toBeVisible();
  await expect(notice(page)).toBeVisible();
  // The auth library keeps retrying the refresh; it used to give up to the
  // sign-in screen after about 10 seconds.
  await page.waitForTimeout(12_000);
  await expect(page.getByRole("heading", { name: "Hello, you two" })).toHaveCount(0);
  await expect(home(page)).toBeVisible();

  // Back online: the refresh succeeds and fresh data arrives.
  supabase.down = false;
  await page.reload();
  await expect(bensMood(page).getByText("Excited")).toBeVisible();
  await expect(notice(page)).toHaveCount(0);
});

test("a session revoked elsewhere also deletes the saved copy", async ({ page, context, supabase }) => {
  // A saved copy from an earlier visit, and a session that has to be refreshed
  // but can't be (signed out on another device, or revoked).
  await context.addInitScript((k) => {
    localStorage.setItem(k, JSON.stringify({ savedAt: new Date().toISOString(), profiles: { x: {} }, moods: {}, locations: {} }));
  }, SNAPSHOT_KEY);
  await supabase.signIn(context, { expired: true });
  supabase.refreshRevoked = true;

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hello, you two" })).toBeVisible();
  await expect.poll(() => page.evaluate((k) => localStorage.getItem(k), SNAPSHOT_KEY)).toBeNull();
});
