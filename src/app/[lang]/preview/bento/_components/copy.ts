import type { Locale } from "@/lib/locales";

/** Preview-only labels that the shared dictionary does not contain. */
const copy = {
  cs: {
    badge: "Náhled stylu",
    styleName: "Bento grid",
    basedIn: "Žiju v",
    studying: "Studuji",
    homelabTeaser: "Homelab",
    servicesCount: (n: number) => `${n} služeb v Dockeru`,
    explore: "Prozkoumat",
    lastPush: "Poslední push",
    repos: "Vybrané repozitáře",
    totalStars: "hvězdiček",
    sayHi: "Napiš mi",
    socials: "Sítě",
    controls: "Nastavení",
    projectsCount: (n: number) => `${n} projektů`,
    openShot: "Zvětšit náhled",
    closeShot: "Zavřít",
    wip: "Work in progress",
    teamProject: "Týmový školní projekt",
  },
  en: {
    badge: "Style preview",
    styleName: "Bento grid",
    basedIn: "Based in",
    studying: "Studying",
    homelabTeaser: "Homelab",
    servicesCount: (n: number) => `${n} services in Docker`,
    explore: "Explore",
    lastPush: "Last push",
    repos: "Featured repositories",
    totalStars: "stars",
    sayHi: "Say hi",
    socials: "Socials",
    controls: "Settings",
    projectsCount: (n: number) => `${n} projects`,
    openShot: "Enlarge screenshot",
    closeShot: "Close",
    wip: "Work in progress",
    teamProject: "Team school project",
  },
} satisfies Record<Locale, unknown>;

export function getCopy(locale: Locale) {
  return copy[locale];
}
