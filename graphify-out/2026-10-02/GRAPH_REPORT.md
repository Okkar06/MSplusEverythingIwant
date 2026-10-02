# Graph Report - MSplusEverythingIwant  (2026-10-02)

## Corpus Check
- Corpus is ~14,646 words - fits in a single context window. You may not need a graph.

## Summary
- 155 nodes · 198 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.87)
- Token cost: 55,538 input · 0 output

## Community Hubs (Navigation)
- Graphify Tooling Docs
- Package & Lint Config
- Design System & Moods
- TypeScript Config
- Next.js App Shell
- Supabase Schema & RLS
- Supabase Client & Env
- Dev Dependencies
- Static SVG Icons
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `/graphify skill` - 19 edges
2. `compilerOptions` - 16 edges
3. `Design system (two-person distance & mood app)` - 13 edges
4. `graphify full build pipeline` - 10 edges
5. `public.profiles` - 7 edges
6. `graphify usage rules (CLAUDE.md)` - 6 edges
7. `graph.json` - 6 edges
8. `Incremental update (--update)` - 6 edges
9. `Semantic colour tokens` - 6 edges
10. `supabase` - 5 edges

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
- **graphify full build flow (extract, merge, build, guard)** — _claude_skills_graphify_skill_ast_structural_extraction, _claude_skills_graphify_skill_semantic_extraction_subagents, _claude_skills_graphify_skill_merge_extraction, _claude_skills_graphify_skill_community_detection, _claude_skills_graphify_skill_graph_health_check, _claude_skills_graphify_skill_shrink_guard, _claude_skills_graphify_skill_manifest [EXTRACTED 1.00]
- **graphify graph freshness mechanisms** — _claude_skills_graphify_references_update_incremental_update, _claude_skills_graphify_references_hooks_post_commit_hook, _claude_skills_graphify_references_add_watch_watch_mode, _claude_skills_graphify_references_add_watch_add_url [INFERRED 0.85]
- **Design token sync targets (tokens.json, globals.css, widgets, migration)** — design_design_tokens_json, design_globals_css, design_widgets, design_moods_check_constraint, design_mood_icons [EXTRACTED 1.00]

## Communities (11 total, 2 thin omitted)

### Community 0 - "Graphify Tooling Docs"
Cohesion: 0.09
Nodes (7): graphify skill registration (.claude/CLAUDE.md), Community detection and labeling, EXTRACTED / INFERRED / AMBIGUOUS audit trail, graph.json, GRAPH_REPORT.md, /graphify skill, graphify usage rules (CLAUDE.md)

### Community 1 - "Package & Lint Config"
Cohesion: 0.08
Nodes (25): eslintConfig, dependencies, next, react, react-dom, @supabase/supabase-js, name, private (+17 more)

### Community 2 - "Design System & Moods"
Cohesion: 0.20
Nodes (14): Semantic colour tokens, Design system (two-person distance & mood app), design/tokens.json, Distance count-up animation, app/globals.css, Mood colours, Custom mood icon set (components/mood-icons.tsx), moods.mood check constraint (+6 more)

### Community 3 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "Next.js App Shell"
Cohesion: 0.15
Nodes (9): figtree, fredoka, metadata, viewport, Home(), nextConfig, Next.js Wordmark Logo (next.svg), Vercel Triangle Logo (vercel.svg) (+1 more)

### Community 5 - "Supabase Schema & RLS"
Cohesion: 0.24
Nodes (7): locations_set_updated_at, moods_set_updated_at, on_auth_user_created, public.is_me_or_partner(), public.locations, public.moods, public.profiles

### Community 6 - "Supabase Client & Env"
Cohesion: 0.24
Nodes (9): supabase, .env.local (from .env.example), Mood + Live-Location Sharing (two users), MSplusEverythingIwant, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, Next.js, Supabase (+1 more)

### Community 7 - "Dev Dependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, supabase, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 8 - "Static SVG Icons"
Cohesion: 0.67
Nodes (3): File Document Icon (file.svg), Globe Icon (globe.svg), Browser Window Icon (window.svg)

## Knowledge Gaps
- **60 isolated node(s):** `fredoka`, `figtree`, `metadata`, `viewport`, `eslintConfig` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 74 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Next.js App Shell` to `Package & Lint Config`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `@supabase/supabase-js` connect `Supabase Client & Env` to `Package & Lint Config`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies` to `Package & Lint Config`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `fredoka`, `figtree`, `metadata` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Graphify Tooling Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.09206349206349207 - nodes in this community are weakly interconnected._
- **Should `Package & Lint Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `TypeScript Config` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._