import { cacheLife, cacheTag } from "next/cache";
import type { Dictionary } from "@/content/cs";
import { type ProjectIcon, projectIcons, projectImages, projects as listed } from "@/content/projects";
import { site } from "@/content/site";
import type { Locale } from "@/lib/locales";

/** A project card, resolved for one language. */
export type Project = {
  repo: string;
  owner: string;
  icon: ProjectIcon;
  tags: readonly string[];
  title: string;
  description: string;
  /** Screenshot (local path or raw.githubusercontent.com URL) opened by the "Preview" button. */
  image: string | undefined;
  /** "Work in progress" badge. */
  inProgress: boolean;
  /** "Team school project" line. */
  team: boolean;
};

type Text = { title: string; description: string };

/** A repository opted in with the `portfolio` topic and a valid portfolio.json (README documents it). */
type TaggedProject = Omit<Project, "title" | "description"> & { text: Record<Locale, Text>; pushedAt: string };

const TOPIC = "portfolio";
const MAX_TAGS = 8;

const isText = (value: unknown): value is Text =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Text).title === "string" &&
  typeof (value as Text).description === "string" &&
  (value as Text).title.trim() !== "" &&
  (value as Text).description.trim() !== "";

/** A relative path inside the repository: no scheme, no leading slash, no "..". */
const isRepoPath = (value: unknown): value is string =>
  typeof value === "string" && /^[\w./-]+$/.test(value) && !value.startsWith("/") && !value.includes("..");

function parsePortfolioJson(
  raw: unknown,
  repo: { name: string; owner: string; branch: string; pushedAt: string },
): TaggedProject | null {
  if (typeof raw !== "object" || raw === null) return null;
  const json = raw as Record<string, unknown>;
  if (!isText(json.cs) || !isText(json.en)) return null;
  const tags = Array.isArray(json.tags) ? json.tags.filter((tag): tag is string => typeof tag === "string") : [];
  return {
    repo: repo.name,
    owner: repo.owner,
    icon: projectIcons.includes(json.icon as ProjectIcon) ? (json.icon as ProjectIcon) : "code",
    tags: tags.slice(0, MAX_TAGS),
    image: isRepoPath(json.image)
      ? `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/${json.image}`
      : undefined,
    inProgress: json.inProgress === true,
    team: json.team === true,
    text: { cs: json.cs, en: json.en },
    pushedAt: repo.pushedAt,
  };
}

/**
 * Repositories of site.githubUser with the `portfolio` topic whose portfolio.json parses, newest push
 * first. Cached for a day (like the repo stats); an invalid file is skipped with a warning, an
 * unreachable GitHub yields an empty list.
 */
export async function getTaggedProjects(): Promise<TaggedProject[]> {
  "use cache";
  cacheLife("days");
  cacheTag("github");

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(`https://api.github.com/users/${site.githubUser}/repos?per_page=100&type=owner`, {
      headers,
    });
    if (!res.ok) {
      console.warn(`GitHub API ${res.status} listing repositories`);
      return [];
    }
    const repos = (await res.json()) as {
      name: string;
      owner: { login: string };
      default_branch: string;
      pushed_at: string;
      archived: boolean;
      topics?: string[];
    }[];
    const tagged = repos.filter((r) => !r.archived && r.topics?.includes(TOPIC));

    const entries = await Promise.all(
      tagged.map(async (r) => {
        const repo = { name: r.name, owner: r.owner.login, branch: r.default_branch, pushedAt: r.pushed_at };
        try {
          // raw.githubusercontent.com is not rate-limited like the API.
          const file = await fetch(
            `https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${repo.branch}/portfolio.json`,
          );
          if (!file.ok) {
            console.warn(`${repo.name}: has the "${TOPIC}" topic but no portfolio.json (${file.status})`);
            return null;
          }
          const entry = parsePortfolioJson(await file.json(), repo);
          if (!entry) console.warn(`${repo.name}: portfolio.json needs cs and en with a title and description`);
          return entry;
        } catch (error) {
          console.warn(`${repo.name}: portfolio.json could not be read:`, error);
          return null;
        }
      }),
    );
    return entries
      .filter((entry): entry is TaggedProject => entry !== null)
      .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));
  } catch (error) {
    console.warn("GitHub API unreachable listing repositories:", error);
    return [];
  }
}

/**
 * Every project card in display order: the curated list (src/content/projects.ts, texts in the
 * dictionaries) first, then tagged repositories not already in it.
 */
export async function getProjects(locale: Locale, t: Dictionary["projects"]): Promise<Project[]> {
  const curated: Project[] = listed.map((p) => ({
    repo: p.repo,
    owner: p.owner ?? site.githubUser,
    icon: p.icon,
    tags: p.tags,
    ...t.items[p.repo],
    image: projectImages[p.repo],
    inProgress: p.teamInProgress === true,
    team: p.teamInProgress === true,
  }));
  const known = new Set(curated.map((p) => `${p.owner}/${p.repo}`.toLowerCase()));
  const tagged: Project[] = (await getTaggedProjects())
    .filter((p) => !known.has(`${p.owner}/${p.repo}`.toLowerCase()))
    .map((p) => ({
      repo: p.repo,
      owner: p.owner,
      icon: p.icon,
      tags: p.tags,
      ...p.text[locale],
      image: p.image,
      inProgress: p.inProgress,
      team: p.team,
    }));
  return [...curated, ...tagged];
}
