import { cacheLife, cacheTag } from "next/cache";
import { site } from "@/content/site";

export type RepoInfo = {
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  /** "owner/name" of the upstream repository when this repo is a fork. */
  forkOf: string | null;
};

type GitHubRepo = {
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  parent?: { full_name: string };
};

/**
 * Repository metadata, cached for a day (`cacheLife("days")`).
 * Set GITHUB_TOKEN to lift the 60 requests/hour anonymous limit.
 * Returns null when GitHub is unreachable so the card still renders without stats.
 */
export async function getRepoInfo(repo: string, owner: string = site.githubUser): Promise<RepoInfo | null> {
  "use cache";
  cacheLife("days");
  cacheTag("github");

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!res.ok) {
      console.warn(`GitHub API ${res.status} for ${owner}/${repo}`);
      return null;
    }
    const data = (await res.json()) as GitHubRepo;
    return {
      url: data.html_url,
      homepage: data.homepage || null,
      language: data.language,
      stars: data.stargazers_count,
      pushedAt: data.pushed_at,
      forkOf: data.parent?.full_name ?? null,
    };
  } catch (error) {
    console.warn(`GitHub API unreachable for ${repo}:`, error);
    return null;
  }
}

export type CommitInfo = { hash: string; subject: string };

type GitHubCommit = { sha: string; commit: { message: string }; parents: unknown[] };

/**
 * The latest `count` non-merge commits on the default branch of `repo`, oldest first (short hash
 * + first line of the message), cached for a day like getRepoInfo. Null when GitHub is unreachable.
 */
export async function getRecentCommits(
  repo: string,
  count: number,
  owner: string = site.githubUser,
): Promise<CommitInfo[] | null> {
  "use cache";
  cacheLife("days");
  cacheTag("github");

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    // Extra headroom for the merge commits filtered out below.
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=${count + 10}`, {
      headers,
    });
    if (!res.ok) {
      console.warn(`GitHub API ${res.status} for ${owner}/${repo} commits`);
      return null;
    }
    const data = (await res.json()) as GitHubCommit[];
    return data
      .filter((c) => c.parents.length < 2)
      .slice(0, count)
      .map((c) => ({ hash: c.sha.slice(0, 7), subject: c.commit.message.split("\n", 1)[0] }))
      .reverse();
  } catch (error) {
    console.warn(`GitHub API unreachable for ${repo} commits:`, error);
    return null;
  }
}
