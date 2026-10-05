# Graph Report - MSplusEverythingIwant  (2026-10-05)

## Corpus Check
- 295 files · ~188,401 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .toml 2, .example 1)

## Summary
- 1095 nodes · 1732 edges · 100 communities (71 shown, 29 thin omitted)
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 245 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d19d6b7a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- home-screen.tsx
- React Best Practices (compiled AGENTS.md)
- /graphify skill
- fake-supabase.ts
- getSupabase
- Accessibility Skill (SKILL.md)
- Supabase Postgres Best Practices Skill
- Node.js Backend Patterns Skill
- Fixtures & Hooks
- feature-commit skill
- Design system (two-person distance & mood app)
- compilerOptions
- Playwright Best Practices Skill
- Functions
- Next.js Cache Components Skill
- Assertions & Waiting
- Drag and Drop Testing
- React Composition Patterns (compiled AGENTS.md)
- Data Patterns
- package.json
- TypeScript Advanced Types Skill
- 20261001000000_initial_schema.sql
- Next.js Best Practices Skill
- Test Suite Structure
- Authentication Testing
- Advanced Network Interception
- Playwright Configuration
- Error & Edge Case Testing
- Canvas & WebGL Testing
- devDependencies
- 20261002010000_pair_approval.sql
- Self-Hosting Next.js
- reaction-banner.tsx
- helpers.mjs
- distance-hero.tsx
- GitHub Actions for Playwright
- React Compiler
- Tailwind CSS Patterns Skill
- File Conventions
- use-couple.ts
- mood-icons.tsx
- MSplusEverythingIwant App
- 20261005010000_reactions.sql
- 20261002000000_pair_invites.sql
- Debugging & Troubleshooting
- next
- Cache Storage API Calls
- SEO Optimization Skill
- Tailwind CSS Configuration
- Tailwind CSS Documentation Reference
- layout.tsx
- Bundling
- Error Handling
- use-location-sharing.ts
- Component Testing
- Hoist RegExp Creation
- Tailwind CSS Accessibility Guidelines
- Tailwind CSS Component Patterns
- Tailwind CSS Layout Patterns
- dependencies
- Suspense Boundaries
- Parallel & Intercepting Routes
- Performance & Parallelization
- Early Length Check for Array Comparisons
- Use Transitions for Non-Urgent Updates
- Optimize RLS Policies for Performance
- Tailwind CSS Animations & Transitions
- scripts
- Use Passive Event Listeners for Scrolling Performance
- Avoid Layout Thrashing
- Prevent Hydration Mismatch Without Flickering
- Use React DOM Resource Hints
- Tailwind CSS Performance Optimization
- eslint.config.mjs
- playwright
- Use SWR for Automatic Deduplication
- Use Activity Component for Show/Hide
- Calculate Derived State During Rendering
- Avoid Duplicate Serialization in RSC Props
- Apple Touch Icon (two overlapping circles)
- App Icon (Two Lights)
- PWA App Icon 512px (Overlapping Circles)
- public.unpair
- Combine Multiple Array Iterations
- Build Index Maps for Repeated Lookups
- Next.js after() function
- Authenticate Server Actions Like API Routes
- postcss.config.mjs
- PWA Icon 192px (overlapping pink and amber circles)

## God Nodes (most connected - your core abstractions)
1. `Playwright Best Practices Skill` - 62 edges
2. `Fixtures & Hooks` - 26 edges
3. `getSupabase()` - 23 edges
4. `WaitingForPartner()` - 21 edges
5. `React Best Practices (compiled AGENTS.md)` - 20 edges
6. `Vercel React Best Practices Skill` - 19 edges
7. `Next.js Best Practices Skill` - 19 edges
8. `Test Suite Structure` - 19 edges
9. `Accessibility Skill (SKILL.md)` - 18 edges
10. `Rule Template` - 18 edges

## Surprising Connections (you probably didn't know these)
- `UI Self-check Before Finishing` --semantically_similar_to--> `E2E Playwright Tests`  [INFERRED] [semantically similar]
  .claude/CLAUDE.md → README.md
- `next build vs next dev .next/ Conflict` --semantically_similar_to--> `E2E Playwright Tests`  [INFERRED] [semantically similar]
  .claude/skills/feature-commit/SKILL.md → README.md
- `Database tests` --references--> `anon()`  [INFERRED]
  tests/db/README.md → tests/db/helpers.mjs
- `FakeSupabase` --references--> `LocationRow`  [EXTRACTED]
  tests/fake-supabase.ts → lib/types.ts
- `FakeSupabase` --references--> `MoodRow`  [EXTRACTED]
  tests/fake-supabase.ts → lib/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Design token sync targets (tokens.json, globals.css, widgets, migration)** — design_design_tokens_json, design_globals_css, design_widgets, design_moods_check_constraint, design_mood_icons [EXTRACTED 1.00]
