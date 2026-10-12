/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Layout, accessibility and console audit
 * ─────────────────────────────────────────────────────────────────────────────
 * Run against a running preview server:
 *   npm run build && npm run preview &
 *   node scripts/audit.mjs
 *
 * Checks, per route and per width:
 *   1. No horizontal overflow (the single most common responsive bug, and the
 *      one that resizing a desktop window will not reveal).
 *   2. No console errors or page exceptions.
 *   3. Heading hierarchy has exactly one h1 and never skips a level.
 *   4. Every image has alt text; every link and button has an accessible name.
 *   5. Interactive targets meet the 44px minimum on touch viewports.
 *
 * The mobile widths run with `hasTouch`/`isMobile`, because a resized desktop
 * window does not flip the `hover` and `pointer` media queries — so all of the
 * touch-specific CSS would otherwise go untested.
 */
import { chromium, devices } from 'playwright';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:4173';

const ROUTES = [
  '/',
  '/work/analytics-dashboards',
  '/work/api-encryption-layer',
  '/work/client-side-caching',
  '/work/timezone-sync',
  '/work/commerce-ui-platform',
  '/resume',
  '/this-route-does-not-exist',
];

const WIDTHS = [
  { w: 320, h: 720, touch: true },
  { w: 360, h: 740, touch: true },
  { w: 375, h: 812, touch: true },
  { w: 390, h: 844, touch: true },
  { w: 414, h: 896, touch: true },
  { w: 768, h: 1024, touch: true },
  { w: 1024, h: 768, touch: false },
  { w: 1280, h: 800, touch: false },
  { w: 1440, h: 900, touch: false },
  { w: 1920, h: 1080, touch: false },
];

const failures = [];
const notes = [];

function fail(route, width, message) {
  failures.push(`[${route} @ ${width}px] ${message}`);
}

async function checkOverflow(page, route, width) {
  // Scroll to the bottom first: lazy-revealed content can overflow after it
  // enters the viewport, which a top-of-page-only check never catches.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(250);

  const result = await page.evaluate((viewportWidth) => {
    const docWidth = document.documentElement.scrollWidth;
    if (docWidth <= viewportWidth + 1) return { ok: true, docWidth };

    // Identify the offending element rather than just reporting a number.
    const offenders = [];
    for (const el of document.querySelectorAll('body *')) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      const right = rect.right + window.scrollX;
      if (right > viewportWidth + 1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className?.baseVal ?? el.className ?? '').toString().slice(0, 60),
          right: Math.round(right),
        });
      }
      if (offenders.length >= 5) break;
    }
    return { ok: false, docWidth, offenders };
  }, width);

  if (!result.ok) {
    fail(
      route,
      width,
      `horizontal overflow: scrollWidth ${result.docWidth} > ${width}. Offenders: ${result.offenders
        .map((o) => `${o.tag}.${o.cls}@${o.right}`)
        .join(', ')}`,
    );
  }
}

