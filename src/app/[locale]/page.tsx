import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  ComplianceMeter,
  ExpiryHorizon,
  ImportStaging,
  Panel,
  RegisterTable,
  RequirementTree,
  StatTiles,
} from "@/components/data";
import { ProductShot } from "@/components/product-shot";
import { JsonLd, faqSchema } from "@/components/json-ld";
import {
  AlertIcon,
  CertificateIcon,
  CrewIcon,
  DatabaseIcon,
  ExpiryIcon,
  ImportIcon,
  MailIcon,
  ReportIcon,
  RigIcon,
  TemplateIcon,
} from "@/components/icons";
import { ArrowIcon, CheckList, ExternalIcon, FeatureRows, Section, SectionHead } from "@/components/ui";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { buildMetadata, keywordSets } from "@/lib/seo";
import {
  expiryHorizon,
  fleetStats,
  fleetUnits,
  registerRows,
  requirementTree,
  stagedRows,
} from "@/lib/sample";
import { screen } from "@/lib/screens";
import { site } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({
    locale,
    route: "home",
    title: t.seo.home.title,
    description: t.seo.home.description,
    keywords: keywordSets.home,
  });
}

/** Two-column section: copy on the left, a product panel on the right. */
function Split({ children, panel }: { children: React.ReactNode; panel: React.ReactNode }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">{children}</div>
      <div className="min-w-0 lg:col-span-7">{panel}</div>
    </div>
  );
}

