import Image from "next/image";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/content/cs";
import { ExternalIcon, ForkIcon, GitHubIcon, StarIcon } from "@/components/icons";
import type { RepoInfo } from "@/lib/github";
import type { getCopy } from "./copy";
import { CoverDialog } from "./cover-dialog";
import { s } from "./styles";

/** Cover gradient focal points, varied per tile so generated covers don't look cloned. */
const focalPoints = [
  ["18%", "12%"],
  ["82%", "18%"],
  ["25%", "85%"],
  ["70%", "75%"],
  ["50%", "10%"],
  ["12%", "55%"],
] as const;

/** Shared cover for projects without a screenshot: a wireframe app window, same sketch style as the Pi. */
function PlaceholderArt() {
  return (
    <svg className={s.placeholder} viewBox="0 0 160 110" aria-hidden="true">
      <defs>
        <linearGradient id="bn-placeholder-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--brand-a)" />
          <stop offset="1" stopColor="var(--brand-b)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#bn-placeholder-grad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="8" width="144" height="94" rx="9" />
        <path d="M8 26h144" />
        <circle cx="20" cy="17" r="2.6" />
        <circle cx="29" cy="17" r="2.6" />
        <circle cx="38" cy="17" r="2.6" />
        <path d="M64 50l-14 14 14 14M96 50l14 14-14 14M86 44l-12 40" strokeWidth="2.4" />
      </g>
    </svg>
  );
}

export function ProjectTile({
  index,
  wide,
  title,
  description,
  tags,
  codeUrl,
  image,
  inProgress,
  info,
  updated,
  t,
  ui,
}: {
  index: number;
  wide: boolean;
  title: string;
  description: string;
  tags: readonly string[];
  codeUrl: string;
  image: string | undefined;
  /** Team project still in development: "Work in progress" badge on the cover. */
  inProgress: boolean;
  info: RepoInfo | null;
  updated: string | null;
  t: Dictionary["projects"];
  ui: ReturnType<typeof getCopy>;
}) {
  const [cx, cy] = focalPoints[index % focalPoints.length];
  const coverStyle = { "--cx": cx, "--cy": cy } as CSSProperties;

  return (
    <li className={`${s.tile} ${s.lift} ${s.project} ${wide ? s.projWide : s.projNormal}`}>
      <article className={`${s.projectInner} ${wide ? s.wideInner : ""}`}>
        <div className={s.cover} style={coverStyle}>
          {image ? (
            <CoverDialog
              image={image}
              alt={`${title} – ${t.screenshot}`}
              title={title}
              description={description}
              openLabel={ui.openShot}
              closeLabel={ui.closeShot}
            >
              <Image
                src={image}
                alt={`${title} – ${t.screenshot}`}
                fill
                sizes={wide ? "(min-width: 1024px) 460px, (min-width: 640px) 100vw, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
                className={s.coverImage}
              />
              <span className={s.zoomHint} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="15" height="15">
                  <path
                    d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </CoverDialog>
          ) : (
            <>
              <PlaceholderArt />
              {info?.language && (
                <span className={s.coverLang} aria-hidden="true">
                  <span className={s.dot} />
                  {info.language}
                </span>
              )}
            </>
          )}
          {inProgress && (
            <span className={s.wip}>
              <span className={s.wipDot} aria-hidden="true" />
              {ui.wip}
            </span>
          )}
        </div>

        <div className={s.projectBody}>
          <h3 className={`font-semibold tracking-tight ${wide ? "text-xl sm:text-2xl" : "text-lg"}`}>{title}</h3>

          {inProgress && <p className={`${s.faint} mt-1.5 text-xs`}>{ui.teamProject}</p>}

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
            <div className="flex gap-2">
              <a href={codeUrl} target="_blank" rel="noopener noreferrer" className={`${s.chip} font-medium`}>
                <GitHubIcon width={14} height={14} /> {t.code}
              </a>
              {info?.homepage && (
                <a href={info.homepage} target="_blank" rel="noopener noreferrer" className={`${s.chip} font-medium`}>
                  {t.live} <ExternalIcon width={13} height={13} />
                </a>
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
        </div>
      </article>
    </li>
  );
}