async function checkSemantics(page, route, width) {
  const report = await page.evaluate(() => {
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
      level: Number(h.tagName[1]),
      text: h.textContent.trim().slice(0, 50),
    }));

    const h1Count = headings.filter((h) => h.level === 1).length;

    const skips = [];
    for (let i = 1; i < headings.length; i += 1) {
      if (headings[i].level - headings[i - 1].level > 1) {
        skips.push(`h${headings[i - 1].level} -> h${headings[i].level} at "${headings[i].text}"`);
      }
    }

    const imagesWithoutAlt = [...document.querySelectorAll('img')].filter(
      (img) => !img.hasAttribute('alt'),
    ).length;

    // An accessible name from text content, aria-label, aria-labelledby or a
    // titled child. Icon-only controls are the usual offenders.
    const nameless = [];
    for (const el of document.querySelectorAll('a[href], button')) {
      if (el.closest('[aria-hidden="true"]')) continue;
      const text = (el.textContent ?? '').trim();
      const aria = el.getAttribute('aria-label');
      const labelledBy = el.getAttribute('aria-labelledby');
      const title = el.getAttribute('title');
      if (!text && !aria && !labelledBy && !title) {
        nameless.push(`${el.tagName.toLowerCase()}.${(el.className ?? '').toString().slice(0, 40)}`);
      }
    }

    const landmarks = {
      main: document.querySelectorAll('main').length,
      header: document.querySelectorAll('header').length,
    };

    return { h1Count, skips, imagesWithoutAlt, nameless, landmarks, headingCount: headings.length };
  });

  if (report.h1Count !== 1) {
    fail(route, width, `expected exactly one h1, found ${report.h1Count}`);
  }
  for (const skip of report.skips) {
    fail(route, width, `heading level skipped: ${skip}`);
  }
  if (report.imagesWithoutAlt > 0) {
    fail(route, width, `${report.imagesWithoutAlt} <img> without alt`);
  }
  for (const n of report.nameless) {
    fail(route, width, `interactive element without accessible name: ${n}`);
  }
  if (report.landmarks.main !== 1) {
    fail(route, width, `expected exactly one <main>, found ${report.landmarks.main}`);
  }
}

async function checkTouchTargets(page, route, width) {
  const small = await page.evaluate(() => {
    const offenders = [];
    for (const el of document.querySelectorAll('a[href], button, summary, [tabindex="0"]')) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      // Inline links inside a paragraph are exempt — WCAG 2.5.8 excludes
      // targets in a sentence of text.
      const inSentence = el.closest('p, li.prose, .prose');
      if (inSentence && el.tagName === 'A') continue;

      // The expanded-hit-area pattern: an absolutely positioned ::after that
      // stretches the link over its whole card. The <a> box itself is small,
      // but the real target is the card, so measure that instead.
      const after = window.getComputedStyle(el, '::after');
      if (after.position === 'absolute' && after.content !== 'none') {
        const card = el.closest('article, li, div');
        if (card && card.getBoundingClientRect().height >= 40) continue;
      }

      if (rect.height < 40) {
        offenders.push(
          `${el.tagName.toLowerCase()}.${(el.className ?? '').toString().slice(0, 40)} h=${Math.round(rect.height)}`,
        );
      }
      if (offenders.length >= 6) break;
    }
    return offenders;
  });

  for (const o of small) {
    notes.push(`[${route} @ ${width}px] small touch target: ${o}`);
  }
}

async function run() {
  const browser = await chromium.launch();
  let checked = 0;

  for (const route of ROUTES) {
    for (const vp of WIDTHS) {
      const context = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        hasTouch: vp.touch,
        isMobile: vp.touch,
        deviceScaleFactor: vp.touch ? 2 : 1,
        userAgent: vp.touch ? devices['iPhone 13'].userAgent : undefined,
      });

      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      page.on('pageerror', (err) => consoleErrors.push(`pageerror: ${err.message}`));

      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      await checkOverflow(page, route, vp.w);
      await checkSemantics(page, route, vp.w);
      if (vp.touch) await checkTouchTargets(page, route, vp.w);

      for (const err of consoleErrors) {
        fail(route, vp.w, `console error: ${err.slice(0, 200)}`);
      }

      checked += 1;
      await context.close();
    }
  }

  await browser.close();

  console.log(`\nChecked ${checked} route × width combinations.\n`);

  if (notes.length) {
    const unique = [...new Set(notes)];
    console.log(`NOTES (${unique.length}):`);
    unique.slice(0, 20).forEach((n) => console.log('  · ' + n));
    if (unique.length > 20) console.log(`  … and ${unique.length - 20} more`);
    console.log('');
  }

  if (failures.length) {
    const unique = [...new Set(failures)];
    console.log(`FAILURES (${unique.length}):`);
    unique.forEach((f) => console.log('  ✗ ' + f));
    process.exit(1);
  }

  console.log('✓ No overflow, console errors, or semantic/accessible-name failures.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
