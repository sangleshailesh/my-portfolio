/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH FOR ALL PORTFOLIO CONTENT
 * ─────────────────────────────────────────────────────────────────────────────
 * Every string in this file traces back to Shailesh Sangle's resume.
 * Nothing here is invented: no fabricated metrics, clients, repos, or awards.
 *
 * ⚠️  Values still needing your input are marked "NEEDS_INPUT" below.
 *     Until they are filled in, the matching links are hidden from the UI
 *     automatically (see `hasLink()` in src/lib/content.js). Nothing breaks.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const LINKEDIN_URL = 'https://www.linkedin.com/in/shailesh-sangle-7a09251b9/';

/** Replace with your GitHub URL, or leave as-is to hide the GitHub link everywhere. */
export const GITHUB_URL = 'NEEDS_INPUT';

/** Deployed origin — used for canonical URL, sitemap, and Open Graph tags. */
export const SITE_URL = 'https://shaileshsangle.dev'; // NEEDS_INPUT if you deploy elsewhere

/**
 * Path to your resume PDF once you drop the file into `public/`.
 *
 * Left null deliberately: a "Download resume" button wired to a file that
 * isn't there is worse than no button, and recruiters treat a 404 on it as a
 * carelessness signal. While this is null the site links to the built-in
 * /resume page instead (real content, print-to-PDF ready), so the route is
 * never dead. Set it to e.g. '/Shailesh-Sangle-Frontend-Engineer.pdf' and a
 * "Download PDF" action appears alongside it automatically.
 */
export const RESUME_PDF = null;

export const profile = {
  name: 'Shailesh Sangle',
  firstName: 'Shailesh',
  title: 'Senior Frontend Engineer',
  discipline: 'React · TypeScript · Data-Heavy Interfaces',
  yearsExperience: '5+',
  email: 'sangleshailesh30@gmail.com',
  phones: ['+91 98212 13016', '+91 81048 07634'],

  // Hero positioning — derived from the resume summary, compressed for scanning.
  headline: 'I build data-heavy React interfaces that stay fast under load.',
  positioning:
    'Five-plus years shipping production frontends across healthcare and e-commerce — interactive analytics dashboards, an end-to-end API encryption layer, and the caching and rendering work that keeps them quick.',

  // Sits under the title as a factual, keyword-bearing micro-label. These are
  // the terms a recruiter running a boolean search actually types.
  microLabel: '5+ years · React · TypeScript · Next.js',

  // Short form used in meta description / OG tags.
  metaDescription:
    'Shailesh Sangle — Senior Frontend Engineer with 5+ years building scalable React, Redux and TypeScript applications across healthcare and e-commerce. Analytics dashboards, API security, and page-load optimization.',

  availability: 'Open to senior frontend roles',
};

/**
 * ABOUT — a narrative built from the resume summary + experience, not a copy of it.
 * Split into passages so the UI can typeset them rather than dumping a paragraph.
 */
export const about = {
  lead: 'I work on the part of the stack where design decisions become performance problems.',
  passages: [
    'Most of my five years have gone into interfaces that carry real weight — analytics dashboards rendering charts and geo-maps, product catalogues with dynamic sorting and pagination, order screens people use all day. The interesting work is rarely the first render. It is the second one: what happens when the payload grows, when the user is in another time zone, when the same API is hit four times for data that has not changed.',
    'At Dure Technologies I build health-tech dashboards with React, Redux and Highcharts, and spend a good share of my time on what sits underneath them — a local-storage caching layer that cut redundant API calls and lifted performance by around 30%, timezone-aware synchronization so global users see accurate data, and an end-to-end encryption and decryption mechanism that keeps request and response payloads unreadable in the browser network tab.',
    'Before that, at Adaptiv Solutions / Apexon, I was the engineer clients talked to directly. I translated business requirements into UI specifications and shipped them across three concurrent projects — product listings, headless-CMS-driven landing pages, CRUD search-result management, onboarding walkthroughs, and a bulk-print feature that saved order teams hours of manual work every week.',
  ],
  principles: [
    {
      title: 'Measure before optimizing',
      body: 'Caching, lazy loading and code splitting are means, not goals. I reach for them once I know which request or render is actually costing the user time.',
    },
    {
      title: 'Security is a frontend concern',
      body: 'Anything the browser can read, someone will read. Designing the encryption layer for API payloads taught me to treat the network tab as part of the threat model.',
    },
    {
      title: 'Requirements are the hard part',
      body: 'Years as the client-facing engineer meant turning ambiguous business asks into UI specs that survived review. Clear specs prevent more bugs than clever code fixes.',
    },
    {
      title: 'Ship under real constraints',
      body: 'Running three client projects at once, fixing production issues to deadline — I optimize for the version that ships correctly, not the version that is theoretically perfect.',
    },
  ],
  domains: ['Healthcare / Health-tech', 'E-commerce / Retail'],
};

