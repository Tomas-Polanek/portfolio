export const locales = ["cs", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Cookie set by the language switch; the proxy prefers it over Accept-Language. */
export const localeCookie = "lang";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
