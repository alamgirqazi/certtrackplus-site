# certitrackplus.com

Static marketing site for **CertiTrack Plus**, the equipment certification and
compliance platform by Reispeq Technologies LLC.

This repository is the **apex domain** (`certitrackplus.com`). The application
itself moves to `app.certitrackplus.com` — see `src/lib/site.ts` (`site.app.url`),
which is the only place that hostname is written.

## Stack

Next.js 15 (App Router) + Tailwind CSS 4, exported as fully static HTML
(`output: "export"`). No Node runtime is needed to serve it — any static host
works: Cloudflare Pages, S3, Netlify, GitHub Pages or a plain nginx directory.

Shares the *toolchain* of the corporate site (`reispeq-site`) so both can be
maintained without context-switching, but deliberately **not** its design system:
this site is dense, azure-led and built out of the product's own UI, where
reispeq.com is airy, navy and editorial.

## Commands

```bash
npm install
npm run dev      # dev server, http://localhost:3000
npm run build    # static export into ./out
npm run start    # serve the built ./out, http://localhost:3000
npm run preview  # build + serve in one step
npm run lint

npm run screens:login  # once — sign in, session saved
npm run screens        # capture app screenshots
npm run assets         # regenerate og.png from the brand logo
```

Note that `npm start` serves the **exported** `out/` directory with `serve` —
`next start` cannot run an `output: "export"` build and will refuse with an
error. Always `npm run build` before `npm start`, or use `npm run preview`.

## Structure

The site is **one page**. Everything lives at `/en/`, split into anchored
sections that the sticky section nav and the footer index both read from
`src/lib/routes.ts`.

```
src/
  app/
    layout.tsx              pass-through root (locale layout owns <html>)
    page.tsx                / — thin redirect document to /en/
    [locale]/
      layout.tsx            <html lang>, header, footer, JSON-LD
      page.tsx              the whole site
    robots.ts sitemap.ts icon.svg
  components/
    data.tsx                status chips, stat tiles, register table,
                            expiry horizon, requirement tree, meters
    icons.tsx               the stroke-drawn icon set
    ui.tsx                  section heads, feature rows, buttons
    section-nav.tsx         sticky in-page nav with scroll spy
    product-shot.tsx        frames a captured screenshot
  i18n/                     config + `en.ts` — all copy lives here
  lib/
    sample.ts               illustrative panel data (NOT real tenant data)
    site.ts routes.ts seo.ts
```

### Sections

Defined once in `src/lib/routes.ts` as `sections`. Adding an entry there puts it
in the sticky nav, the mobile menu and the footer — so a section cannot exist on
the page without being navigable. The `id` must match the `<Section id="…">` in
`page.tsx`.

### Where to change things

| I want to change…                     | Edit                                    |
| ------------------------------------- | --------------------------------------- |
| Any wording on the site               | `src/i18n/en.ts`                        |
| The sample data in the product panels | `src/lib/sample.ts`                      |
| Which sections exist / their order    | `src/lib/routes.ts` + `page.tsx`         |
| Company facts, emails, the app URL    | `src/lib/site.ts`                        |
| Colours, status palette, type         | `src/app/globals.css`                    |
| Icons                                 | `src/components/icons.tsx`               |
| Search keywords                       | `src/lib/seo.ts`                         |

## Design rules worth keeping

**Status colour is never used alone.** Green/amber/red is the traffic-light
triad and is not separable under red-green colour blindness at any lightness —
the deutan ΔE between the "valid" and "expired" steps is about 4, where 8 is the
usable target. Every status therefore renders through `<StatusChip>` /
`<StatusIcon>` in `data.tsx`, which pairs the hue with a distinct icon **shape**
(check / clock / cross / dash) and a text label. Do not add a bare coloured dot
or a colour-only legend.

The `-fg` steps in `globals.css` were darkened from the application's brighter
UI hues so small text clears WCAG 4.5:1 on its own tint. If you change them,
re-check contrast rather than eyeballing it.

**Status hues are reserved.** They mean state. Don't reach for them to decorate
prose bullets or to colour a fourth category.

**No tracked-out uppercase eyebrows, no `01 / 02 / 03` section numbering.** The
section icon does that categorising job. This is a deliberate break from the
corporate site's editorial styling — CertiTrack Plus is meant to look like the
application, not like a brochure about it.

**Sample data is invented.** `src/lib/sample.ts` is fictional equipment on
fictional certificate numbers, and every panel rendering it is labelled as a
sample view. Never paste real tenant data in there.

## Screenshots

