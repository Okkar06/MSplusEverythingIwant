# Test report template

Write `.claude/handoff/test-report.md` with exactly this structure. /code-reviewer
parses the `Status:` and `Fingerprint:` lines, so keep them exactly as shown.

```markdown
# Test report

Status: PASS            <!-- PASS or FAIL; PASS only if every check passed -->
Fingerprint: <output of .claude/skills/code-tester/scripts/fingerprint.sh>
Date: <YYYY-MM-DD HH:MM UTC>
Branch: <branch> @ <short HEAD sha> (base: origin/main @ <short sha>)
Scope: <all changes | the feature named in the argument>

## Features tested
- <feature>: <files>

## Checks
| Check | Result | Notes |
|---|---|---|
| Install | ✅/❌/– | |
| Typecheck (tsc) | | |
| Lint (eslint) | | |
| Build (next build) | | skipped only if `next dev` runs in this folder; say so |
| Database tests (test:db) | | n/n |
| Unit tests (test:unit) | | n/n, or "no such script" |
| E2E (playwright) | | n passed, n skipped (each skip: why) |
| Live check (MCP, headless) | | pages, widths, console/network findings |

## Feature checklists
### <feature>
| # | It should… | Result | Evidence |
|---|---|---|---|

## Tests added or changed
- <file>: <what it covers>; fails without the change: yes/no

## Bugs found
- <bug>: fixed in <file> / left for the builder because <reason>

## Screenshots
- .claude/handoff/screenshots/<name>.png: <what it shows>

## Known issues and gaps
- <anything not verified, and why>

Ready for /code-reviewer        <!-- or: NOT ready: <reasons> -->
```
