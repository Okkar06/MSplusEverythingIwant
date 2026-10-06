---
name: code-reviewer
description: "Senior code review and release step for this repo, run after /code-tester has passed: checks the test report is current, reviews every changed file, writes .claude/handoff/review-report.md, then (only with the user's approval at each step) commits feature by feature and merges. Only runs when the user types /code-reviewer."
disable-model-invocation: true
---

# /code-reviewer

You are the senior reviewer and release manager. You review what /code-tester passed,
then commit and merge it. Commits and merges are hard to undo and other sessions share
this repo, so every step that changes git history waits for the user's explicit yes.

**Commit rules live in `.claude/skills/feature-commit/SKILL.md`.** Read it before step 5
and follow it for grouping, staging by path, what never to stage, message format,
no Claude attribution, and the pre-push attribution check. This skill doesn't repeat
those rules. It adds one difference: **never push or merge without asking**, even where
feature-commit would push on its own.

## 1. Gate

Read `.claude/handoff/test-report.md`, then run:

```bash
.claude/skills/code-tester/scripts/fingerprint.sh
```

Stop and tell the user to run **/code-tester** first if any of these is true:
- the report is missing;
- it doesn't say `Status: PASS`, or doesn't end with "Ready for /code-reviewer";
- its `Fingerprint:` differs from the one you just computed, meaning the code changed after testing.

## 2. Review the diff

Review every changed file in the report's scope, with full context, not only the diff
hunks: `git diff origin/main...HEAD`, `git diff`, and the untracked files.
`references/review-checklist.md` lists what to check: correctness, security, error
handling, performance, accessibility, leftovers, dead code, consistency, test coverage,
docs, env vars and migrations. Verify suspicions before reporting them: read the
calling code, run the query, or try the input. A wrong finding costs the user more
time than a missed nit.

## 3. Report

Write `.claude/handoff/review-report.md` using `references/report-template.md`, grouped
by feature. Tag each finding **Blocker** (wrong, insecure or broken; must fix before
commit), **Should fix** (real but not dangerous), or **Nice to have**. Show the summary
in chat.

## 4. Blockers

If there are Blockers, propose a concrete fix for each and ask before applying any.
After fixing, stop and tell the user to rerun /code-tester. Fixed code needs testing
again, and the fingerprint will have changed. Don't commit around a Blocker.

## 5. Commit plan (wait for approval)

With no Blockers, plan the commits following feature-commit: one feature per commit,
foundations first (schema before UI), files staged by path. Show the full plan: for
each commit, its files and its exact message. **Wait for the user to approve.**

## 6. Commit

Exactly as approved, one commit at a time:
- run the feature-commit checks before each commit;
- `git add <paths>`, then `git commit -F -`;
- run the attribution check from feature-commit.

If anything doesn't match the plan (a file changed, a hook rewrote something), stop and
show the user. Ask before pushing the branch (`git push -u origin <branch>`, never `--force`).

## 7. Merge (wait for approval)

`references/merge.md` explains how. For each branch, show the merge plan: source →
target, PR number (or "create PR"), strategy (merge commit, as this repo's history
does), CI status, and whether it's up to date with the target. **Wait for approval.**
- Never force-push or rewrite history on shared branches.
- Changes reach `main` only through a pull request.
- On conflicts, stop and don't change anything yet. Message the builder session first
  (SendMessage), explaining which files conflict and what each side changed, and agree on
  the resolution with them. Then show it to the user and wait for approval. The resolved
  branch goes back to /code-tester before merging. `references/merge.md` has the steps.

## 8. Summary

Report briefly: the commits made (hash and subject), branches pushed, PRs merged
(number and merge commit), what's left (Should-fix items, follow-ups), and anything the
user must do (secrets, migrations, deploys).
