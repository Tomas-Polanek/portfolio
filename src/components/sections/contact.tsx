import { s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import type { Dictionary } from "@/content/cs";
import { site } from "@/content/site";

export function Contact({ t, nav }: { t: Dictionary["contact"]; nav: string }) {
  const socials = [
    { href: site.links.linkedin, ...t.linkedin, Icon: LinkedInIcon },
    { href: site.links.github, ...t.github, Icon: GitHubIcon },
    { href: site.links.instagram, ...t.instagram, Icon: InstagramIcon },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="flex flex-col gap-4 sm:gap-5 xl:col-span-7">
      <div className={`${s.tile} relative flex flex-1 flex-col overflow-hidden p-6 sm:p-9`}>
        <GlassLayer />
        <span className={s.orb} aria-hidden="true" />
        <p className={`${s.eyebrow} relative`}>
          <span className={s.dot} /> 05 · {nav}
        </p>
        <h2
          id="contact-title"
          className="relative mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl"
        >
          {t.title}
        </h2>
        <p className={`${s.muted} relative mt-3 text-base sm:text-lg`}>{t.subtitle}</p>
        <div className="relative mt-auto pt-8">
          <p className={s.eyebrow}>{t.email.title}</p>
          <div className="mt-2.5">
            <a href={`mailto:${site.email}`} className={`${s.btnSolid} max-w-full`}>
              <MailIcon width={17} height={17} className="shrink-0" />
              <span className="wrap-anywhere">{site.email}</span>
            </a>
          </div>
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
        {socials.map(({ href, title, sub, Icon }) => (
          <li key={title} className="flex">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${s.tile} ${s.lift} group flex w-full items-center gap-3.5 p-4 sm:flex-col sm:items-start sm:p-5`}
            >
              <GlassLayer />
              <span className={s.iconWell}>
                <Icon width={18} height={18} />
              </span>
              <span className="min-w-0 flex-1 sm:pt-3">
                <span className="block font-semibold tracking-tight">{title}</span>
                <span className={`${s.muted} block text-sm`}>{sub}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
