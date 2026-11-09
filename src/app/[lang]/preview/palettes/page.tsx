import type { Metadata } from "next";
import { site } from "@/content/site";
import { getDictionary, getLocale } from "@/lib/i18n";
import { getCopy } from "../bento/_components/copy";
import { GlassMockup, type MockupCopy } from "./_components/glass-mockup";
import { contrast, palettes } from "./_components/palettes";
import "./palettes.css";

export const metadata: Metadata = { title: "Palettes · Liquid glass", robots: { index: false } };

// Temporary page for choosing the colour palette; removed once one is chosen.
export default async function PalettesPreview() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const c = getCopy(locale);
  const cs = locale === "cs";

  const copy: MockupCopy = {
    name: site.name,
    role: t.hero.role,
    line: t.hero.lines[0],
    nav: [t.nav.about, t.nav.projects, t.nav.homelab, t.nav.education, t.nav.contact],
    cta: t.hero.ctaContact,
    aboutTitle: t.about.title,
    about: t.about.paragraphs[0],
    skills: t.about.skills.slice(0, 6),
    basedIn: c.basedIn,
    city: cs ? "Praha" : "Prague",
    project: {
      title: t.projects.items["Sport-slot"].title,
      description: t.projects.items["Sport-slot"].description,
      image: "/projects/Sport-slot.webp",
      wip: c.wip,
    },
    homelab: {
      title: "Homelab",
      prompt: site.homelabPrompt,
      services: t.homelab.services.slice(0, 5).map((s) => s.name),
    },
  };

  return (
    <main className="mx-auto w-[calc(100%-2rem)] max-w-[1080px] py-16">
      <h1 className="text-3xl font-bold">{cs ? "Barevné palety s liquid glass" : "Colour palettes with liquid glass"}</h1>
      <p className="mt-3 max-w-[70ch] text-muted">
        {cs
          ? "Mockupy rozložení Bento + panel. Sklo je skutečný efekt z liquid-glass-react: láme barevné plochy a mřížku pod sebou a reaguje na myš. Lom (displacement) vidí jen Chrome/Edge, Safari a Firefox ukážou jen rozmazané sklo."
          : "Mock-ups of the Bento + panel layout. The glass is the real liquid-glass-react effect: it refracts the colour fields and grid beneath and reacts to the mouse. Refraction shows in Chrome/Edge only; Safari and Firefox get plain frosted glass."}
      </p>

      <div className="mt-12 grid gap-16">
        {palettes.map((p) => (
          <section key={p.id} aria-labelledby={`pal-${p.id}`}>
            <h2 id={`pal-${p.id}`} className="text-xl font-semibold">
              {p.name[locale]}
            </h2>
            <p className="mt-1 text-sm text-muted">{p.note[locale]}</p>
            <div className="mt-5 overflow-x-auto pb-2">
              <GlassMockup p={p} copy={copy} />
            </div>
            <ul className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
              {(
                [
                  [cs ? "pozadí" : "background", p.bg],
                  [cs ? "text" : "text", p.fg],
                  [cs ? "tlumený" : "muted", p.muted],
                  ["accent A", p.accent[0]],
                  ["accent B", p.accent[1]],
                  ...p.blobs.map((hex, i) => [`${cs ? "plocha" : "field"} ${i + 1}`, hex]),
                ] as [string, string][]
              ).map(([label, hex]) => (
                <li key={label} className="glass flex items-center gap-2 rounded-full py-1 pr-3 pl-1">
                  <span className="size-5 rounded-full border border-black/10" style={{ background: hex }} />
                  {label} {hex}
                </li>
              ))}
              <li className="glass rounded-full px-3 py-1">
                {cs ? "kontrast" : "contrast"} text {contrast(p.fg, p.bg).toFixed(1)}:1 · {cs ? "tlumený" : "muted"}{" "}
                {contrast(p.muted, p.bg).toFixed(1)}:1
              </li>
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
