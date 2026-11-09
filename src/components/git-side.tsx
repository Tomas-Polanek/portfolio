import type { CSSProperties } from "react";
import { bs } from "@/components/classes";
import { layoutGraph } from "@/lib/git-graph";
import { getRecentCommits } from "@/lib/github";

const COUNT = 17;
/** Horizontal distance between lanes and the x of lane 0, in px. */
const LANE = 14;
const LANE_X = 5;
const laneX = (lane: number) => LANE_X + lane * LANE;

/**
 * Git log of this site's repository in the left page margin on wide screens (layout.css,
 * .bs-sideArt): the latest commits from the GitHub API (cached daily), oldest first, with
 * `git log --graph` lanes so merged branches show as side lanes. Each row draws its lane segments
 * in an SVG stretched to the row height (parents are above, children below). Rows light up one
 * after another as the page scrolls (CSS scroll-driven animation); without scroll timelines they
 * are simply all lit. Renders nothing if GitHub is down.
 */
export async function GitSide() {
  const commits = await getRecentCommits("portfolio", COUNT);
  if (!commits?.length) return null;
  const { rows, lanes } = layoutGraph(commits);
  const width = laneX(lanes - 1) + LANE_X;
  const n = commits.length;

  // Oldest first, as the page grows downwards.
  const ordered = commits.map((commit, i) => ({ commit, row: rows[i] })).reverse();

  return (
    <div className={`${bs.sideArt} ${bs.sideLeft}`} aria-hidden="true">
      <p className={bs.gitHead}>git log --graph --reverse</p>
      <ol className={bs.git} style={{ "--graph-w": `${width}px` } as CSSProperties}>
        {ordered.map(({ commit, row }, i) => {
          const start = (i / n) * 92;
          const x = laneX(row.lane);
          return (
            <li
              key={commit.sha}
              className={bs.commit}
              style={{ animationRange: `${start}% ${start + 8}%` } as CSSProperties}
            >
              <svg
                className={bs.commitLanes}
                width={width}
                viewBox={`0 0 ${width} 100`}
                preserveAspectRatio="none"
              >
                {row.through.map((lane) => (
                  <line key={`t${lane}`} x1={laneX(lane)} y1={0} x2={laneX(lane)} y2={100} data-lane={lane % 4} />
                ))}
                {row.toParents.map((lane) => (
                  <line key={`p${lane}`} x1={x} y1={50} x2={laneX(lane)} y2={0} data-lane={lane % 4} />
                ))}
                {row.fromChildren.map((lane) => (
                  <line key={`c${lane}`} x1={laneX(lane)} y1={100} x2={x} y2={50} data-lane={lane % 4} />
                ))}
              </svg>
              <span className={bs.commitDot} data-lane={row.lane % 4} style={{ left: x }} />
              <span className={bs.commitHash}>{commit.hash}</span>
              <span className={bs.commitMsg}>{commit.subject}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
