import type { Dictionary } from "@/content/cs";
import { Section } from "../section";

export function About({ t }: { t: Dictionary["about"] }) {
  return (
    <Section id="about" title={t.title}>
      <div className="mx-auto max-w-[65ch] space-y-5 text-center text-lg leading-relaxed text-muted">
        {t.paragraphs.map((p) => (
          <p key={p} data-reveal>
            {p}
          </p>
        ))}
      </div>

      <h3 data-reveal className="mt-14 text-center text-xl font-semibold">
        {t.skillsTitle}
      </h3>
      <ul data-reveal className="mx-auto mt-6 flex max-w-[900px] flex-wrap justify-center gap-3">
        {t.skills.map((skill) => (
          <li
            key={skill}
            className="glass gradient-border rounded-full px-4 py-1.5 text-sm transition hover:-translate-y-px"
          >
            {skill}
          </li>
        ))}
      </ul>
    </Section>
  );
}