- **Feature-commit Workflow Guardrails** — _claude_skills_feature_commit_skill_feature_commit, _claude_skills_feature_commit_skill_selective_staging, _claude_skills_feature_commit_skill_pre_commit_review, _claude_skills_feature_commit_skill_no_claude_attribution, _claude_skills_feature_commit_skill_never_commit_main, _claude_skills_feature_commit_skill_no_force_push [EXTRACTED 1.00]
- **graphify full build flow (extract, merge, build, guard)** — _claude_skills_graphify_skill_ast_structural_extraction, _claude_skills_graphify_skill_semantic_extraction_subagents, _claude_skills_graphify_skill_merge_extraction, _claude_skills_graphify_skill_community_detection, _claude_skills_graphify_skill_graph_health_check, _claude_skills_graphify_skill_shrink_guard, _claude_skills_graphify_skill_manifest [EXTRACTED 1.00]
- **Cache Components tagging and invalidation** — _agents_skills_next_cache_components_skill_use_cache_directive, _agents_skills_next_cache_components_skill_cachetag, _agents_skills_next_cache_components_skill_updatetag, _agents_skills_next_cache_components_skill_revalidatetag, _agents_skills_next_cache_components_skill_cachelife [EXTRACTED 1.00]
- **React/Next.js directives** — _agents_skills_next_best_practices_directives_use_client, _agents_skills_next_best_practices_directives_use_server, _agents_skills_next_best_practices_directives_use_cache [EXTRACTED 1.00]
- **Parallel + intercepting route modal pattern** — _agents_skills_next_best_practices_parallel_routes_slots, _agents_skills_next_best_practices_parallel_routes_default_tsx, _agents_skills_next_best_practices_parallel_routes_intercepting_routes, _agents_skills_next_best_practices_parallel_routes_router_back_modal_close [EXTRACTED 1.00]
- **Playwright CI Pipeline** — _agents_skills_playwright_best_practices_infrastructure_ci_cd_ci_cd, _agents_skills_playwright_best_practices_infrastructure_ci_cd_docker, _agents_skills_playwright_best_practices_infrastructure_ci_cd_github_actions, _agents_skills_playwright_best_practices_infrastructure_ci_cd_ci_cd_sharding [EXTRACTED 1.00]
- **Reusable test code organization patterns** — _agents_skills_playwright_best_practices_architecture_pom_vs_fixtures_page_objects, _agents_skills_playwright_best_practices_architecture_pom_vs_fixtures_custom_fixtures, _agents_skills_playwright_best_practices_architecture_pom_vs_fixtures_helper_functions [EXTRACTED 1.00]
- **Bundle Size Optimization Rules** — _agents_skills_react_best_practices_rules_bundle_analyzable_paths_bundle_analyzable_paths, _agents_skills_react_best_practices_rules_bundle_barrel_imports_bundle_barrel_imports, _agents_skills_react_best_practices_rules_bundle_conditional_bundle_conditional, _agents_skills_react_best_practices_rules_bundle_defer_third_party_bundle_defer_third_party, _agents_skills_react_best_practices_rules_bundle_dynamic_imports_bundle_dynamic_imports, _agents_skills_react_best_practices_rules_bundle_preload_bundle_preload [EXTRACTED 1.00]
- **Waterfall Elimination Rules** — _agents_skills_react_best_practices_rules_async_api_routes_async_api_routes, _agents_skills_react_best_practices_rules_async_cheap_condition_before_await_async_cheap_condition_before_await, _agents_skills_react_best_practices_rules_async_defer_await_async_defer_await, _agents_skills_react_best_practices_rules_async_dependencies_async_dependencies, _agents_skills_react_best_practices_rules_async_parallel_async_parallel, _agents_skills_react_best_practices_rules_async_suspense_boundaries_async_suspense_boundaries [EXTRACTED 1.00]
- **RLS performance optimization techniques** — _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_select_wrapped_auth_uid, _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_is_team_member, _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_rls_column_index, _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_rls_policy [EXTRACTED 1.00]
- **New Success Criteria in WCAG 2.2** — _agents_skills_accessibility_skill_focus_visible, _agents_skills_accessibility_skill_target_size, _agents_skills_accessibility_skill_dragging_movements, _agents_skills_accessibility_skill_accessible_authentication, _agents_skills_accessibility_references_wcag_changes_2_1_to_2_2 [EXTRACTED 1.00]
- **Memoization correctness rules** — _agents_skills_react_best_practices_rules_rerender_memo_rule, _agents_skills_react_best_practices_rules_rerender_memo_with_default_value_rule, _agents_skills_react_best_practices_rules_rerender_simple_expression_in_memo_rule, _agents_skills_react_best_practices_rules_rerender_no_inline_components_rule, _agents_skills_react_best_practices_rules_rerender_memo_memo [INFERRED 0.75]
- **Flaky Test Diagnosis Toolkit** — _agents_skills_playwright_best_practices_debugging_flaky_tests_flakiness_types, _agents_skills_playwright_best_practices_debugging_debugging_trace_viewer, _agents_skills_playwright_best_practices_core_assertions_waiting_topass_polling, _agents_skills_playwright_best_practices_debugging_console_errors_auto_fail_console_fixture [INFERRED 0.75]
- **Quality gates enforced in CI** — _agents_skills_playwright_best_practices_testing_patterns_accessibility_a11y_as_ci_gate, _agents_skills_playwright_best_practices_testing_patterns_performance_testing_performance_budgets, _agents_skills_playwright_best_practices_infrastructure_ci_cd_test_coverage_coverage_thresholds [INFERRED 0.75]
- **Browser rendering/main-thread performance** — _agents_skills_react_best_practices_rules_js_batch_dom_css, _agents_skills_react_best_practices_rules_rendering_content_visibility, _agents_skills_react_best_practices_rules_rendering_animate_svg_wrapper, _agents_skills_react_best_practices_rules_client_passive_event_listeners, _agents_skills_react_best_practices_rules_js_request_idle_callback [INFERRED 0.75]
- **Reducing round trips / waterfalls** — _agents_skills_supabase_postgres_best_practices_references_data_n_plus_one_eliminate_n_plus_one, _agents_skills_supabase_postgres_best_practices_references_data_batch_inserts_batch_inserts, _agents_skills_react_best_practices_rules_server_parallel_nested_fetching_parallel_nested_fetching, _agents_skills_react_best_practices_rules_server_parallel_fetching_parallel_fetching_composition [INFERRED 0.75]
- **Reduced motion / accessible styling across Tailwind references** — _agents_skills_tailwind_css_patterns_references_accessibility_motion_reduce, _agents_skills_tailwind_css_patterns_references_animations_global_reduced_motion, _agents_skills_tailwind_css_patterns_references_accessibility_focus_visible, _agents_skills_tailwind_css_patterns_references_accessibility_sr_only [INFERRED 0.75]
- **Alternatives to Boolean Prop Configuration** — _agents_skills_composition_patterns_rules_architecture_avoid_boolean_props, _agents_skills_composition_patterns_rules_patterns_explicit_variants, _agents_skills_composition_patterns_rules_architecture_compound_components, _agents_skills_composition_patterns_rules_patterns_children_over_render_props [INFERRED 0.85]
- **Provider-Based State Management Rules** — _agents_skills_composition_patterns_rules_state_lift_state, _agents_skills_composition_patterns_rules_state_decouple_implementation, _agents_skills_composition_patterns_rules_state_context_interface, _agents_skills_composition_patterns_rules_architecture_compound_components [INFERRED 0.85]
- **Avoid unnecessary useEffect rules** — _agents_skills_react_best_practices_rules_rerender_derived_state_no_effect_rule, _agents_skills_react_best_practices_rules_rerender_move_effect_to_event_rule, _agents_skills_react_best_practices_rules_rerender_dependencies_rule, _agents_skills_react_best_practices_rules_rerender_split_combined_hooks_rule [INFERRED 0.85]
- **graphify graph freshness mechanisms** — _claude_skills_graphify_references_update_incremental_update, _claude_skills_graphify_references_hooks_post_commit_hook, _claude_skills_graphify_references_add_watch_watch_mode, _claude_skills_graphify_references_add_watch_add_url [INFERRED 0.85]
- **Node.js layered backend architecture** — _agents_skills_nodejs_backend_patterns_skill_layered_architecture, _agents_skills_nodejs_backend_patterns_skill_dependency_injection, _agents_skills_nodejs_best_practices_skill_layered_structure, _agents_skills_nodejs_backend_patterns_references_advanced_patterns_dependency_injection [INFERRED 0.85]
- **Partner Link Lifecycle** — readme_partner_linking_flow, readme_location_sharing, readme_unlink_partner, supabase_snippets_pair_partners [INFERRED 0.85]
- **Playwright Auth & One-Time Setup Mechanisms** — _agents_skills_playwright_best_practices_core_global_setup_globalsetup, _agents_skills_playwright_best_practices_core_projects_dependencies_setup_projects, _agents_skills_playwright_best_practices_core_fixtures_hooks_storage_state_auth, _agents_skills_playwright_best_practices_core_fixtures_hooks_worker_scope_fixtures [INFERRED 0.85]
- **Playwright CI provider configurations** — _agents_skills_playwright_best_practices_infrastructure_ci_cd_gitlab, _agents_skills_playwright_best_practices_infrastructure_ci_cd_other_providers, _agents_skills_playwright_best_practices_infrastructure_ci_cd_parallel_sharding, _agents_skills_playwright_best_practices_infrastructure_ci_cd_reporting [INFERRED 0.85]
- **Playwright network & service mocking toolkit** — _agents_skills_playwright_best_practices_advanced_network_advanced_route_interception, _agents_skills_playwright_best_practices_advanced_network_advanced_har_recording, _agents_skills_playwright_best_practices_advanced_network_advanced_graphql_mocking, _agents_skills_playwright_best_practices_browser_apis_websockets_websocket_mocking, _agents_skills_playwright_best_practices_advanced_third_party_oauth_sso_mocking, _agents_skills_playwright_best_practices_advanced_third_party_payment_gateway_mocking, _agents_skills_playwright_best_practices_advanced_third_party_email_verification_mocking [INFERRED 0.85]
- **Screenshot-based visual verification** — _agents_skills_playwright_best_practices_testing_patterns_visual_regression, _agents_skills_playwright_best_practices_testing_patterns_canvas_webgl_canvas_screenshot_testing, _agents_skills_playwright_best_practices_testing_patterns_i18n_locale_specific_snapshots, _agents_skills_playwright_best_practices_testing_patterns_visual_regression_masking_volatile_content [INFERRED 0.85]
- **Playwright Testing Pipeline** — _github_workflows_playwright_test_job, readme_e2e_tests, tests_fake_supabase, _claude_skills_feature_commit_skill_pre_commit_review [INFERRED 0.85]
- **Postgres Concurrency and Locking Practices** — _agents_skills_supabase_postgres_best_practices_references_lock_advisory_advisory_locks, _agents_skills_supabase_postgres_best_practices_references_lock_deadlock_prevention_consistent_lock_ordering, _agents_skills_supabase_postgres_best_practices_references_lock_short_transactions_short_transactions, _agents_skills_supabase_postgres_best_practices_references_lock_skip_locked_skip_locked, _agents_skills_supabase_postgres_best_practices_references_data_upsert_upsert_on_conflict [INFERRED 0.85]
- **Postgres Indexing Strategies** — _agents_skills_supabase_postgres_best_practices_references_query_composite_indexes_composite_indexes, _agents_skills_supabase_postgres_best_practices_references_query_covering_indexes_covering_indexes, _agents_skills_supabase_postgres_best_practices_references_query_index_types_index_types, _agents_skills_supabase_postgres_best_practices_references_query_missing_indexes_missing_indexes, _agents_skills_supabase_postgres_best_practices_references_query_partial_indexes_partial_indexes, _agents_skills_supabase_postgres_best_practices_references_schema_foreign_key_indexes_foreign_key_indexes [INFERRED 0.85]
- **Postgres Query Monitoring and Diagnostics** — _agents_skills_supabase_postgres_best_practices_references_monitor_explain_analyze_explain_analyze, _agents_skills_supabase_postgres_best_practices_references_monitor_pg_stat_statements_pg_stat_statements, _agents_skills_supabase_postgres_best_practices_references_monitor_vacuum_analyze_vacuum_analyze [INFERRED 0.85]
- **Array iteration and lookup optimizations** — _agents_skills_react_best_practices_rules_js_combine_iterations, _agents_skills_react_best_practices_rules_js_flatmap_filter, _agents_skills_react_best_practices_rules_js_index_maps, _agents_skills_react_best_practices_rules_js_set_map_lookups, _agents_skills_react_best_practices_rules_js_min_max_loop, _agents_skills_react_best_practices_rules_js_length_check_first [INFERRED 0.85]
- **Caching / memoization rules** — _agents_skills_react_best_practices_rules_js_cache_function_results, _agents_skills_react_best_practices_rules_js_cache_property_access, _agents_skills_react_best_practices_rules_js_cache_storage, _agents_skills_react_best_practices_rules_js_hoist_regexp, _agents_skills_react_best_practices_rules_rendering_hoist_jsx [INFERRED 0.85]
- **Stable Callback / Effect Event Pattern** — _agents_skills_react_best_practices_rules_advanced_effect_event_deps_advanced_effect_event_deps, _agents_skills_react_best_practices_rules_advanced_event_handler_refs_advanced_event_handler_refs, _agents_skills_react_best_practices_rules_advanced_use_latest_advanced_use_latest, _agents_skills_react_best_practices_rules_advanced_effect_event_deps_useeffectevent [INFERRED 0.85]
- **Concurrent rendering rules (transitions/deferred values)** — _agents_skills_react_best_practices_rules_rendering_usetransition_loading_rule, _agents_skills_react_best_practices_rules_rerender_transitions_rule, _agents_skills_react_best_practices_rules_rerender_use_deferred_value_rule, _agents_skills_react_best_practices_rules_rendering_usetransition_loading_usetransition [INFERRED 0.85]
- **RSC server-side performance rules** — _agents_skills_react_best_practices_rules_server_parallel_fetching_parallel_fetching_composition, _agents_skills_react_best_practices_rules_server_parallel_nested_fetching_parallel_nested_fetching, _agents_skills_react_best_practices_rules_server_serialization_minimize_rsc_serialization, _agents_skills_react_best_practices_rules_server_dedup_props_avoid_duplicate_rsc_serialization, _agents_skills_react_best_practices_rules_server_hoist_static_io_hoist_static_io, _agents_skills_react_best_practices_rules_server_cache_react_react_cache_dedup, _agents_skills_react_best_practices_rules_server_cache_lru_cross_request_lru_caching [INFERRED 0.85]
- **Tailwind v4 CSS-first config features** — _agents_skills_tailwind_css_patterns_references_configuration_css_first_config, _agents_skills_tailwind_css_patterns_references_configuration_custom_utilities, _agents_skills_tailwind_css_patterns_references_animations_custom_animations, _agents_skills_tailwind_css_patterns_references_reference_custom_variants, _agents_skills_tailwind_css_patterns_references_configuration_vite_integration [INFERRED 0.85]
- **Postgres connection management rules** — _agents_skills_supabase_postgres_best_practices_references_conn_pooling_use_connection_pooling, _agents_skills_supabase_postgres_best_practices_references_conn_limits_set_connection_limits, _agents_skills_supabase_postgres_best_practices_references_conn_idle_timeout_configure_idle_timeouts, _agents_skills_supabase_postgres_best_practices_references_conn_prepared_statements_prepared_statements_with_pooling, _agents_skills_supabase_postgres_best_practices_references__sections_conn_category [INFERRED 0.95]