/**
 * EXPERIENCE — faithful to the resume, restructured for impact-first reading.
 */
export const experience = [
  {
    id: 'dure',
    company: 'Dure Technologies Pvt. Ltd.',
    role: 'Software Engineer',
    period: 'Jun 2023 — Present',
    start: '2023-06',
    end: null,
    current: true,
    domain: 'Healthcare',
    summary:
      'Building interactive analytics dashboards for a health-tech product, plus the caching, security and rendering work that keeps them fast and trustworthy.',
    highlights: [
      {
        impact: 'Interactive analytics dashboards',
        detail:
          'Engineered dashboards using Highcharts — charts and geo-maps — improving data comprehension and delivering visually engaging analytics for end users.',
      },
      {
        impact: '~30% application performance gain',
        detail:
          'Introduced local-storage caching that reduced redundant API calls and significantly decreased page load times.',
      },
      {
        impact: 'Timezone-aware real-time sync',
        detail:
          'Implemented dashboard synchronization that shows accurate data for global users across every time zone, eliminating scheduling discrepancies.',
      },
      {
        impact: 'End-to-end API encryption',
        detail:
          'Architected an encryption–decryption mechanism securing all request and response payloads, eliminating readable data exposure in the browser network tab.',
      },
      {
        impact: 'SSR and unit-test coverage',
        detail:
          'Applying Next.js server-side rendering to speed up page loads, and writing Jest unit tests to keep user flows smooth and bug-free.',
      },
    ],
    stack: ['React.js', 'Redux', 'TypeScript', 'Next.js', 'Highcharts', 'Jest', 'HTML5', 'CSS3'],
  },
  {
    id: 'adaptiv',
    company: 'Adaptiv Solutions / Apexon Pvt. Ltd.',
    role: 'Software Engineer',
    period: 'Feb 2021 — Jun 2023',
    start: '2021-02',
    end: '2023-06',
    current: false,
    domain: 'E-commerce',
    summary:
      'Primary client-facing engineer across three concurrent retail projects — translating business requirements into shipped UI, from product listings to headless-CMS pages.',
    highlights: [
      {
        impact: 'Client-facing requirements ownership',
        detail:
          'Served as the primary client-facing engineer, gathering and translating business requirements into UI specifications and consistently meeting client expectations.',
      },
      {
        impact: 'Core commerce UI modules',
        detail:
          'Developed Product Listing, Header Section and custom pages with dynamic sorting and pagination, improving product discoverability.',
      },
      {
        impact: 'Headless CMS integration',
        detail:
          'Enhanced product and landing pages by fetching dynamic content through Optimizely headless CMS APIs.',
      },
      {
        impact: 'CRUD + guided onboarding',
        detail:
          'Engineered full CRUD functionality for search-result management and implemented user onboarding with page-walkthrough features, reducing support queries.',
      },
      {
        impact: 'Bulk-print for order operations',
        detail:
          'Delivered a bulk-print feature letting users select and print multiple order records straight from the listing page, saving teams hours of manual effort weekly.',
      },
      {
        impact: 'Three concurrent client projects',
        detail:
          'Managed BCI, IBU and Tecumseh in parallel, resolving critical production bugs under tight deadlines — recognised with two "Pat on Back" awards.',
      },
    ],
    stack: ['React.js', 'Redux', 'TypeScript', 'JavaScript', 'Optimizely CMS', 'HTML5', 'CSS3'],
  },
];

