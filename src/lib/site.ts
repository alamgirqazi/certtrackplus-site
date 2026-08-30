/**
 * Single source of truth for product facts that appear in metadata, structured
 * data, the header CTA and the footer.
 *
 * `app.url` is the ONLY place the application's hostname is written. It points
 * at the apex for now, because the application still lives there. When the
 * cutover to app.certitrackplus.com happens, change it here and every sign-in
 * link on the site follows.
 */
function resolveSiteUrl(value: string | undefined, fallback: string): string {
  const raw = value?.trim();
  if (!raw) return fallback;

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(candidate);
    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path}`;
  } catch {
    console.warn(`[site] NEXT_PUBLIC_SITE_URL is not a valid URL (${raw}); falling back to ${fallback}`);
    return fallback;
  }
}

export const site = {
  name: "CertiTrack Plus",
  shortName: "CertiTrack Plus",
  domain: "certitrackplus.com",
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, "https://certitrackplus.com"),
  tagline: "Certification and compliance control for oilfield equipment",
  email: "sales@reispeq.com",
  supportEmail: "support@reispeq.com",
  /** Where the application itself currently lives. See the note above. */
  app: {
    url: "https://certitrackplus.com",
    label: "certitrackplus.com",
  },
  vendor: {
    name: "Reispeq Technologies LLC",
    shortName: "Reispeq",
    url: "https://www.reispeq.com",
    productPage: "https://www.reispeq.com/en/certitrack-plus/",
  },
  regions: ["OM", "AE", "SA", "QA", "KW", "BH", "IQ"],
  social: {
    linkedin: "https://www.linkedin.com/company/reispeq",
  },
} as const;

export type SiteConfig = typeof site;
