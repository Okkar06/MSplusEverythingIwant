# MSplusEverythingIwant

Mood + live-location sharing app for two users, built with Next.js and Supabase.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment template and fill values:
   ```bash
   cp .env.example .env.local
   ```
3. Add your Supabase values in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run the app:
   ```bash
   npm run dev
   ```

## Using the app

1. Apply the schema: `npx supabase db push` (or run `supabase/migrations/*.sql` in the SQL editor).
2. Both of you sign in with your email (magic link or the code in the email).
3. Link your accounts: one of you taps **Get a code** and shares it, the other types it in
   and taps **Ask to link**. The code's owner then sees who asked (name and email) and taps
   **Accept**. Nobody is linked until they do. Codes last a day. (Admin fallback: run
   `supabase/snippets/pair_partners.sql` in the SQL editor.)
4. Pick a mood, and turn on **Share my location** to see the distance between you.
   Location is only shared while the app is open, and only the latest spot is stored.
5. Either of you can unlink at any time from the bottom of the home screen. That clears the
   link for both of you and deletes both stored locations.

## Tests

```bash
npx playwright test
```

End-to-end tests in `tests/` run against a production build on port 3199, built
into `.next-e2e/` so they can run while `npm run dev` is up. Supabase is faked by
`tests/fake-supabase.ts`, so no project or `.env.local` is needed. They run on a
phone-sized Chromium and WebKit; on a fresh machine install the browsers with
`npx playwright install --with-deps chromium webkit`.

## Notes

- Do not put the Supabase service role/secret key in browser-exposed variables.
- The Supabase browser client is configured in `lib/supabase/client.ts`.
