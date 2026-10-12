import { useEffect, useRef } from 'react';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared scroll-reveal observer
 * ─────────────────────────────────────────────────────────────────────────────
 * ONE IntersectionObserver for the entire page, not one per element. A
 * per-element `useInView` hook costs roughly 3× the scripting of a shared
 * observer and leaks detached observers on unmount.
 *
 * Elements are marked pending only once JS is running, so the reveal is purely
 * additive — content is visible by default and stays visible if the script
 * never runs. Each element is unobserved after its first reveal; nothing
 * re-animates on scroll-back.
 *
 * Two rules keep content from ever being stranded invisible:
 *
 *  1. An element is revealed when it intersects OR when it has already been
 *     scrolled past. Jumping straight to Contact via the nav skips every block
 *     in between, and without this they would sit at opacity 0 until the
 *     reader happened to scroll back through them.
 *  2. Printing reveals everything immediately. A printed page with half its
 *     content invisible is worse than no animation at all.
 */

let observer = null;
const observed = new Set();

function reveal(el) {
  el.dataset.reveal = 'shown';
  if (observer) observer.unobserve(el);
  observed.delete(el);
}

function getObserver() {
  if (observer) return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    },
    {
      // The asymmetry here is the whole trick.
      //
      // Bottom: -12% so an element reveals once it is meaningfully on screen,
      // not the instant one pixel crosses the fold.
      //
      // Top: a very large positive margin, which makes everything *above* the
      // viewport count as intersecting. Without it, jumping from the top of
      // the page straight to Contact leaves every block in between stranded at
      // opacity 0 — they go from below-viewport to above-viewport in a single
      // frame, the intersection ratio never leaves 0, and so the observer
      // never fires for them at all. Testing the geometry inside the callback
      // cannot fix that, because the callback is never called. Widening the
      // root upwards makes the browser report them as entered instead.
      rootMargin: '100000px 0px -12% 0px',
      threshold: 0,
    },
  );

  return observer;
}

/** Nothing should be mid-animation on paper. */
function revealAllForPrint() {
  for (const el of [...observed]) reveal(el);
}

let printHookInstalled = false;
function installPrintHook() {
  if (printHookInstalled || typeof window === 'undefined') return;
  printHookInstalled = true;
  window.addEventListener('beforeprint', revealAllForPrint);
  // Safari and older WebKit fire the media query rather than the event.
  window.matchMedia?.('print')?.addEventListener?.('change', (e) => {
    if (e.matches) revealAllForPrint();
  });
}

/**
 * @param {object} options
 * @param {number} options.delay     Stagger delay in ms, applied via CSS var.
 * @param {boolean} options.disabled Skip the reveal entirely.
 */
export function useReveal({ delay = 0, disabled = false } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return undefined;

    // No IntersectionObserver: leave the element in its natural visible state.
    if (typeof IntersectionObserver === 'undefined') return undefined;

    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.dataset.reveal = 'pending';

    const io = getObserver();
    observed.add(el);
    io.observe(el);
    installPrintHook();

    return () => {
      io.unobserve(el);
      observed.delete(el);
    };
  }, [delay, disabled]);

  return ref;
}