export default async function HomePage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDictionary(locale);

  // Present only once `npm run screens` has been run; otherwise the drawn
  // panels below stand in. See README, "Screenshots".
  const shots = {
    dashboard: screen("dashboard"),
    workUnits: screen("work-units"),
    templates: screen("templates"),
    charts: screen("charts"),
    expiry: screen("expiry"),
  };

  /**
   * Icons are paired with copy here rather than stored in the dictionary:
   * `en.ts` is data that a translator edits, and a React component is neither
   * translatable nor safe to sit in it.
   */
  const withIcons = <T,>(items: readonly T[], icons: ((p: React.SVGProps<SVGSVGElement>) => React.ReactNode)[]) =>
    items.map((item, i) => ({ ...item, icon: icons[i] }));

  return (
    <>
      <JsonLd data={faqSchema([...t.faq.items])} />

      {/* ---- Hero ---------------------------------------------------------- */}
      <section className="bg-surface">
        <div className="u-shell grid gap-12 py-14 lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-20">
          <div className="lg:col-span-5">
            <h1 className="u-balance text-[2.1rem] leading-[1.08] font-semibold text-ink sm:text-[2.5rem]">
              {t.hero.title}
            </h1>
            <p className="u-pretty mt-5 text-[16px] leading-relaxed text-ink-soft">{t.hero.lead}</p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <a
                href="#demo"
                className="group inline-flex items-center gap-2 rounded-sm bg-azure-500 px-4.5 py-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-azure-600"
              >
                {t.hero.primaryCta}
                <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#register"
                className="inline-flex items-center gap-2 rounded-sm border border-line bg-white px-4.5 py-3 text-[13.5px] font-semibold text-ink transition-colors hover:border-azure-300 hover:text-azure-600"
              >
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7">
            {shots.dashboard ? (
              <ProductShot
                {...shots.dashboard}
                priority
                alt="The CertiTrack Plus dashboard, showing total equipment, compliant and non-compliant counts, overall compliance rate and a breakdown by work unit."
                caption={t.hero.shotCaption}
              />
            ) : (
              <Panel title={t.hero.panelTitle} meta={t.hero.panelMeta} footnote={t.hero.panelFootnote}>
                <div className="p-4">
                  <StatTiles items={fleetStats} />
                </div>
                <div className="border-t border-line-soft">
                  <RegisterTable rows={registerRows.slice(0, 4)} />
                </div>
              </Panel>
            )}
          </div>
        </div>
      </section>

      {/* ---- 01 Problem ---------------------------------------------------- */}
      <Section id="problem">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHead
              icon={AlertIcon}
              title={t.problem.title}
              lead={t.problem.lead}
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="divide-y divide-line border-y border-line">
              {t.problem.points.map((point) => (
                <li key={point} className="flex gap-3 py-3.5">
                  {/* Neutral, not the reserved "expired" red: these are prose
                      bullets, and a status hue outside a real status reading
                      devalues the one in the panels above. */}
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden className="mt-[5px] h-2.5 w-2.5 shrink-0 text-muted">
                    <path d="M4.6 4.6 11.4 11.4M11.4 4.6 4.6 11.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  <span className="u-pretty text-[14.5px] leading-relaxed text-ink-soft">{point}</span>
                </li>
              ))}
            </ul>
            <p className="u-pretty mt-6 text-[14.5px] leading-relaxed text-muted">{t.problem.close}</p>
          </div>
        </div>
      </Section>

      {/* ---- 02 Register --------------------------------------------------- */}
      <Section id="register" tone="surface">
        <Split
          panel={
            shots.workUnits ? (
              <ProductShot
                {...shots.workUnits}
                alt="The work unit list in CertiTrack Plus, showing each unit with its company, vendor, compliance status, work unit type and template."
                caption={t.register.shotCaption}
              />
            ) : (
              <Panel
                title={t.register.panelTitle}
                meta={t.register.panelMeta}
                footnote={t.register.panelFootnote}
              >
                <RegisterTable rows={registerRows} />
              </Panel>
            )
          }
        >
          <SectionHead
            icon={CertificateIcon}
            title={t.register.title}
            lead={t.register.lead}
          />
        </Split>
        <div className="mt-12">
          <FeatureRows items={withIcons(t.register.features, [RigIcon, CertificateIcon, ImportIcon, MailIcon, TemplateIcon])} />
        </div>
      </Section>

      {/* ---- 03 Expiry ----------------------------------------------------- */}
      <Section id="expiry">
        <Split
          panel={
            shots.expiry ? (
              <ProductShot
                {...shots.expiry}
                alt="The upcoming certificate expiry table in CertiTrack Plus, listing equipment with its work unit, certificate type, expiry date and days remaining."
                caption={t.expiry.shotCaption}
              />
            ) : (
              <Panel title={t.expiry.panelTitle} meta={t.expiry.panelMeta} footnote={t.expiry.panelFootnote}>
                <ExpiryHorizon buckets={expiryHorizon} />
              </Panel>
            )
          }
        >
          <SectionHead
            icon={ExpiryIcon}
            title={t.expiry.title}
            lead={t.expiry.lead}
          />
        </Split>
        <div className="mt-12">
          <FeatureRows items={withIcons(t.expiry.features, [ExpiryIcon, AlertIcon, CertificateIcon, MailIcon])} />
        </div>
      </Section>

      {/* ---- 04 Templates -------------------------------------------------- */}
      <Section id="templates" tone="surface">
        <Split
          panel={
            shots.templates ? (
              <div className="space-y-4">
                <ProductShot
                  {...shots.templates}
                  alt="The work unit templates list in CertiTrack Plus, showing each template with its description, company and work unit type."
                  caption={t.templates.shotCaption}
                />
                {/* The meters stay drawn alongside: the template list shows what
                    is declared, and this shows the gap against it — which is the
                    actual argument of the section. */}
                <Panel
                  title={t.templates.fleetTitle}
                  meta={t.templates.fleetMeta}
                  footnote={t.templates.fleetFootnote}
                >
                  <div className="grid gap-4 px-4 py-4 sm:grid-cols-2">
                    {fleetUnits.map((unit) => (
                      <ComplianceMeter key={unit.label} {...unit} />
                    ))}
                  </div>
                </Panel>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <Panel
                  title={t.templates.panelTitle}
                  meta={t.templates.panelMeta}
                  footnote={t.templates.panelFootnote}
                >
                  <RequirementTree nodes={requirementTree} />
                </Panel>
                <Panel
                  title={t.templates.fleetTitle}
                  meta={t.templates.fleetMeta}
                  footnote={t.templates.fleetFootnote}
                >
                  <div className="space-y-4 px-4 py-4">
                    {fleetUnits.map((unit) => (
                      <ComplianceMeter key={unit.label} {...unit} />
                    ))}
                  </div>
                </Panel>
              </div>
            )
          }
        >
          <SectionHead
            icon={TemplateIcon}
            title={t.templates.title}
            lead={t.templates.lead}
          />
          <div className="mt-5 space-y-4">
            {t.templates.body.map((para) => (
              <p key={para.slice(0, 24)} className="u-pretty text-[14.5px] leading-relaxed text-muted">
                {para}
              </p>
            ))}
          </div>
        </Split>
      </Section>

      {/* ---- 05 Reporting -------------------------------------------------- */}
      <Section id="reporting">
        <SectionHead
          icon={ReportIcon}
          title={t.reporting.title}
          lead={t.reporting.lead}
        />
        {shots.charts ? (
          <div className="mt-10">
            <ProductShot
              {...shots.charts}
              alt="Compliance breakdown charts in CertiTrack Plus: equipment status per work unit, and compliant versus non-compliant per work unit type."
              caption={t.reporting.shotCaption}
            />
          </div>
        ) : null}
        <div className="mt-10">
          <FeatureRows items={withIcons(t.reporting.features, [ReportIcon, MailIcon, TemplateIcon, CertificateIcon])} />
        </div>
      </Section>

      {/* ---- 06 Import ----------------------------------------------------- */}
      <Section id="importing" tone="surface">
        <Split
          panel={
            <Panel
              title={t.importing.panelTitle}
              meta={t.importing.panelMeta}
              footnote={t.importing.panelFootnote}
            >
              <ImportStaging rows={stagedRows} />
            </Panel>
          }
        >
          <SectionHead
            icon={ImportIcon}
            title={t.importing.title}
            lead={t.importing.lead}
          />
        </Split>
        <div className="mt-12">
          <FeatureRows items={withIcons(t.importing.features, [ImportIcon, AlertIcon, CertificateIcon])} />
        </div>
      </Section>

      {/* ---- 07 Security --------------------------------------------------- */}
      <Section id="security">
        <SectionHead
          icon={DatabaseIcon}
          title={t.security.title}
          lead={t.security.lead}
        />
        <div className="mt-10">
          <FeatureRows items={withIcons(t.security.features, [DatabaseIcon, CrewIcon, CertificateIcon, AlertIcon])} />
        </div>
        <p className="mt-6 max-w-2xl border-s-2 border-azure-200 ps-4 text-[13.5px] leading-relaxed text-muted">
          {t.security.note}
        </p>
      </Section>

      {/* ---- 08 Audience --------------------------------------------------- */}
      <Section id="audience" tone="surface">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <SectionHead icon={CrewIcon} title={t.audience.title} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <CheckList items={[...t.audience.items]} />
          </div>
        </div>
      </Section>

      {/* ---- 09 Contact ---------------------------------------------------- */}
      <Section id="demo">
        <SectionHead icon={MailIcon} title={t.contact.title} lead={t.contact.lead} />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <dl className="text-[15px]">
              <dt className="text-[12.5px] font-medium text-muted">{t.contact.emailLabel}</dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${site.email}`}
                  className="text-[17px] font-semibold text-azure-600 underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>
              </dd>
            </dl>
            <p className="mt-5 text-[14px] leading-relaxed text-muted">{t.contact.responseNote}</p>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-md border border-line bg-surface p-6">
              <p className="text-[14px] font-semibold text-ink">{t.contact.appLabel}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{t.contact.appBody}</p>
              <a
                href={site.app.url}
                className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-azure-600 underline-offset-4 hover:underline"
              >
                {site.app.label}
                <ExternalIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h3 className="text-[1.15rem] font-semibold text-ink">{t.faq.title}</h3>
          <dl className="mt-6 border-t border-line">
            {t.faq.items.map((item) => (
              <div key={item.q} className="grid gap-2 border-b border-line py-5 lg:grid-cols-12 lg:gap-14">
                <dt className="text-[14.5px] font-semibold text-ink lg:col-span-5">{item.q}</dt>
                <dd className="u-pretty text-[14.5px] leading-relaxed text-muted lg:col-span-6 lg:col-start-7">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>
    </>
  );
}
