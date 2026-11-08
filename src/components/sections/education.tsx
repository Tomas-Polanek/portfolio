import type { Dictionary } from "@/content/cs";
import { Section } from "../section";

export function Education({ t }: { t: Dictionary["education"] }) {
  return (
    <Section id="education" title={t.title}>
      <div className="mx-auto grid max-w-[900px] gap-6 md:grid-cols-2">
        <ol data-reveal className="relative space-y-6 border-l border-line pl-6">
          {t.items.map((item) => (
            <li key={item.title} className="relative">
              <span className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-linear-to-r from-accent-from to-accent-to shadow-[0_0_12px_var(--accent-b)]" />
              <p className="font-mono text-xs uppercase tracking-wider text-muted">{item.period}</p>
              <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted">{item.place}</p>
            </li>
          ))}
        </ol>

        <div data-reveal className="glass gradient-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold">{t.learningTitle}</h3>
          <ul className="mt-4 space-y-2 text-muted">
            {t.learning.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-gradient font-mono font-bold">›</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
