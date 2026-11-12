import type { ComponentType, SVGProps } from "react";
import { s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { BriefcaseIcon, CapIcon } from "@/components/icons";
import { TileHeading } from "@/components/tile-heading";
import type { Dictionary } from "@/content/cs";

type Entry = Dictionary["education"]["items"][number];

function Timeline({
  entries,
  Icon,
  Heading,
  path = false,
}: {
  entries: readonly Entry[];
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Entry title level: h3 directly under the section's h2, h4 under a sub-heading. */
  Heading: "h3" | "h4";
  /** Study path: a line through the icons, and a status chip on entries that have one. */
  path?: boolean;
}) {
  return (
    <ol className="relative isolate space-y-4">
      {path && (
        <span aria-hidden="true" className="absolute top-5 bottom-5 left-5 -z-10 w-px bg-[var(--line-strong)]" />
      )}
      {entries.map((item) => (
        <li key={item.title} className="flex items-start gap-4">
          <span className={s.iconWell}>
            <Icon />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`${s.chip} ${s.chipMono}`}>{item.period}</span>
              {item.status && (
                <span className={s.chip}>
                  <span className={s.dot} aria-hidden="true" />
                  {item.status}
                </span>
              )}
            </div>
            <Heading className="mt-2 text-lg leading-snug font-semibold tracking-tight">{item.title}</Heading>
            <p className={`${s.muted} text-sm`}>{item.place}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Education({ t }: { t: Dictionary["education"] }) {
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="flex flex-col gap-4 sm:gap-5 xl:col-span-5"
    >
      <div className={`${s.tile} p-6 sm:p-7`}>
        <GlassLayer />
        <TileHeading eyebrow="04" id="education-title" title={t.title} />
        <div className="mt-5">
          <Timeline entries={t.items} Icon={CapIcon} Heading="h3" path />
        </div>
        <h3 className={`${s.eyebrow} mt-7`}>{t.experienceTitle}</h3>
        <div className="mt-3">
          <Timeline entries={t.experience} Icon={BriefcaseIcon} Heading="h4" />
        </div>
      </div>
      <div className={`${s.tile} flex-1 p-6 sm:p-7`}>
        <GlassLayer />
        <h3 className="text-lg font-semibold tracking-tight">{t.learningTitle}</h3>
        <ul className="mt-4 space-y-2.5">
          {t.learning.map((item) => (
            <li key={item} className="flex gap-3 leading-snug">
              <span className={`${s.dot} mt-2`} aria-hidden="true" />
              <span className={s.muted}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
