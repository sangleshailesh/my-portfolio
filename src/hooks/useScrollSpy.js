import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view.
 *
 * Uses a single IntersectionObserver across all sections rather than one per
 * section, and picks the entry closest to the top of the viewport among those
 * intersecting. A naive "first intersecting entry wins" implementation leaves
 * the last section on a page never becoming active when it is shorter than the
 * viewport, which is the usual bug here.
 *
 * @param {string[]} ids   Section element ids, in document order.
 * @param {object}   opts
 * @param {number}   opts.topOffset  Pixels of sticky header to discount.
 */
export function useScrollSpy(ids, { topOffset = 88 } = {}) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null);

    if (elements.length === 0) return undefined;

    // Visibility ratios, keyed by element id, updated by the observer.
    const ratios = new Map();
    let frame = 0;

    const resolve = () => {
      // Bottom-of-page guard: when the document is scrolled to the end, the
      // final section is active regardless of how much of it is visible.
      const scrolledToEnd =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (scrolledToEnd) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }

      let best = null;
      let bestTop = Infinity;

      for (const el of elements) {
        if (!ratios.get(el.id)) continue;
        const top = el.getBoundingClientRect().top - topOffset;
        // Prefer the topmost section that has already crossed the header line.
        const distance = top <= 0 ? Math.abs(top) : top + 10_000;
        if (distance < bestTop) {
          bestTop = distance;
          best = el.id;
        }
      }

      if (best) setActiveId(best);
    };

    // `resolve` reads geometry, so running it straight off the scroll event
    // would force a layout on every frame the user scrolls. Coalescing into one
    // rAF keeps it to a single read per painted frame.
    const scheduleResolve = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        resolve();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting);
        }
        scheduleResolve();
      },
      {
        rootMargin: `-${topOffset}px 0px -35% 0px`,
        threshold: [0, 0.01, 0.25, 0.5],
      },
    );

    elements.forEach((el) => observer.observe(el));
    window.addEventListener('scroll', scheduleResolve, { passive: true });
    resolve();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleResolve);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids, topOffset]);

  return activeId;
}
