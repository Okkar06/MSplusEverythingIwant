# Merging

This repo's history merges feature branches into `main` through GitHub pull requests,
using merge commits ("Merge pull request #N from …"). `gh` is installed, and the
Codespace's token can use it.

## Check before proposing a merge

```bash
git fetch -q origin
gh pr list --head <branch> --state open --json number,title,baseRefName,mergeable,mergeStateStatus
gh pr checks <number>                         # CI must be green
git log --oneline origin/<target>..origin/<branch>   # what would land
git merge-tree --write-tree origin/<target> origin/<branch> >/dev/null && echo "no conflicts"
```

- **No PR yet:** propose creating one: `gh pr create --base main --head <branch>`, with a title and a short body. The PR body has no Claude attribution (see feature-commit).
- **Stacked branches:** if one branch builds on another unmerged branch, merge the base first and say so in the plan.
- **Out of date:** if the branch is behind its target and the PR says it's not mergeable, run the
  `git merge-tree` check above first. If it reports conflicts, go to [Conflicts](#conflicts)
  and don't update the branch yet. If it's clean, propose updating it (merge the target in,
  or rebase only if the branch isn't shared), and wait for approval. If the update still
  stops with conflicts, run `git merge --abort` (or `git rebase --abort`) straight away, so
  the tree is back as it was, then go to [Conflicts](#conflicts).

## The plan to show the user

```
<branch> → main   PR #<n> "<title>"   strategy: merge commit
CI: passing   up to date: yes   conflicts: none
Lands: <n> commits (<subjects>)
After merge: <e.g. Supabase applies migration X; user must set secret Y>
```

Then **wait for approval** before running:

```bash
gh pr merge <number> --merge          # never --admin; never force-push
```

## Conflicts

This covers every conflict: one found before merging, one from updating an out-of-date
branch, and one from `git pull --rebase` in feature-commit. Stop, and don't change any
file, branch or PR until the builder has answered and the user has approved. The builder
wrote the code and may be editing it right now; a fix made without them can be wrong, or
get overwritten. If a merge or rebase has already stopped halfway, abort it first
(`git merge --abort` / `git rebase --abort`).

1. **Find the builder.** Run `ListAgents` and confirm which session is the builder (the
   user's pipeline is builder → tester → reviewer). If it isn't clear, ask the user. If
   `ListAgents` or `SendMessage` isn't available in this session, write the message from
   step 2 for the user and ask them to pass it to the builder.
2. **Message the builder** with `SendMessage`, one message per branch:
   - which branch is being merged into which, and the PR number;
   - each conflicting file: what the target changed, what the branch changed
     (`git merge-tree --write-tree --name-only origin/<target> origin/<branch>` prints a tree id,
     then the conflicting files and a CONFLICT line for each;
     `git diff origin/<target>...origin/<branch> -- <file>` and
     `git diff origin/<branch>...origin/<target> -- <file>` show each side);
   - the resolution you suggest, and anything the merge must also change that isn't a
     textual conflict (e.g. bumping a version both sides set to the same value);
   - a request: say whether they agree or want a different resolution, and who should make
     the change. Ask them **not to edit or push yet**: the user approves first (step 4).
3. **Wait for the reply.** Don't poll; their answer arrives as a message. End your turn
   with a line telling the user the merge is blocked on the builder, so they know to step
   in if no answer comes. If the builder doesn't answer by the next time the user writes,
   or the session is gone, tell the user and wait. Don't resolve it yourself.
4. **Show the user** the agreed resolution: files, what each side keeps, and who makes
   the change, and **wait for their approval**. Only then does anyone edit; tell the
   builder when they may go ahead.
5. **The resolved branch is new code.** It goes back to /code-tester. When the tester
   passes it, redo steps 1–4 of SKILL.md (gate, review, report, blockers) on the new
   commits, including the resolution itself, and show a fresh merge plan before merging.
   Don't reuse the earlier review or plan.

## After merging

- `git fetch -q origin` and confirm the merge commit is on `origin/main`.
- Supabase applies new migrations from `main` through the GitHub integration. Check the PR's "Supabase Preview" check, and tell the user to confirm "Last migration" in the dashboard.
- Leave the merged branch in place unless the user asks you to delete it.
