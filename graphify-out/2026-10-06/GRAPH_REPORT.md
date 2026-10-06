# Graph Report - MSplusEverythingIwant  (2026-10-06)

## Corpus Check
- 305 files · ~205,284 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 4, .toml 2, .example 1)

## Summary
- 1124 nodes · 1695 edges · 107 communities (75 shown, 32 thin omitted)
- Extraction: 85% EXTRACTED · 15% INFERRED · 0% AMBIGUOUS · INFERRED: 252 edges (avg confidence: 0.83)
- Token cost: 96,390 input · 0 output

## Community Hubs (Navigation)
- Playwright CI & Sharding
- Repo Workflow Rules & Docs
- React Best Practices Skill
- App Shell, Auth & Pairing UI
- E2E Tests & Fake Supabase
- Graphify Skill Docs
- Accessibility & WCAG Skill
- React Server Caching & Fetching
- Reactions UI
- Distance Hero & Mini Map
- Playwright Fixtures & Hooks
- Node.js Backend Patterns
- Mood Card & Picker
- Database Test Suite
- App Design System
- TypeScript Config
- Home Screen & Location Card
- Playwright Test Organization
- Next.js Async APIs
- Next.js Cache Components
- Playwright Assertions & Debugging
- React Composition Patterns
- Next.js Data & Directives
- Package Manifest
- TypeScript Advanced Types
- Initial Database Schema
- Dev Dependencies
- Next.js Debugging & Fonts
- Accessibility & Keyboard Testing
- Old Graph Screenshot (artifact)
- Mood Icons
- Auth & Third-Party Mocking
- Multi-Tab & Network Interception
- Playwright Config & Frameworks
- Error & Security Testing
- Canvas & Visual Regression Tests
- Pair Approval Migration
- Next.js Images & Self-Hosting
- Mobile, Geolocation & Service Workers
- Locators & Page Objects
- Angular & Form Testing
- Component & Electron Testing
- React Re-render Optimization
- Tailwind Responsive & Dark Mode
- Next.js Conventions & Upgrades
- Test Annotations & Tags
- API & GraphQL Testing
- File Upload & Download Testing
- Clock & i18n Testing
- Invite Code Migration
- Client Storage Caching
- SEO Fundamentals
- Tailwind Configuration
- Tailwind Variants & Vite
- Root Layout & Fonts
- Next.js Bundling
- Next.js Error Handling
- Vue & Hydration Testing
- JS Micro-optimizations
- Tailwind Accessibility
- Tailwind Component Patterns
- Tailwind Layout Utilities
- npm Scripts
- Suspense & Navigation Hooks
- Parallel & Intercepting Routes
- Array Performance Tips
- React Transitions
- Supabase RLS Performance
- Tailwind Animations
- PWA Manifest & Next Config
- Runtime Dependencies
- Reactions Migration
- Event Listener Performance
- Layout Thrashing
- Hydration Mismatch Fixes
- Resource Preloading
- Tailwind Performance
- ESLint Config
- Playwright MCP Config
- Unlink Cleanup Migration
- Use SWR for Automatic Deduplication
- Use Activity Component for Show/Hide
- Calculate Derived State During Rendering
- Avoid Duplicate Serialization in RSC
- Graphify Communities Panel
- Apple Touch Icon
- App Icon
- PWA App Icon 512px
- public.unpair
- Combine Multiple Array Iterations
- Build Index Maps for Repeated
- Next.js after function
- Authenticate Server Actions Like API
- postcss.config.mjs
- PWA Icon 192px

## God Nodes (most connected - your core abstractions)
1. `getSupabase()` - 23 edges
2. `WaitingForPartner()` - 21 edges
3. `React Best Practices (compiled AGENTS.md)` - 20 edges
4. `Next.js Best Practices Skill` - 19 edges
5. `Playwright Best Practices Skill` - 19 edges
6. `Vercel React Best Practices Skill` - 19 edges
7. `Accessibility Skill (SKILL.md)` - 18 edges
8. `Rule Template` - 18 edges
9. `/graphify skill` - 18 edges
10. `FakeSupabase` - 17 edges

## Surprising Connections (you probably didn't know these)
- `UI Self-check Before Finishing` --semantically_similar_to--> `End-to-end Playwright tests (port 3199, .next-e2e)`  [INFERRED] [semantically similar]
  .claude/CLAUDE.md → README.md
- `next build vs next dev .next/ Conflict` --semantically_similar_to--> `End-to-end Playwright tests (port 3199, .next-e2e)`  [INFERRED] [semantically similar]
  .claude/skills/feature-commit/SKILL.md → README.md
- `helpers.mjs Supabase stand-in` --semantically_similar_to--> `tests/fake-supabase.ts (faked Supabase)`  [INFERRED] [semantically similar]
  tests/db/README.md → README.md
- `sendRequest()` --indirect_call--> `code()`  [INFERRED]
  components/waiting-for-partner.tsx → tests/db/pairing.test.mjs
