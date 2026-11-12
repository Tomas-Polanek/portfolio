import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site } from "@/content/site";
import { getDictionary, getLocale } from "@/lib/i18n";
import { locales } from "@/lib/locales";
import { themeBootScript } from "@/lib/theme";
import { MagicCursor } from "@/components/magic-cursor";
import { ThemeSync } from "@/components/theme-sync";
import "../globals.css";
import "@/styles/tiles.css";
import "@/styles/magic-cursor.css";
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
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: `/${locale}`,
      siteName: site.name,
      locale: locale === "cs" ? "cs_CZ" : "en_US",
      type: "website",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#050506",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="font-sans">
        <MagicCursor />
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
