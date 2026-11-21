import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { site } from "@/content/site";
import { getDictionary, getLocale } from "@/lib/i18n";
import { defaultLocale, locales } from "@/lib/locales";
import { themeBootScript } from "@/lib/theme";
import { ThemeSync } from "@/components/theme-sync";
import "../globals.css";
import "@/styles/tiles.css";
import "@/styles/layout.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": `/${defaultLocale}`,
      },
    },
    authors: [{ name: site.name, url: site.url }],
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: `/${locale}`,
      siteName: site.name,
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
  };
}

function personJsonLd(description: string, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: `${site.url}/${locale}`,
    description,
    email: site.email,
    address: { "@type": "PostalAddress", addressLocality: "Prague", addressCountry: "CZ" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Unicorn University" },
    sameAs: [site.links.github, site.links.linkedin, site.links.instagram],
  };
}

export const viewport: Viewport = {
  themeColor: "#050506",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd(t.meta.description, locale)).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="font-sans">
        <ThemeSync />
        {children}
        {/* Cookieless page-view counter; the homelab dashboard reads it through the GoatCounter API. */}
        <Script data-goatcounter="https://tpolanek.goatcounter.com/count" src="https://gc.zgo.at/count.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
