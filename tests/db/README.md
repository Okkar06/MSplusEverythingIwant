# Database tests

```bash
npm run test:db
```

These run every migration in `supabase/migrations/` on [PGlite](https://pglite.dev)
(Postgres compiled to WebAssembly, running inside Node) and check the rules the
app relies on: who can read and write what, invite codes and approval, the guess
limit, and what unlinking clears. No Docker, Supabase project or network needed.

`helpers.mjs` stands in for the parts of Supabase the migrations use: the
`anon` and `authenticated` roles, `auth.users`, `auth.uid()`, Supabase's default
grants and the Realtime publication. `db.as(userId, sql)` runs a query the way an
app request does (through row-level security), `db.anon(sql)` as a signed-out
visitor, and `db.admin(sql)` as the owner (like the SQL editor).

When you add a migration, add tests here for what it allows and forbids. To check
that a test really guards a migration, run it with that migration moved out of
the folder: the test should fail.

The browser tests (`npx playwright test`) use a fake Supabase instead, so these
are the only tests that run the real SQL.
