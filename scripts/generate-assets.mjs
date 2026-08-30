/**
 * Generate the two brand raster assets that metadata references:
 *
 *   public/apple-touch-icon.png   180x180  home-screen icon
 *   public/og.png                 1200x630 social card
 *
 *   npm run assets
 *
 * Rendered from markup through Playwright (already a dependency for screenshot
 * capture) rather than hand-exported, so re-running after a brand change
 * reproduces them exactly. The mark geometry is duplicated from
 * src/components/logo.tsx — keep the two in step if the logo changes.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public");

const AZURE = "#1a7fd1";
const NAVY = "#14162e";

/** The open tile + check + plus, on a 44x44 grid. */
const MARK = `
  <path d="M33 15.6A7.4 7.4 0 0 0 25.6 8.2L14.4 8.2A7.4 7.4 0 0 0 7 15.6L7 28.4A7.4 7.4 0 0 0 14.4 35.8L25.6 35.8A7.4 7.4 0 0 0 33 28.4"/>
  <path d="M14.2 22.1 18.9 26.7 27.4 17.6"/>
  <path d="M33 14.6L33 24.2"/>
  <path d="M28.2 19.4L37.8 19.4"/>
`;

const markSvg = (size, stroke) => `
<svg viewBox="0 0 44 44" width="${size}" height="${size}" fill="none" stroke="${stroke}"
     stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${MARK}</svg>`;

const ICON_HTML = `
<style>
  html,body{margin:0;padding:0}
  .tile{width:180px;height:180px;background:${AZURE};display:flex;align-items:center;justify-content:center}
</style>
<div class="tile">${markSvg(116, "#ffffff")}</div>`;

const OG_HTML = `
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;padding:0}
  .card{
    width:1200px;height:630px;background:#fff;box-sizing:border-box;
    padding:78px 84px;display:flex;flex-direction:column;justify-content:space-between;
    font-family:'IBM Plex Sans',system-ui,sans-serif;
    border-bottom:14px solid ${AZURE};
  }
  .brand{display:flex;align-items:center;gap:18px}
  .name{font-size:31px;font-weight:600;color:${NAVY};letter-spacing:.01em}
  .name span{color:${AZURE}}
  .sub{margin-top:5px;font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#62658a}
  h1{margin:0;font-size:63px;line-height:1.08;font-weight:600;color:${NAVY};letter-spacing:-.022em;max-width:15ch}
  p{margin:22px 0 0;font-size:25px;line-height:1.45;color:#3d4064;max-width:36ch}
  .foot{font-size:20px;color:#62658a}
</style>
<div class="card">
  <div class="brand">
    ${markSvg(58, AZURE)}
    <div>
      <div class="name">CertiTrack <span>Plus</span></div>
      <div class="sub">by Reispeq</div>
    </div>
  </div>
  <div>
    <h1>Every certificate accounted for.</h1>
    <p>Certification and compliance control for oilfield and industrial equipment.</p>
  </div>
  <div class="foot">certitrackplus.com</div>
</div>`;

const JOBS = [
  { name: "apple-touch-icon.png", html: ICON_HTML, width: 180, height: 180, scale: 1 },
  { name: "og.png", html: OG_HTML, width: 1200, height: 630, scale: 1 },
];

const browser = await chromium.launch();
try {
  await mkdir(OUT, { recursive: true });
  for (const job of JOBS) {
    const page = await browser.newPage({
      viewport: { width: job.width, height: job.height },
      deviceScaleFactor: job.scale,
    });
    await page.setContent(job.html, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUT, job.name) });
    await page.close();
    console.log(`  wrote public/${job.name}  ${job.width}x${job.height}`);
  }
} finally {
  await browser.close();
}
