"use client";

import { useEffect, useState } from "react";
import { sections, type SectionId } from "@/lib/routes";

/**
 * Sticky in-page nav. On a single-page site this is the whole navigation, so
 * it also has to say *where you are* — hence the scroll spy.
 *
 * IntersectionObserver rather than a scroll listener: it does not run work on
 * every frame, and `rootMargin` lets the "active" band sit just under the
 * sticky header instead of at the viewport edge. Falls back to the first
 * section when nothing is intersecting (above the first heading, or below the
 * last), which is the same answer a scroll listener would give.
 */
export function SectionNav() {
  const [active, setActive] = useState<SectionId>(sections[0].id);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Prefer whichever tracked section is nearest the top of the band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      // Band runs from just below the sticky chrome to just above the fold.
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[var(--header-h)] z-40 hidden border-b border-line bg-white/95 backdrop-blur-md lg:block"
    >
      <div className="u-shell">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex items-center border-b-2 px-3 py-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-azure-400 text-azure-700"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
