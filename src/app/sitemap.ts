import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { defaultLocale, locales } from "@/lib/locales";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}`])),
    "x-default": `${site.url}/${defaultLocale}`,
  };
  return locales.map((l) => ({
    url: `${site.url}/${l}`,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
