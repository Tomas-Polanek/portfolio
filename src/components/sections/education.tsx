import { s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { CapIcon } from "@/components/icons";
import type { Dictionary } from "@/content/cs";

export function Education({ t }: { t: Dictionary["education"] }) {
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="flex flex-col gap-4 sm:gap-5 xl:col-span-5"
    >
      <div className={`${s.tile} p-6 sm:p-7`}>
        <GlassLayer />
        <p className={s.eyebrow}>
          <span className={s.dot} /> 04
        </p>
        <h2 id="education-title" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {t.title}
        </h2>
        <ol className="mt-5 space-y-4">
          {t.items.map((item) => (
            <li key={item.title} className="flex items-start gap-4">
              <span className={s.iconWell}>
                <CapIcon />
              </span>
              <div>
                <span className={`${s.chip} ${s.chipMono}`}>{item.period}</span>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className={`${s.muted} text-sm`}>{item.place}</p>
              </div>
            </li>
          ))}
        </ol>
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