- `--test-timeout=300000 backstop` --rationale_for--> `CI test job (ubuntu-latest, 60 min timeout)`  [INFERRED]
  tests/db/README.md → .github/workflows/playwright.yml

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **New Success Criteria in WCAG 2.2** — _agents_skills_accessibility_skill_focus_visible, _agents_skills_accessibility_skill_target_size, _agents_skills_accessibility_skill_dragging_movements, _agents_skills_accessibility_skill_accessible_authentication, _agents_skills_accessibility_references_wcag_changes_2_1_to_2_2 [EXTRACTED 1.00]
- **Alternatives to Boolean Prop Configuration** — _agents_skills_composition_patterns_rules_architecture_avoid_boolean_props, _agents_skills_composition_patterns_rules_patterns_explicit_variants, _agents_skills_composition_patterns_rules_architecture_compound_components, _agents_skills_composition_patterns_rules_patterns_children_over_render_props [INFERRED 0.85]
- **Provider-Based State Management Rules** — _agents_skills_composition_patterns_rules_state_lift_state, _agents_skills_composition_patterns_rules_state_decouple_implementation, _agents_skills_composition_patterns_rules_state_context_interface, _agents_skills_composition_patterns_rules_architecture_compound_components [INFERRED 0.85]
- **React/Next.js directives** — _agents_skills_next_best_practices_directives_use_client, _agents_skills_next_best_practices_directives_use_server, _agents_skills_next_best_practices_directives_use_cache [EXTRACTED 1.00]
- **Parallel + intercepting route modal pattern** — _agents_skills_next_best_practices_parallel_routes_slots, _agents_skills_next_best_practices_parallel_routes_default_tsx, _agents_skills_next_best_practices_parallel_routes_intercepting_routes, _agents_skills_next_best_practices_parallel_routes_router_back_modal_close [EXTRACTED 1.00]
- **Cache Components tagging and invalidation** — _agents_skills_next_cache_components_skill_use_cache_directive, _agents_skills_next_cache_components_skill_cachetag, _agents_skills_next_cache_components_skill_updatetag, _agents_skills_next_cache_components_skill_revalidatetag, _agents_skills_next_cache_components_skill_cachelife [EXTRACTED 1.00]
- **Node.js layered backend architecture** — _agents_skills_nodejs_backend_patterns_skill_layered_architecture, _agents_skills_nodejs_backend_patterns_skill_dependency_injection, _agents_skills_nodejs_best_practices_skill_layered_structure, _agents_skills_nodejs_backend_patterns_references_advanced_patterns_dependency_injection [INFERRED 0.85]
- **Reusable test code organization patterns** — _agents_skills_playwright_best_practices_architecture_pom_vs_fixtures_page_objects, _agents_skills_playwright_best_practices_architecture_pom_vs_fixtures_custom_fixtures, _agents_skills_playwright_best_practices_architecture_pom_vs_fixtures_helper_functions [EXTRACTED 1.00]
- **Playwright network & service mocking toolkit** — _agents_skills_playwright_best_practices_advanced_network_advanced_route_interception, _agents_skills_playwright_best_practices_advanced_network_advanced_har_recording, _agents_skills_playwright_best_practices_advanced_network_advanced_graphql_mocking, _agents_skills_playwright_best_practices_browser_apis_websockets_websocket_mocking, _agents_skills_playwright_best_practices_advanced_third_party_oauth_sso_mocking, _agents_skills_playwright_best_practices_advanced_third_party_payment_gateway_mocking, _agents_skills_playwright_best_practices_advanced_third_party_email_verification_mocking [INFERRED 0.85]
- **Playwright Auth & One-Time Setup Mechanisms** — _agents_skills_playwright_best_practices_core_global_setup_globalsetup, _agents_skills_playwright_best_practices_core_projects_dependencies_setup_projects, _agents_skills_playwright_best_practices_core_fixtures_hooks_storage_state_auth, _agents_skills_playwright_best_practices_core_fixtures_hooks_worker_scope_fixtures [INFERRED 0.85]
- **Flaky Test Diagnosis Toolkit** — _agents_skills_playwright_best_practices_debugging_flaky_tests_flakiness_types, _agents_skills_playwright_best_practices_debugging_debugging_trace_viewer, _agents_skills_playwright_best_practices_core_assertions_waiting_topass_polling, _agents_skills_playwright_best_practices_debugging_console_errors_auto_fail_console_fixture [INFERRED 0.75]
- **Playwright CI Pipeline** — _agents_skills_playwright_best_practices_infrastructure_ci_cd_ci_cd, _agents_skills_playwright_best_practices_infrastructure_ci_cd_docker, _agents_skills_playwright_best_practices_infrastructure_ci_cd_github_actions, _agents_skills_playwright_best_practices_infrastructure_ci_cd_ci_cd_sharding [EXTRACTED 1.00]
- **Playwright CI provider configurations** — _agents_skills_playwright_best_practices_infrastructure_ci_cd_gitlab, _agents_skills_playwright_best_practices_infrastructure_ci_cd_other_providers, _agents_skills_playwright_best_practices_infrastructure_ci_cd_parallel_sharding, _agents_skills_playwright_best_practices_infrastructure_ci_cd_reporting [INFERRED 0.85]
- **Quality gates enforced in CI** — _agents_skills_playwright_best_practices_testing_patterns_accessibility_a11y_as_ci_gate, _agents_skills_playwright_best_practices_testing_patterns_performance_testing_performance_budgets, _agents_skills_playwright_best_practices_infrastructure_ci_cd_test_coverage_coverage_thresholds [INFERRED 0.75]
- **Screenshot-based visual verification** — _agents_skills_playwright_best_practices_testing_patterns_visual_regression, _agents_skills_playwright_best_practices_testing_patterns_canvas_webgl_canvas_screenshot_testing, _agents_skills_playwright_best_practices_testing_patterns_i18n_locale_specific_snapshots, _agents_skills_playwright_best_practices_testing_patterns_visual_regression_masking_volatile_content [INFERRED 0.85]
- **Waterfall Elimination Rules** — _agents_skills_react_best_practices_rules_async_api_routes_async_api_routes, _agents_skills_react_best_practices_rules_async_cheap_condition_before_await_async_cheap_condition_before_await, _agents_skills_react_best_practices_rules_async_defer_await_async_defer_await, _agents_skills_react_best_practices_rules_async_dependencies_async_dependencies, _agents_skills_react_best_practices_rules_async_parallel_async_parallel, _agents_skills_react_best_practices_rules_async_suspense_boundaries_async_suspense_boundaries [EXTRACTED 1.00]
- **Bundle Size Optimization Rules** — _agents_skills_react_best_practices_rules_bundle_analyzable_paths_bundle_analyzable_paths, _agents_skills_react_best_practices_rules_bundle_barrel_imports_bundle_barrel_imports, _agents_skills_react_best_practices_rules_bundle_conditional_bundle_conditional, _agents_skills_react_best_practices_rules_bundle_defer_third_party_bundle_defer_third_party, _agents_skills_react_best_practices_rules_bundle_dynamic_imports_bundle_dynamic_imports, _agents_skills_react_best_practices_rules_bundle_preload_bundle_preload [EXTRACTED 1.00]
- **Stable Callback / Effect Event Pattern** — _agents_skills_react_best_practices_rules_advanced_effect_event_deps_advanced_effect_event_deps, _agents_skills_react_best_practices_rules_advanced_event_handler_refs_advanced_event_handler_refs, _agents_skills_react_best_practices_rules_advanced_use_latest_advanced_use_latest, _agents_skills_react_best_practices_rules_advanced_effect_event_deps_useeffectevent [INFERRED 0.85]
- **Browser rendering/main-thread performance** — _agents_skills_react_best_practices_rules_js_batch_dom_css, _agents_skills_react_best_practices_rules_rendering_content_visibility, _agents_skills_react_best_practices_rules_rendering_animate_svg_wrapper, _agents_skills_react_best_practices_rules_client_passive_event_listeners, _agents_skills_react_best_practices_rules_js_request_idle_callback [INFERRED 0.75]
- **Caching / memoization rules** — _agents_skills_react_best_practices_rules_js_cache_function_results, _agents_skills_react_best_practices_rules_js_cache_property_access, _agents_skills_react_best_practices_rules_js_cache_storage, _agents_skills_react_best_practices_rules_js_hoist_regexp, _agents_skills_react_best_practices_rules_rendering_hoist_jsx [INFERRED 0.85]
- **Array iteration and lookup optimizations** — _agents_skills_react_best_practices_rules_js_combine_iterations, _agents_skills_react_best_practices_rules_js_flatmap_filter, _agents_skills_react_best_practices_rules_js_index_maps, _agents_skills_react_best_practices_rules_js_set_map_lookups, _agents_skills_react_best_practices_rules_js_min_max_loop, _agents_skills_react_best_practices_rules_js_length_check_first [INFERRED 0.85]
- **Avoid unnecessary useEffect rules** — _agents_skills_react_best_practices_rules_rerender_derived_state_no_effect_rule, _agents_skills_react_best_practices_rules_rerender_move_effect_to_event_rule, _agents_skills_react_best_practices_rules_rerender_dependencies_rule, _agents_skills_react_best_practices_rules_rerender_split_combined_hooks_rule [INFERRED 0.85]
- **Memoization correctness rules** — _agents_skills_react_best_practices_rules_rerender_memo_rule, _agents_skills_react_best_practices_rules_rerender_memo_with_default_value_rule, _agents_skills_react_best_practices_rules_rerender_simple_expression_in_memo_rule, _agents_skills_react_best_practices_rules_rerender_no_inline_components_rule, _agents_skills_react_best_practices_rules_rerender_memo_memo [INFERRED 0.75]
- **Concurrent rendering rules (transitions/deferred values)** — _agents_skills_react_best_practices_rules_rendering_usetransition_loading_rule, _agents_skills_react_best_practices_rules_rerender_transitions_rule, _agents_skills_react_best_practices_rules_rerender_use_deferred_value_rule, _agents_skills_react_best_practices_rules_rendering_usetransition_loading_usetransition [INFERRED 0.85]
- **RSC server-side performance rules** — _agents_skills_react_best_practices_rules_server_parallel_fetching_parallel_fetching_composition, _agents_skills_react_best_practices_rules_server_parallel_nested_fetching_parallel_nested_fetching, _agents_skills_react_best_practices_rules_server_serialization_minimize_rsc_serialization, _agents_skills_react_best_practices_rules_server_dedup_props_avoid_duplicate_rsc_serialization, _agents_skills_react_best_practices_rules_server_hoist_static_io_hoist_static_io, _agents_skills_react_best_practices_rules_server_cache_react_react_cache_dedup, _agents_skills_react_best_practices_rules_server_cache_lru_cross_request_lru_caching [INFERRED 0.85]
- **Postgres connection management rules** — _agents_skills_supabase_postgres_best_practices_references_conn_pooling_use_connection_pooling, _agents_skills_supabase_postgres_best_practices_references_conn_limits_set_connection_limits, _agents_skills_supabase_postgres_best_practices_references_conn_idle_timeout_configure_idle_timeouts, _agents_skills_supabase_postgres_best_practices_references_conn_prepared_statements_prepared_statements_with_pooling, _agents_skills_supabase_postgres_best_practices_references__sections_conn_category [INFERRED 0.95]
- **Reducing round trips / waterfalls** — _agents_skills_supabase_postgres_best_practices_references_data_n_plus_one_eliminate_n_plus_one, _agents_skills_supabase_postgres_best_practices_references_data_batch_inserts_batch_inserts, _agents_skills_react_best_practices_rules_server_parallel_nested_fetching_parallel_nested_fetching, _agents_skills_react_best_practices_rules_server_parallel_fetching_parallel_fetching_composition [INFERRED 0.75]
- **Postgres Concurrency and Locking Practices** — _agents_skills_supabase_postgres_best_practices_references_lock_advisory_advisory_locks, _agents_skills_supabase_postgres_best_practices_references_lock_deadlock_prevention_consistent_lock_ordering, _agents_skills_supabase_postgres_best_practices_references_lock_short_transactions_short_transactions, _agents_skills_supabase_postgres_best_practices_references_lock_skip_locked_skip_locked, _agents_skills_supabase_postgres_best_practices_references_data_upsert_upsert_on_conflict [INFERRED 0.85]
- **Postgres Query Monitoring and Diagnostics** — _agents_skills_supabase_postgres_best_practices_references_monitor_explain_analyze_explain_analyze, _agents_skills_supabase_postgres_best_practices_references_monitor_pg_stat_statements_pg_stat_statements, _agents_skills_supabase_postgres_best_practices_references_monitor_vacuum_analyze_vacuum_analyze [INFERRED 0.85]
- **Postgres Indexing Strategies** — _agents_skills_supabase_postgres_best_practices_references_query_composite_indexes_composite_indexes, _agents_skills_supabase_postgres_best_practices_references_query_covering_indexes_covering_indexes, _agents_skills_supabase_postgres_best_practices_references_query_index_types_index_types, _agents_skills_supabase_postgres_best_practices_references_query_missing_indexes_missing_indexes, _agents_skills_supabase_postgres_best_practices_references_query_partial_indexes_partial_indexes, _agents_skills_supabase_postgres_best_practices_references_schema_foreign_key_indexes_foreign_key_indexes [INFERRED 0.85]
- **RLS performance optimization techniques** — _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_select_wrapped_auth_uid, _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_is_team_member, _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_rls_column_index, _agents_skills_supabase_postgres_best_practices_references_security_rls_performance_rls_policy [EXTRACTED 1.00]
- **Reduced motion / accessible styling across Tailwind references** — _agents_skills_tailwind_css_patterns_references_accessibility_motion_reduce, _agents_skills_tailwind_css_patterns_references_animations_global_reduced_motion, _agents_skills_tailwind_css_patterns_references_accessibility_focus_visible, _agents_skills_tailwind_css_patterns_references_accessibility_sr_only [INFERRED 0.75]
- **Tailwind v4 CSS-first config features** — _agents_skills_tailwind_css_patterns_references_configuration_css_first_config, _agents_skills_tailwind_css_patterns_references_configuration_custom_utilities, _agents_skills_tailwind_css_patterns_references_animations_custom_animations, _agents_skills_tailwind_css_patterns_references_reference_custom_variants, _agents_skills_tailwind_css_patterns_references_configuration_vite_integration [INFERRED 0.85]
- **Feature-commit Workflow Guardrails** — _claude_skills_feature_commit_skill_feature_commit, _claude_skills_feature_commit_skill_selective_staging, _claude_skills_feature_commit_skill_pre_commit_review, _claude_skills_feature_commit_skill_no_claude_attribution, _claude_skills_feature_commit_skill_never_commit_main, _claude_skills_feature_commit_skill_no_force_push [EXTRACTED 1.00]
- **graphify full build flow (extract, merge, build, guard)** — _claude_skills_graphify_skill_ast_structural_extraction, _claude_skills_graphify_skill_semantic_extraction_subagents, _claude_skills_graphify_skill_merge_extraction, _claude_skills_graphify_skill_community_detection, _claude_skills_graphify_skill_graph_health_check, _claude_skills_graphify_skill_shrink_guard, _claude_skills_graphify_skill_manifest [EXTRACTED 1.00]
- **graphify graph freshness mechanisms** — _claude_skills_graphify_references_update_incremental_update, _claude_skills_graphify_references_hooks_post_commit_hook, _claude_skills_graphify_references_add_watch_watch_mode, _claude_skills_graphify_references_add_watch_add_url [INFERRED 0.85]
- **Design token sync targets (tokens.json, globals.css, widgets, migration)** — design_design_tokens_json, design_globals_css, design_widgets, design_moods_check_constraint, design_mood_icons [EXTRACTED 1.00]
- **CI test pipeline: DB tests then browser E2E** — _github_workflows_playwright_test_job, _github_workflows_playwright_run_database_tests, tests_db_readme_database_tests, _github_workflows_playwright_run_playwright_tests, readme_e2e_tests [INFERRED 0.85]
- **Supabase stand-ins for testing** — readme_fake_supabase, tests_db_readme_helpers_mjs, tests_db_readme_pglite [INFERRED 0.75]
- **Unlink clears shared partner state** — readme_unlink, readme_location_sharing, readme_reactions, readme_mood [EXTRACTED 1.00]
- **Graphify interactive viewer UI layout** — _playwright_mcp_graph_force_directed_canvas, _playwright_mcp_graph_node_search, _playwright_mcp_graph_node_info_panel, _playwright_mcp_graph_communities_legend [EXTRACTED 1.00]

