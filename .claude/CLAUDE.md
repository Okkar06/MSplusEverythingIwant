# graphify
- **graphify** (`.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

## Self-check before finishing
After any UI or frontend change:
1. Start the dev server.
2. Open the changed pages with the Playwright MCP browser tools.
3. Take a screenshot and check the page looks right.
4. Read the browser console and fix any errors.
5. Click through the feature you changed to confirm it works.
6. If anything is broken, fix it and check again.
Only say the task is done after this passes, and tell me what you checked.


## Commit and push feature by feature
- **feature-commit** (`.claude/skills/feature-commit/SKILL.md`): review, commit and push one feature at a time. Trigger: `/feature-commit`.
Every session follows this. As soon as a feature is finished and working, use the feature-commit skill without waiting to be asked: split the changes into one commit per feature, run type-check, lint, tests and a code review on each, commit, then push the current branch. Never commit to or push `main`, and never force-push.
