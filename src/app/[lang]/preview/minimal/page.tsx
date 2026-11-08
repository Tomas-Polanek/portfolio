import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import type { Dictionary } from "@/content/cs";
import { projectImages, projects } from "@/content/projects";
import { site } from "@/content/site";
import {
  ExternalIcon,
  ForkIcon,
  GitHubIcon,
  HomelabGlyph,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  StarIcon,
} from "@/components/icons";
import { getRepoInfo } from "@/lib/github";
import { getDictionary, getLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";
import { ScrollspyNav } from "./_components/scrollspy-nav";
import { Spotlight } from "./_components/spotlight";
import { ThemeButton } from "./_components/theme-button";
import { s } from "./classes";

const SLUG = "minimal";
const END_ID = "minimal-end";

const ui = {
  cs: { style: "Minimal dvousloupcový", badge: "Náhled stylu", nav: "Sekce stránky", skip: "Přeskočit na obsah" },
  en: { style: "Minimal two-column", badge: "Style preview", nav: "Page sections", skip: "Skip to content" },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: `${ui[locale].badge}: ${ui[locale].style}`, robots: { index: false } };
}

export default async function MinimalPreview() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const other = locale === "cs" ? "en" : "cs";
  const labels = ui[locale];
  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "projects", label: t.nav.projects },
    { id: "homelab", label: t.nav.homelab },
    { id: "education", label: t.nav.education },
    { id: "contact", label: t.nav.contact },
  ];
  const socials = [
    { href: site.links.github, label: "GitHub", Icon: GitHubIcon },
    { href: site.links.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: site.links.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: `mailto:${site.email}`, label: t.contact.email.title, Icon: MailIcon },
  ];

  return (
    <div id="top" className={s.root}>
      <Spotlight />
      <a
        href="#content"
        className="sr-only z-50 rounded-md px-4 py-2 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        style={{ background: "var(--m-heading)", color: "var(--m-bg)" }}
      >
        {labels.skip}
      </a>

      <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-6 py-12 font-sans sm:px-12 md:px-16 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-12">
          {/* ---------- Left column ---------- */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[46%] lg:flex-col lg:justify-between lg:py-24">
            <div>
              <p className={`${s.accent} font-mono text-sm`}>{t.hero.greeting}</p>
              <h1 className={`${s.heading} mt-2 text-4xl font-bold tracking-tight sm:text-5xl`}>{site.name}</h1>
              <p className={`${s.heading} mt-3 text-lg font-medium tracking-tight sm:text-xl`}>{t.hero.role}</p>
              <div className={`${s.brandRule} mt-5 h-0.5 w-12 rounded-full`} aria-hidden="true" />
              <p className="mt-5 max-w-sm">{t.hero.lines[0]}</p>
              <p className={`${s.muted} mt-2 max-w-sm text-[0.95rem]`}>{t.hero.lines[1]}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="#contact"
                  className={`${s.pill} inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold`}
                >
                  {t.hero.ctaContact} <span aria-hidden="true">→</span>
                </a>
                <a href="#projects" className={`${s.link} ${s.underline} text-sm font-semibold`}>
                  {t.hero.ctaProjects}
                </a>
              </div>

              <ScrollspyNav items={navItems} label={labels.nav} endId={END_ID} />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-12">
              <ul className="flex items-center gap-4" aria-label="Social">
                {socials.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className={`${s.iconLink} inline-flex size-9 items-center justify-center rounded-full`}
                    >
                      <Icon width={22} height={22} />
                    </a>
                  </li>
                ))}
              </ul>
              <span className={`${s.line} h-5 border-l`} aria-hidden="true" />
              <div className="flex items-center gap-2">
                <ThemeButton label={t.theme.toggle} />
                <a
                  href={`/${other}/preview/${SLUG}`}
                  hrefLang={other}
                  lang={other}
                  aria-label={t.language.switchLabel}
                  title={t.language.switchLabel}
                  className={`${s.iconLink} inline-flex h-9 items-center rounded-full px-2 font-mono text-sm font-semibold`}
                >
                  {t.language.switchShort}
                </a>
              </div>
            </div>
          </header>

          {/* ---------- Right column ---------- */}
          <main id="content" className="pt-16 lg:w-[54%] lg:py-24">
            <About t={t.about} />
            <Projects t={t.projects} locale={locale} />
            <Homelab t={t.homelab} />
            <Education t={t.education} />
            <Contact t={t.contact} />

            <footer id={END_ID} className={`${s.muted} ${s.line} border-t pt-8 pb-16 text-sm sm:pb-0`}>
              <p className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <span>
                  © {site.name} · {t.footer.builtWith}
                </span>
                <a href="#top" className={`${s.link} ${s.underline}`}>
                  {t.footer.backToTop} ↑
                </a>
              </p>
            </footer>
          </main>
        </div>
      </div>

      <a
        href={`/${locale}/preview`}
        className={`${s.badge} fixed right-3 bottom-3 z-40 rounded-full px-3 py-1.5 font-mono text-[0.7rem] shadow-sm sm:right-4 sm:bottom-4`}
      >
        {labels.badge}: {labels.style}
      </a>
    </div>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mb-20 md:mb-28 lg:mb-36">
      <div
        className={`${s.stickyHead} sticky top-0 z-20 -mx-6 mb-6 px-6 py-5 sm:-mx-12 sm:px-12 md:-mx-16 md:px-16 lg:relative lg:top-auto lg:mx-0 lg:mb-8 lg:px-0 lg:py-0`}
      >
        <div className="flex items-center gap-4">
          <h2 id={`${id}-title`} className={`${s.heading} shrink-0 text-sm font-bold uppercase tracking-[0.18em]`}>
            {title}
          </h2>
          <span className={`${s.line} hidden flex-1 border-t lg:block`} aria-hidden="true" />
        </div>
      </div>
      {children}
    </section>
  );
}

