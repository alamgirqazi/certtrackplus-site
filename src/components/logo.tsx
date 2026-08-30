import type { SVGProps } from "react";

/**
 * Mark geometry, drawn once on a 40×40 grid and reused by the React logo, the
 * favicon and the social card.
 *
 * The form is a certificate seal read as a compliance state: a rounded tile
 * whose upper-right corner is opened by the "+" arm, with a check struck
 * through the middle. Every path carries an explicit `fill="none"` because
 * Satori (next/og) does not inherit fill from the parent <svg> and would
 * otherwise flood the tile solid.
 */
export const MARK = {
  /** Open tile — the right edge is omitted; the "+" vertical arm closes it. */
  tile:
    "M33 15.6A7.4 7.4 0 0 0 25.6 8.2L14.4 8.2A7.4 7.4 0 0 0 7 15.6L7 28.4A7.4 7.4 0 0 0 14.4 35.8L25.6 35.8A7.4 7.4 0 0 0 33 28.4",
  check: "M14.2 22.1 18.9 26.7 27.4 17.6",
  plus: ["M33 14.6L33 24.2", "M28.2 19.4L37.8 19.4"],
  stroke: 3.2,
} as const;

export function CertiTrackMark({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {[MARK.tile, MARK.check, ...MARK.plus].map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={MARK.stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

export function CertiTrackLogo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  /** `dark` = azure/navy on light surfaces. `light` = white on navy surfaces. */
  tone?: "dark" | "light";
}) {
  const markColor = tone === "light" ? "text-white" : "text-azure-400";
  const nameColor = tone === "light" ? "text-white" : "text-brand-700";
  const subColor = tone === "light" ? "text-white/55" : "text-muted";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CertiTrackMark className={`h-9 w-9 shrink-0 ${markColor}`} />
      <span className="flex flex-col leading-none">
        <span className={`text-[15.5px] font-semibold tracking-[0.03em] ${nameColor}`}>
          CertiTrack<span className={tone === "light" ? "text-white/70" : "text-azure-400"}>&nbsp;Plus</span>
        </span>
        <span className={`mt-[4px] text-[8.5px] font-medium tracking-[0.22em] uppercase ${subColor}`}>
          by Reispeq
        </span>
      </span>
    </span>
  );
}
