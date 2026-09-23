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

## Notes

- Do not put the Supabase service role/secret key in browser-exposed variables.
- The Supabase browser client is configured in `lib/supabase/client.ts`.