function About({ t }: { t: Dictionary["about"] }) {
  return (
    <Block id="about" title={t.title}>
      <div className="space-y-4">
        {t.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <h3 className={`${s.heading} mt-10 text-sm font-semibold`}>{t.skillsTitle}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {t.skills.map((skill) => (
          <li key={skill} className={`${s.pill} rounded-full px-3 py-1 text-xs font-medium leading-5`}>
            {skill}
          </li>
        ))}
      </ul>
    </Block>
  );
}

async function Projects({ t, locale }: { t: Dictionary["projects"]; locale: Locale }) {
  const infos = await Promise.all(projects.map((p) => getRepoInfo(p.repo)));
  const monthYear = new Intl.DateTimeFormat(locale, { month: "numeric", year: "numeric", timeZone: "UTC" });

  return (
    <Block id="projects" title={t.title}>
      <p className={`${s.muted} mb-10 text-[0.95rem]`}>{t.subtitle}</p>
      <ol className={s.list}>
        {projects.map(({ repo, tags }, i) => {
          const info = infos[i];
          const { title, description } = t.items[repo];
          const codeUrl = info?.url ?? `${site.links.github}/${repo}`;
          const image = projectImages[repo];
          return (
            <li key={repo} className="mb-12 last:mb-0">
              <article className={`${s.card} group relative grid gap-4 sm:grid-cols-8 sm:gap-6`}>
                <div className={`${s.cardBg} absolute -inset-x-4 -inset-y-4 z-0 rounded-lg lg:-inset-x-6`} aria-hidden="true" />

                <div className={`relative z-10 sm:col-span-2 ${image ? "" : "hidden sm:block"}`}>
                  {image ? (
                    <div className={`${s.thumb} relative aspect-[16/10] w-full max-w-56 overflow-hidden rounded-md sm:mt-1`}>
                      <Image
                        src={image}
                        alt={`${title} – ${t.screenshot}`}
                        fill
                        sizes="(min-width: 640px) 180px, 224px"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div
                      className={`${s.thumb} ${s.tile} mt-1 flex aspect-[16/10] w-full flex-col justify-between rounded-md p-3 font-mono`}
                      aria-hidden="true"
                    >
                      <span className={`${s.accent} text-lg leading-none font-semibold`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {info?.language && (
                        <span className={`${s.muted} truncate text-[0.65rem] uppercase tracking-wider`}>{info.language}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative z-10 sm:col-span-6">
                  <h3 className="text-base leading-snug font-semibold">
                    <a href={codeUrl} target="_blank" rel="noopener noreferrer" className={`${s.cardTitle} inline-flex items-baseline`}>
                      {/* Stretched link: the whole card opens the code */}
                      <span className="absolute -inset-x-4 -inset-y-4 rounded-lg lg:-inset-x-6" aria-hidden="true" />
                      <span>
                        {title}
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className={`${s.arrow} ml-1 inline-block size-4 translate-y-px`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </a>
                  </h3>

                  {info?.forkOf && (
                    <p className={`${s.muted} mt-1 inline-flex items-center gap-1.5 text-xs`}>
                      <ForkIcon width={13} height={13} /> {t.forkOf} {info.forkOf}
                    </p>
                  )}

                  <p className="mt-2 text-sm leading-relaxed">{description}</p>

                  <div className={`${s.muted} mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs`}>
                    <a href={codeUrl} target="_blank" rel="noopener noreferrer" className={`${s.link} relative z-20 inline-flex items-center gap-1.5`}>
                      <GitHubIcon width={13} height={13} /> {t.code}
                    </a>
                    {info?.homepage && (
                      <a href={info.homepage} target="_blank" rel="noopener noreferrer" className={`${s.link} relative z-20 inline-flex items-center gap-1`}>
                        <ExternalIcon width={13} height={13} /> {t.live}
                      </a>
                    )}
                    {info && info.stars > 0 && (
                      <span className="inline-flex items-center gap-1" title={t.stars}>
                        <StarIcon width={13} height={13} aria-label={t.stars} /> {info.stars}
                      </span>
                    )}
                    {info?.language && <span className={image ? "" : "sm:hidden"}>{info.language}</span>}
                    {info && (
                      <span>
                        {t.updated} {monthYear.format(new Date(info.pushedAt))}
                      </span>
                    )}
                  </div>

                  <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags">
                    {tags.map((tag) => (
                      <li key={tag} className={`${s.pill} rounded-full px-3 py-1 text-xs font-medium leading-5`}>
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      <a
        href={site.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className={`${s.link} ${s.underline} mt-12 inline-flex items-center gap-2 font-semibold`}
      >
        {t.allOnGithub} <span aria-hidden="true">↗</span>
      </a>
    </Block>
  );
}

function Homelab({ t }: { t: Dictionary["homelab"] }) {
  return (
    <Block id="homelab" title={t.title}>
      <p>{t.intro}</p>

      <h3 className={`${s.heading} mt-10 text-sm font-semibold`}>{t.specsTitle}</h3>
      <div className={`${s.panel} mt-4 overflow-hidden rounded-lg`}>
        <p className={`${s.muted} ${s.line} border-b px-5 py-2.5 font-mono text-xs`}>
          <span className={s.accent}>{site.homelabPrompt}</span>$ cat setup
        </p>
        <dl className="divide-y px-5">
          {t.specs.map((spec) => (
            <div key={spec.label} className={`${s.line} grid gap-x-4 gap-y-1 py-3.5 sm:grid-cols-[9rem_1fr]`}>
              <dt className={`${s.muted} flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider`}>
                <HomelabGlyph name={spec.icon} width={16} height={16} className={`${s.accent} shrink-0`} />
                {spec.label}
              </dt>
              <dd className={`${s.heading} text-sm`}>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h3 className={`${s.heading} mt-10 text-sm font-semibold`}>{t.servicesTitle}</h3>
      <ul className="mt-5 grid gap-x-8 gap-y-7 sm:grid-cols-2">
        {t.services.map((service) => (
          <li key={service.name} className="flex gap-4">
            <span className={`${s.pill} inline-flex size-9 shrink-0 items-center justify-center rounded-md`}>
              <HomelabGlyph name={service.icon} width={18} height={18} />
            </span>
            <div>
              <h4 className={`${s.heading} text-sm font-semibold`}>{service.name}</h4>
              <p className={`${s.muted} mt-1 text-sm leading-relaxed`}>{service.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <h3 className={`${s.heading} mt-10 text-sm font-semibold`}>{t.learnedTitle}</h3>
      <ul className="mt-4 space-y-2 text-sm">
        {t.learned.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`${s.accent} font-mono font-bold`} aria-hidden="true">
              ›
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Education({ t }: { t: Dictionary["education"] }) {
  return (
    <Block id="education" title={t.title}>
      <ol>
        {t.items.map((item) => (
          <li key={item.title} className="grid gap-1 sm:grid-cols-8 sm:gap-6">
            <p className={`${s.muted} font-mono text-xs leading-6 uppercase tracking-wider sm:col-span-2`}>{item.period}</p>
            <div className="sm:col-span-6">
              <h3 className={`${s.heading} font-semibold leading-6`}>{item.title}</h3>
              <p className={`${s.muted} text-sm`}>{item.place}</p>
            </div>
          </li>
        ))}
      </ol>

      <h3 className={`${s.heading} mt-10 text-sm font-semibold`}>{t.learningTitle}</h3>
      <ul className="mt-4 space-y-2 text-sm">
        {t.learning.map((item) => (
          <li key={item} className="flex gap-3">
            <span className={`${s.accent} font-mono font-bold`} aria-hidden="true">
              ›
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Contact({ t }: { t: Dictionary["contact"] }) {
  const links = [
    { href: site.links.linkedin, title: t.linkedin.title, sub: t.linkedin.sub, Icon: LinkedInIcon },
    { href: site.links.github, title: t.github.title, sub: t.github.sub, Icon: GitHubIcon },
    { href: site.links.instagram, title: t.instagram.title, sub: t.instagram.sub, Icon: InstagramIcon },
  ];
  return (
    <Block id="contact" title={t.title}>
      <p>{t.subtitle}</p>
      <p className={`${s.muted} mt-8 font-mono text-xs uppercase tracking-wider`}>{t.email.title}</p>
      <a
        href={`mailto:${site.email}`}
        className={`${s.link} ${s.underline} mt-1 inline-block text-xl font-semibold tracking-tight break-all sm:text-2xl`}
      >
        {site.email}
      </a>
      <ul className={`${s.line} mt-8 border-t`}>
        {links.map(({ href, title, sub, Icon }) => (
          <li key={title} className={`${s.line} border-b`}>
            <a href={href} target="_blank" rel="noopener noreferrer" className={`${s.card} group flex items-center gap-4 py-4`}>
              <Icon width={20} height={20} className={s.muted} />
              <span className="flex-1">
                <span className={`${s.cardTitle} block font-semibold`}>{title}</span>
                <span className={`${s.muted} block text-sm`}>{sub}</span>
              </span>
              <span className={`${s.arrow} ${s.muted}`} aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Block>
  );
}