## Communities (107 total, 32 thin omitted)

### Community 0 - "Playwright CI & Sharding"
Cohesion: 0.05
Nodes (46): CI/CD Integration, Merge Sharded Blob Reports, Cache Playwright Browsers, Test Sharding, Container-Based Testing, Dev Container Setup, Docker Compose Stack, GitHub Actions for Playwright (+38 more)

### Community 1 - "Repo Workflow Rules & Docs"
Cohesion: 0.07
Nodes (31): graphify skill trigger, Conventional Commits, feature-commit skill, Knowledge Graph Update Commit, Pre-commit Review Checks (tsc, eslint, playwright), Install Playwright Browsers step (chromium, webkit), Playwright Tests CI Workflow, Run database tests step (npm run test:db) (+23 more)

### Community 2 - "React Best Practices Skill"
Cohesion: 0.14
Nodes (23): React Best Practices (compiled AGENTS.md), pnpm build (compile rules to AGENTS.md), React Best Practices Repository, @shuding (Vercel), test-cases.json (LLM evaluation cases), Advanced Patterns (advanced), Eliminating Waterfalls (async), Bundle Size Optimization (bundle) (+15 more)

### Community 3 - "App Shell, Auth & Pairing UI"
Cohesion: 0.13
Nodes (33): Home(), App(), Auth, Loading(), SignedIn(), signOut(), useAuth(), SignIn() (+25 more)

