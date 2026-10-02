# Graph Report - MSplusEverythingIwant  (2026-10-02)

## Corpus Check
- 40 files · ~18,538 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 3, .example 1, .ico 1)

## Summary
- 228 nodes · 376 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c131a9c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- /graphify skill
- package.json
- Design system (two-person distance & mood app)
- compilerOptions
- layout.tsx
- 20261001000000_initial_schema.sql
- app.tsx
- devDependencies
- Browser Window Icon (window.svg)
- postcss.config.mjs
- home-screen.tsx
- distance-hero.tsx
- mood-icons.tsx
- MSplusEverythingIwant

## God Nodes (most connected - your core abstractions)
1. `/graphify skill` - 19 edges
2. `compilerOptions` - 16 edges
3. `Design system (two-person distance & mood app)` - 13 edges
4. `getSupabase()` - 12 edges
5. `graphify full build pipeline` - 10 edges
6. `HomeScreen()` - 9 edges
7. `Base()` - 9 edges
8. `react` - 9 edges
9. `DistanceHero()` - 8 edges
10. `App()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Wordmark Logo (next.svg)` --references--> `Home()`  [EXTRACTED]
  public/next.svg → app/page.tsx
- `Vercel Triangle Logo (vercel.svg)` --references--> `Home()`  [EXTRACTED]
  public/vercel.svg → app/page.tsx
- `Native CLAUDE.md integration (graphify claude install)` --references--> `graphify usage rules (CLAUDE.md)`  [INFERRED]
  .claude/skills/graphify/references/hooks.md → CLAUDE.md
- `HomeScreen()` --calls--> `useLocationSharing()`  [EXTRACTED]
  components/home-screen.tsx → lib/use-location-sharing.ts
- `MoodCard()` --calls--> `timeAgo()`  [EXTRACTED]
  components/mood-card.tsx → lib/time.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Design token sync targets (tokens.json, globals.css, widgets, migration)** — design_design_tokens_json, design_globals_css, design_widgets, design_moods_check_constraint, design_mood_icons [EXTRACTED 1.00]
- **graphify full build flow (extract, merge, build, guard)** — _claude_skills_graphify_skill_ast_structural_extraction, _claude_skills_graphify_skill_semantic_extraction_subagents, _claude_skills_graphify_skill_merge_extraction, _claude_skills_graphify_skill_community_detection, _claude_skills_graphify_skill_graph_health_check, _claude_skills_graphify_skill_shrink_guard, _claude_skills_graphify_skill_manifest [EXTRACTED 1.00]
- **create-next-app default 16x16 gray UI icons (file, globe, window)** — public_file_file_document_icon, public_globe_globe_icon, public_window_browser_window_icon [INFERRED 0.85]
- **graphify graph freshness mechanisms** — _claude_skills_graphify_references_update_incremental_update, _claude_skills_graphify_references_hooks_post_commit_hook, _claude_skills_graphify_references_add_watch_watch_mode, _claude_skills_graphify_references_add_watch_add_url [INFERRED 0.85]

## Communities (15 total, 2 thin omitted)

### Community 0 - "/graphify skill"
Cohesion: 0.09
Nodes (7): graphify skill registration (.claude/CLAUDE.md), Community detection and labeling, EXTRACTED / INFERRED / AMBIGUOUS audit trail, graph.json, GRAPH_REPORT.md, /graphify skill, graphify usage rules (CLAUDE.md)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (24): eslintConfig, dependencies, next, react, react-dom, @supabase/supabase-js, name, private (+16 more)

### Community 2 - "Design system (two-person distance & mood app)"
Cohesion: 0.20
Nodes (14): Semantic colour tokens, Design system (two-person distance & mood app), design/tokens.json, Distance count-up animation, app/globals.css, Mood colours, Custom mood icon set (components/mood-icons.tsx), moods.mood check constraint (+6 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "layout.tsx"
Cohesion: 0.20
Nodes (6): figtree, fredoka, metadata, viewport, nextConfig, next

### Community 5 - "20261001000000_initial_schema.sql"
Cohesion: 0.24
Nodes (7): locations_set_updated_at, moods_set_updated_at, on_auth_user_created, public.is_me_or_partner(), public.locations, public.moods, public.profiles

### Community 6 - "app.tsx"
Cohesion: 0.17
Nodes (17): Home(), App(), Auth, Loading(), SignedIn(), signOut(), useAuth(), SignIn() (+9 more)

### Community 7 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, supabase, tailwindcss, @tailwindcss/postcss, @types/node, @types/react (+2 more)

### Community 8 - "Browser Window Icon (window.svg)"
Cohesion: 0.67
Nodes (3): File Document Icon (file.svg), Globe Icon (globe.svg), Browser Window Icon (window.svg)

### Community 11 - "home-screen.tsx"
Cohesion: 0.14
Nodes (21): HomeScreen(), Props, LocationCard(), Props, MoodCard(), Props, MoodIcon(), MoodPicker() (+13 more)

### Community 12 - "distance-hero.tsx"
Cohesion: 0.18
Nodes (16): DistanceHero(), Presence(), Props, distanceMeters(), formatDistance(), Point, isLive(), LIVE_WINDOW_MS (+8 more)

### Community 13 - "mood-icons.tsx"
Cohesion: 0.29
Nodes (11): Base(), CalmIcon(), ExcitedIcon(), HappyIcon(), IconProps, ICONS, LovedIcon(), MissingYouIcon() (+3 more)

### Community 14 - "MSplusEverythingIwant"
Cohesion: 0.50
Nodes (3): Local setup, MSplusEverythingIwant, Notes

## Knowledge Gaps
- **75 isolated node(s):** `fredoka`, `figtree`, `metadata`, `viewport`, `Auth` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 92 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `distance-hero.tsx` to `package.json`, `home-screen.tsx`, `mood-icons.tsx`, `app.tsx`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `fredoka`, `figtree`, `metadata` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `/graphify skill` be split into smaller, more focused modules?**
  _Cohesion score 0.09206349206349207 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._