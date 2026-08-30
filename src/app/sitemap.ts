import type { MetadataRoute } from "next";

// Required by `output: "export"` — these routes are generated at build time.
export const dynamic = "force-static";
import { routes } from "@/lib/routes";
import { locales, localeMeta, localePath } from "@/i18n/config";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${site.url}${localePath(locale, route.path)}/`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((alt) => [localeMeta[alt].htmlLang, `${site.url}${localePath(alt, route.path)}/`]),
          ),
          "x-default": `${site.url}${localePath("en", route.path)}/`,
        },
      },
    })),
  );
}