### Community 4 - "E2E Tests & Fake Supabase"
Cohesion: 0.10
Nodes (14): Profile, @playwright/test, b64(), cors, FakeSupabase, Invite, makeSession(), ME (+6 more)

### Community 5 - "Graphify Skill Docs"
Cohesion: 0.09
Nodes (5): Community detection and labeling, EXTRACTED / INFERRED / AMBIGUOUS audit trail, graph.json, GRAPH_REPORT.md, /graphify skill

### Community 6 - "Accessibility & WCAG Skill"
Cohesion: 0.11
Nodes (10): Accessibility Code Patterns, Screen Reader Commands, WCAG 2.2 Quick Reference, What Changed from WCAG 2.1 to 2.2, Accessibility Skill (SKILL.md), WCAG Conformance Levels (A, AA, AAA), Accessibility Testing Checklist (Lighthouse, axe-core, manual), WCAG 2.2 (+2 more)

### Community 7 - "React Server Caching & Fetching"
Cohesion: 0.10
Nodes (17): lru-cache (node-lru-cache), Vercel Fluid Compute, React.cache(), Writing Guidelines for Postgres References, Advanced Features (advanced-), Connection Management (conn-), Data Access Patterns (data-), Concurrency & Locking (lock-) (+9 more)

### Community 8 - "Reactions UI"
Cohesion: 0.13
Nodes (22): Props, ReactionBanner(), dismiss(), readSeen(), subscribeVisibility(), usePageVisible(), writeSeen(), Props (+14 more)

