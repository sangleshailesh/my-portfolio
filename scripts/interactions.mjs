/**
 * Behavioural tests for the interactive parts. The audit checks structure;
 * this checks that things actually work.
 *
 *   npm run build && npm run preview &
 *   node scripts/interactions.mjs
 */
import { chromium } from 'playwright';

const BASE = process.env.AUDIT_BASE ?? 'http://localhost:4173';
const results = [];

function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
}

const browser = await chromium.launch();

/* ── Desktop ──────────────────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // Skip link first, on a pristine page. Chromium remembers a sequential
  // focus starting point that blur() does not reset, so this has to run
  // before anything on the page has been clicked.
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => document.activeElement?.className ?? '');
  check('first Tab reaches the skip link', firstFocus.includes('skip-link'), firstFocus.slice(0, 40));

  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  const landedOnMain = await page.evaluate(() => document.activeElement?.id === 'content');
  check('skip link moves focus to main content', landedOnMain);

  // Theme toggle flips the root attribute and persists.
  const before = await page.getAttribute('html', 'data-theme');
  await page.locator('button[aria-label*="Switch to"]:visible').click();
  await page.waitForTimeout(250);
  const after = await page.getAttribute('html', 'data-theme');
  check('theme toggle flips theme', before !== after, `${before} -> ${after}`);

  await page.reload({ waitUntil: 'networkidle' });
  const persisted = await page.getAttribute('html', 'data-theme');
  check('theme persists across reload', persisted === after, persisted);

  // Motion toggle.
  await page.locator('button[aria-label*="animations"]:visible').click();
  await page.waitForTimeout(150);
  const motion = await page.getAttribute('html', 'data-motion');
  check('motion toggle sets reduced', motion === 'reduced', String(motion));

  // Scroll spy marks the right nav item, and only one.
  await page.evaluate(() => document.getElementById('skills')?.scrollIntoView());
  await page.waitForTimeout(700);
  const active = await page.$$eval('nav[aria-label="Sections"] a[aria-current="true"]', (els) =>
    els.map((e) => e.textContent.trim()),
  );
  check('scroll spy marks exactly one section', active.length === 1, active.join(','));
  check('scroll spy tracks to Skills', active[0]?.toUpperCase().includes('SKILL'), active[0] ?? 'none');

  // Bottom of page activates the last nav item — the classic scroll-spy bug.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  const last = await page.$$eval('nav[aria-label="Sections"] a[aria-current="true"]', (els) =>
    els.map((e) => e.textContent.trim()),
  );
  check('bottom of page activates last section', last[0]?.toUpperCase().includes('CONTACT'), last[0] ?? 'none');

  // Reveals actually resolve — nothing left stranded invisible.
  const stranded = await page.$$eval('[data-reveal]', (els) =>
    els.filter((e) => e.dataset.reveal !== 'shown').length,
  );
  check('no element left in the pending reveal state', stranded === 0, `${stranded} pending`);

  // Nothing may be left stranded at opacity 0 after a jump past it — the
  // reveal must catch elements that were scrolled over, not just entered.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const strandedAfterReturn = await page.$$eval('[data-reveal]', (els) =>
    els.filter((e) => e.dataset.reveal !== 'shown').length,
  );
  check('nothing stranded after scrolling back up', strandedAfterReturn === 0, `${strandedAfterReturn} pending`);

  await ctx.close();
}

/* ── Case study ───────────────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/work/analytics-dashboards`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const title = await page.title();
  check('case study sets its own title', title.includes('Interactive Analytics Dashboards'), title);

  const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
  check('canonical URL is per-route', canonical?.endsWith('/work/analytics-dashboards'), String(canonical));

  const ld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent));
  check('JSON-LD present and parseable', ld.length > 0 && !!JSON.parse(ld[0]), `${ld.length} block(s)`);

  // The synthetic chart renders and its timezone control actually re-resolves labels.
  const labelsIST = await page.$$eval('svg text', (els) => els.map((e) => e.textContent));
  await page.click('button:has-text("New York")');
  await page.waitForTimeout(400);
  const labelsNY = await page.$$eval('svg text', (els) => els.map((e) => e.textContent));
  check('chart renders axis labels', labelsIST.length > 0, `${labelsIST.length} labels`);
  check(
    'timezone control re-resolves the axis',
    JSON.stringify(labelsIST) !== JSON.stringify(labelsNY),
    `${labelsIST.slice(-3).join('/')} -> ${labelsNY.slice(-3).join('/')}`,
  );

  const pressed = await page.getAttribute('button:has-text("New York")', 'aria-pressed');
  check('selected zone reports aria-pressed', pressed === 'true', String(pressed));

  // Collapsed detail content stays in the DOM so Ctrl+F and crawlers find it.
  const hiddenText = await page.$$eval('details:not([open])', (els) =>
    els.map((e) => (e.textContent ?? '').trim().length),
  );
  check(
    'collapsed <details> keep their content in the DOM',
    hiddenText.every((len) => len > 40),
    hiddenText.join(','),
  );

  await ctx.close();
}

/* ── Mobile menu ──────────────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });

  // Only one set of theme controls on mobile — the rail's copy must be hidden.
  const themeButtons = await page.$$eval('button[aria-label*="Switch to"]', (els) =>
    els.filter((e) => e.getBoundingClientRect().width > 0).length,
  );
  check('theme control is not duplicated on mobile', themeButtons === 1, `${themeButtons} visible`);

  await page.click('button[aria-haspopup="dialog"]');
  await page.waitForTimeout(400);

  const dialogOpen = await page.$eval('dialog', (d) => d.open);
  check('menu opens as a modal dialog', dialogOpen === true);

  // showModal() puts the dialog in the top layer and makes the page inert.
  const bodyLocked = await page.evaluate(() => document.body.style.overflow === 'hidden');
  check('background scroll is locked while the menu is open', bodyLocked);

  // Escape closes it — free with showModal(), broken in most hand-rolled traps.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = await page.$eval('dialog', (d) => !d.open);
  check('Escape closes the menu', closed);

  const unlocked = await page.evaluate(() => document.body.style.overflow === '');
  check('scroll lock is released on close', unlocked);

  // Section jump from the menu lands on the section.
  await page.click('button[aria-haspopup="dialog"]');
  await page.waitForTimeout(300);
  await page.click('dialog a[href="#work"]');
  await page.waitForTimeout(1200);
  const atWork = await page.evaluate(() => {
    const el = document.getElementById('work');
    if (!el) return false;
    const top = el.getBoundingClientRect().top;
    return top > -120 && top < 200;
  });
  check('menu link scrolls to its section', atWork);

  await ctx.close();
}

/* ── Routing ──────────────────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: 'dark' });
  const page = await ctx.newPage();

  await page.goto(`${BASE}/work/not-a-real-project`, { waitUntil: 'networkidle' });
  const notFoundText = await page.textContent('h1');
  check('unknown project slug renders the 404 view', /doesn't exist/i.test(notFoundText ?? ''), notFoundText ?? '');

  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.click('a[href="/work/api-encryption-layer"]');
  await page.waitForTimeout(800);
  const h1 = await page.textContent('h1');
  check('project link navigates to the case study', /Encryption/.test(h1 ?? ''), h1 ?? '');

  const scrolledTop = await page.evaluate(() => window.scrollY < 40);
  check('navigation resets scroll to the top', scrolledTop);

  await page.goBack({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const backHome = await page.textContent('h1');
  check('back button returns to the portfolio', /Shailesh/.test(backHome ?? ''), backHome ?? '');

  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} passed.`);
if (failed.length) {
  console.log('\nFAILED:');
  failed.forEach((f) => console.log(`  ✗ ${f.name} — ${f.detail}`));
  process.exit(1);
}
