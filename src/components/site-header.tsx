import Link from "next/link";
import { CertiTrackLogo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { SectionNav } from "./section-nav";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { href, sections } from "@/lib/routes";
import { site } from "@/lib/site";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
        <div className="u-shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href={href(locale, "home")} aria-label={site.name} className="shrink-0">
            <CertiTrackLogo />
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={site.app.url}
              className="hidden rounded-sm px-3 py-2 text-[13.5px] font-semibold text-ink-soft transition-colors hover:text-azure-600 sm:inline-flex"
            >
              {t.nav.signIn}
            </a>
            <a
              href="#demo"
              className="hidden rounded-sm bg-azure-500 px-4 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-azure-600 sm:inline-flex"
            >
              {t.nav.cta}
            </a>
            <MobileNav
              items={sections.map((s) => ({ href: `#${s.id}`, label: s.label }))}
              ctaHref="#demo"
              ctaLabel={t.nav.cta}
              signInHref={site.app.url}
              signInLabel={t.nav.signIn}
              openLabel={t.nav.openMenu}
              closeLabel={t.nav.closeMenu}
            />
          </div>
        </div>
      </header>
      <SectionNav />
    </>
  );
}
