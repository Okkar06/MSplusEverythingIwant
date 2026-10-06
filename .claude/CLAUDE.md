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

## Builder: answer the other sessions
The user runs three sessions here: builder → tester (/code-tester) → reviewer (/code-reviewer).
If you're the builder (you build the features; ask the user if you aren't sure), then whenever
the tester or reviewer messages you:
- Answer every time, with `SendMessage` to the session that wrote, before going back to your
  own work. A short reply is fine. Never leave a message unanswered; they wait for you.
- If you can't answer fully yet, say so and say what you're waiting on. Send the full answer
  when you have it.
- Questions about your code: answer what was asked (intent, which branch or commit, what's
  finished and what isn't).
- **Merge conflicts** (the reviewer follows `.claude/skills/code-reviewer/references/merge.md`):
  for each file, say whether you agree with their resolution or give yours, and say who should
  make the change. **Don't edit, commit or push** the conflicting branch until the reviewer says
  the user has approved. Tell them if you're still editing those files, so they wait.
- Once you've made an agreed change, message the sender with the branch and commit, so it can
  go back to /code-tester.
- If your session is about to end or switch to other work, tell the reviewer and tester first.
