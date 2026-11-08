/**
 * Approved GitHub repositories, in display order.
 * Stars, language, last update, fork origin and live URL come from the GitHub API;
 * titles and descriptions per language live in cs.ts / en.ts under `projects.items`.
 */
export const projects = [
  { repo: "ask-your-pdfs", tags: ["Python", "RAG", "ChromaDB", "Gemini", "Streamlit"] },
  { repo: "The-Fridge-Notebook", tags: ["Python", "FastAPI", "Pydantic", "Gemini", "SQLite", "Docker"] },
  { repo: "SleepTrack", tags: ["React", "Vite", "Tailwind CSS", "Node.js", "Express"] },
  { repo: "Jicin-parcel-map", tags: ["Leaflet", "Open data", "SQLite", "JavaScript", "PHP"] },
  { repo: "DOD-2026", tags: ["Node.js", "JavaScript", "SQLite", "QR"] },
  { repo: "Jumping-game-in-python", tags: ["Python", "pygame-ce"] },
] as const;

export type ProjectRepo = (typeof projects)[number]["repo"];
