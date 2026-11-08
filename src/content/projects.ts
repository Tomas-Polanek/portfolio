type ProjectEntry = {
  repo: string;
  tags: readonly string[];
  /** GitHub owner when the repo isn't under site.githubUser (e.g. a team organisation). */
  owner?: string;
  /** Team project still in development: the card shows a "team project · in progress" badge. */
  teamInProgress?: boolean;
};

/**
 * Approved GitHub repositories, in display order.
 * Stars, language, last update, fork origin and live URL come from the GitHub API;
 * titles and descriptions per language live in cs.ts / en.ts under `projects.items`.
 */
const list = [
  { repo: "ask-your-pdfs", tags: ["Python", "RAG", "ChromaDB", "Gemini", "Streamlit"] },
  {
    repo: "Sport-slot",
    owner: "Sport-slot",
    teamInProgress: true,
    tags: ["Next.js", "TypeScript", "Microservices", "PostgreSQL", "Prisma", "GitHub Actions"],
  },
  { repo: "The-Fridge-Notebook", tags: ["Python", "FastAPI", "Pydantic", "Gemini", "SQLite", "Docker"] },
  { repo: "SleepTrack", tags: ["React", "Vite", "Tailwind CSS", "Node.js", "Express"] },
  { repo: "Jicin-parcel-map", tags: ["Leaflet", "Open data", "SQLite", "JavaScript", "PHP"] },
  { repo: "DOD-2026", tags: ["Node.js", "JavaScript", "SQLite", "QR"] },
  { repo: "Jumping-game-in-python", tags: ["Python", "pygame-ce"] },
] as const satisfies readonly ProjectEntry[];

export type ProjectRepo = (typeof list)[number]["repo"];

/** Widened so optional fields (owner, teamInProgress) can be read on every entry. */
export const projects: readonly (ProjectEntry & { repo: ProjectRepo })[] = list;

/** Screenshots in public/projects/, shown at the top of the card (cropped to 16:10 from the top). */
export const projectImages: Partial<Record<ProjectRepo, string>> = {
  "Sport-slot": "/projects/Sport-slot.webp",
  "The-Fridge-Notebook": "/projects/The-Fridge-Notebook.webp",
  SleepTrack: "/projects/SleepTrack.webp",
  "Jicin-parcel-map": "/projects/Jicin-parcel-map.webp",
  "DOD-2026": "/projects/DOD-2026.webp",
};