## Communities (100 total, 29 thin omitted)

### Community 0 - "home-screen.tsx"
Cohesion: 0.18
Nodes (10): HomeScreen(), Props, LocationCard(), Props, MoodPicker(), NameCard(), Props, Props (+2 more)

### Community 1 - "React Best Practices (compiled AGENTS.md)"
Cohesion: 0.14
Nodes (23): React Best Practices (compiled AGENTS.md), pnpm build (compile rules to AGENTS.md), React Best Practices Repository, @shuding (Vercel), test-cases.json (LLM evaluation cases), Advanced Patterns (advanced), Eliminating Waterfalls (async), Bundle Size Optimization (bundle) (+15 more)

### Community 2 - "/graphify skill"
Cohesion: 0.09
Nodes (5): Community detection and labeling, EXTRACTED / INFERRED / AMBIGUOUS audit trail, graph.json, GRAPH_REPORT.md, /graphify skill

### Community 3 - "fake-supabase.ts"
Cohesion: 0.10
Nodes (13): @playwright/test, b64(), cors, FakeSupabase, Invite, makeSession(), ME, NO_ROWS (+5 more)

### Community 4 - "getSupabase"
Cohesion: 0.12
Nodes (36): Home(), App(), Auth, Loading(), SignedIn(), signOut(), useAuth(), SignIn() (+28 more)

