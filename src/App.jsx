import { Suspense, lazy, useEffect, useRef } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MobileBar } from './components/MobileBar/MobileBar';
import Home from './pages/Home';
import './App.css';

/**
 * Only the home page is in the initial bundle. The case study carries the
 * Motion runtime and the chart, and the résumé carries a whole second layout —
 * neither belongs in the payload of someone who has only landed on the
 * homepage.
 */
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const Resume = lazy(() => import('./pages/Resume'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Scroll and focus management across route changes.
 *
 * React Router does not reset scroll on navigation, and it does not move focus
 * — which means a keyboard or screen-reader user lands on a new page with focus
 * still on the link they just left. Both are handled here.
 */
function RouteTransition() {
  const { pathname, hash } = useLocation();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const initial = isInitialLoad.current;
    isInitialLoad.current = false;

    if (hash) {
      // Arriving at /#work from a case study: let the page paint first.
      const target = document.getElementById(hash.slice(1));
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
          target.focus({ preventScroll: true });
        });
        return;
      }
    }

    // On the very first load, leave focus where the browser put it — at the
    // start of the document. Moving it into <main> here would put the skip
    // link behind the user's first Tab, which defeats the only thing it is
    // for, and would drop a screen-reader user past the entire identity rail.
    // Scroll and focus management belong to navigations, not to arrival.
    if (initial) return;

    window.scrollTo({ top: 0, behavior: 'instant' });
    // Focus the new page's main region so assistive tech announces the change.
    document.getElementById('content')?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return null;
}

/** Minimal fallback — the lazy chunks are small enough that a spinner would
 *  flash rather than inform. */
function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="u-sr-only">Loading</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RouteTransition />

      {/* Kept first in the DOM so it is the first thing a keyboard user reaches. */}
      <a className="u-skip-link" href="#content">
        Skip to content
      </a>

      {/* Decorative background. Masked to one corner and deliberately off the
          grid it implies — a uniform full-page grid reads as a template. */}
      <div className="backdrop" aria-hidden="true" />

      <div className="shell">
        <MobileBar />

        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<CaseStudy />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
