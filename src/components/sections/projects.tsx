import type { Dictionary } from "@/content/cs";
import Image from "next/image";
import { projectImages, projects } from "@/content/projects";
import { site } from "@/content/site";
import { getRepoInfo } from "@/lib/github";
import type { Locale } from "@/lib/locales";
import { ExternalIcon, ForkIcon, GitHubIcon, StarIcon } from "../icons";
import { Section } from "../section";

export async function Projects({ t, locale }: { t: Dictionary["projects"]; locale: Locale }) {
  const infos = await Promise.all(projects.map((p) => getRepoInfo(p.repo)));
  const monthYear = new Intl.DateTimeFormat(locale, { month: "numeric", year: "numeric", timeZone: "UTC" });

  return (
    <Section id="projects" title={t.title} subtitle={t.subtitle}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(({ repo, tags }, i) => {
          const info = infos[i];
          const { title, description } = t.items[repo];
          const codeUrl = info?.url ?? `${site.links.github}/${repo}`;
          const image = projectImages[repo];
          return (
            <article
              key={repo}
              data-reveal
              className="glass gradient-border lift group flex flex-col rounded-2xl p-6"
            >
              {image && (
                <div className="relative -mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden rounded-t-2xl border-b border-line">
                  <Image
                    src={image}
                    alt={`${title} – ${t.screenshot}`}
                    fill
                    sizes="(min-width: 1024px) 350px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-gradient text-lg font-bold leading-snug">{title}</h3>
                <div className="flex shrink-0 gap-2">
                  {info?.homepage && (
                    <a
                      href={info.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-line bg-chip px-3 py-1 text-sm transition hover:bg-card-hover"
                    >
                      {t.live} <ExternalIcon width={14} height={14} />
                    </a>
                  )}
                  <a
                    href={codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-chip px-3 py-1 text-sm transition hover:bg-card-hover"
                  >
                    <GitHubIcon width={14} height={14} /> {t.code}
                  </a>
                </div>
              </div>

              {info?.forkOf && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                  <ForkIcon width={14} height={14} /> {t.forkOf} {info.forkOf}
                </p>
              )}

              <p className="mt-3 flex-1 text-[0.95rem] text-muted">{description}</p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <li key={tag} className="rounded-full border border-line bg-chip px-2.5 py-1 text-xs text-muted">
                    {tag}
                  </li>
                ))}
              </ul>

              {info && (
                <div className="mt-5 flex items-center gap-4 border-t border-line pt-4 font-mono text-xs text-muted">
                  {info.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-linear-to-r from-accent-from to-accent-to" />
                      {info.language}
                    </span>
                  )}
                  {info.stars > 0 && (
                    <span className="inline-flex items-center gap-1" title={t.stars}>
                      <StarIcon width={13} height={13} /> {info.stars}
                    </span>
                  )}
                  <span className="ml-auto">
                    {t.updated} {monthYear.format(new Date(info.pushedAt))}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div data-reveal className="mt-10 text-center">
        <a
          href={site.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-link glass gradient-border gap-2 px-5 py-2.5"
        >
          <GitHubIcon width={16} height={16} /> {t.allOnGithub} ↗
        </a>
      </div>
    </Section>
  );
}
