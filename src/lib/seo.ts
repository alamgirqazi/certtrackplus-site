import type { Metadata } from "next";
import { site } from "./site";
import { localeMeta, locales, localePath, type Locale } from "@/i18n/config";
import { routes, type RouteKey } from "./routes";

const pathFor = (key: RouteKey) => routes.find((r) => r.key === key)!.path;

/** Absolute URL for a locale + route, used for canonical, hreflang and JSON-LD. */
export function absoluteUrl(locale: Locale, key: RouteKey): string {
  // `trailingSlash: true` in next.config means the exported page is served at
  // /en/platform/ — canonical, hreflang and sitemap must agree with that.
  return `${site.url}${localePath(locale, pathFor(key))}/`;
}

export function buildMetadata({
  locale,
  route,
  title,
  description,
  keywords,
}: {
  locale: Locale;
  route: RouteKey;
  title: string;
  description: string;
  keywords?: string[];
}): Metadata {
  const canonical = absoluteUrl(locale, route);

  /**
   * Two things the layout's `title.template` does not do for us.
   *
   * 1. The template is declared in `[locale]/layout.tsx` and does not apply to
   *    the page in that *same* segment — so the home page would ship a
   *    <title> with no brand in it at all. It is the one page that most needs
   *    the brand, so it sets an absolute title instead.
   * 2. `template` only rewrites the document title. OpenGraph and Twitter
   *    titles are separate fields, and a link shared to LinkedIn or WhatsApp
   *    would otherwise read just "Platform". Social titles carry the brand
   *    explicitly.
   */
  const isHome = route === "home";
  const brandedTitle = `${site.name} — ${title}`;
  const socialTitle = isHome ? brandedTitle : `${title} | ${site.shortName}`;
  // A committed asset rather than a generated route: static hosts serve
  // extension-less files as application/octet-stream, which breaks previews.
  const ogImage = {
    url: `${site.url}/og.png`,
    width: 1200,
    height: 630,
    alt: `${site.name} — ${title}`,
  };

  const languages: Record<string, string> = {};
  for (const code of locales) {
    languages[localeMeta[code].htmlLang] = absoluteUrl(code, route);
  }
  languages["x-default"] = absoluteUrl("en", route);

  return {
    title: isHome ? { absolute: brandedTitle } : title,
    description,
    keywords,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: socialTitle,
      description,
      url: canonical,
      locale: localeMeta[locale].ogLocale,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
  };
}

/** Keyword sets are deliberately regional — this product sells into the GCC. */
export const keywordSets: Record<RouteKey, string[]> = {
  home: [
    "equipment certification tracking software",
    "certificate expiry alerts oilfield",
    "compliance management software GCC",
    "inspection management system Oman",
    "rig equipment certification software UAE",
    "certificate register software",
    "bulk certificate import Excel",
    "work unit compliance tracking",
    "CertiTrack Plus",
  ],
};
