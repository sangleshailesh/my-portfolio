/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared preference stores (theme, motion)
 * ─────────────────────────────────────────────────────────────────────────────
 * The theme and motion controls are rendered twice — once in the desktop rail
 * and once in the mobile bar — with CSS deciding which is visible. If each
 * copy held its own `useState`, toggling one would leave the other's icon and
 * `aria-pressed` reporting the opposite of reality, and the bug would only
 * surface after a resize.
 *
 * So state lives in a module-level store that every instance subscribes to via
 * `useSyncExternalStore`. One source of truth, no context provider, and no
 * effect-driven synchronisation between siblings.
 */

function createStore(initialValue) {
  let value = initialValue;
  const listeners = new Set();

  return {
    get: () => value,
    set(next) {
      if (next === value) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function readStored(key, allowed, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (allowed.includes(stored)) return stored;
  } catch {
    // Private mode or blocked site data — fall through.
  }
  return fallback;
}

/* ── Theme ──────────────────────────────────────────────────────────────── */

export const THEME_KEY = 'ss-theme';

function systemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** True while the user has not made an explicit choice, so we follow the OS. */
export function themeIsAutomatic() {
  return readStored(THEME_KEY, ['dark', 'light'], null) === null;
}

export const themeStore = createStore(
  readStored(THEME_KEY, ['dark', 'light'], null) ?? systemTheme(),
);

export function setTheme(theme, { persist = true } = {}) {
  themeStore.set(theme);
  if (!persist) return;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Non-fatal: the theme still applies for this session.
  }
}

/* ── Motion ─────────────────────────────────────────────────────────────── */

export const MOTION_KEY = 'ss-motion';

function systemReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const storedMotion = readStored(MOTION_KEY, ['reduced', 'full'], null);

export const motionStore = createStore(
  storedMotion === null ? systemReducedMotion() : storedMotion === 'reduced',
);

export function setReducedMotion(reduced) {
  motionStore.set(reduced);
  try {
    window.localStorage.setItem(MOTION_KEY, reduced ? 'reduced' : 'full');
  } catch {
    // Non-fatal.
  }
}

/* ── Document application ───────────────────────────────────────────────── */

const THEME_COLORS = { dark: '#100f0d', light: '#faf9f7' };

/**
 * Keeps browser chrome in step with the page.
 *
 * index.html ships two media-scoped `theme-color` metas so the very first paint
 * is right. Once the user picks a theme explicitly those media queries would
 * disagree with the page, so both are overwritten with the chosen colour —
 * the browser uses the first whose media matches, and now they match anyway.
 */
function applyThemeColor(theme) {
  const color = THEME_COLORS[theme];
  if (!color) return;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute('content', color));
}

/**
 * Applies stored preferences to <html> before React's first paint, so a person
 * who chose the non-default theme never sees a flash of the other one.
 */
export function applyStoredPreferences() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const theme = themeStore.get();
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  applyThemeColor(theme);
  if (motionStore.get()) root.dataset.motion = 'reduced';
}

export { applyThemeColor };
