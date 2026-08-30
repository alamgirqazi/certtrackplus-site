import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd, publisherSchema, softwareSchema, websiteSchema } from "@/components/json-ld";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, localeMeta, isLocale, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";
import { asset } from "@/lib/base-path";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a7fd1",
  colorScheme: "light",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${t.seo.home.title}`,
      template: `%s | ${site.shortName}`,
    },
    description: t.seo.home.description,
    applicationName: site.name,
    authors: [{ name: site.vendor.name, url: site.vendor.url }],
    creator: site.vendor.name,
    publisher: site.vendor.name,
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    icons: {
      icon: [{ url: asset("/icon.svg"), type: "image/svg+xml" }],
      apple: [{ url: asset("/apple-touch-icon.png"), sizes: "180x180", type: "image/png" }],
    },
    manifest: asset("/site.webmanifest"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typedLocale = locale as Locale;
  const meta = localeMeta[typedLocale];
  const t = getDictionary(typedLocale);

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      className={`${plexSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-paper antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-azure-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          {t.nav.skip}
        </a>
        <JsonLd
          data={[
            publisherSchema(),
            softwareSchema(typedLocale, t.seo.home.description),
            websiteSchema(typedLocale),
          ]}
        />
        <SiteHeader locale={typedLocale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={typedLocale} />
      </body>
    </html>
  );
}
