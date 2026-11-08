import { site } from "@/content/site";
import type { Dictionary } from "@/content/cs";
import { HomelabGlyph } from "../icons";
import { Section } from "../section";

export function Homelab({ t }: { t: Dictionary["homelab"] }) {
  return (
    <Section id="homelab" title={t.title} subtitle={t.intro}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <h3 data-reveal className="mb-4 text-lg font-semibold">
            {t.specsTitle}
          </h3>
          {/* Terminal-styled setup card */}
          <div data-reveal className="glass gradient-border overflow-hidden rounded-2xl">
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-muted">{site.homelabPrompt}</span>
            </div>
            <dl className="space-y-4 p-6 font-mono text-sm">
              {t.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[18px_1fr] gap-x-3">
                  <dt className="col-span-2 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
                    <HomelabGlyph name={spec.icon} className="shrink-0 text-accent-to" width={18} height={18} />
                    {spec.label}
                  </dt>
                  <dd className="col-start-2 mt-0.5">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div>
          <h3 data-reveal className="mb-4 text-lg font-semibold">
            {t.servicesTitle}
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {t.services.map((service) => (
              <li key={service.name} data-reveal className="glass gradient-border lift rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-accent-from/20 to-accent-to/20 text-accent-to">
                    <HomelabGlyph name={service.icon} width={18} height={18} />
                  </span>
                  <h4 className="font-semibold">{service.name}</h4>
                </div>
                <p className="mt-3 text-sm text-muted">{service.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div data-reveal className="glass gradient-border mt-6 rounded-2xl p-6">
        <h3 className="text-lg font-semibold">{t.learnedTitle}</h3>
        <ul className="mt-4 grid gap-x-6 gap-y-2 text-muted sm:grid-cols-2">
          {t.learned.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-gradient font-mono font-bold">›</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
