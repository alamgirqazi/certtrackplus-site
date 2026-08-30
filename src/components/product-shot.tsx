import Image from "next/image";

/**
 * A real screenshot of the application, framed as an application window.
 *
 * Explicit `width`/`height` are required, not optional: without an intrinsic
 * ratio the browser cannot reserve space before the PNG arrives and the whole
 * section below it jumps on load. They are the *capture* dimensions from
 * `scripts/capture-screens.mjs` (CSS pixels, before the 2× device scale), not
 * the display size — the image is rendered fluid via `w-full h-auto`.
 *
 * `unoptimized` is implied by the static export: `next.config.ts` sets
 * `images.unoptimized`, so these are served exactly as captured. Keep the PNGs
 * lean.
 */
export function ProductShot({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure className="u-panel overflow-hidden">
      {/* Window chrome: enough to read as an application, not a full fake
          browser with a spoofed URL bar. */}
      <div aria-hidden className="flex items-center gap-1.5 border-b border-line bg-surface px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
      </div>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(min-width: 1024px) 62vw, 100vw"
        className="h-auto w-full"
      />
      {caption ? (
        <figcaption className="border-t border-line-soft bg-surface px-4 py-2.5 text-[11.5px] leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
