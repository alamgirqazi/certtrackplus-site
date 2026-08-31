/**
 * All user-facing copy for the site, in one dictionary so an Arabic
 * translation is a sibling file and nothing else has to change.
 *
 * Claims are scoped to what the application actually does — the section copy
 * below maps onto real routes and tables in the CertiTrack Plus server. If a
 * capability is removed from the product, remove it here too.
 */
export const en = {
  nav: {
    signIn: "Sign in",
    cta: "Get in touch",
    skip: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    sections: "On this page",
  },

  seo: {
    home: {
      title: "Equipment certification and compliance tracking",
      description:
        "CertiTrack Plus is a certification and compliance platform for oilfield and industrial equipment: a controlled certificate register, expiry alerts, template-driven compliance status and audit-ready reporting across every work unit.",
    },
  },

  hero: {
    title: "Every certificate accounted for, before anyone asks.",
    lead:
      "CertiTrack Plus holds the certification record for your equipment: what is certified, by whom, until when, and with what evidence behind it. A client verification, an audit or a mobilisation stops being a search.",
    primaryCta: "Get in touch",
    secondaryCta: "See how it works",
    panelTitle: "Fleet compliance",
    panelMeta: "All work units",
    panelFootnote: "Illustrative view. Sample data, not a live feed.",
    shotCaption: "The compliance dashboard in CertiTrack Plus.",
  },

  problem: {
    title: "Certificates fail quietly.",
    lead:
      "Equipment certification rarely fails loudly. A certificate expires while the asset stays in service. An inspection record exists but nobody can find the evidence behind it. A register is accurate the day it is built and drifts every week afterwards.",
    points: [
      "A register only as current as the last person to update the spreadsheet",
      "Certificates held in mailboxes, shared drives and folders nobody else can reach",
      "Expiry discovered during mobilisation instead of six weeks before it",
      "No single answer to what is missing on a unit, and who owns closing it",
    ],
    close:
      "The cost lands later. A client verification that stops a job, an asset quarantined at the wellsite, a finding in an audit that should never have been open.",
  },

  register: {
    title: "One record per asset, with the evidence attached.",
    lead:
      "Every certified item carries its attributes, its certificates and the source documents behind them, held together rather than scattered across drives.",
    panelTitle: "Certificate register",
    panelMeta: "Work unit RIG-114",
    panelFootnote: "Illustrative view. Sample data, not a live feed.",
    shotCaption: "The work unit list in CertiTrack Plus.",
    features: [
      {
        title: "Equipment attributes",
        body:
          "Serial, OEM, manufacturing date, pressure and temperature rating, and H₂S / CO₂ service classification held against the asset.",
      },
      {
        title: "Certificates",
        body: "Certificate type, issuing body, issue and expiry dates, and the source document itself.",
      },
      {
        title: "Supporting documents",
        body:
          "Additional documents attach to the parent certificate they support, so a test report never drifts from the certificate it proves.",
      },
      {
        title: "Comments",
        body: "Notes against a certificate record, attributed to a user and dated.",
      },
      {
        title: "Categories",
        body: "Categories and category groups ordered the way your team reads them, not alphabetically.",
      },
    ],
  },

  expiry: {
    title: "Renewal planned against operations, not discovered during them.",
    lead:
      "Upcoming expiry is surfaced by horizon and equipment already out of date is counted separately, so the question is always “what needs doing in the next six weeks”, never “what did we miss”.",
    panelTitle: "Expiry horizon",
    panelMeta: "All work units",
    panelFootnote: "Illustrative view. Sample data, not a live feed.",
    shotCaption: "Upcoming certificate expiry in CertiTrack Plus.",
    features: [
      {
        title: "Horizon views",
        body: "Upcoming expiry by window, filterable to a single work unit when a specific mobilisation is in question.",
      },
      {
        title: "Expired, counted separately",
        body: "Already-expired equipment is its own figure rather than being folded into an “attention needed” total.",
      },
      {
        title: "QA/QC testing",
        body:
          "Items flagged for testing are tracked separately, including what has gone too long since its last update.",
      },
      {
        title: "Notifications",
        body: "In-app notifications per work unit, with read state tracked so nothing is silently dismissed.",
      },
    ],
  },

  templates: {
    title: "Compliance is derived, not typed in.",
    lead:
      "Most certificate trackers are a list of documents with dates on them. That answers “when does this expire” and nothing else. Not “is this unit ready to mobilise”, and not “what is missing”.",
    body: [
      "CertiTrack Plus models the requirement as well as the record. A work unit type has a template; the template declares the categories and equipment a unit of that type must carry; each item carries its certificates.",
      "Compliance status is the difference between what the template requires and what is present and valid. That is what makes fleet-wide answers possible: add a category to a template and it lands on every unit built from it, without anyone opening a unit by hand.",
    ],
    panelTitle: "Template requirements",
    panelMeta: "Drilling rig",
    panelFootnote: "Illustrative view. Sample data, not a live feed.",
    fleetTitle: "Compliance by work unit",
    fleetMeta: "Present of required",
    fleetFootnote: "Illustrative view. Sample data, not a live feed.",
    shotCaption: "Work unit templates in CertiTrack Plus.",
  },

  reporting: {
    title: "The position, in front of whoever has to act on it.",
    shotCaption: "Compliance breakdown by work unit and by work unit type.",
    lead:
      "Dashboards for exposure across the fleet, compliance summaries per unit, and the underlying document for any certificate, available when a client or an auditor asks rather than assembled afterwards.",
    features: [
      {
        title: "Fleet dashboard",
        body: "Total work units and users, critical and expired equipment, and compliance summary by status.",
      },
      {
        title: "Compliance reports",
        body: "Compliance summary reports per work unit, issued on demand and sent by email to named recipients.",
      },
      {
        title: "Filtered views",
        body: "Work unit views filterable by type, vendor, status and compliance state.",
      },
      {
        title: "Evidence on demand",
        body: "The source document for any certificate is one click from the record it belongs to.",
      },
    ],
  },

  importing: {
    title: "Migration without re-keying.",
    lead:
      "Load an existing register from a spreadsheet into a staging area, review and correct every row, then commit. Nothing reaches the live register until it has been looked at.",
    panelTitle: "Import review",
    panelMeta: "register-2026.xlsx · 5 of 214 rows",
    panelFootnote: "Illustrative view. Sample data, not a live feed.",
    features: [
      {
        title: "Staged, not direct",
        body: "Uploaded rows land in a staging table where they can be edited before anything is committed.",
      },
      {
        title: "Rows flagged for review",
        body: "Unmatched categories and unreadable dates are raised per row rather than failing the whole file.",
      },
      {
        title: "Retained against the file",
        body: "Imported rows stay associated with the file they came from, so a migration can be traced afterwards.",
      },
    ],
  },

  security: {
    title: "Your certification record is your audit evidence.",
    lead:
      "Certification data is commercially sensitive and, in an audit, evidentiary. It is held accordingly.",
    features: [
      {
        title: "A database per client",
        body:
          "Tenants are not separated by a column in a shared table. Each client account is provisioned with its own database, so one organisation's equipment, certificates and documents are physically separate from another's.",
      },
      {
        title: "Role-based access",
        body:
          "Users belong to your account and carry a role. Authentication is required on every data route, and administration is separated from day-to-day use.",
      },
      {
        title: "An accumulating record",
        body:
          "Comments are attributed and dated, imports are retained against their source file, and superseded certificates stay in the history rather than being overwritten.",
      },
      {
        title: "Encrypted in transit",
        body: "The application is served over TLS, with standard hardening applied at the HTTP layer.",
      },
    ],
    note:
      "Deployment options, including hosting region and on-premise arrangements, are discussed as part of onboarding.",
  },

  audience: {
    title: "Built for the people who carry the risk.",
    items: [
      "Oilfield service companies managing certified rental and operational equipment",
      "Drilling contractors and workover operators tracking rig equipment certification",
      "Equipment owners and workshops with lifting gear, pressure equipment and calibration obligations",
      "QA/QC and HSE functions responsible for audit and client-verification readiness",
    ],
  },

  contact: {
    title: "Talk to us about your register.",
    lead:
      "Tell us what you manage — the unit types, roughly how much equipment, and what you use today — and we will show CertiTrack Plus against it.",
    emailLabel: "Email",
    responseNote: "We reply within one business day.",
    appLabel: "Existing customer?",
    appBody: "Sign in to your account.",
  },

  faq: {
    title: "Common questions",
    items: [
      {
        q: "Can we migrate our existing spreadsheet register?",
        a: "Yes. CertiTrack Plus imports equipment and certificate data from Excel into a staging area, where every row can be reviewed and corrected before it is committed to the live register.",
      },
      {
        q: "How is our data kept separate from other customers?",
        a: "Each client account is provisioned with its own database rather than sharing tables with other tenants, so your equipment, certificates and documents are physically separate.",
      },
      {
        q: "Can the platform match our own equipment categories and unit types?",
        a: "Yes. Work unit types, categories and templates are configured per account. Templates define what each class of unit must carry, and changes can be applied across every unit built from that template.",
      },
      {
        q: "Does it handle supporting documents, not just certificates?",
        a: "Yes. Additional documents attach to the certificate they support, so test reports and related evidence stay with the record they belong to.",
      },
      {
        q: "Who is CertiTrack Plus built by?",
        a: "Reispeq Technologies LLC, a quality assurance and software company working with oilfield and industrial operators across the GCC.",
      },
    ],
  },

  notFound: {
    code: "404",
    title: "This page is not here.",
    body: "The link may be out of date, or the page may have moved.",
    cta: "Go to the homepage",
  },

  footer: {
    tagline:
      "Certification and compliance control for oilfield and industrial equipment. Developed by Reispeq Technologies LLC.",
    sectionsCol: "On this page",
    accountCol: "Account",
    signIn: "Sign in to the app",
    rights: "All rights reserved.",
    legalNote:
      "CertiTrack Plus is a records management platform. It does not issue certificates and is not a certification body.",
  },
} as const;

export type Dictionary = typeof en;
