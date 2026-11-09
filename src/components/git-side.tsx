import type { CSSProperties } from "react";
import { bs } from "@/components/classes";
import { getRecentCommits } from "@/lib/github";

const COUNT = 17;

/**
 * Git log of this site's repository in the left page margin on wide screens (layout.css,
 * .bs-sideArt): the latest commits from the GitHub API (cached daily), oldest first. Rows light up
 * one after another as the page scrolls (CSS scroll-driven animation, each row its own slice of
 * the page); without scroll timelines they are simply all lit. Renders nothing if GitHub is down.
 */
export async function GitSide() {
  const commits = await getRecentCommits("portfolio", COUNT);
  if (!commits?.length) return null;
  const n = commits.length;

  return (
    <div className={`${bs.sideArt} ${bs.sideLeft}`} aria-hidden="true">
      <p className={bs.gitHead}>git log --reverse -{n}</p>
      <ol className={bs.git}>
        {commits.map((commit, i) => {
          const start = (i / n) * 92;
          return (
            <li
              key={commit.hash}
              className={bs.commit}
              style={{ animationRange: `${start}% ${start + 8}%` } as CSSProperties}
            >
              <span className={bs.commitDot} />
              <span className={bs.commitHash}>{commit.hash}</span>
              <span className={bs.commitMsg}>{commit.subject}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
