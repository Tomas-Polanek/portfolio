import { RevealObserver } from "@/components/reveal-observer";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Hero } from "@/components/sections/hero";
import { Homelab } from "@/components/sections/homelab";
import { Projects } from "@/components/sections/projects";
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
          { id: "projects", label: t.nav.projects },
          { id: "homelab", label: t.nav.homelab },
          { id: "education", label: t.nav.education },
          { id: "contact", label: t.nav.contact },
        ]}
        githubUrl={site.links.github}
        themeLabel={t.theme.toggle}
        menuLabels={{ open: t.nav.openMenu, close: t.nav.closeMenu }}
        language={{ target: otherLocale, label: t.language.switchLabel, short: t.language.switchShort }}
      />

      <main className="mx-auto w-[calc(100%-2rem)] max-w-[1100px]">
        <Hero t={t.hero} />
        <About t={t.about} />
        <Projects t={t.projects} locale={locale} />
        <Homelab t={t.homelab} />
        <Education t={t.education} />
        <Contact t={t.contact} />
      </main>

      <SiteFooter t={t.footer} />

      <RevealObserver />
    </>
  );
}
