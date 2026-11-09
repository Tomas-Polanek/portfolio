import type { CSSProperties } from "react";
import { bs, s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { ArrowIcon, GitHubIcon } from "@/components/icons";
import { ProjectTile } from "@/components/projects/project-tile";
import { SectionHeader } from "@/components/section-header";
import type { Dictionary } from "@/content/cs";
import { getProjects } from "@/lib/projects";
import { site } from "@/content/site";
import { formatMonthYear } from "@/lib/dates";
import { getRepoInfo } from "@/lib/github";
import type { Locale } from "@/lib/locales";

export async function Projects({ t, nav, locale }: { t: Dictionary["projects"]; nav: string; locale: Locale }) {
  const projects = await getProjects(locale, t);
  const infos = await Promise.all(projects.map((p) => getRepoInfo(p.repo, p.owner)));
  const githubHandle = site.links.github.replace("https://github.com/", "@");
  // The "All on GitHub" tile fills what the last row leaves: 2 columns from sm, 3 (of 6) from xl.
  const fill = {
    "--span-sm": projects.length % 2 ? 1 : 2,
    "--span-xl": [6, 4, 2][projects.length % 3],
  } as CSSProperties;

  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-20 sm:pt-28">
      <SectionHeader eyebrow={`02 · ${nav}`} title={t.title} intro={t.subtitle} id="projects-title" />
      <ul className={bs.projGrid}>
        {projects.map((project, i) => {
          const info = infos[i];
          return (
            <ProjectTile
              key={`${project.owner}/${project.repo}`}
              project={project}
              codeUrl={info?.url ?? `https://github.com/${project.owner}/${project.repo}`}
              info={info}
              updated={info ? formatMonthYear(locale, info.pushedAt) : null}
              t={t}
              layer={<GlassLayer />}
            />
          );
        })}
        <li className={`${s.projAll} flex`} style={fill}>
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${s.tile} ${s.lift} group relative flex w-full flex-col justify-between overflow-hidden p-6 sm:p-7`}
          >
            <GlassLayer />
            <span className={s.orb} aria-hidden="true" />
            <span className="relative flex items-center justify-between">
              <GitHubIcon width={34} height={34} />
              <span className={`${s.faint} transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
                <ArrowIcon />
              </span>
            </span>
            <span className="relative pt-10">
              <span className="block text-xl font-semibold tracking-tight sm:text-2xl">{t.allOnGithub}</span>
              <span className={`${s.muted} mt-1 block font-mono text-sm`}>{githubHandle}</span>
            </span>
          </a>
        </li>
      </ul>
    </section>
  );
}
