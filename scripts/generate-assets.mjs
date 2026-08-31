/**
 * Generate the social card that metadata references:
 *
 *   public/og.png   1200x630
 *
 *   npm run assets
 *
 * The logo is read from public/certitrackplus-logo.svg — the supplied brand
 * asset — rather than redrawn here, so the card cannot drift from the real
 * mark. The favicons and apple-touch-icon are supplied artwork and are NOT
 * generated; do not overwrite them from this script.
 */
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public");
const NAVY = "#104378";
const AZURE = "#2492EB";

const logo = await readFile(path.join(OUT, "certitrackplus-logo.svg"), "utf8");
// Angular export artefacts; harmless but noisy, and the fixed width has to go
// so the mark can be scaled by CSS.
const logoMarkup = logo
  .replace(/\s_ngcontent-[a-z0-9-]+=""/g, "")
  .replace(/width="2414" height="473"/, 'width="470"');

const OG_HTML = `
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;padding:0}
  .card{
    width:1200px;height:630px;background:#fff;box-sizing:border-box;
    padding:74px 84px;display:flex;flex-direction:column;justify-content:space-between;
    font-family:'IBM Plex Sans',system-ui,sans-serif;
    border-bottom:14px solid ${AZURE};
  }
  h1{margin:0;font-size:62px;line-height:1.08;font-weight:600;color:${NAVY};letter-spacing:-.022em;max-width:15ch}
  p{margin:22px 0 0;font-size:25px;line-height:1.45;color:#3d4064;max-width:38ch}
  .foot{font-size:20px;color:#62658a}
</style>
<div class="card">
  <div>${logoMarkup}</div>
  <div>
    <h1>Every certificate accounted for.</h1>
    <p>Certification and compliance control for oilfield and industrial equipment.</p>
  </div>
  <div class="foot">certitrackplus.com</div>
</div>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(OG_HTML, { waitUntil: "networkidle" });
  await page.screenshot({ path: path.join(OUT, "og.png") });
  console.log("  wrote public/og.png  1200x630");
} finally {
  await browser.close();
}
