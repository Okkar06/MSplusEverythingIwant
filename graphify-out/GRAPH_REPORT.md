# Graph Report - MSplusEverythingIwant  (2026-09-24)

## Corpus Check
- Corpus is ~1,001 words - fits in a single context window. You may not need a graph.

## Summary
- 81 nodes · 82 edges · 9 communities (8 shown, 1 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.84)
- Token cost: 60,914 input · 0 output

## Community Hubs (Navigation)
- TypeScript Config
- Lint & Package Manifest
- Next.js App Shell
- Supabase & App Concept
- Dev Dependencies
- Runtime Dependencies
- npm Scripts
- Unused Template Icons
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `supabase` - 5 edges
3. `scripts` - 5 edges
4. `next` - 4 edges
5. `MSplusEverythingIwant` - 4 edges
6. `Home()` - 3 edges
7. `Supabase` - 3 edges
8. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - 3 edges
9. `@supabase/supabase-js` - 2 edges
10. `eslint` - 2 edges

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

## Communities (9 total, 1 thin omitted)

### Community 0 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 1 - "Lint & Package Manifest"
Cohesion: 0.13
Nodes (14): eslintConfig, name, private, version, eslint, eslint-config-next, react, react-dom (+6 more)

### Community 2 - "Next.js App Shell"
Cohesion: 0.20
Nodes (7): app_globals, metadata, Home(), nextConfig, Next.js Wordmark Logo (next.svg), Vercel Triangle Logo (vercel.svg), next

### Community 3 - "Supabase & App Concept"
Cohesion: 0.24
Nodes (10): supabase, .env.local (from .env.example), Mood + Live-Location Sharing (two users), MSplusEverythingIwant, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, Next.js, Keep Supabase Service Role Key Out of Browser (+2 more)

### Community 4 - "Dev Dependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.40
Nodes (5): dependencies, next, react, react-dom, @supabase/supabase-js

### Community 6 - "npm Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 7 - "Unused Template Icons"
Cohesion: 0.67
Nodes (3): File Document Icon (file.svg), Globe Icon (globe.svg), Browser Window Icon (window.svg)

## Knowledge Gaps
- **52 isolated node(s):** `metadata`, `eslintConfig`, `nextConfig`, `name`, `version` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 55 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Next.js App Shell` to `Lint & Package Manifest`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **Why does `@supabase/supabase-js` connect `Supabase & App Concept` to `Lint & Package Manifest`?**
  _High betweenness centrality (0.146) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Lint & Package Manifest`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `supabase` (e.g. with `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_URL`) actually correct?**
  _`supabase` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `metadata`, `eslintConfig`, `nextConfig` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `Lint & Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._