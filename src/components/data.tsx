import type { ReactNode } from "react";

/* ==========================================================================
   Status
   ========================================================================== */

export type Status = "valid" | "due" | "expired" | "missing";

/**
 * Green / amber / red is the traffic-light triad, and it is not separable under
 * red-green colour blindness at any lightness — the deutan ΔE between the valid
 * and expired steps is about 4, where 8 is the target. Colour alone therefore
 * cannot carry status here.
 *
 * So each state gets a distinct icon SHAPE as well as a hue, and the label is
 * always rendered. Read with the colour stripped out, the shapes still say
 * check / clock / cross / dash. This is the only place status is styled; nothing
 * else in the codebase should emit a bare status colour.
 */
const STATUS: Record<
  Status,
  { label: string; fg: string; bg: string; mark: string; path: ReactNode }
> = {
  valid: {
    label: "Valid",
    fg: "text-valid-fg",
    bg: "bg-valid-bg",
    mark: "text-valid-mark",
    path: <path d="M3.5 8.4 6.4 11.3 12.5 5" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />,
  },
  due: {
    label: "Due soon",
    fg: "text-due-fg",
    bg: "bg-due-bg",
    mark: "text-due-mark",
    path: (
      <>
        <circle cx="8" cy="8" r="5.6" strokeWidth="1.6" />
        <path d="M8 5.1V8.3l2.1 1.5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  expired: {
    label: "Expired",
    fg: "text-expired-fg",
    bg: "bg-expired-bg",
    mark: "text-expired-mark",
    path: <path d="M4.6 4.6 11.4 11.4M11.4 4.6 4.6 11.4" strokeWidth="1.9" strokeLinecap="round" />,
  },
  missing: {
    label: "Missing",
    fg: "text-missing-fg",
    bg: "bg-missing-bg",
    mark: "text-missing-mark",
    path: <path d="M4.2 8h7.6" strokeWidth="1.9" strokeLinecap="round" />,
  },
};

export function StatusIcon({ status, className = "" }: { status: Status; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden className={`h-3.5 w-3.5 ${className}`}>
      {STATUS[status].path}
    </svg>
  );
}

export function StatusChip({ status, label }: { status: Status; label?: string }) {
  const s = STATUS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-[11.5px] font-semibold ${s.bg} ${s.fg}`}
    >
      <StatusIcon status={status} className="h-3 w-3" />
      {label ?? s.label}
    </span>
  );
}

export function statusLabel(status: Status) {
  return STATUS[status].label;
}

/* ==========================================================================
   Panels — the application's own chrome, reused as page furniture
   ========================================================================== */

export function Panel({
  title,
  meta,
  children,
  footnote,
  className = "",
}: {
  title: string;
  meta?: string;
  children: ReactNode;
  footnote?: string;
  className?: string;
}) {
  return (
    <figure className={`u-panel overflow-hidden ${className}`}>
      <figcaption className="flex items-baseline justify-between gap-4 border-b border-line bg-surface px-4 py-3">
        <span className="text-[13px] font-semibold text-ink">{title}</span>
        {meta ? <span className="u-tnum font-mono text-[11px] text-muted">{meta}</span> : null}
      </figcaption>
      {children}
      {footnote ? (
        <p className="border-t border-line-soft bg-surface px-4 py-2.5 text-[11.5px] leading-relaxed text-muted">
          {footnote}
        </p>
      ) : null}
    </figure>
  );
}

/* ==========================================================================
   Stat tiles
   ========================================================================== */

export type Stat = { value: string; label: string; status?: Status };

/**
 * A KPI row, not a chart. Values are large and *proportional* — `tabular-nums`
 * gives every digit the width of a zero, which reads loose at display sizes.
 * Tabular figures are reserved for the table columns below, where digits have
 * to line up vertically.
 */
export function StatTiles({ items }: { items: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md bg-line sm:grid-cols-4">
      {items.map((item) => {
        const s = item.status ? STATUS[item.status] : null;
        return (
          <div key={item.label} className="flex flex-col bg-paper px-4 py-4">
            <dd className={`order-1 text-[1.75rem] leading-none font-semibold ${s ? s.fg : "text-ink"}`}>
              {item.value}
            </dd>
            <dt className="order-2 mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-muted">
              {s ? <StatusIcon status={item.status!} className={`h-3 w-3 ${s.mark}`} /> : null}
              {item.label}
            </dt>
          </div>
        );
      })}
    </dl>
  );
}

/* ==========================================================================
   Register table
   ========================================================================== */

export type RegisterRow = {
  asset: string;
  cert: string;
  issuer: string;
  expiry: string;
  status: Status;
};

export function RegisterTable({ rows }: { rows: RegisterRow[] }) {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[34rem] text-start text-[13px]">
        <thead>
          <tr className="border-b border-line-soft">
            {["Asset", "Certificate", "Issued by", "Expiry", "Status"].map((h, i) => (
              <th
                key={h}
                scope="col"
                className={`px-4 py-2.5 text-[12px] font-medium text-muted ${
                  i === 4 ? "text-end" : "text-start"
                }`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {rows.map((row) => (
            <tr key={row.cert}>
              <td className="px-4 py-2.5 font-medium text-ink">{row.asset}</td>
              <td className="u-tnum px-4 py-2.5 font-mono text-[12px] whitespace-nowrap text-muted">{row.cert}</td>
              <td className="px-4 py-2.5 whitespace-nowrap text-muted">{row.issuer}</td>
              <td className="u-tnum px-4 py-2.5 whitespace-nowrap text-ink-soft">{row.expiry}</td>
              <td className="px-4 py-2.5 text-end whitespace-nowrap">
                <StatusChip status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==========================================================================
   Expiry horizon
   ========================================================================== */

export type HorizonBucket = { window: string; count: number; status: Status };

/**
 * Magnitude across ordered time buckets — a bar set, not a pie or a donut.
 * Bars share one baseline, are scaled to the largest count, and each is
 * directly labelled, so no axis or legend is needed. Colour repeats the
 * bucket's status; the icon beside the label carries it without colour.
 */
export function ExpiryHorizon({ buckets }: { buckets: HorizonBucket[] }) {
  const max = Math.max(...buckets.map((b) => b.count), 1);
  const fill: Record<Status, string> = {
    valid: "bg-valid-mark",
    due: "bg-due-mark",
    expired: "bg-expired-mark",
    missing: "bg-missing-mark",
  };

  return (
    <ul className="space-y-3 px-4 py-4">
      {buckets.map((b) => (
        <li key={b.window} className="grid grid-cols-[7.5rem_1fr_2.5rem] items-center gap-3">
          <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-ink-soft">
            <StatusIcon status={b.status} className={`h-3 w-3 shrink-0 ${STATUS[b.status].mark}`} />
            {b.window}
          </span>
          {/* Track is a lighter step of the same neutral; the fill carries the
              severity. Rounded only on the data end, anchored to the baseline. */}
          <span className="h-2.5 w-full rounded-xs bg-line-soft">
            <span
              className={`block h-full rounded-e-sm ${fill[b.status]}`}
              style={{ width: `${Math.max((b.count / max) * 100, 3)}%` }}
            />
          </span>
          <span className="u-tnum text-end text-[13px] font-semibold text-ink">{b.count}</span>
        </li>
      ))}
    </ul>
  );
}

/* ==========================================================================
   Requirement tree — the template-versus-record idea, drawn
   ========================================================================== */

export type TreeNode = { label: string; detail?: string; status?: Status; children?: TreeNode[] };

export function RequirementTree({ nodes }: { nodes: TreeNode[] }) {
  return (
    <ul className="space-y-1 px-4 py-4 text-[13px]">
      {nodes.map((node) => (
        <li key={node.label}>
          <div className="flex items-center justify-between gap-3 py-1.5">
            <span className="font-medium text-ink">{node.label}</span>
            {node.status ? <StatusChip status={node.status} /> : null}
          </div>
          {node.children ? (
            <ul className="ms-2 space-y-0.5 border-s border-line ps-4">
              {node.children.map((child) => (
                <li key={child.label} className="flex items-center justify-between gap-3 py-1.5">
                  <span className="min-w-0">
                    <span className="text-ink-soft">{child.label}</span>
                    {child.detail ? (
                      <span className="u-tnum ms-2 font-mono text-[11.5px] text-muted">{child.detail}</span>
                    ) : null}
                  </span>
                  {child.status ? <StatusChip status={child.status} /> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

/* ==========================================================================
   Compliance meter
   ========================================================================== */

/**
 * A single proportion. The fill carries severity; the unfilled track is a
 * lighter step of the same ramp so the state reads across the whole bar.
 */
export function ComplianceMeter({
  label,
  present,
  required,
}: {
  label: string;
  present: number;
  required: number;
}) {
  const pct = Math.round((present / required) * 100);
  const status: Status = pct === 100 ? "valid" : pct >= 80 ? "due" : "expired";
  const fill = { valid: "bg-valid-mark", due: "bg-due-mark", expired: "bg-expired-mark", missing: "bg-missing-mark" }[
    status
  ];
  const track = { valid: "bg-valid-bg", due: "bg-due-bg", expired: "bg-expired-bg", missing: "bg-missing-bg" }[status];

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-ink">{label}</span>
        <span className="u-tnum text-[12.5px] text-muted">
          {present}/{required}
        </span>
      </div>
      <div
        className={`mt-2 h-2 w-full rounded-xs ${track}`}
        role="meter"
        aria-valuenow={present}
        aria-valuemin={0}
        aria-valuemax={required}
        aria-label={`${label}: ${present} of ${required} required items present`}
      >
        <div className={`h-full rounded-e-sm ${fill}`} style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}

/* ==========================================================================
   Import staging
   ========================================================================== */

export type StagedRow = { serial: string; category: string; issue: string | null };

export function ImportStaging({ rows }: { rows: StagedRow[] }) {
  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full min-w-[30rem] text-start text-[13px]">
        <thead>
          <tr className="border-b border-line-soft">
            {["Serial", "Category", "Review"].map((h) => (
              <th
                key={h}
                scope="col"
                className="px-4 py-2.5 text-start text-[12px] font-medium text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {rows.map((row) => (
            <tr key={row.serial}>
              <td className="u-tnum px-4 py-2.5 font-mono text-[12px] whitespace-nowrap text-ink">{row.serial}</td>
              <td className="px-4 py-2.5 text-muted">{row.category}</td>
              <td className="px-4 py-2.5">
                {row.issue ? (
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-due-fg">
                    <StatusIcon status="due" className="h-3 w-3 shrink-0 text-due-mark" />
                    {row.issue}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-valid-fg">
                    <StatusIcon status="valid" className="h-3 w-3 shrink-0 text-valid-mark" />
                    Ready
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
