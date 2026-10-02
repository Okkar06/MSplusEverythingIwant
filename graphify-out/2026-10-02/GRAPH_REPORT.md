# Graph Report - MSplusEverythingIwant  (2026-10-02)

## Corpus Check
- 54 files · ~24,783 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .example 1, .css 1)

## Summary
- 305 nodes · 510 edges · 20 communities (17 shown, 3 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ed99a249`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- home-screen.tsx
- /graphify skill
- app.tsx
- package.json
- mood-icons.tsx
- Design system (two-person distance & mood app)
- compilerOptions
- 20261001000000_initial_schema.sql
- layout.tsx
- /feature-commit
- MSplusEverythingIwant Mood + Location Sharing App
- UI Self-check Before Finishing
- playwright
- Apple Touch Icon (two overlapping circles)
- App Icon (Two Lights)
- PWA App Icon 512px (Overlapping Circles)
- postcss.config.mjs
- PWA Icon 192px (overlapping pink and amber circles)
- fake-supabase.ts

## God Nodes (most connected - your core abstractions)
1. `/graphify skill` - 18 edges
2. `getSupabase()` - 16 edges
3. `compilerOptions` - 16 edges
4. `Design system (two-person distance & mood app)` - 13 edges
5. `HomeScreen()` - 11 edges
6. `WaitingForPartner()` - 11 edges
7. `react` - 11 edges
8. `FakeSupabase` - 11 edges
9. `graphify full build pipeline` - 10 edges
10. `Base()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `UI Self-check Before Finishing` --semantically_similar_to--> `Playwright Tests CI Job`  [INFERRED] [semantically similar]
  .claude/CLAUDE.md → .github/workflows/playwright.yml
- `Home()` --calls--> `App()`  [EXTRACTED]
  app/page.tsx → components/app.tsx
- `SignedIn()` --calls--> `useCouple()`  [EXTRACTED]
  components/app.tsx → lib/use-couple.ts
- `sendLink()` --calls--> `getSupabase()`  [EXTRACTED]
  components/sign-in.tsx → lib/supabase/client.ts
- `verifyCode()` --calls--> `getSupabase()`  [EXTRACTED]
  components/sign-in.tsx → lib/supabase/client.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Design token sync targets (tokens.json, globals.css, widgets, migration)** — design_design_tokens_json, design_globals_css, design_widgets, design_moods_check_constraint, design_mood_icons [EXTRACTED 1.00]
- **graphify full build flow (extract, merge, build, guard)** — _claude_skills_graphify_skill_ast_structural_extraction, _claude_skills_graphify_skill_semantic_extraction_subagents, _claude_skills_graphify_skill_merge_extraction, _claude_skills_graphify_skill_community_detection, _claude_skills_graphify_skill_graph_health_check, _claude_skills_graphify_skill_shrink_guard, _claude_skills_graphify_skill_manifest [EXTRACTED 1.00]
- **User Onboarding Flow (sign-in, pair, share location)** — readme_magic_link_auth, readme_partner_pairing, readme_location_sharing, readme_supabase [EXTRACTED 1.00]
- **graphify graph freshness mechanisms** — _claude_skills_graphify_references_update_incremental_update, _claude_skills_graphify_references_hooks_post_commit_hook, _claude_skills_graphify_references_add_watch_watch_mode, _claude_skills_graphify_references_add_watch_add_url [INFERRED 0.85]

## Communities (20 total, 3 thin omitted)

### Community 0 - "home-screen.tsx"
Cohesion: 0.11
Nodes (29): DistanceHero(), Presence(), Props, HomeScreen(), Props, LocationCard(), Props, MiniMap() (+21 more)

### Community 1 - "/graphify skill"
Cohesion: 0.08
Nodes (6): graphify Skill Trigger (/graphify), Community detection and labeling, EXTRACTED / INFERRED / AMBIGUOUS audit trail, graph.json, GRAPH_REPORT.md, /graphify skill

### Community 2 - "app.tsx"
Cohesion: 0.15
Nodes (25): Home(), App(), Auth, Loading(), SignedIn(), signOut(), useAuth(), SignIn() (+17 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (36): eslintConfig, dependencies, next, react, react-dom, @supabase/supabase-js, devDependencies, eslint (+28 more)

### Community 4 - "mood-icons.tsx"
Cohesion: 0.11
Nodes (27): Props, Base(), CalmIcon(), ExcitedIcon(), HappyIcon(), IconProps, ICONS, LovedIcon() (+19 more)

### Community 5 - "Design system (two-person distance & mood app)"
Cohesion: 0.20
Nodes (14): Semantic colour tokens, Design system (two-person distance & mood app), design/tokens.json, Distance count-up animation, app/globals.css, Mood colours, Custom mood icon set (components/mood-icons.tsx), moods.mood check constraint (+6 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "20261001000000_initial_schema.sql"
Cohesion: 0.24
Nodes (7): locations_set_updated_at, moods_set_updated_at, on_auth_user_created, public.is_me_or_partner(), public.locations, public.moods, public.profiles

### Community 8 - "layout.tsx"
Cohesion: 0.17
Nodes (6): figtree, fredoka, metadata, viewport, nextConfig, next

### Community 9 - "/feature-commit"
Cohesion: 0.22
Nodes (8): 1. Check where you are, 2. Group the changes into features, 3. Review before committing, 4. Commit, 5. Keep the knowledge graph current, 6. Push, 7. Report, /feature-commit

### Community 10 - "MSplusEverythingIwant Mood + Location Sharing App"
Cohesion: 0.50
Nodes (4): Share My Location / Distance, Email Magic Link / OTP Sign-in, MSplusEverythingIwant Mood + Location Sharing App, Partner Pairing (pair_partners.sql)

### Community 11 - "UI Self-check Before Finishing"
Cohesion: 0.50
Nodes (3): Playwright MCP Browser Tools, playwright-report Artifact Upload, Playwright Tests CI Job

### Community 12 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @playwright/mcp

### Community 13 - "Apple Touch Icon (two overlapping circles)"
Cohesion: 0.67
Nodes (3): Apple Touch Icon (two overlapping circles), Overlapping Circles Motif (Two Partners), PWA Home Screen Icon

### Community 14 - "App Icon (Two Lights)"
Cohesion: 0.67
Nodes (3): App Icon (Two Lights), Icon Color Tokens (dark bg, you, partner), Two Lights Motif (You and Partner)

### Community 15 - "PWA App Icon 512px (Overlapping Circles)"
Cohesion: 0.67
Nodes (3): PWA App Icon 512px (Overlapping Circles), Dark Background with Pink/Amber Accent Palette, Overlapping Pink and Amber Circles Motif

### Community 19 - "fake-supabase.ts"
Cohesion: 0.14
Nodes (11): b64(), cors, FakeSupabase, Invite, makeSession(), ME, PARTNER, PARTNER_CODE (+3 more)

## Knowledge Gaps
- **100 isolated node(s):** `npx`, `@playwright/mcp`, `fredoka`, `figtree`, `metadata` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 126 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `home-screen.tsx` to `app.tsx`, `package.json`, `mood-icons.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `npx`, `@playwright/mcp`, `fredoka` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `home-screen.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1106612685560054 - nodes in this community are weakly interconnected._
- **Should `/graphify skill` be split into smaller, more focused modules?**
  _Cohesion score 0.08412698412698413 - nodes in this community are weakly interconnected._
- **Should `app.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.14838709677419354 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._