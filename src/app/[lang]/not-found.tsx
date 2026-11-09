import type { Metadata } from "next";
import { s } from "@/components/classes";
import { GlassLayer } from "@/components/glass-layer";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: `404 | ${t.notFound.title}` };
}

export default async function NotFound() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <div className={s.root}>
      <div className="bs-backdrop" aria-hidden="true" />
      <main className="mx-auto flex min-h-screen w-[calc(100%-2rem)] max-w-[700px] items-center">
        <div className={`${s.tile} w-full px-6 py-16 text-center sm:px-10`}>
          <GlassLayer />
          <p className={`${s.gradText} font-mono text-7xl font-bold sm:text-8xl`}>404</p>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">{t.notFound.heading}</h1>
          <p className={`${s.muted} mx-auto mt-3 max-w-[45ch]`}>{t.notFound.text}</p>
          <a href={`/${locale}`} className={`${s.btnSolid} mt-8`}>
            {t.notFound.back}
          </a>
        </div>
      </main>
    </div>
  );
}