### Community 5 - "Accessibility Skill (SKILL.md)"
Cohesion: 0.11
Nodes (10): Accessibility Code Patterns, Screen Reader Commands, WCAG 2.2 Quick Reference, What Changed from WCAG 2.1 to 2.2, Accessibility Skill (SKILL.md), WCAG Conformance Levels (A, AA, AAA), Accessibility Testing Checklist (Lighthouse, axe-core, manual), WCAG 2.2 (+2 more)

### Community 6 - "Supabase Postgres Best Practices Skill"
Cohesion: 0.10
Nodes (17): lru-cache (node-lru-cache), Vercel Fluid Compute, React.cache(), Writing Guidelines for Postgres References, Advanced Features (advanced-), Connection Management (conn-), Data Access Patterns (data-), Concurrency & Locking (lock-) (+9 more)

### Community 7 - "Node.js Backend Patterns Skill"
Cohesion: 0.12
Nodes (3): Node.js Advanced Patterns, Node.js Backend Patterns Skill, Node.js Best Practices Skill

### Community 8 - "Fixtures & Hooks"
Cohesion: 0.14
Nodes (19): Fixtures & Hooks, Custom Fixtures, beforeEach/afterAll Hooks, Storage State Authentication, Transaction Rollback Pattern, Worker-Scoped Fixtures, Global Setup & Teardown, Database Snapshot Pattern (+11 more)

