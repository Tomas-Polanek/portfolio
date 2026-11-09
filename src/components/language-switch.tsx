"use client";

import { localeCookie, type Locale } from "@/lib/locales";

export function LanguageSwitch({
  target,
  label,
  short,
  className,
}: {
  target: Locale;
  label: string;
  short: string;
  className?: string;
}) {
  return (
    <a
      href={`/${target}`}
      hrefLang={target}
      lang={target}
      aria-label={label}
      title={label}
      onClick={() => {
        // Remember the choice so "/" redirects to it next time (see src/proxy.ts).
        document.cookie = `${localeCookie}=${target}; path=/; max-age=31536000; samesite=lax`;
      }}
      className={className}
    >
      {short}
    </a>
  );
}
