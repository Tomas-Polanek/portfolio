import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: `404 | ${t.notFound.title}` };
}

export default async function NotFound() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <main className="mx-auto flex min-h-screen w-[calc(100%-2rem)] max-w-[700px] items-center">
      <div className="glass gradient-border w-full rounded-[18px] px-6 py-16 text-center sm:px-10">
        <p className="text-gradient text-glow font-mono text-7xl font-bold sm:text-8xl">404</p>
        <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">{t.notFound.heading}</h1>
        <p className="mx-auto mt-3 max-w-[45ch] text-muted">{t.notFound.text}</p>
        <a
          href={`/${locale}`}
          className="mt-8 inline-block rounded-full bg-linear-to-r from-accent-from to-accent-to px-6 py-3 font-semibold text-white shadow-glass transition hover:-translate-y-0.5 hover:brightness-110"
        >
          {t.notFound.back}
        </a>
      </div>
    </main>
  );
}