### Community 9 - "feature-commit skill"
Cohesion: 0.13
Nodes (10): graphify skill trigger, Conventional Commits, feature-commit skill, Knowledge Graph Update Commit, Pre-commit Review Checks (tsc, eslint, playwright), playwright-report artifact, Playwright Tests CI Workflow, test job (chromium + webkit) (+2 more)

### Community 10 - "Design system (two-person distance & mood app)"
Cohesion: 0.20
Nodes (14): Semantic colour tokens, Design system (two-person distance & mood app), design/tokens.json, Distance count-up animation, app/globals.css, Mood colours, Custom mood icon set (components/mood-icons.tsx), moods.mood check constraint (+6 more)

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "Playwright Best Practices Skill"
Cohesion: 0.11
Nodes (18): Validate AI Skill Workflow, Agnix Agent Config Lint (agent-sh/agnix), Date, Time & Clock Mocking, Mobile & Responsive Testing, Browser APIs: Geolocation, Permissions & More, MIT License (Currents Software Inc.), Playwright Best Practices README, Playwright Best Practices Skill (+10 more)

### Community 13 - "Functions"
Cohesion: 0.15
Nodes (15): Async cookies() and headers(), Async params / searchParams (Promise), Async Patterns, next-async-request-api codemod, Functions, Generate functions (generateStaticParams, generateMetadata, ...), ImageResponse, NextRequest / NextResponse (+7 more)

### Community 14 - "Next.js Cache Components Skill"
Cohesion: 0.19
Nodes (15): 'use cache' directive, Custom cache handler (Redis/S3), Cache key generation, cacheComponents config flag, cacheLife() cache profiles, cacheTag(), Next.js Cache Components Skill, Partial Prerendering (PPR) (+7 more)

### Community 15 - "Assertions & Waiting"
Cohesion: 0.25
Nodes (9): Assertions & Waiting, Auto-Waiting, Custom Matchers, Soft Assertions, toPass() / expect.poll() Polling, Web-First Assertions, Debugging and Managing Flaky Tests, Flakiness Categories (+1 more)

