/** Glyph in the top-left corner of a project card (drawn in src/components/icons.tsx). */
export type ProjectIcon = "pdf" | "calendar" | "fridge" | "moon" | "map" | "qr" | "game";

type ProjectEntry = {
  repo: string;
  icon: ProjectIcon;
  tags: readonly string[];
  /** GitHub owner when the repo isn't under site.githubUser (e.g. a team organisation). */
  owner?: string;
  /** Team project still in development: "Work in progress" badge + "team school project" line. */
  teamInProgress?: boolean;
};

/**
 * Approved GitHub repositories, in display order.
 * Stars, language, last update, fork origin and live URL come from the GitHub API;
 * titles and descriptions per language live in cs.ts / en.ts under `projects.items`.
 */
const list = [
  { repo: "ask-your-pdfs", icon: "pdf", tags: ["Python", "RAG", "ChromaDB", "Gemini", "Streamlit"] },
  {
    repo: "Sport-slot",
    owner: "Sport-slot",
    icon: "calendar",
    teamInProgress: true,
    tags: ["Next.js", "TypeScript", "Microservices", "PostgreSQL", "Prisma", "GitHub Actions"],
  },
  {
    repo: "The-Fridge-Notebook",
    icon: "fridge",
    tags: ["Python", "FastAPI", "Pydantic", "Gemini", "SQLite", "Docker"],
  },
  { repo: "SleepTrack", icon: "moon", tags: ["React", "Vite", "Tailwind CSS", "Node.js", "Express"] },
  { repo: "Jicin-parcel-map", icon: "map", tags: ["Leaflet", "Open data", "SQLite", "JavaScript", "PHP"] },
  { repo: "DOD-2026", icon: "qr", tags: ["Node.js", "JavaScript", "SQLite", "QR"] },
  { repo: "Jumping-game-in-python", icon: "game", tags: ["Python", "pygame-ce"] },
] as const satisfies readonly ProjectEntry[];

export type ProjectRepo = (typeof list)[number]["repo"];

/** Widened so optional fields (owner, teamInProgress) can be read on every entry. */
export const projects: readonly (ProjectEntry & { repo: ProjectRepo })[] = list;

/** Screenshots in public/projects/, opened from the card's "Preview" button. */
export const projectImages: Partial<Record<ProjectRepo, string>> = {
  "Sport-slot": "/projects/Sport-slot.webp",
  "The-Fridge-Notebook": "/projects/The-Fridge-Notebook.webp",
  SleepTrack: "/projects/SleepTrack.webp",
  "Jicin-parcel-map": "/projects/Jicin-parcel-map.webp",
  "DOD-2026": "/projects/DOD-2026.webp",
};
