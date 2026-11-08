import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import Image from "next/image";
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
import { projectImages, projects } from "@/content/projects";
import { site } from "@/content/site";
import { getRepoInfo } from "@/lib/github";
import { getDictionary, getLocale } from "@/lib/i18n";
import { ThemeButton } from "./_components/theme-button";
import "./editorial.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-editorial-serif",
});

export const metadata: Metadata = {
  robots: { index: false },
};

/** Splits a description into its first sentence (row summary) and the rest (revealed detail). */
function splitSentence(text: string): [string, string] {
  const match = /^([\s\S]+?[.!?])\s+([\s\S]+)$/.exec(text);
  return match ? [match[1], match[2]] : [text, ""];
}

export default async function EditorialPreview() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  const other = locale === "cs" ? "en" : "cs";
  const infos = await Promise.all(projects.map((p) => getRepoInfo(p.repo, p.owner)));
  const monthYear = new Intl.DateTimeFormat(locale, { month: "numeric", year: "numeric", timeZone: "UTC" });
  const badge = locale === "cs" ? "Náhled stylu" : "Style preview";

  const nav = [
    { id: "about", label: t.nav.about },
    { id: "projects", label: t.nav.projects },
    { id: "homelab", label: t.nav.homelab },
    { id: "education", label: t.nav.education },
    { id: "contact", label: t.nav.contact },
  ];

  const contacts = [
    { href: site.links.linkedin, title: t.contact.linkedin.title, sub: t.contact.linkedin.sub, Icon: LinkedInIcon },
    { href: site.links.github, title: t.contact.github.title, sub: t.contact.github.sub, Icon: GitHubIcon },
    { href: site.links.instagram, title: t.contact.instagram.title, sub: t.contact.instagram.sub, Icon: InstagramIcon },
  ];

  return (
    <div id="top" className={`ed-root ${serif.variable}`}>
      <a href="#main" className="ed-skip">
        {locale === "cs" ? "Přeskočit na obsah" : "Skip to content"}
      </a>

      <header className="ed-header">
        <div className="ed-headerInner">
          <a href="#top" className="ed-brand">
            {site.name}
          </a>
          <nav aria-label={locale === "cs" ? "Hlavní navigace" : "Main navigation"} className="ed-nav">
            <ul>
              {nav.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ed-controls">
            <a
              href={`/${other}/preview/editorial`}
              hrefLang={other}
              lang={other}
              aria-label={t.language.switchLabel}
              title={t.language.switchLabel}
              className="ed-langLink"
            >
              {t.language.switchShort}
            </a>
            <ThemeButton label={t.theme.toggle} />
          </div>
        </div>
      </header>

      <main id="main" className="ed-main">
        {/* Hero */}
        <section className="ed-hero" aria-labelledby="hero-title">
          <p className="ed-eyebrow">
            <span className="ed-dot" aria-hidden="true" />
            {t.hero.role}
          </p>
          <h1 id="hero-title" className="ed-display">
            {t.hero.greeting}
            <span className="ed-accentStop">.</span>
          </h1>
          <div className="ed-heroLines">
            {t.hero.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="ed-ctas">
            <a href="#projects" className="ed-ctaPrimary">
              {t.hero.ctaProjects} <span aria-hidden="true">↓</span>
            </a>
            <a href="#contact" className="ed-textLink">
              {t.hero.ctaContact} <span aria-hidden="true">→</span>
            </a>
          </p>
        </section>

        {/* About */}
        <section id="about" className="ed-section" aria-labelledby="about-title">
          <SectionHeading index={1} id="about-title" title={t.about.title} />
          <div className="ed-prose">
            {t.about.paragraphs.map((p, i) => (
              <p key={p} className={i === 0 ? "ed-lead" : undefined}>
                {p}
              </p>
            ))}
          </div>
          <h3 className="ed-subheading">{t.about.skillsTitle}</h3>
          <ul className="ed-skills">
            {t.about.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>

        {/* Projects */}
        <section id="projects" className="ed-section" aria-labelledby="projects-title">
          <SectionHeading index={2} id="projects-title" title={t.projects.title} />
          <p className="ed-intro">{t.projects.subtitle}</p>
          <ol className="ed-index">
            {projects.map(({ repo, tags }, i) => {
              const info = infos[i];
              const { title, description } = t.projects.items[repo];
              const [summary, rest] = splitSentence(description);
              const codeUrl = info?.url ?? `${site.links.github}/${repo}`;
              const image = projectImages[repo];
              return (
                <li key={repo} className="ed-row">
                  <article className="ed-rowInner">
                    <span className="ed-rowNumber" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="ed-rowMain">
                      <h3 className="ed-rowTitle">
                        <a href={codeUrl} target="_blank" rel="noopener noreferrer" className="ed-rowLink">
                          {title}
                          <span className="ed-rowArrow" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      </h3>
                      <p className="ed-rowSummary">{summary}</p>
                      <p className="ed-rowMeta">
                        {info && (
                          <span>
                            {t.projects.updated} {monthYear.format(new Date(info.pushedAt))}
                          </span>
                        )}
                        {info?.language && <span>{info.language}</span>}
                        {info && info.stars > 0 && (
                          <span title={t.projects.stars} className="ed-metaIcon">
                            <StarIcon width={12} height={12} aria-hidden="true" />
                            <span className="ed-srOnly">{t.projects.stars}:</span> {info.stars}
                          </span>
                        )}
                      </p>

                      <div className="ed-detail">
                        <div className="ed-detailInner">
                          {image && (
                            <figure className="ed-shot">
                              <Image
                                src={image}
                                alt={`${title} – ${t.projects.screenshot}`}
                                fill
                                sizes="(min-width: 768px) 640px, 100vw"
                                className="ed-shotImg"
                              />
                            </figure>
                          )}
                          {rest && <p className="ed-rowRest">{rest}</p>}
                          {info?.forkOf && (
                            <p className="ed-fork">
                              <ForkIcon width={13} height={13} aria-hidden="true" /> {t.projects.forkOf} {info.forkOf}
                            </p>
                          )}
                          <ul className="ed-tags" aria-label="Tags">
                            {tags.map((tag) => (
                              <li key={tag}>{tag}</li>
                            ))}
                          </ul>
                          <p className="ed-rowLinks">
                            <a href={codeUrl} target="_blank" rel="noopener noreferrer" className="ed-textLink">
                              <GitHubIcon width={14} height={14} aria-hidden="true" /> {t.projects.code}
                              <span className="ed-srOnly"> – {title}</span>
                            </a>
                            {info?.homepage && (
                              <a
                                href={info.homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ed-textLink"
                              >
                                <ExternalIcon width={14} height={14} aria-hidden="true" /> {t.projects.live}
                                <span className="ed-srOnly"> – {title}</span>
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
          <p className="ed-after">
            <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="ed-textLink">
              {t.projects.allOnGithub} <span aria-hidden="true">↗</span>
            </a>
          </p>
        </section>

        {/* Homelab */}
        <section id="homelab" className="ed-section" aria-labelledby="homelab-title">
          <SectionHeading index={3} id="homelab-title" title={t.homelab.title} />
          <p className="ed-intro">{t.homelab.intro}</p>

          <h3 className="ed-subheading">{t.homelab.specsTitle}</h3>
          <p className="ed-prompt">
            {site.homelabPrompt}
            <span aria-hidden="true">$</span>
          </p>
          <dl className="ed-specs">
            {t.homelab.specs.map((spec) => (
              <div key={spec.label}>
                <dt>
                  <HomelabGlyph name={spec.icon} width={15} height={15} aria-hidden="true" />
                  {spec.label}
                </dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="ed-subheading">{t.homelab.servicesTitle}</h3>
          <ul className="ed-services">
            {t.homelab.services.map((service) => (
              <li key={service.name}>
                <HomelabGlyph name={service.icon} width={18} height={18} aria-hidden="true" className="ed-glyph" />
                <div>
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="ed-subheading">{t.homelab.learnedTitle}</h3>
          <ul className="ed-dashList">
            {t.homelab.learned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Education */}
        <section id="education" className="ed-section" aria-labelledby="education-title">
          <SectionHeading index={4} id="education-title" title={t.education.title} />
          <ol className="ed-timeline">
            {t.education.items.map((item) => (
              <li key={item.title}>
                <span className="ed-period">{item.period}</span>
                <div>
                  <h3 className="ed-eduTitle">{item.title}</h3>
                  <p className="ed-muted">{item.place}</p>
                </div>
              </li>
            ))}
          </ol>
          <h3 className="ed-subheading">{t.education.learningTitle}</h3>
          <ul className="ed-dashList">
            {t.education.learning.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Contact */}
        <section id="contact" className="ed-section" aria-labelledby="contact-title">
          <SectionHeading index={5} id="contact-title" title={t.contact.title} />
          <p className="ed-intro">{t.contact.subtitle}</p>
          <p className="ed-emailLine">
            <span className="ed-label">
              <MailIcon width={14} height={14} aria-hidden="true" /> {t.contact.email.title}
            </span>
            <a href={`mailto:${site.email}`} className="ed-email">
              {site.email}
            </a>
          </p>
          <ul className="ed-contactList">
            {contacts.map(({ href, title, sub, Icon }) => (
              <li key={title}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon width={16} height={16} aria-hidden="true" />
                  <span className="ed-contactTitle">{title}</span>
                  <span className="ed-contactSub">{sub}</span>
                  <span className="ed-rowArrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="ed-footer">
        <p>
          © {site.name} · {t.footer.builtWith}
        </p>
        <a href="#top" className="ed-textLink">
          {t.footer.backToTop} <span aria-hidden="true">↑</span>
        </a>
      </footer>

      <a href={`/${locale}/preview`} className="ed-badge">
        {badge}: <strong>Editorial</strong>
      </a>
    </div>
  );
}

function SectionHeading({ index, id, title }: { index: number; id: string; title: string }) {
  return (
    <header className="ed-sectionHead">
      <span className="ed-sectionIndex" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <h2 id={id} className="ed-h2">
        {title}
      </h2>
    </header>
  );
}