### Community 16 - "Drag and Drop Testing"
Cohesion: 0.18
Nodes (11): Keyboard Navigation Testing, Drag and Drop Testing, File Drop Zone, Kanban Board Cross-Column Movement, Keyboard-Based Reordering, Native HTML5 Drag and Drop, Sortable Lists Reordering, File Upload and Download Testing (Advanced) (+3 more)

### Community 17 - "React Composition Patterns (compiled AGENTS.md)"
Cohesion: 0.41
Nodes (5): React Composition Patterns (compiled AGENTS.md), React Composition Patterns README, Rule Sections (architecture, state, patterns, react19), Rule Template, Vercel Composition Patterns Skill

### Community 18 - "Data Patterns"
Cohesion: 0.16
Nodes (14): Data Patterns, Preload pattern, Server Actions for mutations, Server Components for reads, Directives, 'use client' directive, 'use server' directive, Route Handlers (+6 more)

### Community 20 - "package.json"
Cohesion: 0.15
Nodes (12): name, private, version, autoskills, react-dom, supabase, tailwindcss, @tailwindcss/postcss (+4 more)

### Community 21 - "TypeScript Advanced Types Skill"
Cohesion: 0.23
Nodes (9): Conditional types, DeepReadonly / DeepPartial, TypeScript Advanced Types Skill, Generics, infer keyword, Mapped types, Template literal types, Type guards and assertion functions (+1 more)

### Community 22 - "20261001000000_initial_schema.sql"
Cohesion: 0.24
Nodes (7): locations_set_updated_at, moods_set_updated_at, on_auth_user_created, public.is_me_or_partner(), public.locations, public.moods, public.profiles

### Community 23 - "Next.js Best Practices Skill"
Cohesion: 0.21
Nodes (12): Debug Tricks, Dev server MCP endpoint (get_errors, get_routes, ...), Rebuild specific routes (Next.js 16+), Font Optimization, next/font (Google & local fonts), Hydration Errors, Hydration mismatch causes (browser APIs, dates, random IDs, invalid nesting), Scripts (+4 more)

### Community 24 - "Test Suite Structure"
Cohesion: 0.18
Nodes (13): Test Annotations & Organization, Custom Annotations, Fixme & Fail Annotations, Skip Annotations, Test Steps (test.step), Test Suite Structure, API Mocking (page.route), Test Directory Structure (+5 more)

### Community 25 - "Authentication Testing"
Cohesion: 0.13
Nodes (13): Authentication Testing, Organizing Reusable Test Code (POM vs Fixtures), Choosing Test Types: E2E, Component, or API, Mocking Strategy: Real vs Mock Services, API Testing, API Data Seeding, Chained API Calls, Request Fixtures for Authenticated Clients (+5 more)

### Community 26 - "Advanced Network Interception"
Cohesion: 0.14
Nodes (7): Complex Authentication Flow Patterns, Multi-Tab, Window & Popup Testing, Multi-User & Collaboration Testing, Advanced Network Interception, Third-Party Service Mocking, Service Worker Testing, WebSocket & Real-Time Testing

### Community 27 - "Playwright Configuration"
Cohesion: 0.11
Nodes (21): Playwright Configuration, Artifact Collection Strategy, Environment-Specific Configuration (.env), webServer Config, Angular Testing with Playwright, CDK Overlay Container, Protractor Migration Reference, Zone.js and Change Detection (+13 more)

### Community 28 - "Error & Edge Case Testing"
Cohesion: 0.13
Nodes (17): Browser Console & JavaScript Error Handling, Auto-Fail Console Fixture, Uncaught Exception (pageerror) Detection, Error & Edge Case Testing, Error Boundary Testing, Form Validation Testing, Network Failure Testing, Offline Testing (+9 more)

### Community 29 - "Canvas & WebGL Testing"
Cohesion: 0.20
Nodes (11): Canvas & WebGL Testing, Canvas Screenshot Testing, Chart Library Testing, Frame-by-Frame Testing, WebGL Testing, Locale-Specific Snapshots, Visual Regression Testing, Cross-Browser Visual Testing (+3 more)

### Community 30 - "devDependencies"
Cohesion: 0.15
Nodes (13): devDependencies, autoskills, @electric-sql/pglite, eslint, eslint-config-next, @playwright/test, supabase, tailwindcss (+5 more)

### Community 31 - "20261002010000_pair_approval.sql"
Cohesion: 0.22
Nodes (4): pair_invites_one_request_each, public.approve_pair_request(), public.my_pair_request(), public.request_pair()

### Community 32 - "Self-Hosting Next.js"
Cohesion: 0.27
Nodes (10): Image Optimization, next/image, remotePatterns config, Build-time vs runtime environment variables, Self-Hosting Next.js, Docker deployment, Health check endpoint, OpenNext (+2 more)

### Community 33 - "reaction-banner.tsx"
Cohesion: 0.14
Nodes (20): Props, ReactionBanner(), dismiss(), readSeen(), subscribeVisibility(), usePageVisible(), writeSeen(), Props (+12 more)

### Community 34 - "helpers.mjs"
Cohesion: 0.12
Nodes (10): @electric-sql/pglite, [A, B, C], build(), createDb(), anon(), MIGRATIONS, templates, user() (+2 more)

