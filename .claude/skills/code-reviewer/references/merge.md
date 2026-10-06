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
- **Out of date:** if the branch is behind its target and the PR says it's not mergeable, propose updating it (merge the target in, or rebase only if the branch isn't shared), and wait for approval.

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

Stop. For each conflicting file, show what `main` changed and what the branch changed.
Suggest a resolution, and let the user decide. Don't resolve conflicts silently.

## After merging

- `git fetch -q origin` and confirm the merge commit is on `origin/main`.
- Supabase applies new migrations from `main` through the GitHub integration. Check the PR's "Supabase Preview" check, and tell the user to confirm "Last migration" in the dashboard.
- Leave the merged branch in place unless the user asks you to delete it.
