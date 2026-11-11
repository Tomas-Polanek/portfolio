import { Fragment, type CSSProperties } from "react";
import { bs, s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeButton } from "@/components/theme-button";
import type { Dictionary } from "@/content/cs";
import { site } from "@/content/site";
import type { Locale } from "@/lib/locales";
import type { NavItem } from "./use-scrollspy";
import { SectionNav } from "./section-nav";

/**
 * Left column: intro block on small screens, sticky full-height glass panel from lg (name, role,
 * theme + language, section nav with scrollspy, contact icons).
 */
export function SitePanel({
  t,
  locale,
  nav,
  endId,
}: {
  t: Dictionary;
  locale: Locale;
  nav: NavItem[];
  endId: string;
}) {
  const other = locale === "cs" ? "en" : "cs";
  // Letters of the name, numbered across words for the staggered intro.
  let letterIndex = 0;
  const nameWords = site.name.split(" ").map((word) => [...word].map((char) => ({ char, i: letterIndex++ })));
  const contactLinks = [
    { href: site.links.github, label: t.contact.github.title, Icon: GitHubIcon },
    { href: site.links.linkedin, label: t.contact.linkedin.title, Icon: LinkedInIcon },
    { href: site.links.instagram, label: t.contact.instagram.title, Icon: InstagramIcon },
    { href: `mailto:${site.email}`, label: `${t.contact.email.title}: ${site.email}`, Icon: MailIcon },
  ];

  return (
    <header id="intro" className={bs.column}>
      <GlassLayer className="bs-columnGlass" />
      <div>
        <div className="flex items-center gap-3">
          <ThemeButton label={t.theme.toggle} className={s.iconBtn} />
          <LanguageSwitch
            target={other}
            label={t.language.switchLabel}
            short={t.language.switchShort}
            className={s.iconBtn}
          />
        </div>
        <h1 className="mt-10 text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl xl:text-[3.5rem]">
          <span className="sr-only">{site.name}</span>
          <span aria-hidden="true">
            {nameWords.map((letters, w) => (
              <Fragment key={w}>
                {w > 0 && " "}
                <span className="inline-block whitespace-nowrap">
                  {letters.map(({ char, i }) => (
                    <span key={i} className={s.introLetter} style={{ "--i": i } as CSSProperties}>
                      {char}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        </h1>
        <p
          className={`${s.roleText} ${s.introFade} mt-3 text-lg font-semibold tracking-tight sm:text-xl`}
          style={{ "--delay": "0.55s" } as CSSProperties}
        >
          {t.hero.role}
        </p>
        <div className={`${s.introFade} mt-4 max-w-sm space-y-2`} style={{ "--delay": "0.7s" } as CSSProperties}>
          {t.hero.lines.map((line) => (
            <p key={line} className={`${s.muted} leading-relaxed`}>
              {line}
            </p>
          ))}
        </div>
      </div>

      <SectionNav items={nav} label={t.nav.sections} endId={endId} />

      <ul className="mt-7 flex gap-2.5 lg:mt-0">
        {contactLinks.map(({ href, label, Icon }) => (
          <li key={label}>
            <a
              href={href}
              {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
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
  );
}
