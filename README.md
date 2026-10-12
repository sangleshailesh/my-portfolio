# Shailesh Sangle — Portfolio

A single-page portfolio with case-study routes, built on React 19 + Vite.

```bash
npm install
npm run dev            # http://localhost:5173
npm run build
npm run preview        # http://localhost:4173
npm run lint

# against a running preview server:
npm run audit          # layout + a11y across every route × 10 widths
npm run interactions   # behavioural tests (nav, theme, chart, routing, a11y)
npm run shots          # render key views to shots/ for eyeballing
npm run verify         # lint + build + audit + interactions
```

---

## ⚠️ Before you deploy

Configuration lives in [`src/data/portfolioData.js`](src/data/portfolioData.js). Search for `NEEDS_INPUT`.

| What | Where | Status |
|---|---|---|
| **LinkedIn URL** | `LINKEDIN_URL` | ✅ Set — `linkedin.com/in/shailesh-sangle-7a09251b9` |
| **GitHub URL** | `GITHUB_URL` | ⚠️ Unset. Every GitHub link stays hidden site-wide; nothing breaks, the lists just get shorter. Leave it if you have no public GitHub worth linking. |
| **Deployed origin** | `SITE_URL` | ⚠️ Currently `https://shaileshsangle.dev` — a guess. Drives canonical URLs, Open Graph tags and `sitemap.xml`. Set it to the domain you actually deploy to. |

Placeholder and `#` links are deliberately *not* rendered. A 404 on a profile link is read as carelessness by the people this site is for, so the components check the value and omit the link instead.

### Résumé PDF (optional)

There is no PDF in `public/`, so `RESUME_PDF` is `null` and the **Résumé** button points at the built-in `/resume` page instead. That page is generated from the same data as the rest of the site, prints cleanly to A4, and can never go stale or 404.

To add a real PDF as well:

1. Drop it in `public/`, e.g. `public/Shailesh-Sangle-Frontend-Engineer.pdf`
2. Set `RESUME_PDF = '/Shailesh-Sangle-Frontend-Engineer.pdf'`

A "Download PDF" action then appears next to the Résumé link everywhere.

---

## Editing content

**All copy lives in [`src/data/portfolioData.js`](src/data/portfolioData.js).** Components contain no prose. Adding a case study means adding an object to `projects` — the route, the index entry, the sitemap and the related-work links all follow automatically.

Everything currently in that file traces to the résumé. Nothing is invented: no fabricated metrics, no testimonials, no client logos, no projects that did not happen. Where a figure is qualitative rather than measured, it carries a `note` that says so, and the UI renders that note under the number.

---

## Structure

```
src/
├── data/portfolioData.js      ← all content, single source of truth
├── lib/
│   ├── content.js             ← link guards, project lookup
│   └── schema.js              ← JSON-LD builders
├── hooks/
│   ├── useScrollSpy.js        ← section tracking for the rail
│   ├── useReveal.js           ← ONE shared IntersectionObserver
│   ├── useTheme.js
│   └── useMotionPreference.js
├── styles/
│   ├── tokens.css             ← every colour, size, duration, easing
│   └── base.css               ← reset, type, a11y, motion system
├── components/
│   ├── Rail/                  ← desktop identity column + nav (the h1)
│   ├── MobileBar/             ← sticky bar + <dialog> menu
│   ├── About|Experience|Work|Skills|Recognition|Contact|Footer/
│   ├── ArchitectureDiagram/   ← data-driven flow diagrams
│   ├── SyntheticChart/        ← interactive demo, zero dependencies
│   └── ui/                    ← Action, Icon, Reveal, TechTags, …
└── pages/
    ├── Home.jsx
    ├── CaseStudy.jsx          ← lazy
    ├── Resume.jsx             ← lazy, print-optimised
    └── NotFound.jsx           ← lazy
```

---

## Design decisions worth knowing

**No screenshots, by design.** All of this work is client and internal product work. Rather than filling image slots with gradient placeholders — the universally recognised signal for "there was no image" — the visual system generates its own: hand-built architecture diagrams, a mono metadata rail, and one genuinely interactive chart. A published confidentiality policy states the rules, which turns the same absence into a professionalism signal rather than a gap.

**The home page ships zero animation JavaScript.** Motion is loaded only inside the lazy `/work/:slug` chunk. Scroll reveals run on one shared IntersectionObserver and CSS transitions; the hero entrance is a pure CSS keyframe. Given the résumé claims performance work, a portfolio that janks would refute the claim more effectively than any animation could support it.

**Reveals are written additively.** Elements render visible and are only marked pending once JS runs. If the script fails, content is simply there — never stranded at `opacity: 0`, which is the most damaging and most common portfolio bug.

