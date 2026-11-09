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
| Which GitHub repos are shown, their order, card icon and tech tags | `src/content/projects.ts` |
| Project screenshots (opened by the card's "Preview" button) | `public/projects/*.webp`, listed in `projectImages` in `src/content/projects.ts` |
| E-mail, social links, site URL | `src/content/site.ts` |
| Colors (dark / light) | CSS variables at the top of `src/styles/tiles.css`; backdrop colour fields in `.bs-backdrop` (`src/styles/layout.css`) |

Adding a project: add `{ repo, tags }` to `projects.ts` (plus `owner` for repos outside `Tomas-Polanek`, `teamInProgress: true` for the "Work in progress" badge), then a `title` + `description` under `projects.items` in both `cs.ts` and `en.ts`.

## How it works

- **Languages** – routes are `/cs` and `/en` (`src/app/[lang]`). `src/proxy.ts` redirects `/` by the saved choice (`lang` cookie, set by the language switch), then the browser's `Accept-Language` (Slovak → Czech), defaulting to English.
- **GitHub data** – `src/lib/github.ts` fetches stars, language, last push, fork origin and homepage URL per repo, cached for a day (`cacheLife("days")`). A homepage URL set on the GitHub repo shows up as a "Live" button. Set `GITHUB_TOKEN` to avoid the 60 requests/hour anonymous limit.
- **Theme** – an inline script in `src/app/[lang]/layout.tsx` applies the saved theme before first paint; the toggle stores it in `localStorage`.
- **Layout and styles** – `src/app/[lang]/page.tsx` composes the side panel (`src/components/panel`) and the sections (`src/components/sections`). Styles are plain CSS with prefixed class names (`bn-*` in `src/styles/tiles.css`, `bs-*` in `src/styles/layout.css`), mapped in `src/components/classes.ts`; CSS modules are not used.
- **Glass** – every tile and the side panel render `GlassLayer` (`src/components/glass-layer.tsx`): a CSS `backdrop-filter` blur over the `.bs-backdrop` colour fields. SVG refraction (liquid-glass-react) was dropped: its displacement filter is recomputed on every frame the backdrop moves under a tile, which made scrolling about 4× slower.
- **3D model** – `src/components/pi-model` draws the Raspberry Pi 5 + Active Cooler + Geekworm X1001 + Samsung 990 PRO build as a wireframe with [three.js](https://threejs.org). It is loaded lazily, renders only while visible, explodes into layers as its tile scrolls up and on hover, tap or Enter/Space, and falls back to an SVG sketch without WebGL.
- **Side art (≥ 1880 px)** – the free page margins show a large copy of the build on the right (`pi-side.tsx`: no ambient animation, it renders only on scroll, exploding towards the middle of the page while it turns) and a git graph of this repository on the left (`src/components/git-side.tsx`, commits listed in `src/content/history.ts`), lit row by row with a CSS scroll-driven animation.
