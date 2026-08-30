import { CertiTrackLogo } from "./logo";
import { ExternalIcon } from "./ui";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { sections } from "@/lib/routes";
import { site } from "@/lib/site";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="u-shell py-12 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <CertiTrackLogo />
            <p className="u-pretty mt-5 max-w-sm text-[14px] leading-relaxed text-muted">{t.footer.tagline}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            <div>
              <p className="text-[12px] font-semibold text-ink">{t.footer.sectionsCol}</p>
              <ul className="mt-3.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-[13.5px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[12px] font-semibold text-ink">{t.footer.accountCol}</p>
              <ul className="mt-3.5 space-y-1.5">
                <li>
                  <a
                    href={site.app.url}
                    className="inline-flex items-center gap-1.5 text-[13.5px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {t.footer.signIn}
                    <ExternalIcon />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="text-[13.5px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.vendor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13.5px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    {site.vendor.shortName}
                    <ExternalIcon />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-[12.5px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.vendor.name}. {t.footer.rights}
          </p>
          <p className="u-pretty max-w-xl sm:text-end">{t.footer.legalNote}</p>
        </div>
      </div>
    </footer>
  );
}
