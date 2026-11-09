export type Palette = {
  id: string;
  name: { cs: string; en: string };
  note: { cs: string; en: string };
  /** Light palettes put the glass in `overLight` mode. */
  light: boolean;
  bg: string;
  fg: string;
  muted: string;
  /** Brand gradient: logo tile, buttons, map line, active nav. */
  accent: [string, string];
  /** Soft colour fields behind the glass; the glass refracts them. */
  blobs: [string, string, string];
};

export const palettes: Palette[] = [
  {
    id: "aurora",
    name: { cs: "1 · Aurora", en: "1 · Aurora" },
    note: {
      cs: "Tmavá. Severní záře: tyrkysová a zelená na noční modré. Chladná, technická, dobře ladí s homelabem.",
      en: "Dark. Northern lights: teal and green on night blue. Cool and technical, fits the homelab.",
    },
    light: false,
    bg: "#060a12",
    fg: "#e8f3f2",
    muted: "#93a9ad",
    accent: ["#2dd4bf", "#38bdf8"],
    blobs: ["#0d9488", "#0ea5e9", "#22c55e"],
  },
  {
    id: "ember",
    name: { cs: "2 · Žhavé uhlíky", en: "2 · Ember" },
    note: {
      cs: "Tmavá a teplá. Korálová, růžová a jantarová na skoro černé. Výrazná a osobní.",
      en: "Dark and warm. Coral, pink and amber on near-black. Bold and personal.",
    },
    light: false,
    bg: "#0e0a09",
    fg: "#fbefe9",
    muted: "#b8a29a",
    accent: ["#ff7a45", "#ff3d7f"],
    blobs: ["#ea580c", "#db2777", "#f59e0b"],
  },
  {
    id: "frost",
    name: { cs: "3 · Mráz (jen světlá)", en: "3 · Frost (light only)" },
    note: {
      cs: "Světlá. Pastelová modrá, levandulová a růžová pod mléčným sklem. Nejblíž Apple liquid glass.",
      en: "Light. Pastel blue, lavender and pink under milky glass. Closest to Apple's Liquid Glass.",
    },
    light: true,
    bg: "#eef2f8",
    fg: "#0f172a",
    muted: "#475569",
    accent: ["#2563eb", "#7c3aed"],
    blobs: ["#7cc0ff", "#b9a7ff", "#ffc2d4"],
  },
  {
    id: "sage",
    name: { cs: "4 · Šalvěj (jen světlá)", en: "4 · Sage (light only)" },
    note: {
      cs: "Světlá a zemitá. Šalvějová zelená, terakota a písková na teplé bílé. Klidná, „editorial“.",
      en: "Light and earthy. Sage green, terracotta and sand on warm white. Calm, editorial.",
    },
    light: true,
    bg: "#f4efe6",
    fg: "#1d2a22",
    muted: "#56655b",
    accent: ["#2f6b4f", "#c2703d"],
    blobs: ["#9cc5a1", "#e8a87c", "#f2d37f"],
  },
  {
    id: "graphite",
    name: { cs: "5 · Grafit + limetka", en: "5 · Graphite + lime" },
    note: {
      cs: "Tmavá a střídmá. Šedé sklo, jediný akcent limetkový. Minimalistická, „developer“ estetika.",
      en: "Dark and restrained. Grey glass, a single lime accent. Minimal developer look.",
    },
    light: false,
    bg: "#0a0a0b",
    fg: "#fafafa",
    muted: "#a1a1aa",
    accent: ["#c6f432", "#4ade80"],
    blobs: ["#3f3f46", "#52525b", "#84cc16"],
  },
  {
    id: "current",
    name: { cs: "Současná (pro srovnání)", en: "Current (for comparison)" },
    note: {
      cs: "Dnešní fialovo-modrý přechod ze starého webu, jen pod liquid glass.",
      en: "Today's purple-to-blue gradient from the old site, under liquid glass.",
    },
    light: false,
    bg: "#09090b",
    fg: "#f4f4f5",
    muted: "#a1a1aa",
    accent: ["#a050ff", "#50b4ff"],
    blobs: ["#7c3aed", "#2563eb", "#c026d3"],
  },
];

/** WCAG 2 contrast ratio of two #rrggbb colours. */
export function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
