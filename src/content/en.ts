import type { Dictionary } from "./cs";

export const en: Dictionary = {
  meta: {
    title: "Tomáš Polánek | Portfolio",
    description:
      "Software Engineering student in Prague. Web development, Python, Linux and homelab.",
  },
  nav: {
    about: "About",
    projects: "Projects",
    homelab: "Homelab",
    education: "Education",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  theme: {
    toggle: "Toggle light / dark mode",
  },
  language: {
    switchLabel: "Přepnout do češtiny",
    switchShort: "CZ",
  },
  hero: {
    greeting: "Hi, I'm Tomáš",
    role: "Software Engineering student",
    lines: [
      "Focused on web development and open to new technologies and ideas.",
      "Studying Software Engineering in Prague and tinkering with my homelab in the evenings.",
    ],
    ctaProjects: "My projects",
    ctaContact: "Get in touch",
  },
  about: {
    title: "About me",
    paragraphs: [
      "Hi, I'm Tomáš, a Software Engineering student based in Prague. I'm building a solid foundation in programming and modern technologies, with a strong focus on practical learning and real-world problem solving.",
      "I learn best by turning ideas into small projects, which helps me gradually tackle more complex challenges – from web apps through working with data to applications built on language models.",
      "Outside of code I enjoy Linux and my own homelab, where I find out how services behave in real operation. Feel free to reach out – I'm always open to connecting, sharing ideas and learning from others.",
    ],
    skillsTitle: "Skills",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js & Express",
      "Python",
      "FastAPI",
      "SQLite",
      "HTML & CSS",
      "Tailwind CSS",
      "LLM APIs & RAG",
      "Docker",
      "Linux",
      "Git & GitHub",
    ],
  },
  projects: {
    title: "Projects",
    subtitle: "Selected projects from my GitHub. Stats update automatically.",
    code: "Code",
    live: "Live",
    updated: "Updated",
    stars: "Stars",
    forkOf: "Fork of",
    allOnGithub: "All projects on GitHub",
    items: {
      "ask-your-pdfs": {
        title: "Ask Your PDFs",
        description:
          "A RAG app that ingests a folder of PDFs and answers questions with page-level citations. Text is chunked per page, embeddings are stored in Chroma and Gemini answers only from the retrieved passages.",
      },
      "Jicin-parcel-map": {
        title: "Jičín Parcel Map",
        description:
          "A web map of 17,723 cadastral parcels from Czech open cadastre data (ČÚZK). Data is imported once into SQLite, Leaflet renders thousands of polygons to canvas for smooth panning, and every technical decision – including the choice of stack – is documented in the repo.",
      },
      "The-Fridge-Notebook": {
        title: "The Fridge Notebook",
        description:
          "Tell it what's in your fridge and Gemini suggests three recipes, including the missing ingredients. Structured JSON validated with Pydantic, a CLI plus a FastAPI web UI, SQLite history, tests and Docker.",
      },
      SleepTrack: {
        title: "SleepTrack",
        description:
          "A sleep tracking web app – entries, calendar and statistics. React frontend with Vite and Tailwind, Node.js backend with Express and AJV validation.",
      },
      "DOD-2026": {
        title: "UCT Prague Open Day Game",
        description:
          "A mobile web game for a university open day: 10 stations with QR codes, choices that shape your score, an organiser dashboard and a leaderboard for the projector. Scoring runs on the server, so it can't be cheated.",
      },
      "Jumping-game-in-python": {
        title: "Jumping Game",
        description:
          "My first step in Python – a simple jumping game in pygame-ce with movement, gravity and window-border collisions.",
      },
    },
  },
  homelab: {
    title: "Linux & Homelab",
    intro:
      "I run my own homelab on a Raspberry Pi 5 at home. I manage it purely from the terminal over SSH, with no GUI – it's my playground for Linux, networking and running containerised services.",
    specsTitle: "Setup",
    specs: [
      { icon: "pi", label: "Hardware", value: "Raspberry Pi 5 · 8 GB RAM · 4 cores" },
      { icon: "os", label: "OS", value: "Debian 13 (trixie) · ARM64" },
      { icon: "storage", label: "Storage", value: "32 GB microSD" },
      { icon: "terminal", label: "Management", value: "Headless, SSH and terminal only" },
      { icon: "docker", label: "Containers", value: "Docker" },
    ],
    servicesTitle: "What it runs",
    services: [
      {
        icon: "dns",
        name: "AdGuard Home",
        description: "A DNS server that blocks ads and trackers for every device on the home network.",
      },
      {
        icon: "media",
        name: "Jellyfin",
        description: "A media server streaming my own movies and shows to every device.",
      },
      {
        icon: "vpn",
        name: "Tailscale",
        description: "A WireGuard-based VPN – I reach the homelab securely from anywhere without opening router ports.",
      },
      {
        icon: "monitoring",
        name: "Uptime Kuma",
        description: "Monitors the availability of every service and keeps an outage history.",
      },
      {
        icon: "dashboard",
        name: "Portainer",
        description: "A web UI for managing Docker containers, images and volumes.",
      },
      {
        icon: "update",
        name: "Watchtower",
        description: "Automatically updates running containers to new image versions.",
      },
    ],
    learnedTitle: "What it taught me",
    learned: [
      "Managing Linux (Debian) purely from the command line",
      "Running and updating services in Docker containers",
      "How DNS and a home network work",
      "Secure remote access with WireGuard / Tailscale",
      "Uptime monitoring and troubleshooting outages",
    ],
  },
  education: {
    title: "Education",
    items: [
      {
        period: "since 2025",
        title: "Software Engineering",
        place: "Unicorn University, Prague",
      },
    ],
    learningTitle: "Currently learning",
    learning: [
      "Modern web development – React, Next.js and TypeScript",
      "Backend with Node.js and Python",
      "Applications built on language models (RAG, structured outputs)",
      "Linux, Docker and self-hosting",
    ],
  },
  contact: {
    title: "Let's connect",
    subtitle: "Send me an email or find me on social media.",
    email: { title: "Email" },
    linkedin: { title: "LinkedIn", sub: "Professional profile" },
    github: { title: "GitHub", sub: "Projects & code" },
    instagram: { title: "Instagram", sub: "Personal" },
  },
  footer: {
    builtWith: "Built with Next.js and Tailwind CSS",
    backToTop: "Back to top",
  },
  notFound: {
    title: "Page not found",
    heading: "This page got lost in space",
    text: "The address doesn't exist or has moved. Try again from the home page.",
    back: "Back to the home page",
  },
};
