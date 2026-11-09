import { bs, s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeButton } from "@/components/theme-button";
import { TpMark } from "@/components/tp-mark";
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
          <span className={s.monogram} aria-hidden="true">
            <TpMark className="size-full" />
          </span>
          <ThemeButton label={t.theme.toggle} className={s.iconBtn} />
          <LanguageSwitch
            target={other}
            label={t.language.switchLabel}
            short={t.language.switchShort}
            className={s.iconBtn}
          />
        </div>
        <h1 className="mt-10 text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl xl:text-[3.5rem]">
          {site.name}
        </h1>
        <p className={`${s.roleText} mt-3 text-lg font-semibold tracking-tight sm:text-xl`}>
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
