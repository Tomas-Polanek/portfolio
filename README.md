# Tomáš Polánek – Portfolio

Personal portfolio built with Next.js 16 (App Router, Cache Components), React 19, TypeScript and Tailwind CSS v4.
Czech and English versions, a bento layout with a sticky frosted-glass side panel (dark by default, light variant),
a wireframe 3D model of the homelab build and project cards fed by the GitHub API.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Editing content

| What | Where |
|---|---|
| All texts (CZ / EN) | `src/content/cs.ts`, `src/content/en.ts` – the English file must match the Czech structure (TypeScript enforces it) |
| Curated GitHub repos, their order, card icon and tech tags | `src/content/projects.ts` |
| Project screenshots (opened by the card's "Preview" button) | `public/projects/*.webp` or a `raw.githubusercontent.com/Tomas-Polanek/…` URL, listed in `projectImages` in `src/content/projects.ts` |
| E-mail, social links, site URL | `src/content/site.ts` |
| Colors (dark / light) | CSS variables at the top of `src/styles/tiles.css`; backdrop colour fields in `.bs-backdrop` (`src/styles/layout.css`) |

### Adding a project

Three ways, from least to most hands-on:

1. **Do nothing** – the daily *Project watch* (below) notices a new or changed repository and opens a pull request with the entry and CZ / EN texts for you to review.
2. **Opt the repository in** – give it the `portfolio` topic and commit a `portfolio.json` to its root. The site picks it up within a day (`src/lib/projects.ts`, cached daily) and shows it after the curated projects:

   ```json
   {
     "icon": "code",
     "tags": ["TypeScript", "Next.js"],
     "image": "docs/screenshot.png",
     "inProgress": false,
     "team": false,
     "cs": { "title": "Název", "description": "Dvě až tři věty o projektu." },
     "en": { "title": "Title", "description": "Two or three sentences about the project." }
   }
   ```

   `cs` and `en` are required; `icon` is one of `projectIcons` in `src/content/projects.ts` (default `code`), `image` a path inside the repository, `inProgress` shows the "Work in progress" badge, `team` the "team school project" line. A file that doesn't parse is skipped with a warning in the server log.
3. **By hand** – add `{ repo, icon, tags }` to `projects.ts` (plus `owner` for repos outside `Tomas-Polanek`, `teamInProgress: true` for the badge and team line), then a `title` + `description` under `projects.items` in both `cs.ts` and `en.ts`.

### Project watch

`.github/workflows/project-watch.yml` runs every morning (and on demand: Actions → *Project watch* → *Run workflow*). A gate without AI goes first (`.github/scripts/project-watch-gate.sh`): Claude only starts when one of the watched repositories (his own, minus `ignore`, plus `extraRepos` in `.github/project-watch.json`) was pushed since the last run in which Claude ran, and no proposal is waiting, so quiet days cost no tokens; *Run workflow* with **force** skips the gate. Claude Code then runs the `project-watch` skill (`.claude/skills/project-watch/SKILL.md`) over the changed repositories, and when a project is new, changed or finished it opens **one** pull request labelled `project-watch`, mentioning @Tomas-Polanek, with texts taken only from the repository. Nothing reaches the site until the pull request is merged; a closed proposal is not offered again until that repository changes.

One-time setup: run `claude setup-token` locally and save the printed token as the repository secret `CLAUDE_CODE_OAUTH_TOKEN` (`gh secret set CLAUDE_CODE_OAUTH_TOKEN -R Tomas-Polanek/portfolio`, then paste). Runs use the Claude subscription, not API billing. GitHub pauses scheduled workflows after 60 days without activity in a public repository; merging a proposal or any push keeps it running.

## How it works

- **Languages** – routes are `/cs` and `/en` (`src/app/[lang]`). `src/proxy.ts` redirects `/` by the saved choice (`lang` cookie, set by the language switch), then the browser's `Accept-Language` (Slovak → Czech), defaulting to English.
- **GitHub data** – `src/lib/github.ts` fetches stars, language, last push, fork origin and homepage URL per repo, cached for a day (`cacheLife("days")`). A homepage URL set on the GitHub repo shows up as a "Live" button. Set `GITHUB_TOKEN` to avoid the 60 requests/hour anonymous limit.
- **Theme** – an inline script in `src/app/[lang]/layout.tsx` applies the saved theme before first paint; the toggle stores it in `localStorage`.
- **Layout and styles** – `src/app/[lang]/page.tsx` composes the side panel (`src/components/panel`) and the sections (`src/components/sections`). Styles are plain CSS with prefixed class names (`bn-*` in `src/styles/tiles.css`, `bs-*` in `src/styles/layout.css`), mapped in `src/components/classes.ts`; CSS modules are not used.
- **Glass** – every tile and the side panel render `GlassLayer` (`src/components/glass-layer.tsx`): a CSS `backdrop-filter` blur over the `.bs-backdrop` colour fields. SVG refraction (liquid-glass-react) was dropped: its displacement filter is recomputed on every frame the backdrop moves under a tile, which made scrolling about 4× slower.
- **3D model** – `src/components/pi-model` draws the Raspberry Pi 5 + Active Cooler + Geekworm X1001 + Samsung 990 PRO build as a wireframe with [three.js](https://threejs.org). It is loaded lazily, renders only while visible, explodes into layers as its tile scrolls up and on hover, tap or Enter/Space, and falls back to an SVG sketch without WebGL.
- **Side art (≥ 1880 px)** – the free page margins show a large copy of the build on the right (`pi-side.tsx`: no ambient animation, it renders only on scroll, exploding towards the middle of the page while it turns) and the latest commits of this repository on the left (`src/components/git-side.tsx`, fetched from the GitHub API and cached daily), lit row by row with a CSS scroll-driven animation.