/**
 * CASE STUDIES — derived strictly from resume bullets, expanded into the
 * problem/approach/contribution/outcome frame a technical interviewer reads.
 *
 * `architecture` draws the approach the resume states. It illustrates the
 * described design; it is not a claim about proprietary internals.
 *
 * NOTE: all of this is client / internal product work. There are deliberately
 * no live demo or repository links, and no screenshots — see `confidential`.
 */
export const projects = [
  {
    slug: 'analytics-dashboards',
    index: '01',
    title: 'Interactive Analytics Dashboards',
    tagline: 'Charts and geo-maps that made health data readable at a glance.',
    company: 'Dure Technologies Pvt. Ltd.',
    period: 'Jun 2023 — Present',
    domain: 'Healthcare',
    confidential: true,
    featured: true,
    accent: 'chart',
    problem:
      'Health-programme data arrives as dense, multi-dimensional records. Delivered as tables, it is technically complete and practically unreadable — users could not see distribution, trend or geography without exporting and rebuilding the view themselves.',
    approach:
      'I built the dashboard layer in React and Redux on top of Highcharts, using both standard chart types and geo-maps so the same dataset could be read as a distribution, as a trend, and as a map. Redux holds the normalized dashboard state so a single fetch feeds several linked visualizations instead of each widget requesting its own slice.',
    contribution: [
      'Engineered the interactive dashboard components and their Highcharts configuration, including chart and geo-map views.',
      'Modelled dashboard state in Redux so multiple visualizations share one source of data.',
      'Worked through the rendering and data-shaping details that make large series readable rather than merely plotted.',
    ],
    challenges: [
      {
        challenge: 'Geo-maps and charts driven by the same dataset',
        resolution:
          'Normalizing the data once in the store, then deriving each chart’s series from it, rather than fetching and reshaping per widget.',
      },
      {
        challenge: 'Keeping dense series comprehensible',
        resolution:
          'Choosing chart types and Highcharts configuration around what the user needs to compare, so the visualization answers a question instead of just displaying rows.',
      },
    ],
    outcome: [
      { label: 'Data comprehension', value: 'Improved', note: 'Qualitative, per resume — not a measured figure' },
      { label: 'Visualization surface', value: 'Charts + geo-maps' },
    ],
    stack: ['React.js', 'Redux', 'Highcharts', 'TypeScript', 'CSS3'],
    architecture: {
      caption: 'How a dashboard view is assembled',
      summary:
        'A single fetch is normalized into the store once, and each visualization derives its own series from that one copy — rather than every widget requesting and reshaping its own slice.',
      layers: [
        { nodes: [{ label: 'Dashboard API', sub: 'one fetch per dataset', kind: 'service' }] },
        { nodes: [{ label: 'Redux store', sub: 'normalized dataset', kind: 'state' }] },
        {
          connector: 'derive',
          nodes: [{ label: 'Selectors', sub: 'per-chart series', kind: 'logic' }],
        },
        {
          nodes: [
            { label: 'Highcharts', sub: 'charts', kind: 'view' },
            { label: 'Highcharts', sub: 'geo-maps', kind: 'view' },
          ],
        },
      ],
      feedback: 'Filters and drill-down re-run the selectors — no refetch.',
    },
    interviewHooks: [
      'Why normalize dashboard data in the store rather than per-widget fetching?',
      'How do you decide between a chart type and a geo-map for a given question?',
      'What breaks first when a Highcharts series grows by an order of magnitude?',
    ],
  },
  {
    slug: 'api-encryption-layer',
    index: '02',
    title: 'End-to-End API Encryption Layer',
    tagline: 'Request and response payloads that stay unreadable in the network tab.',
    company: 'Dure Technologies Pvt. Ltd.',
    period: 'Jun 2023 — Present',
    domain: 'Healthcare',
    confidential: true,
    featured: true,
    accent: 'lock',
    problem:
      'Transport-level encryption protects data in flight, but anyone with devtools open can still read every request and response body in plain text. For a health-tech product that is a meaningful exposure — sensitive payloads sitting legible in the network tab of any machine the app runs on.',
    approach:
      'I architected an end-to-end encryption–decryption mechanism covering all request and response payloads. The transform sits at the boundary of the application’s data layer, so payloads are ciphertext by the time they reach the network and plaintext only inside application code — feature code keeps working with ordinary objects and never touches crypto.',
    contribution: [
      'Designed the encryption–decryption mechanism end to end across request and response paths.',
      'Placed the transform at the API-client boundary so every call is covered by default rather than per-endpoint.',
      'Verified that payloads no longer appear in readable form in the browser network tab.',
    ],
    challenges: [
      {
        challenge: 'Covering every call without rewriting every caller',
        resolution:
          'Handling the transform centrally in the API layer, so existing feature code passes and receives plain objects and the encryption is invisible to it.',
      },
      {
        challenge: 'Keeping the app debuggable once payloads are opaque',
        resolution:
          'Decryption happening at the same boundary means application state and logs still hold readable data, even though the wire does not.',
      },
    ],
    outcome: [
      { label: 'Readable payload exposure', value: 'Eliminated', note: 'Payloads no longer legible in the network tab' },
      { label: 'Coverage', value: 'All request + response bodies' },
    ],
    stack: ['React.js', 'TypeScript', 'REST APIs', 'API Security'],
    architecture: {
      caption: 'Where the encryption boundary sits',
      summary:
        'The transform lives at the API client, not in feature code. Everything above the boundary works with ordinary objects; everything below it is ciphertext.',
      layers: [
        { nodes: [{ label: 'Feature code', sub: 'plain objects', kind: 'view' }] },
        {
          connector: 'boundary',
          nodes: [{ label: 'API client', sub: 'encrypt · decrypt', kind: 'logic' }],
        },
        { nodes: [{ label: 'Network', sub: 'ciphertext only — nothing legible in devtools', kind: 'wire' }] },
        { nodes: [{ label: 'Backend', sub: 'decrypt · process', kind: 'service' }] },
      ],
      feedback: 'Responses travel the same path in reverse, decrypting at the same boundary.',
    },
    interviewHooks: [
      'Why add payload encryption on top of HTTPS — what threat does it actually address?',
      'Where do you put the transform so feature code stays unaware of it?',
      'What does this cost you in debuggability, and how do you get it back?',
    ],
  },
  {
    slug: 'client-side-caching',
    index: '03',
    title: 'Local-Storage Caching Layer',
    tagline: 'Roughly 30% faster by not asking twice for data that had not changed.',
    company: 'Dure Technologies Pvt. Ltd.',
    period: 'Jun 2023 — Present',
    domain: 'Healthcare',
    confidential: true,
    featured: true,
    accent: 'cache',
    problem:
      'The dashboards were re-requesting data the browser had already received. Every navigation and remount meant another round trip for a payload that had not changed — redundant network calls the user paid for in load time.',
    approach:
      'I introduced a local-storage caching layer in front of the API calls. Reads check the cache first and render from it when the entry is valid; misses go to the network and populate the cache on the way back. Repeat views render from local data instead of waiting on a request.',
    contribution: [
      'Built the caching layer over the application’s API access.',
      'Cut redundant API calls by serving repeat reads from local storage.',
      'Measured the result as roughly a 30% improvement in application performance, with page load times significantly reduced.',
    ],
    challenges: [
      {
        challenge: 'Serving cached data without serving stale data',
        resolution:
          'Validity rules on cache entries decide when a cached read is acceptable and when the request has to go out, so speed does not come at the cost of correctness.',
      },
      {
        challenge: 'Choosing what is worth caching',
        resolution:
          'Targeting the repeated, unchanged reads — the ones being fetched again for no benefit — rather than caching indiscriminately.',
      },
    ],
    outcome: [
      { label: 'Application performance', value: '~30%', note: 'Improvement, per resume' },
      { label: 'Redundant API calls', value: 'Reduced' },
      { label: 'Page load time', value: 'Significantly decreased' },
    ],
    stack: ['React.js', 'Redux', 'JavaScript', 'Web Storage API', 'Page Load Optimization'],
    architecture: {
      caption: 'Read path with the cache in front',
      summary:
        'Every read passes the validity check first. Only a miss reaches the network, and a miss populates the cache on its way back — so the second view of the same data costs nothing.',
      layers: [
        { nodes: [{ label: 'Component', sub: 'requests data', kind: 'view' }] },
        {
          connector: 'check',
          nodes: [{ label: 'Local storage', sub: 'is the stored entry still valid?', kind: 'decision' }],
        },
        {
          nodes: [
            { label: 'Hit', sub: 'render from local storage', kind: 'view', branch: 'hit' },
            { label: 'Miss', sub: 'API request', kind: 'service', branch: 'miss' },
          ],
        },
        { nodes: [{ label: 'Response', sub: 'written to cache, then rendered', kind: 'state' }] },
      ],
      feedback: 'The redundant repeat calls are the ones that disappear.',
    },
    interviewHooks: [
      'How do you decide a cached entry is still valid?',
      'Why local storage rather than in-memory or the Cache API?',
      'What is the failure mode when the cache and the server disagree?',
    ],
  },
  {
    slug: 'timezone-sync',
    index: '04',
    title: 'Timezone-Aware Dashboard Sync',
    tagline: 'One dataset, correct for every user, wherever they are.',
    company: 'Dure Technologies Pvt. Ltd.',
    period: 'Jun 2023 — Present',
    domain: 'Healthcare',
    confidential: true,
    featured: true,
    accent: 'clock',
    problem:
      'A dashboard shared by users in different time zones will disagree with itself. The same timestamped record reads as a different day depending on where it is rendered, and anything scheduled drifts — users in different regions saw discrepancies in what should have been identical data.',
    approach:
      'I implemented timezone-aware real-time synchronization for the dashboards, so the data each user sees resolves against their own zone rather than rendering from raw timestamps. Scheduling discrepancies between regions were eliminated as a result.',
    contribution: [
      'Implemented timezone-aware synchronization across the real-time dashboard views.',
      'Made timestamped data resolve correctly for global users in every time zone.',
      'Removed the scheduling discrepancies that had appeared between regions.',
    ],
    challenges: [
      {
        challenge: 'Real-time data and time zones at once',
        resolution:
          'Handling zone resolution as part of the synchronization path, so live updates arrive already correct for the viewer rather than being corrected afterwards.',
      },
      {
        challenge: 'Agreement across regions',
        resolution:
          'Resolving every displayed time against the viewer’s zone from a single canonical representation, so two users in different countries read the same underlying record the same way.',
      },
    ],
    outcome: [
      { label: 'Scheduling discrepancies', value: 'Eliminated', note: 'Per resume' },
      { label: 'Coverage', value: 'Global users, all time zones' },
    ],
    stack: ['React.js', 'Redux', 'TypeScript', 'Real-time Sync'],
    architecture: {
      caption: 'Resolving time on the way to the view',
      summary:
        'Zone resolution happens inside the synchronization path, so live updates arrive already correct for whoever is looking — rather than being corrected after the fact in each component.',
      layers: [
        {
          nodes: [
            { label: 'Real-time feed', sub: 'canonical timestamps', kind: 'service' },
            { label: "Viewer's zone", sub: 'resolved per user', kind: 'state' },
          ],
        },
        {
          connector: 'resolve',
          nodes: [{ label: 'Sync layer', sub: 'zone resolution', kind: 'logic' }],
        },
        { nodes: [{ label: 'Dashboard', sub: 'locally correct times', kind: 'view' }] },
      ],
      feedback: 'Two users in different countries read the same record the same way.',
    },
    interviewHooks: [
      'Where should timezone conversion live — server, sync layer, or render?',
      'How do you keep a real-time stream correct for viewers in different zones?',
      'What goes wrong if you store local time instead of a canonical representation?',
    ],
  },
  {
    slug: 'commerce-ui-platform',
    index: '05',
    title: 'E-Commerce UI Platform',
    tagline: 'Listings, headless CMS pages, CRUD and bulk print — across three clients at once.',
    company: 'Adaptiv Solutions / Apexon Pvt. Ltd.',
    period: 'Feb 2021 — Jun 2023',
    domain: 'E-commerce',
    confidential: true,
    featured: true,
    accent: 'grid',
    clients: ['BCI', 'IBU', 'Tecumseh'],
    problem:
      'Three retail clients, each with their own requirements, all needing the same class of commerce interface: products that can be found, pages whose content marketing can change without a deploy, order records that can be acted on in bulk. The requirements arrived as business asks, not specifications.',
    approach:
      'I worked as the primary client-facing engineer — gathering requirements directly and translating them into UI specifications, then building them. The surface spanned product listing with dynamic sorting and pagination, header and custom pages, Optimizely headless-CMS-driven product and landing content, full CRUD for search-result management, a guided onboarding walkthrough, and bulk printing of order records.',
    contribution: [
      'Owned requirement gathering and translation into UI specifications as the primary client-facing engineer.',
      'Built Product Listing, Header Section and custom pages with dynamic sorting and pagination, improving product discoverability.',
      'Integrated Optimizely headless CMS APIs so product and landing pages render dynamic content.',
      'Engineered full CRUD for search-result management.',
      'Implemented user onboarding with page walkthroughs, reducing support queries.',
      'Delivered bulk print — selecting and printing multiple order records straight from the listing page.',
      'Ran BCI, IBU and Tecumseh concurrently, fixing critical production bugs under tight deadlines.',
    ],
    challenges: [
      {
        challenge: 'Ambiguous business requirements',
        resolution:
          'Engaging the client directly and converting each ask into a UI specification before building, so expectations and implementation matched at review.',
      },
      {
        challenge: 'Three production projects in parallel',
        resolution:
          'Prioritizing by production impact and deadline — the work that earned two "Pat on Back" awards, one for concurrent delivery under deadline pressure and one for shipping complex, high-fidelity UI with zero defects.',
      },
      {
        challenge: 'Repetitive manual order printing',
        resolution:
          'Bulk print from the listing page — multi-select plus a single print action — removing hours of weekly manual effort for order teams.',
      },
    ],
    outcome: [
      { label: 'Manual effort saved', value: 'Hours weekly', note: 'Order teams, via bulk print' },
      { label: 'Support queries', value: 'Reduced', note: 'Via guided onboarding' },
      { label: 'Concurrent client projects', value: '3' },
      { label: 'Recognition', value: '2 Pat on Back awards' },
    ],
    stack: ['React.js', 'Redux', 'TypeScript', 'JavaScript', 'Optimizely CMS', 'CSS3'],
    architecture: {
      caption: 'Content and data paths behind the storefront',
      summary:
        'Editorial content and commerce data arrive from separate sources and meet in the app, which is what lets marketing change a landing page without a deploy.',
      layers: [
        {
          nodes: [
            { label: 'Optimizely', sub: 'headless CMS content', kind: 'service' },
            { label: 'Commerce APIs', sub: 'products · orders', kind: 'service' },
          ],
        },
        {
          connector: 'compose',
          nodes: [{ label: 'React app', sub: 'Redux state', kind: 'state' }],
        },
        {
          nodes: [
            { label: 'Listing', sub: 'dynamic sort · paginate', kind: 'view' },
            { label: 'Orders', sub: 'CRUD · bulk print', kind: 'view' },
          ],
        },
      ],
      feedback: 'Three client builds shared this shape; the content and rules differed.',
    },
    interviewHooks: [
      'How do you turn an ambiguous client ask into a buildable UI spec?',
      'Dynamic sorting and pagination — client-side, server-side, and why?',
      'What does headless CMS integration change about how you structure a page?',
      'How do you triage across three production codebases at once?',
    ],
  },
];

