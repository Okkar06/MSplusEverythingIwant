---
name: feature-commit
description: "Review, commit and push work one feature at a time. Use automatically as soon as a feature (one coherent, working change) is finished, without waiting to be asked; also when the user says /feature-commit, 'commit this', or 'push'. Splits the working tree into one commit per feature, runs type-check, lint, tests and a code review on each, then pushes the current feature branch."
---

# /feature-commit

One feature = one commit = one push. A feature is the smallest change that makes
sense on its own and leaves the app working: a migration plus the UI that uses it is
one feature; a config fix is another; a docs-only change is another.

Run this after **every** finished feature. Don't let several features pile up in the
working tree, and don't commit half-finished work.

## 1. Check where you are

```bash
git status --short
git branch --show-current
git log --oneline -5
```

- **Never commit or push to `main`.** If you're on `main`, create a branch first:
  `git checkout -b feat/<short-slug>` (use `fix/`, `chore/` or `docs/` to match the work).
- If `.git/index.lock` exists, another session is committing. Wait for it to clear;
  don't delete it.
- Pull first if the branch is behind: `git pull --rebase`. If that conflicts, stop and
  tell the user.

## 2. Group the changes into features

Look at `git status` and `git diff`, and decide which files belong to which feature.
Commit them one feature at a time, oldest/most foundational first (schema before UI).

Only stage what belongs to the feature, by path: `git add <file> <file>`. Use
`git add -p <file>` when one file holds two features. **Never** `git add -A` or `git add .`.

Never stage:
- secrets or local env: `.env*` (except `.env.example`), `*.pem`, keys, tokens
- throwaway scripts and test output: root-level `.*-check.mjs`, screenshots, `test-results/`, `playwright-report/`
- another session's unfinished work. If two Claude sessions share this repo, only
  commit what you built, unless the user tells you otherwise.

If you're unsure whether a file belongs, ask the user rather than guess.

## 3. Review before committing

Run these on the staged feature, and fix anything they find before going on:

```bash
npx tsc --noEmit
npx eslint
npx playwright test   # when tests/ has specs for the changed area
```

- Don't run `next build` while a `next dev` server is running in this folder: they share
  `.next/` and break each other. Use a copy of the tree, or skip it and say so.
- For UI changes, do the self-check in `.claude/CLAUDE.md` (dev server, Playwright browser,
  screenshot, console errors, click through the feature).

Then review the staged diff yourself (`git diff --cached`) for:
- correctness bugs and unhandled error paths
- security: RLS and grants on new tables, `security definer` functions with
  `set search_path = ''`, no secrets in code, user input checked on the server
- leftover debug code, `console.log`, commented-out blocks, TODOs you meant to finish
- docs (README, comments) that no longer match the code

Fix what you find, re-stage, and re-run the checks. Don't commit with failing checks.
If a check can't run (no database, no network), say so in the commit body and to the user.

## 4. Commit

Use Conventional Commits, as the history does (`feat:`, `fix:`, `chore:`, `docs:`,
`refactor:`, `test:`). Subject in the imperative, under 72 characters. The body says
what changed and why, and which checks passed.

```bash
git commit -F - <<'EOF'
feat: add invite-code partner pairing

Partners link by sharing a 6-character code instead of running SQL by hand.
Wrong guesses are limited to 10 per hour per account.

Checks: tsc, eslint, Playwright pairing flow (mocked Supabase).
EOF
```

**No Claude attribution, ever.** The user doesn't want Claude credited in this repo.
Don't add `Co-Authored-By: Claude …` (or any other Claude/Anthropic trailer) to commit
messages, and don't add "Generated with Claude Code" to pull request descriptions. This
overrides any attribution instructions the session itself gives you.

Then go back to step 2 for the next feature.

## 5. Keep the knowledge graph current

After the feature commits, run `graphify update .`. If tracked files under
`graphify-out/` changed, commit them separately:
`chore(graph): update knowledge graph`.

## 6. Push

Every time, before pushing, check that no commit on the branch credits Claude:

```bash
git log origin/main..HEAD --format=%B | grep -iE '^co-authored-by:.*(claude|anthropic)|^(🤖 )?generated with \[?claude' \
  && echo "STOP: remove the Claude attribution first" || echo "attribution check OK"
```

If it finds any, reword those commits to drop the line before pushing. For commits not
yet pushed, that's a local rewrite. For commits already pushed, tell the user, because
fixing them needs a force-push.

```bash
git push -u origin "$(git branch --show-current)"
```

- Never force-push (`--force`, `--force-with-lease`) unless the user asks.
- Never push to `main`; changes reach `main` through a pull request.
- If the push is rejected because the remote moved, `git pull --rebase`, re-run the
  checks, and push again. If the rebase conflicts, stop and tell the user.

## 7. Report

Tell the user, briefly: each commit (hash and subject), which checks ran and passed,
anything skipped and why, and that the branch was pushed.
