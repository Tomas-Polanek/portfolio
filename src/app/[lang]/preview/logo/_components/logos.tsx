/**
 * Logo / favicon concepts. Pure paths on a 32-unit grid (no fonts), so they stay crisp at 16 px
 * and render the same everywhere.
 */

export type LogoVariant = "ligature" | "ligatureSolid" | "prompt" | "cube";

const TILE = "M9 1h14a8 8 0 0 1 8 8v14a8 8 0 0 1-8 8H9a8 8 0 0 1-8-8V9a8 8 0 0 1 8-8Z";

/** T and P sharing one stem: left half of the T's bar, the stem, the P's bowl. */
const LIGATURE = "M8 8.5h7M15 8.5v15M15 8.5h4a4.5 4.5 0 0 1 0 9h-4";
/** Shell prompt: chevron + cursor (the homelab terminal). */
const PROMPT = "M8.5 10l6 6-6 6M17.5 22h6.5";
/** Isometric wireframe box, same sketch language as the Pi model. */
const CUBE = "M16 6l8.66 5v10L16 26l-8.66-5V11ZM7.34 11L16 16l8.66-5M16 16v10";

export const variants: { id: LogoVariant; name: { cs: string; en: string }; note: { cs: string; en: string } }[] = [
  {
    id: "ligature",
    name: { cs: "A · Ligatura TP (obrys)", en: "A · TP ligature (outline)" },
    note: {
      cs: "T a P sdílí jednu nožičku. Tmavá dlaždice, přechodová linka jako 3D model a mapa.",
      en: "T and P share one stem. Dark tile, gradient line like the 3D model and the map.",
    },
  },
  {
    id: "ligatureSolid",
    name: { cs: "B · Ligatura TP (plná)", en: "B · TP ligature (solid)" },
    note: {
      cs: "Stejná značka na přechodové dlaždici. Výraznější, působí jako ikona aplikace.",
      en: "Same mark on a gradient tile. Bolder, reads like an app icon.",
    },
  },
  {
    id: "prompt",
    name: { cs: "C · Terminál", en: "C · Terminal" },
    note: {
      cs: "Prompt ❯_ odkazuje na homelab a práci v terminálu. Neobsahuje iniciály.",
      en: "A ❯_ prompt nods to the homelab and the terminal. No initials.",
    },
  },
  {
    id: "cube",
    name: { cs: "D · Drátěná kostka", en: "D · Wireframe cube" },
    note: {
      cs: "Izometrický drátěný kvádr ve stylu 3D modelu Pi. Abstraktní, bez písmen.",
      en: "Isometric wireframe box in the Pi model's style. Abstract, no letters.",
    },
  },
];

const PATHS: Record<LogoVariant, string> = {
  ligature: LIGATURE,
  ligatureSolid: LIGATURE,
  prompt: PROMPT,
  cube: CUBE,
};

export function Logo({
  variant,
  size,
  gradId,
  light = false,
}: {
  variant: LogoVariant;
  size: number;
  /** Unique per instance: gradients are referenced by document-wide id. */
  gradId: string;
  light?: boolean;
}) {
  const solid = variant === "ligatureSolid";
  const a = light ? "#8434f0" : "#a050ff";
  const b = light ? "#1f86d6" : "#50b4ff";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="block flex-none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <path
        d={TILE}
        fill={solid ? `url(#${gradId})` : light ? "#ffffff" : "#0d0d12"}
        stroke={solid ? "none" : light ? "#d9d9e0" : "#26262e"}
        strokeWidth="1"
      />
      <path
        d={PATHS[variant]}
        fill="none"
        stroke={solid ? "#ffffff" : `url(#${gradId})`}
        strokeWidth={variant === "cube" ? 2.1 : 2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
