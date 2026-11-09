import { bs } from "./classes";
import { pragueOutline as outline } from "./prague-outline";

/** Prague's city boundary as a thin gradient line with the Vltava flowing through it. */
export function PragueMap() {
  return (
    <div
      className={bs.map}
      style={{ aspectRatio: `${outline.width} / ${outline.height}` }}
      aria-hidden="true"
    >
      <svg viewBox={outline.viewBox}>
        <defs>
          <linearGradient id="bs-prague-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a050ff" />
            <stop offset="1" stopColor="#50b4ff" />
          </linearGradient>
        </defs>
        <path d={outline.d} />
        <path d={outline.river} className={bs.mapRiver} />
      </svg>
    </div>
  );
}