### Community 9 - "Distance Hero & Mini Map"
Cohesion: 0.15
Nodes (20): DistanceHero(), Presence(), Props, MiniMap(), project(), Props, COMPASS, compassDirection() (+12 more)

### Community 10 - "Playwright Fixtures & Hooks"
Cohesion: 0.12
Nodes (23): Fixtures & Hooks, Custom Fixtures, beforeEach/afterAll Hooks, Storage State Authentication, Transaction Rollback Pattern, Worker-Scoped Fixtures, Global Setup & Teardown, Database Snapshot Pattern (+15 more)

### Community 11 - "Node.js Backend Patterns"
Cohesion: 0.12
Nodes (3): Node.js Advanced Patterns, Node.js Backend Patterns Skill, Node.js Best Practices Skill

### Community 12 - "Mood Card & Picker"
Cohesion: 0.17
Nodes (15): MoodCard(), Props, MoodIcon(), Props, MOOD_VALUES, MOODS, MoodStyle, MoodValue (+7 more)

### Community 13 - "Database Test Suite"
Cohesion: 0.13
Nodes (9): @electric-sql/pglite, [A, B, C], build(), createDb(), MIGRATIONS, templates, user(), [A, B, C, D, E] (+1 more)

### Community 14 - "App Design System"
Cohesion: 0.20
Nodes (14): Semantic colour tokens, Design system (two-person distance & mood app), design/tokens.json, Distance count-up animation, app/globals.css, Mood colours, Custom mood icon set (components/mood-icons.tsx), moods.mood check constraint (+6 more)

### Community 15 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "Home Screen & Location Card"
Cohesion: 0.17
Nodes (11): HomeScreen(), Props, LocationCard(), Props, MoodPicker(), NameCard(), Props, Props (+3 more)

### Community 17 - "Playwright Test Organization"
Cohesion: 0.17
Nodes (10): Validate AI Skill Workflow, Agnix Agent Config Lint (agent-sh/agnix), Authentication Testing, Organizing Reusable Test Code (POM vs Fixtures), Choosing Test Types: E2E, Component, or API, Mocking Strategy: Real vs Mock Services, MIT License (Currents Software Inc.), Playwright Best Practices README (+2 more)

### Community 18 - "Next.js Async APIs"
Cohesion: 0.15
Nodes (15): Async cookies() and headers(), Async params / searchParams (Promise), Async Patterns, next-async-request-api codemod, Functions, Generate functions (generateStaticParams, generateMetadata, ...), ImageResponse, NextRequest / NextResponse (+7 more)