The product panels on the page come in two kinds, and the distinction matters.

**Drawn panels** (`src/components/data.tsx` fed by `src/lib/sample.ts`) are
markup, not images. They stay sharp at any width, reflow on mobile, are
readable by screen readers, and never go stale when the app is restyled. They
carry invented data and every one is labelled as a sample view.

**Real screenshots** (`public/screens/`, rendered by `<ProductShot>`) are
captured from the live application. Sign in by hand once:

```bash
npm run screens:login
```

That opens a real browser window. You log in yourself; Playwright saves the
resulting session to `.auth/certitrack.json` (gitignored). **No password is
written to a file or passed through the script.** Then, any time after:

```bash
npm run screens
```

`scripts/capture-screens.mjs` waits for each page's data to land (not a fixed
sleep — the app is a single-page app and a sleep races the fetch), hides the
signed-in user's avatar and notification badge, and writes 2× PNGs. Re-run
`screens:login` when the session expires. To capture a different page, add an
entry to `TARGETS` at the top of the script.

`TARGETS` entries may set `top` and `height` (CSS pixels) to crop. The dashboard
is cropped into three shots — `dashboard`, `charts`, `expiry` — because one
1440x1441 image is nearly square, sits badly beside hero copy, and each band
belongs to a different section of the page. Those offsets were measured against
the live DOM; **re-measure them if the app's dashboard layout changes**, or the
crops will slice through a card. With no `top`/`height`, the shot is clipped to
the measured content height so there is no dead space.

Screenshots total ~650 KB. Only the hero image is eager; the rest are
`loading="lazy"` via `next/image`, so the critical path carries one PNG.

For CI, put `CERTITRACK_EMAIL` and `CERTITRACK_PASSWORD` in `.env.local`
instead and the script logs in headlessly.

The first run on a machine needs the browser binary:

```bash
npx playwright install chromium
```

### Capture from a demo tenant

**Whatever account you sign in as is what goes on a public web page.** Two
separate problems come from capturing the wrong tenant:

1. **Customer data.** A live customer's equipment, serials, vendors and
   compliance position are theirs, not yours to publish.
2. **The numbers argue against you.** As of the last check the Reispeq tenant
   showed *138 equipment, 3 compliant, 135 non-compliant, a 2% compliance rate*
   and a "Critical — rigs at risk of non-compliance" banner, on work units named
   "Rig 1", "Rig 2", "Rig 3". That is an honest picture of a test account and a
   terrible advertisement for a compliance product: a prospect reads a wall of
   red and 2%.

Seed a demo tenant with a realistic register — mostly valid, a handful due, one
or two expired, and real-sounding unit names — and capture that. The screenshot
should show the product working, which is also the state a customer is buying.

Where a screenshot would be dishonest or is not yet available, keep the drawn
panel. Do **not** edit numbers into a screenshot in a graphics editor; either
capture a tenant whose data says what you want, or use a drawn panel that is
labelled as illustrative.

## Deploying

`.github/workflows/deploy.yml` builds the static export and publishes it to
GitHub Pages on every push to `main`.

**There is nothing to configure.** No repository variables, no secrets. The
workflow calls `actions/configure-pages` (with `enablement: true`, so it turns
Pages on if it is off), reads back where Pages will actually serve this repo
from, and feeds that into the build:

| Deploying to | site URL | base path |
| --- | --- | --- |
| `owner.github.io/repo` (project page) | `https://owner.github.io/repo` | `/repo` |
| `owner.github.io` (user/org page) | `https://owner.github.io` | `/` → treated as none |
| A custom domain | the domain | `/` → treated as none |

The base path matters because a project page serves from a sub-directory: get
it wrong and every stylesheet, font and screenshot 404s. Both shapes are
verified by building with `NEXT_PUBLIC_BASE_PATH` set, serving `out/` under
that sub-directory, and checking every referenced asset returns 200.

If the first run fails at *Configure Pages*, set Settings → Pages → *Build and
deployment* → Source to **GitHub Actions** manually and re-run.

### Overriding later (for the custom domain)

Set `NEXT_PUBLIC_SITE_URL` as a repository variable (Settings → Secrets and
variables → Actions → **Variables**) and leave `NEXT_PUBLIC_BASE_PATH` unset.
When `NEXT_PUBLIC_SITE_URL` is present the workflow uses *both* variables
verbatim, so a deliberately blank base path stays blank.

This is why the resolution is a shell step rather than an inline
`vars.X || outputs.Y`: `a && b || c` collapses an intentionally empty override
to the fallback, which would have put a `/repo` prefix on a custom-domain build
and broken every asset URL.

