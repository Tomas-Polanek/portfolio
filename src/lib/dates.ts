import type { Locale } from "./locales";

const formatters = new Map<Locale, Intl.DateTimeFormat>();

/** "11/2026" / "11/2026" style month + year of an ISO timestamp (UTC, so server and client agree). */
export function formatMonthYear(locale: Locale, iso: string) {
  let formatter = formatters.get(locale);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, { month: "numeric", year: "numeric", timeZone: "UTC" });
    formatters.set(locale, formatter);
  }
  return formatter.format(new Date(iso));
}
