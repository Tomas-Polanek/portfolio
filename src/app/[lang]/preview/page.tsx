import { getLocale } from "@/lib/i18n";

// Temporary index for comparing style previews; removed once a style is chosen.
const styles = [
  {
    slug: "minimal",
    name: { cs: "Minimal dvousloupcový", en: "Minimal two-column" },
    note: { cs: "Pevný levý sloupec s menu, obsah vpravo. Střídmé barvy.", en: "Sticky left column with nav, content on the right. Restrained colours." },
  },
  {
    slug: "bento",
    name: { cs: "Bento grid", en: "Bento grid" },
    note: { cs: "Dlaždice různých velikostí, velké náhledy projektů.", en: "Tiles of varied sizes, large project screenshots." },
  },
  {
    slug: "bento-sidebar",
    name: { cs: "Bento + panel", en: "Bento + panel" },
    note: { cs: "Bento s pevným levým panelem (jméno, režim, jazyk, menu).", en: "Bento with a sticky left panel (name, theme, language, nav)." },
  },
  {
    slug: "editorial",
    name: { cs: "Editorial", en: "Editorial" },
    note: { cs: "Velká typografie, hodně prostoru, světlý základ.", en: "Large typography, lots of whitespace, light-first." },
  },
] as const;

export default async function PreviewIndex() {
  const locale = await getLocale();
  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-2rem)] max-w-[720px] flex-col justify-center gap-6 py-16">
      <h1 className="text-3xl font-bold">{locale === "cs" ? "Náhledy stylů" : "Style previews"}</h1>
      <ul className="grid gap-4">
        <li>
          <a href={`/${locale}`} className="glass block rounded-2xl p-5 transition hover:-translate-y-0.5">
            <span className="font-semibold">{locale === "cs" ? "Současný styl (galaxie)" : "Current style (galaxy)"}</span>
          </a>
        </li>
        {styles.map((s) => (
          <li key={s.slug}>
            <a href={`/${locale}/preview/${s.slug}`} className="glass block rounded-2xl p-5 transition hover:-translate-y-0.5">
              <span className="font-semibold">{s.name[locale]}</span>
              <span className="mt-1 block text-sm text-muted">{s.note[locale]}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
