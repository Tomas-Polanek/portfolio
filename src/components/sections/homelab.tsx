import { s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { CheckIcon, HomelabGlyph } from "@/components/icons";
import { SectionHeader } from "@/components/section-header";
import type { Dictionary } from "@/content/cs";
import { site } from "@/content/site";

export function Homelab({
  t,
  nav,
  servicesCount,
}: {
  t: Dictionary["homelab"];
  nav: string;
  servicesCount: Dictionary["overview"]["servicesCount"];
}) {
  return (
    <section id="homelab" aria-labelledby="homelab-title" className="pt-20 sm:pt-28">
      <SectionHeader eyebrow={`03 · ${nav}`} title={t.title} intro={t.intro} id="homelab-title" />
      <div className="grid gap-4 sm:gap-5">
        <div className="flex flex-col gap-4 sm:gap-5 xl:grid xl:grid-cols-2">
          {/* Specs as a terminal */}
          <div className={`${s.tile} overflow-hidden`}>
            <GlassLayer />
            <div className={s.terminalBar} aria-hidden="true">
              <span />
              <span />
              <span />
              <span className="ml-2 truncate">{site.homelabPrompt}</span>
            </div>
            <div className="p-5 sm:p-7">
              <p className="font-mono text-xs sm:text-sm" aria-hidden="true">
                <span className={s.prompt}>{site.homelabPrompt}$</span>{" "}
                <span className={s.muted}>neofetch --short</span>
              </p>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{t.specsTitle}</h3>
              <dl className="mt-3">
                {t.specs.map((spec) => (
                  <div key={spec.label} className={`${s.specRow} flex items-start gap-3.5 py-3`}>
                    <span className={`${s.iconWell} size-9!`}>
                      <HomelabGlyph name={spec.icon} width={17} height={17} />
                    </span>
                    <div className="min-w-0">
                      <dt className={`${s.eyebrow} text-[0.68rem]!`}>{spec.label}</dt>
                      <dd className="mt-0.5 text-[0.95rem] leading-snug">{spec.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* What it taught me */}
          <div className={`${s.tile} flex-1 p-5 sm:p-7`}>
            <GlassLayer />
            <h3 className="text-lg font-semibold tracking-tight">{t.learnedTitle}</h3>
            <ul className="mt-4 space-y-3">
              {t.learned.map((item) => (
                <li key={item} className="flex gap-3 leading-snug">
                  <span className="mt-0.5 shrink-0 text-(--brand-text-b)">
                    <CheckIcon />
                  </span>
                  <span className={s.muted}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Services */}
        <div className="flex flex-col">
          <div className="flex items-baseline justify-between gap-3 px-1 pb-4 lg:pt-1">
            <h3 className="text-lg font-semibold tracking-tight">{t.servicesTitle}</h3>
            <span className={`${s.chip} ${s.chipMono}`}>{servicesCount(t.services.length)}</span>
          </div>
          <ul className="grid flex-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {t.services.map((svc) => (
              <li key={svc.name} className={`${s.tile} ${s.lift} flex flex-col p-5`}>
                {/* Small repeated tiles: cheap frosted glass instead of refraction. */}
                <GlassLayer liquid={false} />
                <span className={s.iconWell}>
                  <HomelabGlyph name={svc.icon} />
                </span>
                <h4 className="mt-4 font-semibold tracking-tight">{svc.name}</h4>
                <p className={`${s.muted} mt-1 text-sm leading-relaxed`}>{svc.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
