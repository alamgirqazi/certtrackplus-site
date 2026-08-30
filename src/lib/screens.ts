/**
 * Build-time discovery of captured screenshots.
 *
 * SERVER ONLY. This module reads the filesystem, so it must only ever be
 * imported from a server component. It is used by `[locale]/page.tsx`, which
 * renders at build time under `output: "export"`.
 *
 * The point is that there is no flag to flip: run `npm run screens`, and the
 * page picks the screenshot up on the next build. Delete the PNG and it falls
 * back to the drawn panel. Nothing to keep in sync by hand.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

import { asset } from "./base-path";

export type Screen = { src: string; width: number; height: number };

/**
 * Intrinsic pixel size from the PNG header.
 *
 * A PNG is an 8-byte signature followed by the IHDR chunk: 4-byte length,
 * 4-byte type, then width and height as big-endian uint32 at offsets 16 and 20.
 * Reading it here avoids both a dependency and hard-coded dimensions that would
 * silently go wrong the next time the capture viewport changes — and the
 * correct intrinsic ratio is what stops the page jumping as the image loads.
 */
function pngSize(file: string): { width: number; height: number } | null {
  try {
    const buf = readFileSync(file);
    if (buf.length < 24 || buf.toString("ascii", 12, 16) !== "IHDR") return null;
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  } catch {
    return null;
  }
}

/** Returns the screenshot if it has been captured, otherwise null. */
export function screen(name: string): Screen | null {
  const file = path.join(process.cwd(), "public", "screens", `${name}.png`);
  if (!existsSync(file)) return null;
  const size = pngSize(file);
  if (!size) {
    console.warn(`[screens] ${name}.png is not a readable PNG — falling back to the drawn panel`);
    return null;
  }
  // `asset()`, not a bare path: with `images.unoptimized` under a static
  // export, next/image does NOT prefix `src` with basePath, so on a GitHub
  // *project* page (owner.github.io/repo) every screenshot would 404. Verified
  // by building with NEXT_PUBLIC_BASE_PATH set.
  return { src: asset(`/screens/${name}.png`), ...size };
}
