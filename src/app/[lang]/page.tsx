import { RevealObserver } from "@/components/reveal-observer";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import { getDictionary, getLocale } from "@/lib/i18n";

export default async function Home() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const otherLocale = locale === "cs" ? "en" : "cs";

  return (
    <>
      <SiteHeader
        brand={site.name}
        links={[
          { id: "about", label: t.nav.about },
        ]}
        githubUrl={site.links.github}
        themeLabel={t.theme.toggle}
        menuLabels={{ open: t.nav.openMenu, close: t.nav.closeMenu }}
        language={{ target: otherLocale, label: t.language.switchLabel, short: t.language.switchShort }}
      />

      <main className="mx-auto w-[calc(100%-2rem)] max-w-[1100px]">
        <Hero t={t.hero} />
        <About t={t.about} />
      </main>

      <SiteFooter t={t.footer} />

      <RevealObserver />
    </>
  );
}