### Community 19 - "Next.js Cache Components"
Cohesion: 0.19
Nodes (15): 'use cache' directive, Custom cache handler (Redis/S3), Cache key generation, cacheComponents config flag, cacheLife() cache profiles, cacheTag(), Next.js Cache Components Skill, Partial Prerendering (PPR) (+7 more)

### Community 20 - "Playwright Assertions & Debugging"
Cohesion: 0.16
Nodes (15): Assertions & Waiting, Auto-Waiting, Custom Matchers, Soft Assertions, toPass() / expect.poll() Polling, Web-First Assertions, Debugging & Troubleshooting, Playwright Inspector (+7 more)

### Community 21 - "React Composition Patterns"
Cohesion: 0.41
Nodes (5): React Composition Patterns (compiled AGENTS.md), React Composition Patterns README, Rule Sections (architecture, state, patterns, react19), Rule Template, Vercel Composition Patterns Skill

### Community 22 - "Next.js Data & Directives"
Cohesion: 0.16
Nodes (14): Data Patterns, Preload pattern, Server Actions for mutations, Server Components for reads, Directives, 'use client' directive, 'use server' directive, Route Handlers (+6 more)

### Community 24 - "Package Manifest"
Cohesion: 0.14
Nodes (13): name, private, version, autoskills, react-dom, supabase, @supabase/supabase-js, tailwindcss (+5 more)

### Community 25 - "TypeScript Advanced Types"
Cohesion: 0.23
Nodes (9): Conditional types, DeepReadonly / DeepPartial, TypeScript Advanced Types Skill, Generics, infer keyword, Mapped types, Template literal types, Type guards and assertion functions (+1 more)

### Community 26 - "Initial Database Schema"
Cohesion: 0.24
Nodes (7): locations_set_updated_at, moods_set_updated_at, on_auth_user_created, public.is_me_or_partner(), public.locations, public.moods, public.profiles

### Community 27 - "Dev Dependencies"
Cohesion: 0.15
Nodes (13): devDependencies, autoskills, @electric-sql/pglite, eslint, eslint-config-next, @playwright/test, supabase, tailwindcss (+5 more)

### Community 28 - "Next.js Debugging & Fonts"
Cohesion: 0.21
Nodes (12): Debug Tricks, Dev server MCP endpoint (get_errors, get_routes, ...), Rebuild specific routes (Next.js 16+), Font Optimization, next/font (Google & local fonts), Hydration Errors, Hydration mismatch causes (browser APIs, dates, random IDs, invalid nesting), Scripts (+4 more)

### Community 29 - "Accessibility & Keyboard Testing"
Cohesion: 0.17
Nodes (12): Accessibility Testing, A11y as CI Gate, ARIA Validation, Axe-Core Integration, Focus Management, Keyboard Navigation Testing, Drag and Drop Testing, Kanban Board Cross-Column Movement (+4 more)

### Community 30 - "Old Graph Screenshot (artifact)"
Cohesion: 0.21
Nodes (12): Communities Legend (filterable), Community: Design system (two-person distance), Community: fake-supabase.ts, Community: feature-commit skill, Community: getSupabase, Community: /graphify skill, Community: home-screen.tsx, Community: React Best Practices (+4 more)

### Community 31 - "Mood Icons"
Cohesion: 0.29
Nodes (11): Base(), CalmIcon(), ExcitedIcon(), HappyIcon(), IconProps, ICONS, LovedIcon(), MissingYouIcon() (+3 more)

### Community 32 - "Auth & Third-Party Mocking"
Cohesion: 0.22
Nodes (3): Complex Authentication Flow Patterns, Third-Party Service Mocking, iFrame Testing

### Community 33 - "Multi-Tab & Network Interception"
Cohesion: 0.25
Nodes (4): Multi-Tab, Window & Popup Testing, Multi-User & Collaboration Testing, Advanced Network Interception, WebSocket & Real-Time Testing

### Community 34 - "Playwright Config & Frameworks"
Cohesion: 0.22
Nodes (11): Playwright Configuration, Artifact Collection Strategy, Environment-Specific Configuration (.env), webServer Config, Next.js Testing Patterns, App Router Patterns, Middleware Testing, React Application Testing (+3 more)

### Community 35 - "Error & Security Testing"
Cohesion: 0.22
Nodes (11): Browser Console & JavaScript Error Handling, Uncaught Exception (pageerror) Detection, Error & Edge Case Testing, Error Boundary Testing, Form Validation Testing, Network Failure Testing, Offline Testing, Security Testing Basics (+3 more)

### Community 36 - "Canvas & Visual Regression Tests"
Cohesion: 0.20
Nodes (11): Canvas & WebGL Testing, Canvas Screenshot Testing, Chart Library Testing, Frame-by-Frame Testing, WebGL Testing, Locale-Specific Snapshots, Visual Regression Testing, Cross-Browser Visual Testing (+3 more)

### Community 37 - "Pair Approval Migration"
Cohesion: 0.22
Nodes (4): pair_invites_one_request_each, public.approve_pair_request(), public.my_pair_request(), public.request_pair()

### Community 38 - "Next.js Images & Self-Hosting"
Cohesion: 0.27
Nodes (10): Image Optimization, next/image, remotePatterns config, Build-time vs runtime environment variables, Self-Hosting Next.js, Docker deployment, Health check endpoint, OpenNext (+2 more)

