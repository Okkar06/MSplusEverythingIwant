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

Stop, and don't change any file, branch or PR until the builder has answered. The
builder wrote the code and may be editing it right now; a fix made without them can be
wrong, or get overwritten.

1. **Find the builder.** Run `ListAgents` and confirm which session is the builder (the
   user's pipeline is builder → tester → reviewer). If it isn't clear, ask the user.
2. **Message the builder** with `SendMessage`, one message per branch:
   - which branch is being merged into which, and the PR number;
   - each conflicting file: what the target changed, what the branch changed
     (`git merge-tree --write-tree --name-only origin/<target> origin/<branch>` prints a tree id,
     then the conflicting files and a CONFLICT line for each;
     `git diff origin/<target>...origin/<branch> -- <file>` and
     `git diff origin/<branch>...origin/<target> -- <file>` show each side);
   - the resolution you suggest, and anything the merge must also change that isn't a
     textual conflict (e.g. bumping a version both sides set to the same value);
   - a request: say whether they agree, or resolve it themselves, and tell you when the
     branch is updated.
3. **Wait for the reply.** Don't poll; their answer arrives as a message. If the builder
   doesn't answer, or the session is gone, tell the user and wait. Don't resolve it yourself.
4. **Show the user** the agreed resolution: files, what each side keeps, and who makes
   the change, and **wait for their approval**. Only then does anyone edit.
5. The resolved branch is new code. It goes back to /code-tester before it's merged.

## After merging

- `git fetch -q origin` and confirm the merge commit is on `origin/main`.
- Supabase applies new migrations from `main` through the GitHub integration. Check the PR's "Supabase Preview" check, and tell the user to confirm "Last migration" in the dashboard.
- Leave the merged branch in place unless the user asks you to delete it.