**Reduced motion is a designed state, not a kill switch.** Opacity fades survive; travel, stagger and smooth scrolling do not. There is also a user-facing toggle (the waveform icon) that defaults to the OS setting and persists — useful because it is an accessibility affordance a reviewer can actually exercise.

**Preference state lives outside React.** The theme and motion controls render twice — desktop rail and mobile bar — with CSS choosing which is visible. Two `useState` copies would drift the moment one was toggled, so both read a module-level store through `useSyncExternalStore`.

**Deliberately not shipped**, despite being on most portfolio checklists: magnetic buttons, a custom cursor, parallax, a preloader, tilt cards, a typewriter headline, a tech-logo marquee, and skill percentage bars. Each is on a current "overused" list, and for a senior-level claim they read as *learned the effects* rather than *has judgement about when not to use them*. The contact section is a visible email address rather than a form, because a form is the one contact pattern a recruiter cannot forward to a hiring manager.

**Warm charcoal + amber, not navy + mint.** The cool-navy-plus-mint palette is the most-cloned developer-portfolio scheme there is and reads as a fork on sight. Warm neutrals are near-absent in this category, and amber-on-charcoal suits work about instruments and analytics.

**No skill percentage bars.** A self-assigned "React — 95%" is unverifiable, invisible to parsers, and reads as a junior tell. The two-tier split (used daily / shipped with) says something checkable instead.

---

## Setup

Requires **Node 20.19+ or 22.12+** (Vite 8 will refuse to start on older runtimes).

```bash
git clone <your-repo-url> portfolio
cd portfolio
npm install
npm run dev          # http://localhost:5173
```

`npm install` also pulls Playwright, which the two test suites use. Playwright needs its browser binary once:

```bash
npx playwright install chromium
```

Skip that if you are only going to build and deploy — nothing in `dev` or `build` touches it.

### Build commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR on :5173 |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serves the built `dist/` on :4173 — this is what the tests run against |
| `npm run lint` | oxlint |
| `npm run audit` | Layout + a11y, every route × 10 widths (needs preview running) |
| `npm run interactions` | 27 behavioural tests (needs preview running) |
| `npm run shots` | Renders key views to `shots/` for eyeballing |
| `npm run verify` | lint → build → audit → interactions |

Build output is entirely static: HTML, CSS, JS and a few files in `public/`. There is no server, no API and no database.

---

## Environment variables

**There are none, and none are needed.** Nothing in `src/` reads `import.meta.env` or `process.env` — you can verify that with `grep -rn "import.meta.env\|process.env" src/`, which returns nothing.

Everything configurable is a plain exported constant in [`src/data/portfolioData.js`](src/data/portfolioData.js): `LINKEDIN_URL`, `GITHUB_URL`, `SITE_URL`, `RESUME_PDF`. That is deliberate. These values are all **public** — they end up visible in the shipped HTML regardless — so putting them behind env vars would add a deployment step and a class of "works locally, broken in production" failure while hiding nothing. Edit the file, commit, redeploy.

If you later add something genuinely secret (an analytics key, a contact-form endpoint), that is the point to introduce `VITE_`-prefixed variables — and note that **anything prefixed `VITE_` is embedded in the client bundle and is therefore still public**. Real secrets need a server.

---

## Deploying free on Vercel

Vercel's Hobby tier is free, gives HTTPS and a `*.vercel.app` domain, and redeploys on every push.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

### 2. Import the project

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. **Add New → Project**, then import the repository.
3. Vercel detects Vite and fills these in. Confirm they match:

   | Setting | Value |
   |---|---|
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |
   | Node.js Version | 22.x |

4. Leave **Environment Variables** empty — see above.
5. **Deploy.** First build takes about a minute.

### 3. Point `SITE_URL` at the real domain

Vercel gives you something like `shailesh-portfolio.vercel.app`. Put that (or your custom domain) into `SITE_URL` in `portfolioData.js`, then regenerate the sitemap and push:

```bash
node --input-type=module -e "
import { projects, SITE_URL } from './src/data/portfolioData.js';
import { writeFileSync } from 'node:fs';
const routes = ['/', '/resume', ...projects.map(p => '/work/' + p.slug)];
writeFileSync('public/sitemap.xml',
  '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n' +
  routes.map(r => '  <url><loc>' + SITE_URL + r + '</loc><changefreq>monthly</changefreq><priority>' + (r === '/' ? '1.0' : '0.8') + '</priority></url>').join('\n') +
  '\n</urlset>\n');
console.log('sitemap regenerated for ' + SITE_URL);
"
git commit -am "Set production origin" && git push
```

`public/robots.txt` also hardcodes the sitemap URL — update that line too.

### 4. Custom domain (optional)

**Project → Settings → Domains → Add.** For an apex domain set an `A` record to `76.76.21.21`; for `www` set a `CNAME` to `cname.vercel-dns.com`. Vercel issues the certificate automatically.

### 5. After the first deploy

