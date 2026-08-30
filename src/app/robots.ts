import type { MetadataRoute } from "next";

// Required by `output: "export"` — these routes are generated at build time.
export const dynamic = "force-static";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
