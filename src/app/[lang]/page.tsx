import { bs, s } from "@/components/classes";
import { CompactBar } from "@/components/panel/compact-bar";
import { SitePanel } from "@/components/panel/site-panel";
import { RevealObserver } from "@/components/reveal-observer";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Homelab } from "@/components/sections/homelab";
import { Projects } from "@/components/sections/projects";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import { getDictionary, getLocale } from "@/lib/i18n";

const END_ID = "page-end";

export default async function Home() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const nav = [
    { id: "about", label: t.nav.about },
    { id: "projects", label: t.nav.projects },
    { id: "homelab", label: t.nav.homelab },
    { id: "education", label: t.nav.education },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <div className={s.root} id="top">
      {/* Colour fields the glass refracts */}
      <div className="bs-backdrop" aria-hidden="true" />
      <div className={bs.layout}>
        <SitePanel t={t} locale={locale} nav={nav} endId={END_ID} />
        <CompactBar
          name={site.name}
          items={nav}
          navLabel={t.nav.sections}
          themeLabel={t.theme.toggle}
          menuLabels={{ open: t.nav.openMenu, close: t.nav.closeMenu }}
          language={{
            target: locale === "cs" ? "en" : "cs",
            label: t.language.switchLabel,
            short: t.language.switchShort,
          }}
          watchId="intro"
          endId={END_ID}
        />

        <div className={bs.content}>
          <main>
            <About t={t.about} />
            <Projects t={t.projects} locale={locale} />
            <Homelab t={t.homelab} />
            <Education t={t.education} />
            <Contact t={t.contact} />
          </main>
          <SiteFooter t={t.footer} id={END_ID} />
        </div>
      </div>

      <RevealObserver />
    </div>
  );
}
