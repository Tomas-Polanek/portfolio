# Tomáš Polánek – Portfolio

Personal portfolio built with Next.js 16 (App Router, Cache Components), React 19, TypeScript and Tailwind CSS v4.
Czech and English versions, dark "galaxy" theme with a light variant, project cards fed by the GitHub API.

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
| Which GitHub repos are shown, their order and tech tags | `src/content/projects.ts` |
| E-mail, social links, site URL | `src/content/site.ts` |
| Colors (dark / light) | CSS variables at the top of `src/app/globals.css` |

Adding a project: add `{ repo, tags }` to `projects.ts`, then a `title` + `description` under `projects.items` in both `cs.ts` and `en.ts`.

## How it works

- **Languages** – routes are `/cs` and `/en` (`src/app/[lang]`). `src/proxy.ts` redirects `/` by the saved choice (`lang` cookie, set by the language switch), then the browser's `Accept-Language` (Slovak → Czech), defaulting to English.
- **GitHub data** – `src/lib/github.ts` fetches stars, language, last push, fork origin and homepage URL per repo, cached for a day (`cacheLife("days")`). A homepage URL set on the GitHub repo shows up as a "Live" button. Optionally set `GITHUB_TOKEN` to avoid the 60 requests/hour anonymous limit.
- **Theme** – an inline script in `src/app/[lang]/layout.tsx` applies the saved theme before first paint; the toggle stores it in `localStorage`.