/**
 * SKILLS — grouped as the resume groups them. No proficiency percentages:
 * self-assigned numbers communicate nothing verifiable.
 */
export const skillGroups = [
  {
    id: 'frontend',
    label: 'Frontend',
    note: 'Where most of five years has gone.',
    skills: [
      { name: 'React.js', core: true },
      { name: 'Redux', core: true },
      { name: 'TypeScript', core: true },
      { name: 'JavaScript (ES6+)', core: true },
      { name: 'Next.js' },
      { name: 'HTML5' },
      { name: 'CSS3' },
      { name: 'Tailwind CSS' },
      { name: 'Bootstrap' },
      { name: 'Optimizely CMS' },
    ],
  },
  {
    id: 'data-viz',
    label: 'Data & Visualization',
    note: 'Turning dense records into something readable.',
    skills: [
      { name: 'Highcharts', core: true },
      { name: 'Chart.js' },
      { name: 'Geo-maps' },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    note: 'The work that shows up as a faster page.',
    skills: [
      { name: 'Local Storage Caching', core: true },
      { name: 'Page Load Optimization', core: true },
      { name: 'Code Splitting' },
      { name: 'Lazy Loading' },
      { name: 'Next.js SSR' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Data',
    note: 'Enough to own the contract, not just consume it.',
    skills: [
      { name: 'Node.js' },
      { name: 'Express.js' },
      { name: 'MongoDB' },
      { name: 'RESTful API Integration', core: true },
    ],
  },
  {
    id: 'practices',
    label: 'Tools & Practices',
    note: 'How the work actually gets shipped.',
    skills: [
      { name: 'Git' },
      { name: 'GitHub' },
      { name: 'Jest' },
      { name: 'Postman' },
      { name: 'VS Code' },
      { name: 'Agile / Scrum' },
      { name: 'API Security', core: true },
      { name: 'Code Reviews' },
      { name: 'Client Engagement', core: true },
    ],
  },
];

export const education = {
  degree: 'Bachelor of Engineering (B.E.)',
  institution: 'VESIT, Mumbai',
  period: 'Jul 2017 — Oct 2020',
};

export const awards = [
  {
    title: 'Pat on Back Award',
    org: 'Adaptiv Solutions',
    date: 'Oct 2022',
    detail:
      'For concurrently managing the BCI, IBU and Tecumseh projects and resolving critical production bugs under stringent deadlines.',
  },
  {
    title: 'Pat on Back Award',
    org: 'Adaptiv Solutions',
    date: 'Jan 2022',
    detail:
      'For delivering complex, high-fidelity UI requirements ahead of a tight project deadline with zero defects.',
  },
];

/**
 * Figures shown in the hero strip. Every one is resume-backed.
 * Nothing here is an estimate or rounded up for effect.
 */
export const metrics = [
  { value: '5+', label: 'Years building production frontends' },
  { value: '~30%', label: 'Performance gain from client-side caching' },
  { value: '3', label: 'Client projects run concurrently' },
  { value: '2', label: 'Domains shipped in — healthcare, e-commerce' },
];

export const navSections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

export const contact = {
  heading: 'Let’s build something that holds up in production.',
  body: 'I’m open to senior frontend roles working on data-heavy, performance-sensitive React products. The fastest way to reach me is email.',
};
