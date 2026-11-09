---
name: project-watch
description: Daily check of Tomáš Polánek's GitHub repositories. Proposes portfolio updates (new or changed projects) as one pull request for him to review; never publishes anything itself.
allowed-tools: Bash(gh *), Bash(git *), Bash(npm ci), Bash(npm run *), Bash(date *), Read, Edit, Write, Glob, Grep
---

# Project watch

You keep the **Projects** section of https://tomaspolanek.dev in sync with Tomáš's GitHub work.
You run unattended in GitHub Actions; `gh` is authenticated for this repository. Your only output
is **one pull request** (or nothing). Tomáš reviews and merges it; merging deploys the site.

## Hard rules

- **Never invent facts.** Every sentence about a project must come from that repository: README,
  code, package/dependency files, commit messages. If something is unclear, leave it out and ask
  in the PR body instead.
- Touch only `src/content/projects.ts`, `src/content/cs.ts`, `src/content/en.ts` and
  `.github/project-watch.json`. Nothing else.
- No marketing language. Match the tone and length of the existing `projects.items` entries in
  `src/content/cs.ts` (Czech, 2–3 concrete sentences: what it does, how, his role if stated).
  `en.ts` gets a faithful English translation with the same structure.
- `npm ci`, `npm run lint` and `npm run build` must pass before you open the PR.
- Run shell commands one at a time with literal values: no `for` loops, no `$variables` (the
  permission check rejects commands it can't verify up front). One `gh api` call per repo is fine.

## Steps

1. **Stop early if a proposal is waiting:**
   `gh pr list --label project-watch --state open --json number` — if it returns any PR, print
   "Open proposal exists, skipping" and stop.
2. **Window:** changes after **$ARGUMENTS** count (ISO time from the workflow's gate: its last
   run in which you ran). If that is empty, use 7 days ago:
   `date -u -d "7 days ago" +%Y-%m-%dT%H:%M:%SZ`. Read `.github/project-watch.json` → `ignore`
   (repo names) and `extraRepos` (`owner/repo` outside Tomas-Polanek).
3. **Collect repositories:**
   - `gh api "users/Tomas-Polanek/repos?per_page=100&type=owner"` (name, fork, archived, topics,
     pushed_at, description, default_branch, html_url).
   - Plus every entry of `extraRepos`: `gh api repos/<owner>/<repo>`.
   - Skip: names in `ignore`, archived repos, and repos with the `portfolio` topic (the site loads
     those from their own `portfolio.json`; if such a repo has no valid `portfolio.json`, only
     mention it in the PR body).
   - Skip repos proposed in a **closed, unmerged** `project-watch` PR
     (`gh pr list --label project-watch --state closed --json title,body,mergedAt,closedAt`)
     unless they were pushed after that PR was closed.
4. **Only look at repos pushed after the window start.** For each:
   - **Not on the site yet** (not in `src/content/projects.ts`): it is a candidate only if it has a
     README or meaningful code (not an empty/template repo, not a fork without his own commits:
     check `gh api repos/<o>/<r>/commits?author=Tomas-Polanek&per_page=5`). Read the README
     (`gh api repos/<o>/<r>/readme -H "Accept: application/vnd.github.raw"`) and the dependency
     files to learn the stack. Add an entry to the `list` in `src/content/projects.ts` (`repo`, `icon` from
     `projectIcons`, 2–6 `tags` that the code really uses; `owner` only if not Tomas-Polanek, and
     then also add `<owner>/<repo>` to `extraRepos` so the gate watches it) and a
     `projects.items[<repo>]` entry `{ title, description }` in both `cs.ts` and `en.ts`.
     New projects go at the top of the list (most recent work first).
   - **Already on the site:** read the commits since the window start
     (`gh api "repos/<o>/<r>/commits?since=<window start>"`) and the current README. Change the texts or
     tags **only** if they became inaccurate or a notable feature shipped. If a project marked
     `teamInProgress` looks finished (release, "done"/"finished" in README, deployed), propose
     removing the flag and say why in the PR body.
   - **Screenshot:** if the repo has a screenshot (e.g. `docs/screenshot.png`, find it with
     `gh api "repos/<o>/<r>/git/trees/<branch>?recursive=1"`), you may set
     `projectImages[<repo>]` to its `https://raw.githubusercontent.com/<o>/<r>/<branch>/<path>`
     URL (owner must be Tomas-Polanek; next.config.ts only allows his repos).
5. **Nothing to propose?** Print a one-line summary per checked repo and stop. Do not commit.
6. **Otherwise:**
   - Run `npm ci`, `npm run lint` and `npm run build` (each as its own command, not chained) and
     fix your own mistakes until they pass.
   - `git switch -c project-watch/<YYYY-MM-DD>`, commit with a message like
     `Project watch: add <repo>, update <repo>`, `git push -u origin HEAD`.
   - If `gh label list --search project-watch` shows no such label, create it:
     `gh label create project-watch --color 7c3aed --description "Návrh z denní kontroly projektů"`.
   - `gh pr create --label project-watch --reviewer Tomas-Polanek --title "Portfolio: <shrnutí>" --body-file <file>`

## PR body (Czech)

```
@Tomas-Polanek, denní kontrola projektů našla změny:

### <název projektu> – nový / upravený / dokončený
- Co se změní na webu: …
- Zdroje: <odkazy na README / commity>
- Zkontroluj: <věty, u kterých si nejsi jistý; anglický překlad>

---
Nechceš některou změnu? Uprav ji přímo v tomto PR, nebo PR zavři – zavřené návrhy se znovu
nenabízí, dokud v daném repu nepřibude nová změna.
```
