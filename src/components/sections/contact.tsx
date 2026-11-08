import type { ComponentType, SVGProps } from "react";
import type { Dictionary } from "@/content/cs";
import { site } from "@/content/site";
import { GitHubIcon, InstagramIcon, LinkedInIcon, MailIcon } from "../icons";
import { Section } from "../section";

export function Contact({ t }: { t: Dictionary["contact"] }) {
  const cards: {
    href: string;
    title: string;
    sub: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    external: boolean;
  }[] = [
    { href: `mailto:${site.email}`, title: t.email.title, sub: site.email, Icon: MailIcon, external: false },
    { href: site.links.linkedin, ...t.linkedin, Icon: LinkedInIcon, external: true },
    { href: site.links.github, ...t.github, Icon: GitHubIcon, external: true },
    { href: site.links.instagram, ...t.instagram, Icon: InstagramIcon, external: true },
  ];

  return (
    <Section id="contact" title={t.title} subtitle={t.subtitle}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, title, sub, Icon, external }) => (
          <a
            key={href}
            href={href}
            data-reveal
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="glass gradient-border lift flex flex-col gap-1 rounded-[18px] p-6"
          >
            <Icon className="mb-2 text-accent-to" width={22} height={22} />
            <span className="font-semibold">{title}</span>
            <span className="break-all text-sm text-muted">{sub}</span>
          </a>
        ))}
      </div>
    </Section>
  );
}
