import { bs, s } from "@/components/classes";
import { CompactBar } from "@/components/panel/compact-bar";
import { SitePanel } from "@/components/panel/site-panel";
import { Contact } from "@/components/sections/contact";
import { Education } from "@/components/sections/education";
import { Homelab } from "@/components/sections/homelab";
import { Overview } from "@/components/sections/overview";
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
            <Overview t={t} locale={locale} />
            <Projects t={t.projects} nav={t.nav.projects} locale={locale} />
            <Homelab t={t.homelab} nav={t.nav.homelab} servicesCount={t.overview.servicesCount} />
            <div className="grid gap-4 pt-20 sm:gap-5 sm:pt-28 xl:grid-cols-12">
              <Education t={t.education} />
              <Contact t={t.contact} nav={t.nav.contact} />
            </div>
          </main>
          <SiteFooter t={t.footer} id={END_ID} />
        </div>
      </div>
    </div>
  );
}