### Community 35 - "distance-hero.tsx"
Cohesion: 0.19
Nodes (16): DistanceHero(), Presence(), Props, MiniMap(), project(), Props, COMPASS, compassDirection() (+8 more)

### Community 36 - "GitHub Actions for Playwright"
Cohesion: 0.06
Nodes (34): Trace Viewer, CI-Specific Flakiness, Merge Sharded Blob Reports, Test Sharding, Container-Based Testing, Dev Container Setup, Docker Compose Stack, Official Playwright Docker Image (+26 more)

### Community 39 - "Tailwind CSS Patterns Skill"
Cohesion: 0.27
Nodes (9): Dark mode, Container queries (@container, v4.1+), Dark mode toggle (React), Tailwind CSS Responsive Design & Dark Mode, Mobile-first responsive layout, Dark mode (dark: variant), Tailwind CSS Patterns Skill, Responsive breakpoints (sm/md/lg/xl/2xl) (+1 more)

### Community 40 - "File Conventions"
Cohesion: 0.28
Nodes (9): File Conventions, middleware.ts (Next.js 14-15), proxy.ts (Next.js 16+ replaces middleware.ts), Runtime Selection, Edge runtime, Node.js runtime (default), Next.js Upgrade Skill, Incremental upgrade path (+1 more)

### Community 41 - "use-couple.ts"
Cohesion: 0.17
Nodes (17): MoodCard(), Props, MoodIcon(), Props, MOOD_VALUES, MOODS, MoodStyle, MoodValue (+9 more)

### Community 42 - "mood-icons.tsx"
Cohesion: 0.29
Nodes (11): Base(), CalmIcon(), ExcitedIcon(), HappyIcon(), IconProps, ICONS, LovedIcon(), MissingYouIcon() (+3 more)

### Community 43 - "MSplusEverythingIwant App"
Cohesion: 0.31
Nodes (8): Live Location Sharing, Email Magic Link Sign-in, Mood Sharing, MSplusEverythingIwant App, Next.js, Partner Linking via Invite Code, Supabase, Unlink Partner

### Community 44 - "20261005010000_reactions.sql"
Cohesion: 0.29
Nodes (3): public.reactions, reactions_set_sent_at, public.unpair()

### Community 45 - "20261002000000_pair_invites.sql"
Cohesion: 0.43
Nodes (6): pair_attempts_user_time, public.accept_pair_invite(), public.create_pair_invite(), public.has_mutual_partner(), public.pair_attempts, public.pair_invites

### Community 46 - "Debugging & Troubleshooting"
Cohesion: 0.12
Nodes (18): iFrame Testing, Locator Strategies, Locator Filtering & Chaining, getByRole, getByTestId, Locator Priority Order, Page Object Model (POM), Component Objects (+10 more)

### Community 48 - "Cache Storage API Calls"
Cohesion: 0.33
Nodes (3): Version and Minimize localStorage Data, Cache Repeated Function Calls, Cache Storage API Calls

### Community 49 - "SEO Optimization Skill"
Cohesion: 0.29
Nodes (7): Canonical URLs, Core Web Vitals, Search Ranking Factors, robots.txt / Meta Robots, SEO Optimization Skill, URL Structure Guidelines, XML Sitemap

### Community 50 - "Tailwind CSS Configuration"
Cohesion: 0.33
Nodes (7): Custom animations via @theme keyframes, CSS-first configuration (@theme, v4.1+), Custom utilities (@utility), Tailwind CSS Configuration, JavaScript configuration (legacy), Tailwind plugins, Tailwind presets

### Community 51 - "Tailwind CSS Documentation Reference"
Cohesion: 0.29
Nodes (7): Vite integration (@tailwindcss/vite), Arbitrary values, Custom variants (@custom-variant), Tailwind CSS Documentation Reference, Layer organization (@layer), State variants (hover/focus/etc.), Installation with Vite

### Community 52 - "layout.tsx"
Cohesion: 0.29
Nodes (4): figtree, fredoka, metadata, viewport

### Community 53 - "Bundling"
Cohesion: 0.47
Nodes (6): Bundle analysis, Bundling, Server-incompatible packages, serverExternalPackages, transpilePackages (ESM/CJS fix), Webpack to Turbopack migration

### Community 54 - "Error Handling"
Cohesion: 0.47
Nodes (6): Error Handling, error.tsx error boundary, global-error.tsx, Navigation API gotcha (redirect/notFound throw), not-found.tsx, Special files (page, layout, loading, error, ...)

### Community 55 - "use-location-sharing.ts"
Cohesion: 0.60
Nodes (4): Fix, readPref(), useLocationSharing(), writePref()

### Community 56 - "Component Testing"
Cohesion: 0.12
Nodes (16): Accessibility Testing, A11y as CI Gate, ARIA Validation, Axe-Core Integration, Focus Management, Extension Fixture, Component Testing, Mocking Dependencies (+8 more)

### Community 57 - "Hoist RegExp Creation"
Cohesion: 0.33
Nodes (4): Cache Property Access in Loops, Hoist RegExp Creation, Animate SVG Wrapper Instead of SVG Element, Hoist Static JSX Elements

