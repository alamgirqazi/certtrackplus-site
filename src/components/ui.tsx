import Link from "next/link";
import type { ReactNode } from "react";

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={`h-3.5 w-3.5 ${className}`}>
      <path
        d="M4 10h11m0 0-4.2-4.2M15 10l-4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={`h-2.5 w-2.5 ${className}`}>
      <path d="M4 2h6v6M10 2 2.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const buttonBase =
  "group inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-[13.5px] font-semibold transition-colors duration-150";

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
}) {
  const styles = {
    primary: "bg-azure-500 text-white hover:bg-azure-600",
    secondary: "border border-line bg-white text-ink hover:border-azure-300 hover:text-azure-600",
  };
  const props = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <Link href={href} className={`${buttonBase} ${styles[variant]} ${className}`} {...props}>
      {children}
      {external ? <ExternalIcon /> : <ArrowIcon className="transition-transform duration-150 group-hover:translate-x-0.5" />}
    </Link>
  );
}

/**
 * Section header: an icon, the heading, and a short lead.
 *
 * No numbered mono eyebrow above the title. That pattern (`01 —— THE PROBLEM`
 * in tracked-out uppercase) is the most tired convention in current template
 * design and it adds no information the heading is not already carrying — the
 * icon does the categorising job faster and without the extra line of type.
 */
export function SectionHead({
  icon: IconGlyph,
  title,
  lead,
}: {
  icon: (props: React.SVGProps<SVGSVGElement>) => ReactNode;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-azure-50 text-azure-600">
        <IconGlyph className="h-5 w-5" />
      </span>
      <h2 className="u-balance mt-4 text-[1.6rem] leading-[1.15] font-semibold text-ink sm:text-[1.9rem]">
        {title}
      </h2>
      {lead ? <p className="u-pretty mt-3.5 text-[15.5px] leading-relaxed text-ink-soft">{lead}</p> : null}
    </div>
  );
}

export function Section({
  children,
  id,
  tone = "paper",
  className = "",
}: {
  children: ReactNode;
  id?: string;
  tone?: "paper" | "surface";
  className?: string;
}) {
  return (
    <section id={id} className={`${tone === "surface" ? "bg-surface" : "bg-paper"} border-t border-line ${className}`}>
      <div className="u-shell py-14 sm:py-16 lg:py-20">{children}</div>
    </section>
  );
}

/** A tight feature list: icon, title, body. Hairline rows, no cards. */
export function FeatureRows({
  items,
}: {
  items: { title: string; body: string; icon?: (props: React.SVGProps<SVGSVGElement>) => ReactNode }[];
}) {
  return (
    <ul className="grid gap-x-12 border-t border-line sm:grid-cols-2">
      {items.map((item) => {
        const Glyph = item.icon;
        return (
          <li key={item.title} className="flex gap-3.5 border-b border-line py-5">
            {Glyph ? (
              <span className="mt-0.5 shrink-0 text-azure-500">
                <Glyph className="h-[18px] w-[18px]" />
              </span>
            ) : null}
            <div className="min-w-0">
              <h3 className="text-[14.5px] font-semibold text-ink">{item.title}</h3>
              <p className="u-pretty mt-1.5 text-[14px] leading-relaxed text-muted">{item.body}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mt-[3px] h-3.5 w-3.5 shrink-0 text-azure-400">
            <path d="m3 8.4 3.2 3.1L13 4.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="u-pretty text-[14.5px] leading-relaxed text-ink-soft">{item}</span>
        </li>
      ))}
    </ul>
  );
}
