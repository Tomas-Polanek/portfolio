import type { ReactNode } from "react";

export function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-16 sm:py-20">
      <div data-reveal className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mx-auto mt-3 max-w-[60ch] text-muted">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
