#!/usr/bin/env bash
# Project watch gate: decides without AI whether today's run needs Claude, so days without any
# change cost no tokens. Writes `run` (true/false) and `since` (window start) to $GITHUB_OUTPUT.
#
# Window start = creation time of the last run on main in which the "Claude" step actually ran
# (skipped days don't move it, so nothing pushed in between is missed); 7 days ago if none.
set -euo pipefail

repo="${GITHUB_REPOSITORY:-Tomas-Polanek/portfolio}"
user="Tomas-Polanek"
config=".github/project-watch.json"
out="${GITHUB_OUTPUT:?GITHUB_OUTPUT must point to a file}"

skip() {
  echo "Skipping Claude: $1"
  echo "run=false" >>"$out"
  exit 0
}

open=$(gh pr list -R "$repo" --label project-watch --state open --json number --jq length)
[ "$open" -eq 0 ] || skip "a proposal is waiting for review"

since=""
for id in $(gh run list -R "$repo" --workflow project-watch.yml --branch main --status success --limit 30 \
  --json databaseId --jq '.[].databaseId'); do
  ran=$(gh run view "$id" -R "$repo" --json jobs \
    --jq '[.jobs[].steps[] | select(.name == "Claude" and .conclusion == "success")] | length')
  if [ "$ran" -gt 0 ]; then
    since=$(gh run view "$id" -R "$repo" --json createdAt --jq .createdAt)
    break
  fi
done
[ -n "$since" ] || since=$(date -u -d "7 days ago" +%Y-%m-%dT%H:%M:%SZ)
echo "Window start: $since"

# The user's own repositories, minus archived and ignored ones.
changed=$(gh api "users/$user/repos?per_page=100&type=owner" |
  jq -r --arg since "$since" --argjson ignore "$(jq -c .ignore "$config")" \
    '.[] | select((.archived | not) and .pushed_at > $since and (.name as $n | $ignore | index($n) | not)) | .name')

# Curated repositories under other owners (e.g. a team organisation).
for full in $(jq -r '.extraRepos[]' "$config"); do
  pushed=$(gh api "repos/$full" --jq .pushed_at)
  if [[ "$pushed" > "$since" ]]; then changed="$changed $full"; fi
done

changed=$(echo $changed)
[ -n "$changed" ] || skip "no repository changed since $since"

echo "Changed since $since: $changed"
{
  echo "run=true"
  echo "since=$since"
} >>"$out"
