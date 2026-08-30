/**
 * Capture product screenshots from the live CertiTrack Plus application.
 *
 *   npm run screens:login    once — sign in by hand, session is saved
 *   npm run screens          any time after — captures using that session
 *
 * There are two ways to authenticate, and the first is preferred:
 *
 * 1. INTERACTIVE (`--login`). Opens a real browser window, you sign in
 *    yourself, and Playwright saves the resulting session to
 *    `.auth/certitrack.json` (gitignored). No password is ever written to a
 *    file or passed through this script. Re-run `--login` when the session
 *    expires.
 *
 * 2. HEADLESS with credentials from the environment, for CI. Put them in
 *    `.env.local` (gitignored):
 *      CERTITRACK_EMAIL=...  CERTITRACK_PASSWORD=...
 *
 * Output lands in `public/screens/` as PNGs at 2x for retina. The site picks
 * them up on the next build automatically — see src/lib/screens.ts.
 *
 * IMPORTANT: whatever tenant you sign in as is what ends up on a public web
 * page. Capture from a demo tenant with representative data, not from a live
 * customer account and not from a register that is 98% non-compliant. See
 * README, "Screenshots".
 */
import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve("public/screens");
const AUTH_FILE = path.resolve(".auth/certitrack.json");
// Tall enough that the dashboard's charts render in full. The shot is then
// clipped down to the real content height, so the extra height costs nothing.
const VIEWPORT = { width: 1440, height: 1600 };
const SCALE = 2;

/**
 * What to capture. `wait` is a selector that must be visible before the shot,
 * which is what makes the run deterministic: the app is a single-page app and
 * a fixed sleep races the data fetch.
 */
/**
 * What to capture.
 *
 * `wait` is a selector that must be visible before the shot, which is what
 * makes the run deterministic: the app is a single-page app and a fixed sleep
 * races the data fetch.
 *
 * `top` / `height` crop the shot in CSS pixels. Omit both and the capture is
 * clipped to the measured content height. The dashboard is cropped into three
 * separate shots because one 1440x1441 image is nearly square — it sits badly
 * next to hero copy, and each band of it belongs to a different section of the
 * marketing page anyway. Offsets come from measuring the live DOM; re-measure
 * if the app's dashboard layout changes.
 */
const TARGETS = [
  // Nav, page title, the KPI row and the overall-compliance card.
  { name: "dashboard", route: "/company-dashboard", wait: "text=Equipment Analytics", height: 762 },
  // The two breakdown charts, without the nav — reads as a panel, not a re-shot of the whole app.
  { name: "charts", route: "/company-dashboard", wait: "text=Compliance by Rig", top: 752, height: 448 },
  // The upcoming-expiry table.
  { name: "expiry", route: "/company-dashboard", wait: "text=Upcoming Certificate Expiry", top: 1188, height: 236 },
  { name: "work-units", route: "/work-unit-managment", wait: "table" },
  { name: "templates", route: "/templates", wait: "table" },
];

/**
 * Hidden before every capture: the signed-in user's own chrome. `.nav-actions`
 * is the wrapper holding both the notification bell and the profile avatar.
 *
 * Verified against the live DOM rather than guessed — an earlier version used
 * `[class*='avatar']`, which matches nothing in this app and failed silently,
 * leaving the avatar in every shot.
 */
const HIDE = [".nav-actions"];

const argv = process.argv.slice(2);
const INTERACTIVE = argv.includes("--login");

async function loadEnvLocal() {
  const file = path.resolve(".env.local");
  if (!existsSync(file)) return;
  for (const line of (await readFile(file, "utf8")).split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const env = (k, fallback) => process.env[k]?.trim() || fallback;

/** True once the app has left the sign-in form. */
async function isSignedIn(page) {
  const pw = page.locator('input[type="password"]');
  return !(await pw.first().isVisible().catch(() => false));
}

/**
 * Opens a headed window and waits for the human to sign in. Polls rather than
 * waiting on a navigation event because the app is an SPA — a successful login
 * swaps the view without necessarily firing a load.
 */
async function interactiveLogin(baseUrl) {
  console.log(
    `\n→ Opening a browser window at ${baseUrl}\n` +
      "  Sign in there. This script is just watching — it never reads what you type.\n",
  );
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });

  const deadline = Date.now() + 5 * 60_000;
  while (Date.now() < deadline) {
    await page.waitForTimeout(1000);
    if (page.isClosed()) throw new Error("Window was closed before sign-in completed.");
    if (await isSignedIn(page)) {
      await page.waitForTimeout(1500); // let the token settle into storage
      await mkdir(path.dirname(AUTH_FILE), { recursive: true });
      await context.storageState({ path: AUTH_FILE });
      console.log(`  signed in — session saved to .auth/certitrack.json`);
      await browser.close();
      return;
    }
  }
  await browser.close();
  throw new Error("Timed out after 5 minutes waiting for sign-in.");
}

