import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/config";

/**
 * The site is a single page. `routes` still exists as a list because the
 * sitemap, canonicals and hreflang all read from it — and because a second
 * page (pricing, a changelog) should be added here rather than by hand.
 */
export const routes = [{ key: "home", path: "", priority: 1.0, changeFrequency: "monthly" }] as const;

export type RouteKey = (typeof routes)[number]["key"];

const byKey = new Map(routes.map((r) => [r.key, r]));

export function href(locale: Locale, key: RouteKey): string {
  return localePath(locale, byKey.get(key)!.path);
}

/**
 * In-page sections, in document order. Drives the sticky section nav, the
 * mobile menu and the footer index, so a section cannot be added to the page
 * without appearing in the navigation.
 */
export const sections = [
  { id: "problem", label: "The problem" },
  { id: "register", label: "The register" },
  { id: "expiry", label: "Expiry and alerts" },
  { id: "templates", label: "Templates" },
  { id: "reporting", label: "Reporting" },
  { id: "importing", label: "Migration" },
  { id: "security", label: "Security" },
  { id: "demo", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Anchor href for a section, locale-aware so it also works from a 404 page. */
export function sectionHref(locale: Locale, id: SectionId): string {
  return `${localePath(locale, "")}/#${id}`;
}
