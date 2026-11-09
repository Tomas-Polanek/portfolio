/** A commit with its parents, newest first as `git log` lists them. */
export type GraphCommit = { sha: string; parents: readonly string[] };

/**
 * One row of the graph. Lanes are columns (0 = leftmost); they never shift between rows, so a
 * line leaving one row at lane i enters the next row at lane i.
 */
export type GraphRow = {
  /** Lane of this commit's dot. */
  lane: number;
  /** Lanes passing straight through without touching this commit. */
  through: number[];
  /** Lanes arriving from the child side (newer commits) into this commit's dot. */
  fromChildren: number[];
  /** Lanes leaving this commit's dot towards its parents (older commits). */
  toParents: number[];
};

/**
 * Lays out `git log --graph`-style lanes for commits listed newest first. Each lane remembers the
 * commit it expects next; a commit several lanes wait for is where branches converge, and every
 * parent after the first (a merge) opens or joins another lane. Parents outside the list simply
 * run off the edge. Also returns the number of lanes used, for the graph's width.
 */
export function layoutGraph(commits: readonly GraphCommit[]): { rows: GraphRow[]; lanes: number } {
  const waiting: (string | null)[] = [];
  let lanes = 0;

  const rows = commits.map(({ sha, parents }) => {
    const incoming = waiting.flatMap((expected, i) => (expected === sha ? [i] : []));
    const free = () => {
      const i = waiting.indexOf(null);
      return i === -1 ? waiting.length : i;
    };
    const lane = incoming[0] ?? free();
    const through = waiting.flatMap((expected, i) => (expected !== null && expected !== sha ? [i] : []));

    // Branches converging here end; this commit continues in its first lane.
    for (const i of incoming) waiting[i] = null;

    const toParents: number[] = [];
    parents.forEach((parent, index) => {
      const existing = waiting.indexOf(parent);
      if (existing !== -1) {
        toParents.push(existing);
        return;
      }
      // The first parent continues the commit's own lane; later ones open a new lane.
      const target = index === 0 && waiting[lane] == null ? lane : free();
      waiting[target] = parent;
      toParents.push(target);
    });

    lanes = Math.max(lanes, lane + 1, ...through.map((i) => i + 1), ...toParents.map((i) => i + 1));
    return { lane, through, fromChildren: incoming, toParents };
  });

  return { rows, lanes };
}
