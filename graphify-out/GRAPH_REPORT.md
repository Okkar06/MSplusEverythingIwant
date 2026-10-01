# Graph Report - MSplusEverythingIwant  (2026-10-01)

## Corpus Check
- Corpus is ~13,124 words - fits in a single context window. You may not need a graph.

## Summary
- 111 nodes · 127 edges · 11 communities (10 shown, 1 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.84)
- Token cost: 39,105 input · 0 output

## Community Hubs (Navigation)
- TypeScript Config
- Lint & Package Manifest
- Moods & Locations Schema
- Profiles & Partner Pairing
- Next.js App Shell
- Supabase Client & App Concept
- Dev Dependencies
- Runtime Dependencies
- npm Scripts
- Unused Template Icons
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `public.profiles table` - 10 edges
3. `public.moods table` - 8 edges
4. `public.locations table` - 8 edges
5. `is_me_or_partner()` - 6 edges
6. `supabase` - 5 edges
7. `scripts` - 5 edges
8. `Pair partners UPDATE (sets partner_id)` - 5 edges
9. `next` - 4 edges
10. `MSplusEverythingIwant` - 4 edges

## Surprising Connections (you probably didn't know these)
- `supabase` --shares_data_with--> `NEXT_PUBLIC_SUPABASE_URL`  [INFERRED]
  lib/supabase/client.ts → README.md
- `supabase` --shares_data_with--> `NEXT_PUBLIC_SUPABASE_ANON_KEY`  [INFERRED]
  lib/supabase/client.ts → README.md
- `supabase` --implements--> `Supabase`  [INFERRED]
  lib/supabase/client.ts → README.md
- `Next.js Wordmark Logo (next.svg)` --references--> `Home()`  [EXTRACTED]
  public/next.svg → app/page.tsx
- `Vercel Triangle Logo (vercel.svg)` --references--> `Home()`  [EXTRACTED]
  public/vercel.svg → app/page.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Supabase Client Env Configuration** — readme_env_local, readme_next_public_supabase_url, readme_next_public_supabase_anon_key, lib_supabase_client_supabase [INFERRED 0.85]
- **create-next-app default 16x16 gray UI icons (file, globe, window)** — public_file_file_document_icon, public_globe_globe_icon, public_window_browser_window_icon [INFERRED 0.85]
- **Partner-scoped RLS read access** — supabase_migrations_20261001000000_initial_schema_is_me_or_partner, supabase_migrations_20261001000000_initial_schema_policy_profiles_read_me_and_partner, supabase_migrations_20261001000000_initial_schema_policy_moods_read_me_and_partner, supabase_migrations_20261001000000_initial_schema_policy_locations_read_me_and_partner [EXTRACTED 1.00]
- **Sign-up auto profile creation** — supabase_migrations_20261001000000_initial_schema_auth_users, supabase_migrations_20261001000000_initial_schema_on_auth_user_created, supabase_migrations_20261001000000_initial_schema_handle_new_user, supabase_migrations_20261001000000_initial_schema_profiles [EXTRACTED 1.00]
- **updated_at timestamp maintenance** — supabase_migrations_20261001000000_initial_schema_set_updated_at, supabase_migrations_20261001000000_initial_schema_moods_set_updated_at, supabase_migrations_20261001000000_initial_schema_locations_set_updated_at [EXTRACTED 1.00]

## Communities (11 total, 1 thin omitted)

### Community 0 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Lint & Package Manifest"
Cohesion: 0.12
Nodes (15): eslintConfig, name, private, version, eslint, eslint-config-next, react, react-dom (+7 more)

### Community 2 - "Moods & Locations Schema"
Cohesion: 0.17
Nodes (14): public.locations table, locations_set_updated_at trigger, mood allowed values check, public.moods table, moods_set_updated_at trigger, RLS policy "locations: delete my own", RLS policy "locations: insert my own", RLS policy "locations: read me and partner" (+6 more)

### Community 3 - "Profiles & Partner Pairing"
Cohesion: 0.27
Nodes (11): initial_schema.sql, auth.users table, handle_new_user(), is_me_or_partner(), on_auth_user_created trigger, RLS policy "profiles: read me and partner", RLS policy "profiles: update my own", public.profiles table (+3 more)

### Community 4 - "Next.js App Shell"
Cohesion: 0.20
Nodes (6): metadata, Home(), nextConfig, Next.js Wordmark Logo (next.svg), Vercel Triangle Logo (vercel.svg), next

### Community 5 - "Supabase Client & App Concept"
Cohesion: 0.24
Nodes (9): supabase, .env.local (from .env.example), Mood + Live-Location Sharing (two users), MSplusEverythingIwant, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, Next.js, Supabase (+1 more)

### Community 6 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, supabase, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 7 - "Runtime Dependencies"
Cohesion: 0.40
Nodes (5): dependencies, next, react, react-dom, @supabase/supabase-js

### Community 8 - "npm Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 9 - "Unused Template Icons"
Cohesion: 0.67
Nodes (3): File Document Icon (file.svg), Globe Icon (globe.svg), Browser Window Icon (window.svg)

## Knowledge Gaps
- **62 isolated node(s):** `metadata`, `eslintConfig`, `nextConfig`, `name`, `version` (+57 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 65 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Next.js App Shell` to `Lint & Package Manifest`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `@supabase/supabase-js` connect `Supabase Client & App Concept` to `Lint & Package Manifest`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Lint & Package Manifest`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `metadata`, `eslintConfig`, `nextConfig` to the rest of the system?**
  _62 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Lint & Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._