For a custom domain also set it in Settings → Pages **and** commit a
`public/CNAME` containing just the hostname — the deploy action replaces the
published tree on every run, and without the file in the artifact the domain
setting can be lost.

### next/image does not apply basePath

With `images.unoptimized` under a static export, `next/image` does **not**
prefix `src` with the base path. `src/lib/screens.ts` therefore runs every
screenshot path through `asset()` from `src/lib/base-path.ts`. If you add
another image referenced by a hand-written path, do the same, or it will work
on the apex and 404 on a project page.

### Screenshots must be committed

`public/screens/*.png` are read at build time. CI does not run `npm run screens`
(it has no session), so **whatever is committed is what ships**. If the PNGs are
missing the build still succeeds and silently renders the drawn fallback
panels — the workflow prints a warning listing what it found, so check the log.

### Other hosts

Nothing here is Pages-specific: the output is a plain `out/` directory.
Cloudflare Pages, Netlify, S3 or nginx all work with build command
`npm run build` and output directory `out`.

## Brand assets

`public/certitrackplus-logo.svg` is the supplied CertiTrack lockup and is the
source of truth. `src/components/logo.tsx` is transcribed from it — droplet
mark plus the "CertiTRACK" wordmark, navy `#104378` and azure `#2492EB`.

Two things about that component are deliberate:

- **Brand colours are hard-coded.** It is supplied artwork, not a themeable
  icon. Both current placements are on light backgrounds; a knockout version
  needs artwork from the brand owner, not a CSS override.
- **`idSuffix` is required per instance.** The artwork depends on a
  `<clipPath>`, and ids must be unique per document. The clip is load-bearing —
  removing it lets the droplet's tip overshoot — so it cannot just be dropped.
  The header passes `hdr`, the footer `ftr`. Add a third placement and give it
  its own suffix.

`favicon-16x16.png`, `favicon-32x32.png` and `apple-touch-icon.png` are
**supplied artwork**. `npm run assets` does not touch them; it only regenerates
`og.png`, and it reads the logo SVG so the card cannot drift from the real mark.

Note there is no `src/app/icon.svg`. Next serves that filename automatically as
the favicon and it would silently override the PNGs declared in metadata.

## Adding Arabic

The site is locale-segmented (`/en/…`), matching reispeq.com. To add Arabic:

1. Add `"ar"` to `locales` and an `ar` entry to `localeMeta` in
   `src/i18n/config.ts` (`dir: "rtl"`, `htmlLang: "ar"`, `ogLocale: "ar_AE"`).
2. Write `src/i18n/ar.ts` against the `Dictionary` type and register it in
   `src/i18n/dictionaries.ts`.
3. Load `IBM_Plex_Sans_Arabic` in `[locale]/layout.tsx`.
4. Translate the `sections` labels in `src/lib/routes.ts` — they are the only
   user-facing strings living outside the dictionary, because the sitemap and
   the nav both read them.

Routing, canonicals, hreflang and the sitemap pick it up with no further work.
Two things need attention in RTL: the arrow-hover translate on buttons
(`group-hover:translate-x-0.5`) is a physical direction and should mirror, and
`RequirementTree`'s left border uses logical properties already, so it is fine.

## Configuration

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — absolute origin; drives canonicals, hreflang, sitemap
  and OpenGraph image URLs. Defaults to `https://certitrackplus.com`.
- `NEXT_PUBLIC_BASE_PATH` — only for a GitHub *project* page. Leave blank.

## Before launch

- [ ] **Create `support@certitrackplus.com` and confirm it is monitored.** It is
      the only address on the site and the only way to reach you from it — there
      is no form. Verify it actually receives mail before launch; the domain's
      MX records may not be set up for it yet.
- [ ] **The app and this site both want the apex.** `site.app.url` currently
      points at `https://certitrackplus.com` because the application still
      lives there — which means every "Sign in" link on this site points at
      itself once this site is deployed to the apex. Before launch, either move
      the app to `app.certitrackplus.com` and update `site.app.url`, or host
      this site somewhere else. This is the one blocking item.
- [ ] Add redirects from any deep links into the old apex-hosted app.
- [ ] Decide whether to replace the drawn panels with real screenshots. If so,
      capture them from a **demo tenant**, not a live customer account.

## Claims policy

Copy in `src/i18n/en.ts` is scoped to what the application actually does. There
are no invented usage metrics anywhere on the site — the band under the hero
states capabilities, not numbers. **If a capability is removed from the product,
remove it here too.**
