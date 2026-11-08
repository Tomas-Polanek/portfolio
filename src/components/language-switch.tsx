"use client";

import { localeCookie, type Locale } from "@/lib/locales";

export function LanguageSwitch({ target, label, short }: { target: Locale; label: string; short: string }) {
  return (
    <a
      href={`/${target}`}
      hrefLang={target}
      aria-label={label}
      title={label}
      onClick={() => {
        // Remember the choice so "/" redirects to it next time (see src/proxy.ts).
        document.cookie = `${localeCookie}=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className="glass inline-flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition hover:-translate-y-px hover:shadow-glass"
    >
      {short}
    </a>
  );
}
