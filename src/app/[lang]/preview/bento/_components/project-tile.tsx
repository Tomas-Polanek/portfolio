import Image from "next/image";
import type { CSSProperties } from "react";
import type { Dictionary } from "@/content/cs";
import { ExternalIcon, ForkIcon, GitHubIcon, StarIcon } from "@/components/icons";
import type { RepoInfo } from "@/lib/github";
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

function initialsOf(title: string) {
  const words = title.split(/[\s–-]+/).filter((w) => /\p{L}/u.test(w));
  const parts = words.length > 1 ? words : title.split(/(?=\p{Lu})/u);
  return parts
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function ProjectTile({
  index,
  wide,
  title,
  description,
  tags,
  codeUrl,
  image,
  info,
  updated,
  t,
}: {
  index: number;
  wide: boolean;
  title: string;
  description: string;
  tags: readonly string[];
  codeUrl: string;
  image: string | undefined;
  info: RepoInfo | null;
  updated: string | null;
  t: Dictionary["projects"];
}) {
  const [cx, cy] = focalPoints[index % focalPoints.length];
  const coverStyle = { "--cx": cx, "--cy": cy } as CSSProperties;

  return (
    <li className={`${s.tile} ${s.lift} ${s.project} ${wide ? s.projWide : s.projNormal}`}>
      <article className={`${s.projectInner} ${wide ? s.wideInner : ""}`}>
        <div className={s.cover} style={coverStyle}>
          {image ? (
            <Image
              src={image}
              alt={`${title} – ${t.screenshot}`}
              fill
              sizes={wide ? "(min-width: 1024px) 460px, (min-width: 640px) 100vw, 100vw" : "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"}
              className={s.coverImage}
            />
          ) : (
            <>
              <span className={s.initials} aria-hidden="true">
                {initialsOf(title)}
              </span>
              {info?.language && (
                <span className={s.coverLang} aria-hidden="true">
                  <span className={s.dot} />
                  {info.language}
                </span>
              )}
            </>
          )}
        </div>

        <div className={s.projectBody}>
          <h3 className={`font-semibold tracking-tight ${wide ? "text-xl sm:text-2xl" : "text-lg"}`}>{title}</h3>

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