async function headlessLogin(context, page, baseUrl) {
  const email = env("CERTITRACK_EMAIL");
  const password = env("CERTITRACK_PASSWORD");
  if (!email || !password) return false;

  console.log("→ signing in with credentials from the environment");
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.locator('input[type="email"], input[name="email"]').first().fill(email);
  await page.locator('input[type="password"]').first().fill(password);
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.getByRole("button", { name: /sign in/i }).click(),
  ]);
  if (!(await isSignedIn(page))) throw new Error("Still on the sign-in form — check the credentials.");
  await mkdir(path.dirname(AUTH_FILE), { recursive: true });
  await context.storageState({ path: AUTH_FILE });
  return true;
}

/**
 * Height of the actual content, so the shot is not padded with dead space.
 *
 * The app's page container stretches to the viewport, so `scrollHeight` just
 * returns the viewport height and a fixed clip either cuts a chart in half or
 * leaves 40% empty. Instead: take the lowest edge of any element that paints
 * its own background (the content cards), ignoring full-height containers,
 * and add a margin.
 */
async function contentHeight(page) {
  const measured = await page.evaluate(() => {
    const docH = document.documentElement.scrollHeight;
    let bottom = 0;
    // `body *`, not `main *`: this app renders neither a <main> landmark nor a
    // direct <div> child of <body>, so anything narrower silently matches zero
    // elements and the measurement collapses to the floor.
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width < 40 || r.height < 12) continue;
      if (r.height > docH * 0.9) continue; // a layout container, not content
      const bg = getComputedStyle(el).backgroundColor;
      const paints = bg && bg !== "transparent" && !bg.endsWith(", 0)");
      if (!paints) continue;
      bottom = Math.max(bottom, r.bottom + window.scrollY);
    }
    return Math.ceil(bottom);
  });
  const padded = measured + 28;
  return Math.max(360, Math.min(padded, VIEWPORT.height));
}

async function capture(page, baseUrl) {
  await mkdir(OUT_DIR, { recursive: true });
  for (const target of TARGETS) {
    console.log(`→ ${target.name}  ${target.route}`);
    await page.goto(`${baseUrl}${target.route}`, { waitUntil: "networkidle" });

    if (!(await isSignedIn(page))) {
      throw new Error("Session has expired. Re-run `npm run screens:login`.");
    }
    if (target.wait) {
      await page.locator(target.wait).first().waitFor({ state: "visible", timeout: 20_000 });
    }
    await page.waitForTimeout(1200); // charts animate in; don't catch them mid-grow
    await page.addStyleTag({ content: `${HIDE.join(",")} { visibility: hidden !important; }` });

    const top = target.top ?? 0;
    const height = target.height ?? (await contentHeight(page)) - top;
    await page.screenshot({
      path: path.join(OUT_DIR, `${target.name}.png`),
      clip: { x: 0, y: top, width: VIEWPORT.width, height },
    });
    console.log(`  wrote public/screens/${target.name}.png`);
  }
}

async function main() {
  await loadEnvLocal();
  const baseUrl = env("CERTITRACK_URL", "https://certitrackplus.com").replace(/\/+$/, "");

  if (INTERACTIVE) await interactiveLogin(baseUrl);

  const hasSession = existsSync(AUTH_FILE);
  const hasCreds = Boolean(env("CERTITRACK_EMAIL") && env("CERTITRACK_PASSWORD"));

  if (!hasSession && !hasCreds) {
    console.error(
      "\nNo saved session and no credentials.\n\n" +
        "Recommended — sign in by hand, once:\n\n" +
        "  npm run screens:login\n\n" +
        "That opens a browser, you log in, and the session is saved to\n" +
        ".auth/certitrack.json (gitignored). No password is stored anywhere.\n\n" +
        "For CI instead, put CERTITRACK_EMAIL and CERTITRACK_PASSWORD in .env.local.\n",
    );
    process.exitCode = 1;
    return;
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
    ...(hasSession ? { storageState: AUTH_FILE } : {}),
  });
  const page = await context.newPage();

  try {
    if (!hasSession) await headlessLogin(context, page, baseUrl);

    await capture(page, baseUrl);
    console.log(
      `\nDone. ${TARGETS.length} screenshots in public/screens/.\n` +
        "The site picks them up on the next `npm run build`.\n" +
        "Check each one for data you would not want on a public page first.\n",
    );
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(`\nCapture failed: ${err.message}\n`);
  process.exit(1);
});
