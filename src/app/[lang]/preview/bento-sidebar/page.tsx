import type { Metadata } from "next";
import {
  GitHubIcon,
  HomelabGlyph,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  StarIcon,
} from "@/components/icons";
import { TpMark } from "@/components/tp-mark";
import { projectImages, projects } from "@/content/projects";
import { site } from "@/content/site";
import { getRepoInfo } from "@/lib/github";
import { getDictionary, getLocale } from "@/lib/i18n";
import "../bento/bento.css";
import "./bento-sidebar.css";
import { getCopy } from "../bento/_components/copy";
import { ProjectTile } from "../bento/_components/project-tile";
import { s } from "../bento/_components/styles";
import { bs, sectionsLabel, styleName } from "./_components/classes";
import { CompactBar } from "./_components/compact-bar";
import { PiModel } from "./_components/pi-model/pi-model";
import { SectionNav } from "./_components/section-nav";
import { ThemeButton } from "../bento/_components/theme-button";

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    title: `${getCopy(locale).badge}: ${styleName} | ${t.meta.title}`,
    robots: { index: false },
  };
}

/** Projects drawn as wide (4/6) tiles from xl; the rest take 2/6. */
const wideProjects = new Set([1, 5]);

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m2 9 10-5 10 5-10 5L2 9Z" />
      <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5M22 9v6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function SectionHeader({
  eyebrow,
  title,
  intro,
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  id: string;
}) {
  return (
    <div className="mb-6 max-w-2xl sm:mb-8">
      <p className={s.eyebrow}>
        <span className={s.dot} /> {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
      >
        {title}
      </h2>
      {intro && (
        <p className={`${s.muted} mt-3 text-base leading-relaxed sm:text-lg`}>
          {intro}
        </p>
      )}
    </div>
  );
}

export default async function BentoSidebarPreview() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const c = getCopy(locale);
  const other = locale === "cs" ? "en" : "cs";
  const infos = await Promise.all(projects.map((p) => getRepoInfo(p.repo, p.owner)));
  const monthYear = new Intl.DateTimeFormat(locale, {
    month: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const study = t.education.items[0];
  const [university, city] = study.place.split(",").map((part) => part.trim());
  const [hardware, ...hardwareSpecs] = t.homelab.specs[0].value.split(" · ");
  const totalStars = infos.reduce((sum, info) => sum + (info?.stars ?? 0), 0);
  const lastPush = infos.reduce<string | null>(
    (latest, info) =>
      info && (!latest || info.pushedAt > latest) ? info.pushedAt : latest,
    null,
  );
  const githubHandle = site.links.github.replace("https://github.com/", "@");

  const nav = [
    { id: "about", label: t.nav.about },
    { id: "projects", label: t.nav.projects },
    { id: "homelab", label: t.nav.homelab },
    { id: "education", label: t.nav.education },
    { id: "contact", label: t.nav.contact },
  ];

  const socials = [
    {
      href: site.links.linkedin,
      label: t.contact.linkedin.title,
      sub: t.contact.linkedin.sub,
      Icon: LinkedInIcon,
    },
    {
      href: site.links.github,
      label: t.contact.github.title,
      sub: t.contact.github.sub,
      Icon: GitHubIcon,
    },
    {
      href: site.links.instagram,
      label: t.contact.instagram.title,
      sub: t.contact.instagram.sub,
      Icon: InstagramIcon,
    },
  ];

  const contactLinks = [
    {
      href: site.links.github,
      label: t.contact.github.title,
      Icon: GitHubIcon,
    },
    {
      href: site.links.linkedin,
      label: t.contact.linkedin.title,
      Icon: LinkedInIcon,
    },
    {
      href: site.links.instagram,
      label: t.contact.instagram.title,
      Icon: InstagramIcon,
    },
    {
      href: `mailto:${site.email}`,
      label: `${t.contact.email.title}: ${site.email}`,
      Icon: MailIcon,
    },
  ];
  const languageHref = `/${other}/preview/bento-sidebar`;

  return (
    <div className={s.root} id="top">
      <div className={bs.layout}>
        {/* Left column: intro block (< lg) / sticky full-height column (≥ lg) */}
        <header id="intro" className={bs.column}>
          <div>
            <div className="flex items-center gap-3">
              <span className={s.monogram} aria-hidden="true">
                <TpMark className="size-full" />
              </span>
              <ThemeButton label={t.theme.toggle} className={s.iconBtn} />
              <a
                href={languageHref}
                hrefLang={other}
                lang={other}
                aria-label={t.language.switchLabel}
                title={t.language.switchLabel}
                className={s.iconBtn}
              >
                {t.language.switchShort}
              </a>
            </div>
            <h1 className="mt-10 text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl xl:text-[3.5rem]">
              {site.name}
            </h1>
            <p
              className={`${s.gradText} mt-3 text-lg font-semibold tracking-tight sm:text-xl`}
            >
              {t.hero.role}
            </p>
            <div className="mt-4 max-w-sm space-y-2">
              {t.hero.lines.map((line) => (
                <p key={line} className={`${s.muted} leading-relaxed`}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          <SectionNav
            items={nav}
            label={sectionsLabel[locale]}
            endId="page-end"
          />

          <ul className="mt-7 flex gap-2.5 lg:mt-0">
            {contactLinks.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("mailto:")
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  aria-label={label}
                  title={label}
                  className={s.iconBtn}
                >
                  <Icon width={17} height={17} />
                </a>
              </li>
            ))}
          </ul>
        </header>

        <CompactBar
          name={site.name}
          items={nav}
          navLabel={sectionsLabel[locale]}
          themeLabel={t.theme.toggle}
          menuLabels={{ open: t.nav.openMenu, close: t.nav.closeMenu }}
          language={{
            href: languageHref,
            lang: other,
            label: t.language.switchLabel,
            short: t.language.switchShort,
          }}
          watchId="intro"
          endId="page-end"
        />

        <div className={bs.content}>
          <main>
            {/* ================= HERO BENTO ================= */}
            <div className={bs.heroGrid}>
              {/* Studying */}
              <div
                className={`${s.tile} ${s.lift} ${s.aStudy} flex flex-col p-5 sm:p-6`}
              >
                <div className="flex items-center justify-between">
                  <span className={s.iconWell}>
                    <CapIcon />
                  </span>
                  <span className={`${s.chip} ${s.chipMono}`}>
                    {study.period}
                  </span>
                </div>
                <p className={`${s.eyebrow} mt-auto pt-6`}>{c.studying}</p>
                <p className="mt-1.5 text-lg leading-snug font-semibold tracking-tight">
                  {study.title}
                </p>
                <p className={`${s.muted} text-sm`}>{university}</p>
              </div>

              {/* Location */}
              <div
                className={`${s.tile} ${s.lift} ${s.aLoc} relative flex min-h-44 flex-col overflow-hidden p-5 sm:p-6`}
              >
                <span className={s.mapGrid} aria-hidden="true" />
                <span
                  className="absolute top-[40%] left-[70%] -translate-x-1/2 -translate-y-1/2"
                  aria-hidden="true"
                >
                  <span className={`${s.pin} block`} />
                </span>
                <p className={`${s.eyebrow} relative`}>{c.basedIn}</p>
                <p className="relative mt-auto text-4xl font-semibold tracking-tight">
                  {city}
                </p>
                <p className={`${s.faint} relative mt-1 font-mono text-xs`}>
                  50.08° N · 14.44° E
                </p>
              </div>

              {/* About */}
              <section
                id="about"
                aria-labelledby="about-title"
                className={`${s.tile} ${s.aAbout} p-6 sm:p-8`}
              >
                <p className={s.eyebrow}>
                  <span className={s.dot} /> 01
                </p>
                <h2
                  id="about-title"
                  className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
                >
                  {t.about.title}
                </h2>
                <div className="mt-4 space-y-3.5">
                  {t.about.paragraphs.map((p) => (
                    <p key={p} className={`${s.muted} leading-relaxed`}>
                      {p}
                    </p>
                  ))}
                </div>
              </section>

              {/* Skills */}
              <section
                aria-labelledby="skills-title"
                className={`${s.tile} ${s.aSkills} p-6 sm:p-8`}
              >
                <h2
                  id="skills-title"
                  className="text-lg font-semibold tracking-tight"
                >
                  {t.about.skillsTitle}
                </h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {t.about.skills.map((skill) => (
                    <li key={skill} className={s.chip}>
                      {skill}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Homelab teaser: the model is its own button, the text is a stretched link. */}
              <div
                className={`${s.tile} ${s.lift} ${s.aLab} ${bs.labTile} group relative p-5 sm:p-6`}
              >
                <span
                  className={`${s.faint} absolute top-5 right-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:top-6 sm:right-6`}
                >
                  <ArrowIcon />
                </span>
                <div className={bs.labBody}>
                  <PiModel
                    label={
                      locale === "cs"
                        ? "Rozložit sestavu Raspberry Pi"
                        : "Explode the Raspberry Pi build"
                    }
                  />
                  <a href="#homelab" className={`${bs.labText} ${bs.labLink}`}>
                    <p className={`${s.eyebrow} mt-4`}>{c.homelabTeaser}</p>
                    <p className="mt-1.5 text-xl font-semibold tracking-tight">
                      {hardware}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {hardwareSpecs.map((spec) => (
                        <li key={spec} className={`${s.chip} ${s.chipMono}`}>
                          {spec}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-6">
                      <ul className="flex gap-1.5" aria-hidden="true">
                        {t.homelab.services.map((svc) => (
                          <li
                            key={svc.name}
                            className={`${s.iconWell} size-8! rounded-lg!`}
                          >
                            <HomelabGlyph
                              name={svc.icon}
                              width={15}
                              height={15}
                            />
                          </li>
                        ))}
                      </ul>
                      <p className={`${s.muted} mt-3 text-sm`}>
                        {c.servicesCount(t.homelab.services.length)}
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* GitHub */}
              <a
                href={site.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`${s.tile} ${s.lift} ${s.aGh} group flex flex-col p-5 sm:p-6`}
              >
                <div className="flex items-center justify-between">
                  <GitHubIcon width={30} height={30} />
                  <span
                    className={`${s.faint} transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                  >
                    <ArrowIcon />
                  </span>
                </div>
                <p className="mt-6 font-mono text-sm font-medium">
                  {githubHandle}
                </p>
                <p className={`${s.muted} text-sm`}>
                  {c.projectsCount(projects.length)}
                </p>
                <p
                  className={`${s.faint} mt-auto flex flex-wrap gap-x-3 pt-4 font-mono text-xs`}
                >
                  {totalStars > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <StarIcon width={12} height={12} /> {totalStars}{" "}
                      {c.totalStars}
                    </span>
                  )}
                  {lastPush && (
                    <span>
                      {c.lastPush} {monthYear.format(new Date(lastPush))}
                    </span>
                  )}
                </p>
              </a>
            </div>

            {/* ================= PROJECTS ================= */}
            <section
              id="projects"
              aria-labelledby="projects-title"
              className="pt-20 sm:pt-28"
            >
              <SectionHeader
                eyebrow={`02 · ${t.nav.projects}`}
                title={t.projects.title}
                intro={t.projects.subtitle}
                id="projects-title"
              />
              <ul className={bs.projGrid}>
                {projects.map(({ repo, tags, teamInProgress }, i) => {
                  const info = infos[i];
                  const { title, description } = t.projects.items[repo];
                  return (
                    <ProjectTile
                      key={repo}
                      index={i}
                      wide={wideProjects.has(i)}
                      title={title}
                      description={description}
                      tags={tags}
                      codeUrl={info?.url ?? `${site.links.github}/${repo}`}
                      image={projectImages[repo]}
                      inProgress={teamInProgress === true}
                      info={info}
                      updated={
                        info ? monthYear.format(new Date(info.pushedAt)) : null
                      }
                      t={t.projects}
                      ui={c}
                    />
                  );
                })}
                <li className={`${s.projAll} flex`}>
                  <a
                    href={site.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${s.tile} ${s.lift} group relative flex w-full flex-col justify-between overflow-hidden p-6 sm:p-7`}
                  >
                    <span className={s.orb} aria-hidden="true" />
                    <span className="relative flex items-center justify-between">
                      <GitHubIcon width={34} height={34} />
                      <span
                        className={`${s.faint} transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}
                      >
                        <ArrowIcon />
                      </span>
                    </span>
                    <span className="relative pt-10">
                      <span className="block text-xl font-semibold tracking-tight sm:text-2xl">
                        {t.projects.allOnGithub}
                      </span>
                      <span
                        className={`${s.muted} mt-1 block font-mono text-sm`}
                      >
                        {githubHandle}
                      </span>
                    </span>
                  </a>
                </li>
              </ul>
            </section>

            {/* ================= HOMELAB ================= */}
            <section
              id="homelab"
              aria-labelledby="homelab-title"
              className="pt-20 sm:pt-28"
            >
              <SectionHeader
                eyebrow={`03 · ${t.nav.homelab}`}
                title={t.homelab.title}
                intro={t.homelab.intro}
                id="homelab-title"
              />
              <div className="grid gap-4 sm:gap-5">
                <div className="flex flex-col gap-4 sm:gap-5 xl:grid xl:grid-cols-2">
                  {/* Specs as a terminal */}
                  <div className={`${s.tile} overflow-hidden`}>
                    <div className={s.terminalBar} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span className="ml-2 truncate">
                        {site.homelabPrompt}
                      </span>
                    </div>
                    <div className="p-5 sm:p-7">
                      <p
                        className="font-mono text-xs sm:text-sm"
                        aria-hidden="true"
                      >
                        <span className={s.prompt}>{site.homelabPrompt}$</span>{" "}
                        <span className={s.muted}>neofetch --short</span>
                      </p>
                      <h3 className="mt-4 text-lg font-semibold tracking-tight">
                        {t.homelab.specsTitle}
                      </h3>
                      <dl className="mt-3">
                        {t.homelab.specs.map((spec) => (
                          <div
                            key={spec.label}
                            className={`${s.specRow} flex items-start gap-3.5 py-3`}
                          >
                            <span className={`${s.iconWell} size-9!`}>
                              <HomelabGlyph
                                name={spec.icon}
                                width={17}
                                height={17}
                              />
                            </span>
                            <div className="min-w-0">
                              <dt className={`${s.eyebrow} text-[0.68rem]!`}>
                                {spec.label}
                              </dt>
                              <dd className="mt-0.5 text-[0.95rem] leading-snug">
                                {spec.value}
                              </dd>
                            </div>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>

                  {/* What it taught me */}
                  <div className={`${s.tile} flex-1 p-5 sm:p-7`}>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {t.homelab.learnedTitle}
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {t.homelab.learned.map((item) => (
                        <li key={item} className="flex gap-3 leading-snug">
                          <span className="mt-0.5 shrink-0 text-(--brand-text-b)">
                            <CheckIcon />
                          </span>
                          <span className={s.muted}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Services */}
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between gap-3 px-1 pb-4 lg:pt-1">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {t.homelab.servicesTitle}
                    </h3>
                    <span className={`${s.chip} ${s.chipMono}`}>
                      {c.servicesCount(t.homelab.services.length)}
                    </span>
                  </div>
                  <ul className="grid flex-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                    {t.homelab.services.map((svc) => (
                      <li
                        key={svc.name}
                        className={`${s.tile} ${s.lift} flex flex-col p-5`}
                      >
                        <span className={s.iconWell}>
                          <HomelabGlyph name={svc.icon} />
                        </span>
                        <h4 className="mt-4 font-semibold tracking-tight">
                          {svc.name}
                        </h4>
                        <p
                          className={`${s.muted} mt-1 text-sm leading-relaxed`}
                        >
                          {svc.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ================= EDUCATION + CONTACT ================= */}
            <div className="grid gap-4 pt-20 sm:gap-5 sm:pt-28 xl:grid-cols-12">
              <section
                id="education"
                aria-labelledby="education-title"
                className="flex flex-col gap-4 sm:gap-5 xl:col-span-5"
              >
                <div className={`${s.tile} p-6 sm:p-7`}>
                  <p className={s.eyebrow}>
                    <span className={s.dot} /> 04
                  </p>
                  <h2
                    id="education-title"
                    className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
                  >
                    {t.education.title}
                  </h2>
                  <ol className="mt-5 space-y-4">
                    {t.education.items.map((item) => (
                      <li key={item.title} className="flex items-start gap-4">
                        <span className={s.iconWell}>
                          <CapIcon />
                        </span>
                        <div>
                          <span className={`${s.chip} ${s.chipMono}`}>
                            {item.period}
                          </span>
                          <h3 className="mt-2 text-lg font-semibold tracking-tight">
                            {item.title}
                          </h3>
                          <p className={`${s.muted} text-sm`}>{item.place}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className={`${s.tile} flex-1 p-6 sm:p-7`}>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {t.education.learningTitle}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {t.education.learning.map((item) => (
                      <li key={item} className="flex gap-3 leading-snug">
                        <span className={`${s.dot} mt-2`} aria-hidden="true" />
                        <span className={s.muted}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section
                id="contact"
                aria-labelledby="contact-title"
                className="flex flex-col gap-4 sm:gap-5 xl:col-span-7"
              >
                <div
                  className={`${s.tile} relative flex flex-1 flex-col overflow-hidden p-6 sm:p-9`}
                >
                  <span className={s.orb} aria-hidden="true" />
                  <p className={`${s.eyebrow} relative`}>
                    <span className={s.dot} /> 05 · {t.nav.contact}
                  </p>
                  <h2
                    id="contact-title"
                    className="relative mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl"
                  >
                    {t.contact.title}
                  </h2>
                  <p
                    className={`${s.muted} relative mt-3 text-base sm:text-lg`}
                  >
                    {t.contact.subtitle}
                  </p>
                  <div className="relative mt-auto pt-8">
                    <p className={s.eyebrow}>{t.contact.email.title}</p>
                    <div className="mt-2.5">
                      <a
                        href={`mailto:${site.email}`}
                        className={`${s.btnSolid} max-w-full`}
                      >
                        <MailIcon width={17} height={17} className="shrink-0" />
                        <span className="wrap-anywhere">{site.email}</span>
                      </a>
                    </div>
                  </div>
                </div>
                <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
                  {socials.map(({ href, label, sub, Icon }) => (
                    <li key={label} className="flex">
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${s.tile} ${s.lift} group flex w-full items-center gap-3.5 p-4 sm:flex-col sm:items-start sm:p-5`}
                      >
                        <span className={s.iconWell}>
                          <Icon width={18} height={18} />
                        </span>
                        <span className="min-w-0 flex-1 sm:pt-3">
                          <span className="block font-semibold tracking-tight">
                            {label}
                          </span>
                          <span className={`${s.muted} block text-sm`}>
                            {sub}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </main>

          <footer id="page-end" className="pt-10 pb-14">
            <div
              className={`${s.tile} flex flex-col gap-3 px-6 py-5 text-sm sm:flex-row sm:items-center sm:justify-between`}
            >
              <p className="flex items-center gap-2.5">
                <span className={`${s.monogram} size-7! rounded-lg!`} aria-hidden="true">
                  <TpMark className="size-full" />
                </span>
                <span className="font-medium">© {site.name}</span>
              </p>
              <p className={s.muted}>{t.footer.builtWith}</p>
              <a href="#top" className={`${s.chip} self-start sm:self-auto`}>
                ↑ {t.footer.backToTop}
              </a>
            </div>
          </footer>
        </div>
      </div>

      <a href={`/${locale}/preview`} className={s.badge}>
        <span className={s.dot} />
        {c.badge}: <strong className="font-semibold">{styleName}</strong>
      </a>
    </div>
  );
}
