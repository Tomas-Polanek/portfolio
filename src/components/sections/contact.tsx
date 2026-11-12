import { s } from "@/components/classes";
import { ContactForm } from "@/components/contact-form";
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

        <a
          href={`mailto:${site.email}`}
          className={`${s.tile} ${s.lift} group relative mt-7 flex min-w-0 items-center gap-3.5 p-5 sm:p-6`}
        >
          <GlassLayer />
          <span className={s.iconWell}>
            <MailIcon width={18} height={18} />
          </span>
          <span className="min-w-0 flex-1">
            <span className={`${s.eyebrow} block`}>{t.email.eyebrow}</span>
            <span className="mt-1 block text-xl font-semibold tracking-tight sm:text-2xl">{t.email.cta}</span>
            <span className={`${s.muted} wrap-anywhere mt-0.5 block text-sm`}>{site.email}</span>
          </span>
          <span aria-hidden="true" className={`${s.muted} shrink-0 text-2xl`}>
            ↗
          </span>
        </a>

        <div className="relative mt-7">
          <p className={s.eyebrow}>{t.checklist.title}</p>
          <ol className="mt-3">
            {t.checklist.items.map((item, i) => (
              <li key={item} className="flex gap-4 border-b border-[var(--line-strong)] py-2.5 last:border-b-0">
                <span className={`${s.eyebrow} shrink-0 pt-0.5`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.muted}>{item}</span>
              </li>
            ))}
          </ol>
          <p className={`${s.muted} mt-3 text-sm italic`}>{t.checklist.reply}</p>
        </div>

        <div className="relative mt-8">
          <h3 className={s.eyebrow}>{t.formTitle}</h3>
          <ContactForm t={t.form} />
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
