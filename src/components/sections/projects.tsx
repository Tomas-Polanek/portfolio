import { bs, s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { ArrowIcon, GitHubIcon } from "@/components/icons";
import { ProjectTile } from "@/components/projects/project-tile";
import { SectionHeader } from "@/components/section-header";
import type { Dictionary } from "@/content/cs";
import { projectImages, projects } from "@/content/projects";
import { site } from "@/content/site";
import { formatMonthYear } from "@/lib/dates";
import { getRepoInfo } from "@/lib/github";
import type { Locale } from "@/lib/locales";

export async function Projects({ t, nav, locale }: { t: Dictionary["projects"]; nav: string; locale: Locale }) {
  const infos = await Promise.all(projects.map((p) => getRepoInfo(p.repo, p.owner)));
  const githubHandle = site.links.github.replace("https://github.com/", "@");

  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-20 sm:pt-28">
      <SectionHeader eyebrow={`02 · ${nav}`} title={t.title} intro={t.subtitle} id="projects-title" />
      <ul className={bs.projGrid}>
        {projects.map(({ repo, owner, icon, tags, teamInProgress }, i) => {
          const info = infos[i];
          const { title, description } = t.items[repo];
          return (
            <ProjectTile
              key={repo}
              title={title}
              description={description}
              icon={icon}
              tags={tags}
              codeUrl={info?.url ?? `https://github.com/${owner ?? site.githubUser}/${repo}`}
              image={projectImages[repo]}
              inProgress={teamInProgress === true}
              info={info}
              updated={info ? formatMonthYear(locale, info.pushedAt) : null}
              t={t}
              layer={<GlassLayer />}
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
