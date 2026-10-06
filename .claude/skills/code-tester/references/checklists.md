# Test coverage checklists

## E2E coverage for a changed user flow

For each flow, aim for one test per line that applies:

- [ ] **Happy path:** the main thing works end to end, and the right request reaches the fake (assert on `supabase.requests` or the fake's state, not only the screen).
- [ ] **Validation:** a bad or empty input shows the message the user sees, and nothing is sent.
- [ ] **Server says no:** the RPC or REST call returns an error (put the fake in a state its handler rejects, e.g. `misses`, or use `failNext`), the error is shown, and the screen stays usable.
- [ ] **Empty state:** no data yet (no partner, no mood, no location) shows the intended placeholder.
- [ ] **Live update:** if the feature uses Realtime, `supabase.push(...)` updates the screen without a reload.
- [ ] **Reload / come back later:** the state survives a reload where it should, and doesn't where it shouldn't.
- [ ] **Offline / Supabase down** (`supabase.down = true`, or `failNext` where the fake has no `down` yet): if the feature touches loading data.
- [ ] **Both browsers:** Chromium and WebKit, unless a documented Playwright limitation forces one.
- [ ] **Accessibility:** controls are reachable by role and name (`getByRole`), live messages use `role="status"` or `alert`.

## Database coverage for a new migration (tests/db)

- [ ] What the owner can do, and what a partner and a stranger can't (read, insert, update, delete).
- [ ] Signed-out visitors (`db.anon`) are refused, and refused by grants, not only by luck.
- [ ] New functions: who can execute them (`has_function_privilege`), `security definer` only with `search_path` pinned.
- [ ] Edge cases: one-sided links, expiry, limits, idempotent repeats.
- [ ] It still works with the migration applied on top of all earlier ones (the helper does this).
- [ ] The test fails with the migration removed (move it out, run, restore).

## Feature checklist (step 6)

Write one line per promised behaviour, then a result and its evidence:

| # | It should… | Result | Evidence |
|---|---|---|---|
| 1 | send a reaction with one tap | ✅ | `reactions.spec.ts › a tap sends the reaction…` |
| 2 | show nothing older than 10 minutes on open | ✅ | `…an old reaction isn't replayed` |
| 3 | look right at 390px in dark mode | ✅ | `.claude/handoff/screenshots/reactions-dark-390.png` |

Sources for "should":
- the code and its comments
- README.md and DESIGN.md
- migration header comments
- what the user or the builder described
