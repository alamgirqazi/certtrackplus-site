import type { SVGProps } from "react";

/**
 * One stroke-drawn icon set, on a 24×24 grid at 1.6 stroke.
 *
 * Deliberately drawn here rather than pulled from a library: the set is small,
 * every glyph is a literal object from the domain (a certificate, a rig, a
 * spreadsheet) rather than a generic abstraction, and matching the 1.6 stroke
 * to the status icons in `data.tsx` keeps the page reading as one drawing.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

/** A certificate: sheet, ruled lines, seal on the corner. */
export function CertificateIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 3.5h9.5L19 8v8.5" />
      <path d="M14 3.5V8h5" />
      <path d="M5 3.5v17h7" />
      <path d="M8 9.5h3M8 13h6M8 16.5h4" />
      <circle cx="17" cy="18" r="3" />
      <path d="M15.4 20.4 15 23l2-1 2 1-.4-2.6" />
    </Icon>
  );
}

/** A clock with the hand past the hour: time running out. */
export function ExpiryIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 8.5V13l3 2" />
      <path d="M9 2.5h6" />
      <path d="M12 2.5V5" />
    </Icon>
  );
}

/** A template: a fixed frame with slots, one of them still empty. */
export function TemplateIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3.5" width="18" height="17" rx="2" />
      <path d="M3 8.5h18" />
      <path d="M8.5 8.5v12" />
      <path d="M11.5 12h6M11.5 16h3.5" />
    </Icon>
  );
}

/** Bars on a baseline. */
export function ReportIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 20.5h17" />
      <path d="M7 20.5V13M12 20.5V6.5M17 20.5v-5" />
    </Icon>
  );
}

/** A spreadsheet with an arrow lifting out of it. */
export function ImportIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13.5 3.5H5.5a1.5 1.5 0 0 0-1.5 1.5v14a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-4" />
      <path d="M4 8.5h12M4 13.5h8" />
      <path d="M10 8.5v12" />
      <path d="M19 3.5v8m0-8-2.5 2.5M19 3.5 21.5 6" />
    </Icon>
  );
}

/** Stacked database platters — the per-tenant isolation claim, literally. */
export function DatabaseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
      <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
      <path d="M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
    </Icon>
  );
}

/** A hard hat: the people on the other side of the record. */
export function CrewIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 16.5h17" />
      <path d="M5.5 16.5v-2a6.5 6.5 0 0 1 13 0v2" />
      <path d="M10 8.4V5.5h4v2.9" />
      <path d="M3.5 16.5v1.5a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-1.5" />
    </Icon>
  );
}

/** A derrick — the asset the certificates are attached to. */
export function RigIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 20.5 12 3l4 17.5" />
      <path d="M9.4 13.5h5.2M8.8 16.5h6.4M10 10.5h4" />
      <path d="M4.5 20.5h15" />
    </Icon>
  );
}

/** A warning triangle. */
export function AlertIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v3.5M12 16.4v.1" />
    </Icon>
  );
}

/** An envelope. */
export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.6 7 8.4 6 8.4-6" />
    </Icon>
  );
}
