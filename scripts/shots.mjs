/**
 * Visual check — renders the key views to shots/ for eyeballing.
 *
 *   npm run build && npm run preview &
 *   node scripts/shots.mjs
 *
 * Not a test; nothing here asserts. It exists so a layout change can be looked
 * at across both themes and the breakpoints that matter, rather than only the
 * one the author happens to have open.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:4173';
const OUT = 'shots';
mkdirSync(OUT, { recursive: true });

const SHOTS = [
  { name: 'home-dark', route: '/', w: 1440, h: 950 },
  { name: 'home-dark-full', route: '/', w: 1440, h: 950, full: true },
  { name: 'home-light', route: '/', w: 1440, h: 950, light: true },
  { name: 'home-mobile', route: '/', w: 390, h: 844, touch: true },
  { name: 'home-320', route: '/', w: 320, h: 720, touch: true },
  { name: 'case-dark-full', route: '/work/analytics-dashboards', w: 1440, h: 950, full: true },
  { name: 'case-mobile', route: '/work/api-encryption-layer', w: 390, h: 844, touch: true, full: true },
  { name: 'resume', route: '/resume', w: 1100, h: 1400, full: true },
  { name: 'notfound', route: '/nope', w: 1100, h: 700 },
];

const browser = await chromium.launch();

for (const shot of SHOTS) {
  const ctx = await browser.newContext({
    viewport: { width: shot.w, height: shot.h },
    hasTouch: !!shot.touch,
    isMobile: !!shot.touch,
    deviceScaleFactor: 2,
    colorScheme: shot.light ? 'light' : 'dark',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + shot.route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  if (shot.full) {
    // Scroll through so every reveal has resolved before capturing.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }

  await page.screenshot({ path: `${OUT}/${shot.name}.png`, fullPage: !!shot.full });
  console.log('shot:', shot.name);
  await ctx.close();
}

await browser.close();
console.log(`\n${SHOTS.length} screenshots written to ${OUT}/`);
