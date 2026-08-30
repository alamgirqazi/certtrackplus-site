/**
 * The corporate site (reispeq.com) ships English and Arabic. This site is
 * built on the same locale-segmented routing so Arabic is a dictionary drop-in
 * rather than a restructure — add "ar" here and an `ar.ts` dictionary and every
 * route, canonical, hreflang and sitemap entry follows.
 */
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeMeta: Record<
  Locale,
  { label: string; englishLabel: string; dir: "ltr" | "rtl"; htmlLang: string; ogLocale: string }
> = {
  en: { label: "English", englishLabel: "English", dir: "ltr", htmlLang: "en", ogLocale: "en_US" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Prefix a route with its locale segment. `path` must start with "/" or be "". */
export function localePath(locale: Locale, path = ""): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}
