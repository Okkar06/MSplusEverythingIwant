# Review report template

Write `.claude/handoff/review-report.md` like this:

```markdown
# Review report

Date: <YYYY-MM-DD HH:MM UTC>
Branch: <branch> @ <short sha>   Base: origin/main @ <short sha>
Test report: Status PASS, fingerprint <value> (matches current code: yes)
Verdict: <Clean: ready to commit | N Blockers: fix and rerun /code-tester>

## Summary
| Feature | What changed | What's still needed |
|---|---|---|
| <feature> | <one line> | <none / list> |

## <Feature name>
Files: <paths>

- **Blocker**: <file:line>: <what's wrong> → <proposed fix>
- **Should fix**: <file:line>: <issue> → <suggestion>
- **Nice to have**: <file:line>: <idea>

(Write "No findings." if there are none.)

## Needs from the user
- <secrets, env vars, migrations to apply, deploy steps>

## Commit plan          <!-- only when there are no Blockers -->
1. `<type>: <subject>`: <files>
2. ...
```
