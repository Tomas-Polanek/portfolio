import type { ReactNode } from "react";
import type { Dictionary } from "@/content/cs";
import { ExternalIcon, ForkIcon, GitHubIcon, ProjectGlyph, StarIcon } from "@/components/icons";
import type { RepoInfo } from "@/lib/github";
import type { Project } from "@/lib/projects";
import { s } from "@/components/classes";
import { ScreenshotDialog } from "./screenshot-dialog";

export function ProjectTile({
  project: { title, description, icon, tags, image, inProgress, team },
  codeUrl,
  info,
  updated,
  t,
  layer,
}: {
  /** Screenshot opened by the "Preview" button (no button without one), badges and texts. */
  project: Project;
  codeUrl: string;
  info: RepoInfo | null;
  updated: string | null;
  t: Dictionary["projects"];
  /** Optional surface rendered behind the content (e.g. a glass layer). */
  layer?: ReactNode;
}) {
  return (
    <li className={`${s.tile} ${s.lift} ${s.project}`}>
      {layer}
      <article className={s.projectInner}>
        <div className="flex items-start justify-between gap-3">
          <span className={s.iconWell}>
            <ProjectGlyph name={icon} />
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {inProgress && (
              <span className={`${s.chip} ${s.chipMono}`}>
                <span className={s.wipDot} aria-hidden="true" />
                {t.wip}
              </span>
            )}
            {info?.language && (
              <span className={`${s.chip} ${s.chipMono}`}>
                <span className={s.dot} aria-hidden="true" />
                {info.language}
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>

        {team && <p className={`${s.faint} mt-1.5 text-xs`}>{t.teamProject}</p>}

        {info?.forkOf && (
          <p className={`${s.faint} mt-1.5 inline-flex items-center gap-1.5 text-xs`}>
            <ForkIcon width={14} height={14} /> {t.forkOf} {info.forkOf}
          </p>
        )}

        <p className={`${s.muted} mt-2.5 text-[0.93rem] leading-relaxed`}>{description}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <li key={tag} className={`${s.chip} ${s.chipMono}`}>
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-5">
          <div className="flex flex-wrap gap-2">
            <a href={codeUrl} target="_blank" rel="noopener noreferrer" className={`${s.chip} font-medium`}>
              <GitHubIcon width={14} height={14} /> {t.code}
            </a>
            {info?.homepage && (
              <a href={info.homepage} target="_blank" rel="noopener noreferrer" className={`${s.chip} font-medium`}>
                {t.live} <ExternalIcon width={13} height={13} />
              </a>
            )}
            {image && (
              <ScreenshotDialog
                image={image}
                alt={`${title} – ${t.screenshot}`}
                title={title}
                description={description}
                label={t.preview}
                closeLabel={t.closeShot}
                className={`${s.chip} cursor-pointer font-medium`}
              />
            )}
          </div>
          {info && (
            <p className={`${s.faint} ml-auto flex items-center gap-3 font-mono text-[0.72rem]`}>
              {info.stars > 0 && (
                <span className="inline-flex items-center gap-1" title={t.stars}>
                  <StarIcon width={12} height={12} />
                  <span className="sr-only">{t.stars}:</span> {info.stars}
                </span>
              )}
              {updated && (
                <span>
                  {t.updated} {updated}
                </span>
              )}
            </p>
          )}
        </div>
      </article>
    </li>
  );
}
