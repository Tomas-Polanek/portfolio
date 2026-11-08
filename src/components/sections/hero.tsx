import type { Dictionary } from "@/content/cs";

export function Hero({ t }: { t: Dictionary["hero"] }) {
  return (
    <section
      id="top"
      className="glass gradient-border mt-8 rounded-[18px] px-6 py-16 text-center sm:px-10 sm:py-24"
    >
      <p data-reveal className="font-mono text-sm tracking-wide text-muted">
        {t.greeting}
      </p>
      <h1
        data-reveal
        className="text-gradient text-glow mt-3 text-4xl font-bold tracking-tight sm:text-6xl"
      >
        {t.role}
      </h1>
      {t.lines.map((line) => (
        <p key={line} data-reveal className="mx-auto mt-4 max-w-[60ch] text-lg text-muted">
          {line}
        </p>
      ))}
      <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#projects"
          className="rounded-full bg-linear-to-r from-accent-from to-accent-to px-6 py-3 font-semibold text-white shadow-glass transition hover:-translate-y-0.5 hover:brightness-110"
        >
          {t.ctaProjects}
        </a>
        <a href="#contact" className="nav-link glass gradient-border px-6 py-3 font-semibold">
          {t.ctaContact}
        </a>
      </div>
    </section>
  );
}
