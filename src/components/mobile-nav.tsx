"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string };

export function MobileNav({
  items,
  ctaHref,
  ctaLabel,
  signInHref,
  signInLabel,
  openLabel,
  closeLabel,
}: {
  items: Item[];
  ctaHref: string;
  ctaLabel: string;
  signInHref: string;
  signInLabel: string;
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const panel = (
    <div
      id="mobile-nav-panel"
      className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden"
    >
      <nav className="u-shell py-6" aria-label={openLabel}>
        <ul className="divide-y divide-line-soft">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center justify-between py-4 text-base font-medium text-ink">
                {item.label}
                <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4 text-azure-300">
                  <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={ctaHref}
          className="mt-6 flex w-full items-center justify-center rounded-sm bg-azure-400 px-5 py-3.5 text-sm font-semibold text-white"
        >
          {ctaLabel}
        </Link>
        <a
          href={signInHref}
          className="mt-3 flex w-full items-center justify-center rounded-sm border border-line px-5 py-3.5 text-sm font-semibold text-ink"
        >
          {signInLabel}
        </a>
      </nav>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? closeLabel : openLabel}
        className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-line text-ink lg:hidden"
      >
        <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-5 w-5">
          {open ? (
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {/*
        Portalled to <body> on purpose. The header carries `backdrop-blur`,
        which makes it a containing block for fixed-position descendants — a
        panel rendered inside it would resolve `top`/`bottom` against the 72px
        header rather than the viewport and collapse to a few pixels tall.
      */}
      {mounted && open ? createPortal(panel, document.body) : null}
    </>
  );
}
