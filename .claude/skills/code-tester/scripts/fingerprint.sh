#!/usr/bin/env bash
# Prints a fingerprint of "the changes being tested": every file that differs
# from the base branch (committed, staged, unstaged or untracked), hashed by its
# current content. The same changes give the same fingerprint whether or not
# they've been committed yet, so /code-reviewer can tell if anything changed
# after /code-tester ran.
#
# Usage: fingerprint.sh [base-branch]   (default: origin/main)
set -euo pipefail
base_ref="${1:-origin/main}"
cd "$(git rev-parse --show-toplevel)"
base="$(git merge-base "$base_ref" HEAD)"

# Not code: test output, reports, the knowledge graph, local tool artifacts.
exclude='^(\.claude/handoff/|graphify-out/|test-results/|playwright-report/|\.playwright-mcp/)'

# core.quotePath=false: print non-ASCII paths as-is, not "caf\303\251" (which
# the -f test below would treat as deleted, hiding content changes).
{
  git -c core.quotePath=false diff --name-only "$base"
  git -c core.quotePath=false ls-files --others --exclude-standard
} | sort -u | { grep -Ev "$exclude" || true; } | while IFS= read -r path; do
  if [ -f "$path" ]; then
    printf '%s %s\n' "$(git hash-object -- "$path")" "$path"
  else
    printf 'deleted %s\n' "$path"
  fi
done | sha256sum | cut -c1-16
