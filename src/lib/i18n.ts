import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { cs } from "@/content/cs";
import { en } from "@/content/en";
import { hasLocale, type Locale } from "./locales";

const dictionaries = { cs, en } as const;

export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getDictionary() {
  return dictionaries[await getLocale()];
}
