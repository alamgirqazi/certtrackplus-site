import type { NextConfig } from "next";
import { normaliseBasePath } from "./src/lib/base-path";

/**
 * Static export, same as the Reispeq corporate site: the marketing site must be
 * hostable on any static origin while the application itself moves to
 * app.certitrackplus.com. No Node runtime is required to serve this.
 */
const basePath = normaliseBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
};

export default nextConfig;
