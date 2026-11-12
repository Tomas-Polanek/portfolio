import { bs, s } from "@/components/classes";
import { CountUp } from "@/components/count-up";
import { GlassLayer } from "@/components/glass-layer";
import { ArrowIcon, GitHubIcon, HomelabGlyph, StarIcon } from "@/components/icons";
import { PiModel } from "@/components/pi-model/pi-model";
import { TileHeading } from "@/components/tile-heading";
import type { Dictionary } from "@/content/cs";
import { getProjects } from "@/lib/projects";
import { site } from "@/content/site";
import { formatMonthYear } from "@/lib/dates";
import { getRepoInfo } from "@/lib/github";
import { countTexts } from "@/lib/count-texts";
import type { Locale } from "@/lib/locales";

function emphasize(text: string) {
  return text.split(/\*\*(.+?)\*\*/).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-semibold text-[color:var(--fg)]">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Top bento grid: about (#about), location, skills, homelab teaser with the 3D model and a
 * GitHub summary.
 */
export async function Overview({ t, locale }: { t: Dictionary; locale: Locale }) {
  const projects = await getProjects(locale, t.projects);
  const infos = await Promise.all(projects.map((p) => getRepoInfo(p.repo, p.owner)));
  const c = t.overview;
  const [, city] = t.education.items[0].place.split(",").map((part) => part.trim());
  const [hardware, ...hardwareSpecs] = t.homelab.specs[0].value.split(" · ");
  const totalStars = infos.reduce((sum, info) => sum + (info?.stars ?? 0), 0);
  const lastPush = infos.reduce<string | null>(
    (latest, info) => (info && (!latest || info.pushedAt > latest) ? info.pushedAt : latest),
    null,
  );
  const githubHandle = site.links.github.replace("https://github.com/", "@");

  return (
    <div className={bs.heroGrid}>
      {/* Location */}
      <div
        className={`${s.tile} ${s.lift} ${s.aLoc} relative flex min-h-44 flex-col overflow-hidden p-5 sm:p-6`}
      >
        <GlassLayer />
        <span className={s.mapGrid} aria-hidden="true" />
        <span className="absolute top-[40%] left-[70%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <span className={`${s.pin} block`} />
        </span>
        <p className={`${s.eyebrow} relative`}>{c.basedIn}</p>
        <p className="relative mt-auto text-4xl font-semibold tracking-tight">{city}</p>
        <p className={`${s.faint} relative mt-1 font-mono text-xs`}>50.08° N · 14.44° E</p>
      </div>

      {/* About */}
      <section id="about" aria-labelledby="about-title" className={`${s.tile} ${s.aAbout} p-6 sm:p-8`}>
        <GlassLayer />
        <TileHeading eyebrow="01" id="about-title" title={t.about.title} />
        <div className="mt-4 space-y-3.5">
          {t.about.paragraphs.map((p) => (
            <p key={p} className={`${s.muted} text-base leading-relaxed sm:text-lg`}>
              {emphasize(p)}
            </p>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section aria-labelledby="skills-title" className={`${s.tile} ${s.aSkills} p-6 sm:p-8`}>
        <GlassLayer />
        <h2 id="skills-title" className="text-lg font-semibold tracking-tight">
          {t.about.skillsTitle}
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {t.about.skills.map((skill) => (
            <li key={skill} className={s.chip}>
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* Homelab teaser: the model is its own button, the text is a stretched link. */}
      <div className={`${s.tile} ${s.lift} ${s.aLab} ${bs.labTile} group relative p-5 sm:p-6`}>
        <GlassLayer />
        <span
          className={`${s.faint} absolute top-5 right-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:top-6 sm:right-6`}
        >
          <ArrowIcon />
        </span>
        <div className={bs.labBody}>
          <PiModel label={c.explodeBuild} />
          <a href="#homelab" className={`${bs.labText} ${bs.labLink}`}>
            <p className={`${s.eyebrow} mt-4`}>{t.nav.homelab}</p>
            <p className="mt-1.5 text-xl font-semibold tracking-tight">{hardware}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {hardwareSpecs.map((spec) => (
                <li key={spec} className={`${s.chip} ${s.chipMono}`}>
                  {spec}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6">
              <ul className="flex gap-1.5" aria-hidden="true">
                {t.homelab.services.map((svc) => (
                  <li key={svc.name} className={`${s.iconWell} size-8! rounded-lg!`}>
                    <HomelabGlyph name={svc.icon} width={15} height={15} />
                  </li>
                ))}
              </ul>
              <p className={`${s.muted} mt-3 text-sm`}>
                <CountUp texts={countTexts(t.homelab.services.length, c.servicesCount)} />
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* GitHub */}
      <a
        href={site.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className={`${s.tile} ${s.lift} ${s.aGh} group flex flex-col p-5 sm:p-6`}
      >
        <GlassLayer />
        <div className="flex items-center justify-between">
          <GitHubIcon width={30} height={30} />
          <span className={`${s.faint} transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5`}>
            <ArrowIcon />
          </span>
        </div>
        <p className="mt-6 font-mono text-sm font-medium">{githubHandle}</p>
        <p className={`${s.muted} text-sm`}>
          <CountUp texts={countTexts(projects.length, c.projectsCount)} />
        </p>
        <p className={`${s.faint} mt-auto flex flex-wrap gap-x-3 pt-4 font-mono text-xs`}>
          {totalStars > 0 && (
            <span className="inline-flex items-center gap-1">
              <StarIcon width={12} height={12} /> <CountUp texts={countTexts(totalStars)} /> {c.totalStars}
            </span>
          )}
          {lastPush && (
            <span>
              {c.lastPush} {formatMonthYear(locale, lastPush)}
            </span>
          )}
        </p>
      </a>
    </div>
  );
}