- Submit `https://<your-domain>/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) so a search for your name finds this and not only LinkedIn.
- Run the suites against the live URL: `AUDIT_BASE=https://<your-domain> npm run audit`

---

## Routing configuration

`/`, `/resume`, `/work/:slug` and the 404 are **client-side routes** — the server only ever has one real file, `index.html`. So every path must fall back to it, or `/work/analytics-dashboards` returns a hard 404 on refresh or when someone opens a shared link.

Both configs are already committed:

- **Vercel** — [`vercel.json`](vercel.json): rewrites `/(.*)` → `/index.html`, plus a one-year immutable cache header on `/assets/*` (safe because Vite content-hashes those filenames).
- **Netlify** — [`public/_redirects`](public/_redirects): `/*  /index.html  200`.

Other hosts:

| Host | Configuration |
|---|---|
| nginx | `location / { try_files $uri $uri/ /index.html; }` |
| Apache | `FallbackResource /index.html` |
| GitHub Pages | Copy `dist/index.html` to `dist/404.html` after building |
| Cloudflare Pages | Add `/* /index.html 200` to `public/_redirects` (already present) |

Note the rewrite must be a **rewrite/200, not a redirect/301** — a redirect changes the URL in the address bar and breaks deep links.

---

## Troubleshooting

**`/work/<slug>` 404s on refresh, works when clicked.**
The SPA fallback is not active. On Vercel, confirm `vercel.json` is at the repository root and that Output Directory is `dist`. See *Routing configuration*.

**Blank white page, console shows a MIME-type or 404 error on `/assets/*.js`.**
Output Directory is wrong, or the app was deployed to a sub-path. This build assumes it is served from the domain root. For a sub-path, set `base: '/sub-path/'` in `vite.config.js` and rebuild.

**Build fails with `crypto.hash is not a function` or similar.**
Node is too old. Vite 8 needs Node 20.19+ / 22.12+. On Vercel: **Settings → General → Node.js Version → 22.x**.

**`manualChunks is not a function`.**
Vite 8 uses Rolldown, which only accepts the function form. `vite.config.js` already uses it — this appears if the object form is reintroduced.

**Fonts render in a fallback for a moment.**
Expected. Inter and JetBrains Mono load from Google Fonts with `display=swap`, which shows fallback text immediately rather than blocking the first paint. To remove the swap entirely, self-host the two variable WOFF2 files and add metric-matched `@font-face` fallbacks.

**LinkedIn or GitHub links are missing.**
By design when the constant is still `NEEDS_INPUT` — `hasLink()` in [`src/lib/content.js`](src/lib/content.js) omits the link rather than rendering a dead one. Set the constant and rebuild.

**`npm run audit` / `npm run interactions` fail to connect.**
They test the built output, not the dev server. Run `npm run build && npm run preview` first; they expect `http://localhost:4173`, overridable with `AUDIT_BASE`.

**Playwright errors with "Executable doesn't exist".**
`npx playwright install chromium`.

**Open Graph preview shows the wrong URL when shared.**
`SITE_URL` still points at the placeholder domain. See step 3 above.

---

## Tests

Both suites run against a built preview server, not the dev server, so they exercise what actually ships.

```bash
npm run build && npm run preview &
npm run verify
```

**`scripts/audit.mjs`** — structure. Drives a real Chromium over every route at ten widths (320 → 1920), with `hasTouch`/`isMobile` set on the mobile ones; a resized desktop window never flips the `hover` and `pointer` media queries, so touch-specific CSS would otherwise go untested. Fails on horizontal overflow (naming the offending element), console errors, anything other than exactly one `h1`, skipped heading levels, missing `alt`, interactive elements with no accessible name, and more than one `<main>`. Sub-44px touch targets are reported as notes.

**`scripts/interactions.mjs`** — behaviour. 27 checks covering the skip link, theme and motion toggles and their persistence, scroll-spy (including the bottom-of-page case that most implementations get wrong), scroll reveals resolving with nothing stranded invisible, per-route titles / canonical / JSON-LD, the chart's timezone control actually re-resolving its axis, `<details>` keeping collapsed text in the DOM, the mobile dialog's open / Escape / scroll-lock / restore cycle, and routing including the back button.

Three bugs this pair caught that review had not:

- Scroll reveals left 17 elements stranded at `opacity: 0` after a nav jump — an element that goes from below the viewport to above it in one frame never crosses a threshold, so the observer never fires for it. Fixed with an asymmetric `rootMargin`, not a callback check.
- Focusing `<main>` on first load put the skip link behind the user's first Tab, defeating it entirely.
- Off the home page the mobile menu's five section links pointed at ids that did not exist on that route.

---

## Stack

React 19 · Vite 8 (Rolldown) · React Router 7 · Motion 13 (case-study route only) · CSS Modules + custom properties. No CSS framework, no component library, no icon package, no charting library.