### Community 39 - "Mobile, Geolocation & Service Workers"
Cohesion: 0.24
Nodes (7): Mobile & Responsive Testing, Browser APIs: Geolocation, Permissions & More, Service Worker Testing, Browser Extension Testing, Content Script Testing, Manifest V3 Service Worker, Popup Testing

### Community 40 - "Locators & Page Objects"
Cohesion: 0.22
Nodes (10): Locator Strategies, Locator Filtering & Chaining, getByRole, getByTestId, Locator Priority Order, Page Object Model (POM), Component Objects, Page Factory Functions (+2 more)

### Community 41 - "Angular & Form Testing"
Cohesion: 0.20
Nodes (10): Angular Testing with Playwright, CDK Overlay Container, Protractor Migration Reference, Zone.js and Change Detection, Form Testing Patterns, Auto-Complete and Typeahead Fields, Dynamic Forms Conditional Fields, Multi-Step Forms and Wizards (+2 more)

### Community 42 - "Component & Electron Testing"
Cohesion: 0.20
Nodes (10): Extension Fixture, Component Testing, Mocking Dependencies, Mount with Wrapper/Provider, Mounting Components, Electron Testing, Electron Test Fixture, IPC Communication Testing (+2 more)

### Community 45 - "Tailwind Responsive & Dark Mode"
Cohesion: 0.27
Nodes (9): Dark mode, Container queries (@container, v4.1+), Dark mode toggle (React), Tailwind CSS Responsive Design & Dark Mode, Mobile-first responsive layout, Dark mode (dark: variant), Tailwind CSS Patterns Skill, Responsive breakpoints (sm/md/lg/xl/2xl) (+1 more)

### Community 46 - "Next.js Conventions & Upgrades"
Cohesion: 0.28
Nodes (9): File Conventions, middleware.ts (Next.js 14-15), proxy.ts (Next.js 16+ replaces middleware.ts), Runtime Selection, Edge runtime, Node.js runtime (default), Next.js Upgrade Skill, Incremental upgrade path (+1 more)

### Community 47 - "Test Annotations & Tags"
Cohesion: 0.25
Nodes (9): Test Annotations & Organization, Custom Annotations, Fixme & Fail Annotations, Skip Annotations, Test Steps (test.step), Test Tags, --grep Tag Filtering, Common Tag Categories (+1 more)

### Community 48 - "API & GraphQL Testing"
Cohesion: 0.25
Nodes (9): API Testing, API Data Seeding, Chained API Calls, Request Fixtures for Authenticated Clients, Schema Validation with Zod, GraphQL Testing, Authenticated GraphQL Fixture, GraphQL Helper Function (+1 more)

### Community 49 - "File Upload & Download Testing"
Cohesion: 0.22
Nodes (9): File Drop Zone, File Upload & Download Testing (Basics), Download Fixture, File Content Verification, Upload from Buffer, File Upload and Download Testing (Advanced), Authenticated Downloads, File Type and Size Restrictions (+1 more)

### Community 50 - "Clock & i18n Testing"
Cohesion: 0.25
Nodes (6): Date, Time & Clock Mocking, Internationalization (i18n) Testing, Date, Time & Number Formats, Locale Fixture, Missing Translation Detection, RTL Layout Testing

### Community 51 - "Invite Code Migration"
Cohesion: 0.43
Nodes (6): pair_attempts_user_time, public.accept_pair_invite(), public.create_pair_invite(), public.has_mutual_partner(), public.pair_attempts, public.pair_invites

### Community 52 - "Client Storage Caching"
Cohesion: 0.33
Nodes (3): Version and Minimize localStorage Data, Cache Repeated Function Calls, Cache Storage API Calls

### Community 53 - "SEO Fundamentals"
Cohesion: 0.29
Nodes (7): Canonical URLs, Core Web Vitals, Search Ranking Factors, robots.txt / Meta Robots, SEO Optimization Skill, URL Structure Guidelines, XML Sitemap

### Community 54 - "Tailwind Configuration"
Cohesion: 0.33
Nodes (7): Custom animations via @theme keyframes, CSS-first configuration (@theme, v4.1+), Custom utilities (@utility), Tailwind CSS Configuration, JavaScript configuration (legacy), Tailwind plugins, Tailwind presets

### Community 55 - "Tailwind Variants & Vite"
Cohesion: 0.29
Nodes (7): Vite integration (@tailwindcss/vite), Arbitrary values, Custom variants (@custom-variant), Tailwind CSS Documentation Reference, Layer organization (@layer), State variants (hover/focus/etc.), Installation with Vite

### Community 56 - "Root Layout & Fonts"
Cohesion: 0.29
Nodes (4): figtree, fredoka, metadata, viewport

### Community 57 - "Next.js Bundling"
Cohesion: 0.47
Nodes (6): Bundle analysis, Bundling, Server-incompatible packages, serverExternalPackages, transpilePackages (ESM/CJS fix), Webpack to Turbopack migration

### Community 58 - "Next.js Error Handling"
Cohesion: 0.47
Nodes (6): Error Handling, error.tsx error boundary, global-error.tsx, Navigation API gotcha (redirect/notFound throw), not-found.tsx, Special files (page, layout, loading, error, ...)

### Community 59 - "Vue & Hydration Testing"
Cohesion: 0.33
Nodes (6): Auto-Fail Console Fixture, Hydration Testing, Vue and Nuxt Testing, Pinia Store Testing Through UI, Testing v-model, Capturing Vue Warnings

### Community 60 - "JS Micro-optimizations"
Cohesion: 0.33
Nodes (4): Cache Property Access in Loops, Hoist RegExp Creation, Animate SVG Wrapper Instead of SVG Element, Hoist Static JSX Elements

