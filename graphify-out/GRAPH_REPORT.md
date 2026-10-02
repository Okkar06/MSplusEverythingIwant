# Graph Report - MSplusEverythingIwant  (2026-10-02)

## Corpus Check
- 45 files · ~20,266 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: (none) 3, .example 1, .css 1)

## Summary
- 240 nodes · 404 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ac9579ed`
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
5. `HomeScreen()` - 11 edges
6. `react` - 10 edges
7. `graphify full build pipeline` - 10 edges
8. `Base()` - 9 edges
9. `DistanceHero()` - 8 edges
10. `App()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Native CLAUDE.md integration (graphify claude install)` --references--> `graphify usage rules (CLAUDE.md)`  [INFERRED]
  .claude/skills/graphify/references/hooks.md → CLAUDE.md
- `Home()` --calls--> `App()`  [EXTRACTED]
  app/page.tsx → components/app.tsx
- `HomeScreen()` --calls--> `useLocationSharing()`  [EXTRACTED]
  components/home-screen.tsx → lib/use-location-sharing.ts
- `MoodCard()` --calls--> `timeAgo()`  [EXTRACTED]
  components/mood-card.tsx → lib/time.ts
- `sendLink()` --calls--> `getSupabase()`  [EXTRACTED]
  components/sign-in.tsx → lib/supabase/client.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Design token sync targets (tokens.json, globals.css, widgets, migration)** — design_design_tokens_json, design_globals_css, design_widgets, design_moods_check_constraint, design_mood_icons [EXTRACTED 1.00]
- **graphify full build flow (extract, merge, build, guard)** — _claude_skills_graphify_skill_ast_structural_extraction, _claude_skills_graphify_skill_semantic_extraction_subagents, _claude_skills_graphify_skill_merge_extraction, _claude_skills_graphify_skill_community_detection, _claude_skills_graphify_skill_graph_health_check, _claude_skills_graphify_skill_shrink_guard, _claude_skills_graphify_skill_manifest [EXTRACTED 1.00]
- **graphify graph freshness mechanisms** — _claude_skills_graphify_references_update_incremental_update, _claude_skills_graphify_references_hooks_post_commit_hook, _claude_skills_graphify_references_add_watch_watch_mode, _claude_skills_graphify_references_add_watch_add_url [INFERRED 0.85]

## Communities (14 total, 2 thin omitted)

### Community 0 - "/graphify skill"
Cohesion: 0.09
Nodes (7): graphify skill registration (.claude/CLAUDE.md), Community detection and labeling, EXTRACTED / INFERRED / AMBIGUOUS audit trail, graph.json, GRAPH_REPORT.md, /graphify skill, graphify usage rules (CLAUDE.md)

### Community 1 - "package.json"
Cohesion: 0.07
Nodes (25): eslintConfig, dependencies, next, react, react-dom, @supabase/supabase-js, name, private (+17 more)

### Community 2 - "Design system (two-person distance & mood app)"
Cohesion: 0.20
Nodes (14): Semantic colour tokens, Design system (two-person distance & mood app), design/tokens.json, Distance count-up animation, app/globals.css, Mood colours, Custom mood icon set (components/mood-icons.tsx), moods.mood check constraint (+6 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 4 - "layout.tsx"
Cohesion: 0.17
Nodes (6): figtree, fredoka, metadata, viewport, nextConfig, next

### Community 5 - "20261001000000_initial_schema.sql"
Cohesion: 0.24
Nodes (7): locations_set_updated_at, moods_set_updated_at, on_auth_user_created, public.is_me_or_partner(), public.locations, public.moods, public.profiles

### Community 6 - "app.tsx"
Cohesion: 0.20
Nodes (15): Home(), App(), Auth, Loading(), SignedIn(), signOut(), useAuth(), SignIn() (+7 more)

### Community 7 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, @playwright/test, supabase, tailwindcss, @tailwindcss/postcss, @types/node (+3 more)

### Community 11 - "home-screen.tsx"
Cohesion: 0.12
Nodes (24): HomeScreen(), Props, LocationCard(), Props, MoodCard(), Props, MoodIcon(), MoodPicker() (+16 more)

### Community 12 - "distance-hero.tsx"
Cohesion: 0.15
Nodes (20): DistanceHero(), Presence(), Props, MiniMap(), project(), Props, COMPASS, compassDirection() (+12 more)

### Community 13 - "mood-icons.tsx"
Cohesion: 0.29
Nodes (11): Base(), CalmIcon(), ExcitedIcon(), HappyIcon(), IconProps, ICONS, LovedIcon(), MissingYouIcon() (+3 more)

### Community 14 - "MSplusEverythingIwant"
Cohesion: 0.40
Nodes (4): Local setup, MSplusEverythingIwant, Notes, Using the app

## Knowledge Gaps
- **78 isolated node(s):** `fredoka`, `figtree`, `metadata`, `viewport`, `Auth` (+73 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 99 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `home-screen.tsx` to `package.json`, `distance-hero.tsx`, `mood-icons.tsx`, `app.tsx`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **What connects `fredoka`, `figtree`, `metadata` to the rest of the system?**
  _78 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `/graphify skill` be split into smaller, more focused modules?**
  _Cohesion score 0.09206349206349207 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._