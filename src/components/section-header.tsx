import { s } from "@/components/classes";

/** Numbered section heading: "02 · Projects" eyebrow, title and optional intro. */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** id of the <h2>, for the section's aria-labelledby. */
  id: string;
}) {
  return (
    <div className="mb-6 max-w-2xl sm:mb-8">
      <p className={s.eyebrow}>
        <span className={s.dot} /> {eyebrow}
      </p>
      <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {intro && <p className={`${s.muted} mt-3 text-base leading-relaxed sm:text-lg`}>{intro}</p>}
    </div>
  );
}