### Community 62 - "Tailwind Accessibility"
Cohesion: 0.33
Nodes (6): ARIA patterns with Tailwind, Color contrast guidelines (WCAG), Tailwind CSS Accessibility Guidelines, focus-visible vs focus, sr-only screen reader content, Modal/Dialog

### Community 63 - "Tailwind Component Patterns"
Cohesion: 0.33
Nodes (6): React Button component with variants, Card component, Tailwind CSS Component Patterns, Form elements, Navigation bar, Discriminated unions

### Community 64 - "Tailwind Layout Utilities"
Cohesion: 0.33
Nodes (6): Color utilities and opacity, Tailwind CSS Layout Patterns, Flexbox layouts, Grid layouts, Spacing scale (padding/margin), Typography utilities

### Community 65 - "npm Scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, test:db

### Community 66 - "Suspense & Navigation Hooks"
Cohesion: 0.40
Nodes (5): Avoiding data waterfalls (Promise.all, streaming, preload), Navigation hooks (useRouter, usePathname, useSearchParams, ...), Suspense Boundaries, usePathname Suspense requirement, useSearchParams requires Suspense boundary

### Community 67 - "Parallel & Intercepting Routes"
Cohesion: 0.60
Nodes (5): default.tsx (critical for parallel routes), Parallel & Intercepting Routes, Intercepting routes ((.) matchers) modal, Close modal with router.back(), Parallel route slots (@slot)

### Community 68 - "Array Performance Tips"
Cohesion: 0.40
Nodes (4): Early Return from Functions, Early Length Check for Array Comparisons, Use Loop for Min/Max Instead of Sort, Use toSorted() Instead of sort() for Immutability

### Community 70 - "Supabase RLS Performance"
Cohesion: 0.70
Nodes (3): Optimize RLS Policies for Performance, is_team_member security definer function, Row Level Security policy

### Community 71 - "Tailwind Animations"
Cohesion: 0.40
Nodes (5): Reduced motion (motion-reduce/motion-safe), Built-in animations (spin, ping, pulse, bounce), Tailwind CSS Animations & Transitions, Global reduced motion support, Transitions and transform effects

### Community 73 - "Runtime Dependencies"
Cohesion: 0.40
Nodes (5): dependencies, next, react, react-dom, @supabase/supabase-js

### Community 82 - "Tailwind Performance"
Cohesion: 0.67
Nodes (4): Content path configuration, cssnano minification, Tailwind CSS Performance Optimization, PurgeCSS configuration

### Community 83 - "ESLint Config"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 84 - "Playwright MCP Config"
Cohesion: 0.50
Nodes (3): npx, playwright, @playwright/mcp

### Community 90 - "Graphify Communities Panel"
Cohesion: 1.00
Nodes (3): Graphify Communities Panel (100 communities), Graphify graph viewer accessibility snapshot, Graphify graph viewer accessibility snapshot

### Community 91 - "Apple Touch Icon"
Cohesion: 0.67
Nodes (3): Apple Touch Icon (two overlapping circles), Overlapping Circles Motif (Two Partners), PWA Home Screen Icon

### Community 92 - "App Icon"
Cohesion: 0.67
Nodes (3): App Icon (Two Lights), Icon Color Tokens (dark bg, you, partner), Two Lights Motif (You and Partner)

### Community 93 - "PWA App Icon 512px"
Cohesion: 0.67
Nodes (3): PWA App Icon 512px (Overlapping Circles), Dark Background with Pink/Amber Accent Palette, Overlapping Pink and Amber Circles Motif

## Ambiguous Edges - Review These
- `Cross-Request LRU Caching` → `Use Connection Pooling`  [AMBIGUOUS]
  .agents/skills/react-best-practices/rules/server-cache-lru.md · relation: conceptually_related_to

## Knowledge Gaps
- **304 isolated node(s):** `npx`, `@playwright/mcp`, `fredoka`, `figtree`, `metadata` (+299 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 427 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Cross-Request LRU Caching` and `Use Connection Pooling`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `react` connect `Home Screen & Location Card` to `App Shell, Auth & Pairing UI`, `Reactions UI`, `Distance Hero & Mini Map`, `Mood Card & Picker`, `Package Manifest`, `Mood Icons`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `Fixtures & Hooks` connect `Playwright Fixtures & Hooks` to `Playwright CI & Sharding`, `Playwright Config & Frameworks`, `Error & Security Testing`, `Locators & Page Objects`, `Component & Electron Testing`, `File Upload & Download Testing`, `Playwright Assertions & Debugging`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `Test Suite Structure` connect `Playwright Fixtures & Hooks` to `Playwright CI & Sharding`, `Multi-Tab & Network Interception`, `Playwright Config & Frameworks`, `Canvas & Visual Regression Tests`, `Locators & Page Objects`, `Component & Electron Testing`, `Test Annotations & Tags`, `Playwright Assertions & Debugging`, `Accessibility & Keyboard Testing`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `npx`, `@playwright/mcp`, `fredoka` to the rest of the system?**
  _304 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Playwright CI & Sharding` be split into smaller, more focused modules?**
  _Cohesion score 0.050241545893719805 - nodes in this community are weakly interconnected._
- **Should `Repo Workflow Rules & Docs` be split into smaller, more focused modules?**
  _Cohesion score 0.06736353077816493 - nodes in this community are weakly interconnected._