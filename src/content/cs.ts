import type { ProjectRepo } from "./projects";

export type HomelabIcon =
  | "pi"
  | "os"
  | "storage"
  | "terminal"
  | "docker"
  | "dns"
  | "media"
  | "vpn"
  | "monitoring"
  | "dashboard"
  | "update";

export const cs = {
  meta: {
    title: "Tomáš Polánek | Portfolio",
    description:
      "Student softwarového inženýrství v Praze. Webový vývoj, Python, Linux a homelab.",
  },
  nav: {
    about: "O mně",
    projects: "Projekty",
    homelab: "Homelab",
    education: "Vzdělání",
    contact: "Kontakt",
    openMenu: "Otevřít menu",
    closeMenu: "Zavřít menu",
  },
  theme: {
    toggle: "Přepnout světlý / tmavý režim",
  },
  language: {
    switchLabel: "Switch to English",
    switchShort: "EN",
  },
  hero: {
    greeting: "Ahoj, jsem Tomáš",
    role: "Student softwarového inženýrství",
    lines: [
      "Zaměřuji se na webový vývoj a jsem otevřený novým technologiím a nápadům.",
      "Studuji softwarové inženýrství v Praze a po večerech ladím svůj homelab.",
    ],
    ctaProjects: "Moje projekty",
    ctaContact: "Napiš mi",
  },
  about: {
    title: "O mně",
    paragraphs: [
      "Ahoj, jsem Tomáš, student softwarového inženýrství v Praze. Stavím si pevné základy v programování a moderních technologiích a nejvíc mě baví praktické učení a řešení skutečných problémů.",
      "Nové věci se nejradši učím tak, že z nápadu udělám malý projekt. Postupně se tak dostávám ke složitějším výzvám – od webových aplikací přes práci s daty až po aplikace nad jazykovými modely.",
      "Mimo kód mě baví Linux a vlastní homelab, kde si zkouším, jak služby fungují v reálném provozu. Klidně se ozvi – rád se propojím, sdílím nápady a učím se od ostatních.",
    ],
    skillsTitle: "Dovednosti",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js & Express",
      "Python",
      "FastAPI",
      "PHP",
      "SQLite",
      "HTML & CSS",
      "Tailwind CSS",
      "LLM API & RAG",
      "Docker",
      "Linux",
      "Git & GitHub",
    ],
  },
  projects: {
    title: "Projekty",
    subtitle: "Vybrané projekty z mého GitHubu. Statistiky se aktualizují automaticky.",
    code: "Kód",
    live: "Živě",
    updated: "Aktualizováno",
    stars: "Hvězdičky",
    forkOf: "Fork z",
    allOnGithub: "Všechny projekty na GitHubu",
    items: {
      "ask-your-pdfs": {
        title: "Ask Your PDFs",
        description:
          "RAG aplikace, která načte složku PDF a odpovídá na otázky s citacemi konkrétních stran. Text dělí po stránkách, ukládá embeddingy do Chroma a odpověď generuje Gemini jen z nalezených úryvků.",
      },
      "Jicin-parcel-map": {
        title: "Mapa parcel – Jičín",
        description:
          "Webová mapa 17 723 katastrálních parcel z otevřených dat ČÚZK. Vlastní PHP backend nad SQLite, klient ve vanilla JS s Leafletem vykresleným do canvasu a zdokumentovaná technická rozhodnutí.",
      },
      "The-Fridge-Notebook": {
        title: "The Fridge Notebook",
        description:
          "Napíšeš, co máš v lednici, a Gemini navrhne tři recepty včetně chybějících surovin. Strukturovaný JSON validovaný Pydanticem, CLI i webové rozhraní na FastAPI, historie v SQLite, testy a Docker.",
      },
      SleepTrack: {
        title: "SleepTrack",
        description:
          "Webová aplikace pro sledování spánku – záznamy, kalendář a statistiky. Frontend v Reactu s Vite a Tailwindem, backend v Node.js s Express a validací přes AJV.",
      },
      "DOD-2026": {
        title: "Den otevřených dveří VŠCHT",
        description:
          "Mobilní webová hra pro den otevřených dveří: 10 stanovišť s QR kódy, rozhodování ovlivňující skóre, přehled pro organizátory a žebříček na projektor. Body počítá server, takže nejde podvádět.",
      },
      "Jumping-game-in-python": {
        title: "Jumping Game",
        description:
          "Můj první krok v Pythonu – jednoduchá skákací hra v pygame-ce s pohybem, gravitací a kolizemi s okraji okna.",
      },
    } satisfies Record<ProjectRepo, { title: string; description: string }>,
  },
  homelab: {
    title: "Linux & Homelab",
    intro:
      "Doma provozuji vlastní homelab na Raspberry Pi 5. Spravuji ho čistě z terminálu přes SSH, bez grafického rozhraní – je to moje hřiště pro Linux, sítě a provoz služeb v kontejnerech.",
    specsTitle: "Sestava",
    specs: [
      { icon: "pi" as HomelabIcon, label: "Hardware", value: "Raspberry Pi 5 · 8 GB RAM · 4 jádra" },
      { icon: "os" as HomelabIcon, label: "Systém", value: "Debian 13 (trixie) · ARM64" },
      { icon: "storage" as HomelabIcon, label: "Úložiště", value: "microSD 32 GB" },
      { icon: "terminal" as HomelabIcon, label: "Správa", value: "Headless, jen SSH a terminál" },
      { icon: "docker" as HomelabIcon, label: "Kontejnery", value: "Docker" },
    ],
    servicesTitle: "Co na něm běží",
    services: [
      {
        icon: "dns" as HomelabIcon,
        name: "AdGuard Home",
        description: "DNS server, který blokuje reklamy a trackery pro všechna zařízení v domácí síti.",
      },
      {
        icon: "media" as HomelabIcon,
        name: "Jellyfin",
        description: "Media server pro streamování vlastních filmů a seriálů na všechna zařízení.",
      },
      {
        icon: "vpn" as HomelabIcon,
        name: "Tailscale",
        description: "VPN postavená na WireGuardu – k homelabu se bezpečně připojím odkudkoliv, bez otevírání portů na routeru.",
      },
      {
        icon: "monitoring" as HomelabIcon,
        name: "Uptime Kuma",
        description: "Hlídá dostupnost všech služeb a ukazuje historii výpadků.",
      },
      {
        icon: "dashboard" as HomelabIcon,
        name: "Portainer",
        description: "Webové rozhraní pro správu Docker kontejnerů, image a volumes.",
      },
      {
        icon: "update" as HomelabIcon,
        name: "Watchtower",
        description: "Automaticky aktualizuje běžící kontejnery na nové verze image.",
      },
    ],
    learnedTitle: "Co mě to naučilo",
    learned: [
      "Správa Linuxu (Debian) čistě z příkazové řádky",
      "Provoz a aktualizace služeb v Docker kontejnerech",
      "Jak funguje DNS a domácí síť",
      "Bezpečný vzdálený přístup přes WireGuard / Tailscale",
      "Monitoring dostupnosti a řešení výpadků",
    ],
  },
  education: {
    title: "Vzdělání",
    items: [
      {
        period: "od 2025",
        title: "Softwarové inženýrství",
        place: "Unicorn University, Praha",
      },
    ],
    learningTitle: "Aktuálně se učím",
    learning: [
      "Moderní webový vývoj – React, Next.js a TypeScript",
      "Backend v Node.js a Pythonu",
      "Aplikace nad jazykovými modely (RAG, strukturované výstupy)",
      "Linux, Docker a provoz vlastních služeb",
    ],
  },
  contact: {
    title: "Pojďme se spojit",
    subtitle: "Napiš mi e-mail nebo mě najdi na sítích.",
    email: { title: "E-mail" },
    linkedin: { title: "LinkedIn", sub: "Profesní profil" },
    github: { title: "GitHub", sub: "Projekty a kód" },
    instagram: { title: "Instagram", sub: "Osobní" },
  },
  footer: {
    builtWith: "Postaveno v Next.js a Tailwind CSS",
    backToTop: "Nahoru",
  },
  notFound: {
    title: "Stránka nenalezena",
    heading: "Tahle stránka se ztratila ve vesmíru",
    text: "Adresa neexistuje nebo byla přesunuta. Zkus to z hlavní stránky.",
    back: "Zpět na hlavní stránku",
  },
};

export type Dictionary = typeof cs;
