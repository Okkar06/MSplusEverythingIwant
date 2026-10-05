import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against a production build with a fake Supabase:
// tests/fake-supabase.ts answers every REST, auth and Realtime call, so no
// real project or network access is needed.
const PORT = 3199;

export default defineConfig({
  testDir: "./tests",
  // Only *.spec.ts: the database tests (tests/db/*.test.mjs) run under
  // node:test (npm run test:db). A testIgnore glob would be matched against the
  // absolute path, so a checkout inside any "db" folder would hide every test.
  testMatch: "*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },

  // Phone-first app, so test on phone-sized screens.
  projects: [
    { name: "chromium", use: { ...devices["Pixel 7"] } },
    { name: "webkit", use: { ...devices["iPhone 15"] } },
  ],

  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Always build fresh: reusing a leftover server would quietly test an old build.
    reuseExistingServer: false,
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://e2e.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "e2e-anon-key",
      // Separate build folder, so this can run while `next dev` is up.
      NEXT_DIST_DIR: ".next-e2e",
    },
  },
});
