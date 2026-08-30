import { site } from "@/lib/site";
import type { Locale } from "@/i18n/config";
import { absoluteUrl } from "@/lib/seo";
import type { RouteKey } from "@/lib/routes";

/**
 * Emits JSON-LD. Kept as a component so each page declares only the schema it
 * genuinely represents, rather than one global blob.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema is authored here, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/**
 * The product is the subject of this site; Reispeq is its publisher. Modelled
 * that way rather than as an Organization site, so search engines attribute
 * the software to the company without the two competing for the same entity.
 */
export function softwareSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software`,
    name: site.name,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Compliance and certification management",
    operatingSystem: "Web",
    url: site.url,
    description,
    inLanguage: locale,
    publisher: { "@id": `${site.url}/#publisher` },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Oilfield service companies, drilling contractors and equipment owners",
    },
    featureList: [
      "Equipment certificate register",
      "Certificate expiry alerts",
      "Work unit compliance status",
      "Inspection and QA/QC tracking",
      "Bulk certificate import from Excel",
      "Compliance summary reporting",
      "Role-based access control",
    ],
    offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "USD" },
  };
}

export function publisherSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#publisher`,
    name: site.vendor.name,
    alternateName: site.vendor.shortName,
    url: site.vendor.url,
    email: site.email,
    areaServed: site.regions.map((code) => ({ "@type": "Country", identifier: code })),
    sameAs: [site.social.linkedin, site.vendor.url],
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: locale,
    about: { "@id": `${site.url}/#software` },
    publisher: { "@id": `${site.url}/#publisher` },
  };
}

export function breadcrumbSchema(locale: Locale, trail: { name: string; route: RouteKey }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(locale, item.route),
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
