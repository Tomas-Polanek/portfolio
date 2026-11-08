import { s } from "../../bento/_components/styles";
import { bs } from "./classes";
import { pragueOutline as outline } from "./prague-outline";

/** Prague's city boundary as a thin gradient line with a pulsing pin on Praha 4. */
export function PragueMap({ pinLabel }: { pinLabel: string }) {
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
      </svg>
      <span
        className={bs.mapPin}
        style={{
          left: `${(outline.pin.x / outline.width) * 100}%`,
          top: `${(outline.pin.y / outline.height) * 100}%`,
        }}
      >
        <span className={`${s.pin} block`} />
        <span className={bs.mapPinLabel}>{pinLabel}</span>
      </span>
    </div>
  );
}
