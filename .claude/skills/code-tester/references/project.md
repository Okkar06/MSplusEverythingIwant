# Project facts for testing

Last checked against the repo on 2026-10-06. If something here no longer matches
`package.json` or `playwright.config.ts`, trust the repo and update this file.

## Stack and commands

- Next.js 16 (App Router; the app is one client page), Supabase, TypeScript, Tailwind 4.
- Package manager: **npm** (`package-lock.json`). Install with `npm ci`.
- Typecheck: `npx tsc --noEmit`. In a fresh checkout or worktree, run `npx next typegen`
  first, or `LayoutProps` will be "not found".
- Lint: `npx eslint`.
- Build: `npx next build`.
- Dev server: `npm run dev` on **port 3000**.
- Database tests: `npm run test:db`. They run every migration on PGlite (Postgres in
  Node) and need no Docker. See `tests/db/README.md`.
- Unit tests: `npm run test:unit`, if that script exists (push-function logic).
- E2E: `npx playwright test`. It builds into `.next-e2e/` and serves on **port 3199**,
  with Chromium (Pixel 7) and WebKit (iPhone 15). Supabase is faked by
  `tests/fake-supabase.ts`: REST, auth, RPC and Realtime.

## Traps that cost time before

- **`.next` sharing:** `next build` and `next dev` in the same folder break each other.
  The e2e build is safe because it uses `.next-e2e`.
- **Port 3199:** Playwright refuses to start if 3199 is taken. It is often another
  session's run. Wait for it to free up (`until ! ss -ltn | grep -q :3199; do sleep 3; done`),
  and never kill another session's server.
- **Service workers** (from `feat/offline-snapshot` on; check `playwright.config.ts`):
  they're blocked for e2e in the config, because a worker-controlled page breaks
  Playwright routing in WebKit. Tests of the worker itself opt back in with
  `test.use({ serviceWorkers: "allow" })` and run in Chromium only.
- **Notifications / Push API:** Playwright's WebKit has neither. Test those in Chromium,
  and skip WebKit with a reason.
- **WebKit failed requests:** an aborted request makes WebKit route later requests past
  the fake. To simulate Supabase being down, use the fake's `down` switch, which returns 503
  (added in `feat/offline-snapshot`). Where the fake has no `down` yet, use
  `supabase.failNext.add("<path suffix>")`, which makes the next matching call return 503.
- **Console errors fail tests:** the fake fails any test that logs a console error.
  Expected network failures are filtered in `tests/fake-supabase.ts`; extend that filter
  narrowly, never broadly.
- **Load:** several sessions share an 8 GB machine. Timeouts under load aren't bugs.
  Rerun once before investigating.

## Live check without `.env.local`

`.env.local` (real Supabase URL and anon key) isn't in the repo. Without it, `npm run dev`
shows only the "Almost set up" screen.

- **With `.env.local`** (a dev project, never production): `npm run dev`, then use the MCP
  browser on http://localhost:3000.
- **Without it:**
  - Use the MCP browser on the screens that need no backend.
  - For signed-in screens, take screenshots through the e2e harness: a throwaway spec
    `tests/zz-shots.spec.ts` that uses `supabase.link()`, `supabase.signIn(context)` and so
    on, with `page.setViewportSize()` for each width and `page.screenshot()`. Save to
    `.claude/handoff/screenshots/`. Delete the spec afterwards.
  - Say in the report which screens were checked live, and which through the harness.
  - Suggest the user add `.env.local` for a dev project.

## Design rules to check screenshots against (DESIGN.md)

- Content capped at `max-w-md`.
- 16px side gutter.
- No horizontal scroll at 320px.
- Tap targets of 44px or more.
- Light and dark mode (emulate `prefers-color-scheme`).
- Text colours from tokens, not hex.
- `you` and `partner` colours not used for small body text.