### Community 59 - "Tailwind CSS Accessibility Guidelines"
Cohesion: 0.33
Nodes (6): ARIA patterns with Tailwind, Color contrast guidelines (WCAG), Tailwind CSS Accessibility Guidelines, focus-visible vs focus, sr-only screen reader content, Modal/Dialog

### Community 60 - "Tailwind CSS Component Patterns"
Cohesion: 0.33
Nodes (6): React Button component with variants, Card component, Tailwind CSS Component Patterns, Form elements, Navigation bar, Discriminated unions

### Community 61 - "Tailwind CSS Layout Patterns"
Cohesion: 0.33
Nodes (6): Color utilities and opacity, Tailwind CSS Layout Patterns, Flexbox layouts, Grid layouts, Spacing scale (padding/margin), Typography utilities

### Community 62 - "dependencies"
Cohesion: 0.40
Nodes (5): dependencies, next, react, react-dom, @supabase/supabase-js

### Community 63 - "Suspense Boundaries"
Cohesion: 0.40
Nodes (5): Avoiding data waterfalls (Promise.all, streaming, preload), Navigation hooks (useRouter, usePathname, useSearchParams, ...), Suspense Boundaries, usePathname Suspense requirement, useSearchParams requires Suspense boundary

### Community 64 - "Parallel & Intercepting Routes"
Cohesion: 0.60
Nodes (5): default.tsx (critical for parallel routes), Parallel & Intercepting Routes, Intercepting routes ((.) matchers) modal, Close modal with router.back(), Parallel route slots (@slot)

### Community 66 - "Performance & Parallelization"
Cohesion: 0.16
Nodes (15): CI/CD Integration, Cache Playwright Browsers, Performance & Parallelization, Block Unnecessary Resources, Cache API Responses, Lazy Navigation, Reuse Authentication, Test Coverage (+7 more)

### Community 69 - "Early Length Check for Array Comparisons"
Cohesion: 0.40
Nodes (4): Early Return from Functions, Early Length Check for Array Comparisons, Use Loop for Min/Max Instead of Sort, Use toSorted() Instead of sort() for Immutability

### Community 71 - "Optimize RLS Policies for Performance"
Cohesion: 0.70
Nodes (3): Optimize RLS Policies for Performance, is_team_member security definer function, Row Level Security policy

### Community 72 - "Tailwind CSS Animations & Transitions"
Cohesion: 0.40
Nodes (5): Reduced motion (motion-reduce/motion-safe), Built-in animations (spin, ping, pulse, bounce), Tailwind CSS Animations & Transitions, Global reduced motion support, Transitions and transform effects

### Community 74 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test:db

### Community 83 - "Tailwind CSS Performance Optimization"
Cohesion: 0.67
Nodes (4): Content path configuration, cssnano minification, Tailwind CSS Performance Optimization, PurgeCSS configuration

### Community 84 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 85 - "playwright"
Cohesion: 0.50
Nodes (3): npx, playwright, @playwright/mcp

### Community 90 - "Apple Touch Icon (two overlapping circles)"
Cohesion: 0.67
Nodes (3): Apple Touch Icon (two overlapping circles), Overlapping Circles Motif (Two Partners), PWA Home Screen Icon

### Community 91 - "App Icon (Two Lights)"
Cohesion: 0.67
Nodes (3): App Icon (Two Lights), Icon Color Tokens (dark bg, you, partner), Two Lights Motif (You and Partner)

### Community 92 - "PWA App Icon 512px (Overlapping Circles)"
Cohesion: 0.67
Nodes (3): PWA App Icon 512px (Overlapping Circles), Dark Background with Pink/Amber Accent Palette, Overlapping Pink and Amber Circles Motif

## Ambiguous Edges - Review These
- `Cross-Request LRU Caching` → `Use Connection Pooling`  [AMBIGUOUS]
  .agents/skills/react-best-practices/rules/server-cache-lru.md · relation: conceptually_related_to

## Knowledge Gaps
- **297 isolated node(s):** `name`, `version`, `private`, `dev`, `build` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 417 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Cross-Request LRU Caching` and `Use Connection Pooling`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Playwright Best Practices Skill` connect `Playwright Best Practices Skill` to `Performance & Parallelization`, `Component Testing`, `GitHub Actions for Playwright`, `Fixtures & Hooks`, `Debugging & Troubleshooting`, `Assertions & Waiting`, `Drag and Drop Testing`, `Test Suite Structure`, `Authentication Testing`, `Advanced Network Interception`, `Playwright Configuration`, `Error & Edge Case Testing`, `Canvas & WebGL Testing`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `react` connect `getSupabase` to `home-screen.tsx`, `reaction-banner.tsx`, `distance-hero.tsx`, `use-couple.ts`, `mood-icons.tsx`, `package.json`, `use-location-sharing.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Supabase` connect `MSplusEverythingIwant App` to `fake-supabase.ts`, `getSupabase`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `React Best Practices (compiled AGENTS.md)` be split into smaller, more focused modules?**
  _Cohesion score 0.1353658536585366 - nodes in this community are weakly interconnected._
- **Should `/graphify skill` be split into smaller, more focused modules?**
  _Cohesion score 0.08739495798319327 - nodes in this community are weakly interconnected._