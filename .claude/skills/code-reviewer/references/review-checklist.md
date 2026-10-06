# Review checklist

Go through each changed file with these in mind. Skip what doesn't apply.

## Correctness and logic
- Does it do what the feature promises (README, DESIGN.md, the test report's checklist)?
- Edge cases: empty data, no partner, a one-sided link, expired sessions, offline, double clicks, races between two users.
- React: effect dependencies, stale closures, cleanup of timers, subscriptions and channels, state that should be derived instead of stored.
- Async: unhandled rejections, a missing `await`, error results ignored (supabase-js returns `{ error }` rather than throwing).

## Security (this app shares people's locations: be strict)
- **New tables:** RLS enabled; policies for select, insert, update and delete as intended; `anon` revoked; no broader grant than needed.
- **Functions:** `security definer` only when needed, always `set search_path = ''`, execute revoked from `public` and `anon`, inputs validated, `auth.uid()` checked.
- **Policies:** use `(select auth.uid())`, not bare `auth.uid()`.
- **Data exposure:** nothing a partner or stranger shouldn't see (coordinates, notes, emails). Check what crosses into widgets, notifications and localStorage.
- **Secrets:** no secrets in code or `NEXT_PUBLIC_*`, and never the service-role key in the client.
- **Untrusted input:** URLs or HTML from users (open redirects, XSS); endpoints a server will call (SSRF).

## Error handling
- The user sees a clear message, and the screen stays usable after a failure.
- No swallowed errors that hide real bugs. A broad `catch`, or `exception when others`, needs a reason and a test.

## Performance
- No N+1 queries, no polling where Realtime exists, no re-renders on every tick without need.
- Indexes on foreign keys and on columns used in RLS policies.

## Accessibility
- Real buttons and links; names for controls (`aria-label`, label elements); `role="status"` or `alert` for live messages; focus not lost.
- Tap targets of 44px or more; colour contrast (DESIGN.md: `you` and `partner` colours aren't for small text).
- Reduced motion respected.

## Leftovers and dead code
- `console.log`, `debugger`, commented-out blocks, TODOs, throwaway files (`tests/zz-*`, `.*-check.mjs`), unused exports, imports or props.

## Consistency
- Matches the surrounding code: naming, comment style, design tokens rather than hex colours, file layout.

## Tests
- Every changed behaviour has a test that would fail without it.
- Migrations have `tests/db` tests; user flows have Playwright specs.
- Skips have reasons.

## Docs, env and migrations
- README and DESIGN.md updated where behaviour changed.
- New env vars listed (`.env.example`, README).
- **Migrations:**
  - new files only; never edit one already applied in production;
  - safe for the app version still deployed while the migration rolls out;
  - one-time steps for the user are written down (secrets, Vault, deploys).
