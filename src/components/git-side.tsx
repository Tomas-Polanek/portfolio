import type { CSSProperties } from "react";
import { bs } from "@/components/classes";
import { history } from "@/content/history";

/**
 * Git graph of this site's history in the left page margin on wide screens (layout.css,
 * .bs-sideArt). Rows light up one after another as the page scrolls (CSS scroll-driven animation,
 * each row its own slice of the page); without scroll timelines they are simply all lit.
 */
export function GitSide() {
  const n = history.length;
  return (
    <div className={`${bs.sideArt} ${bs.sideLeft}`} aria-hidden="true">
      <p className={bs.gitHead}>git log --reverse --graph</p>
      <ol className={bs.git}>
        {history.map((commit, i) => {
          const prevLane = history[i - 1]?.lane ?? 0;
          const nextLane = history[i + 1]?.lane ?? 0;
          const start = (i / n) * 92;
          return (
            <li
              key={commit.hash}
              className={bs.commit}
              data-lane={commit.lane}
              data-fork={(commit.lane === 1 && prevLane === 0) || undefined}
              data-merge={(commit.lane === 1 && nextLane === 0) || undefined}
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
