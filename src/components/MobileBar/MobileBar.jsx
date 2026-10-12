import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { profile, navSections } from '../../data/portfolioData';
import { links } from '../../lib/content';
import { Icon } from '../ui/Icon';
import { Action } from '../ui/Action';
import { Preferences } from '../ui/Preferences';
import { ResumeActions } from '../ui/ResumeActions';
import styles from './MobileBar.module.css';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Mobile navigation — sticky bar plus a native <dialog> section menu.
 * ─────────────────────────────────────────────────────────────────────────────
 * `dialog.showModal()` supplies top-layer promotion, background inertness, Tab
 * wrapping, Escape-to-close and focus restoration for free. Hand-rolling a
 * focus trap in 2026 gets all five of those subtly wrong.
 *
 * Deliberately absent: `role="dialog"` and `aria-modal` — the browser already
 * supplies both for a modal <dialog>, and duplicating them causes screen
 * readers to announce twice.
 */
export function MobileBar() {
  const { pathname } = useLocation();
  // The sections only exist on the home page. Everywhere else the same links
  // have to route home first, and the bar has to stay visible on desktop too —
  // the identity rail that normally carries the nav and the theme controls is
  // part of the home page, so without this a case study has neither.
  const isHome = pathname === '/';

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialogRef = useRef(null);
  const sentinelRef = useRef(null);
  const scrollYRef = useRef(0);
  const jumpingRef = useRef(false);

  // Scroll state via a 1px sentinel at the top of the document rather than a
  // scroll listener — one observer callback instead of work on every frame.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') return undefined;

    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);

  // Drive the native dialog from React state, and lock background scrolling
  // while it is open. The scroll position is captured and restored explicitly:
  // `overflow: hidden` alone makes iOS jump to the top of the page on close.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (open) {
      scrollYRef.current = window.scrollY;
      // Compensate for the scrollbar's disappearance so the page behind the
      // overlay does not shift sideways.
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }

    return undefined;
  }, [open]);

  // Runs on every close, including Escape and backdrop dismissal, which do not
  // go through our own handler.
  //
  // The scroll position is restored explicitly because `overflow: hidden` alone
  // makes iOS jump to the top of the page on close. It is skipped when the
  // close was caused by a section jump, which is about to set its own position
  // — otherwise the restore and the jump fight each other.
  const handleClose = useCallback(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (!jumpingRef.current) {
      window.scrollTo({ top: scrollYRef.current, behavior: 'instant' });
    }
    jumpingRef.current = false;
    setOpen(false);
  }, []);

  // Clicking the backdrop closes. The dialog element's own box is the backdrop
  // hit area; the inner panel stops the event.
  const handleDialogClick = useCallback(
    (event) => {
      if (event.target === dialogRef.current) setOpen(false);
    },
    [],
  );

  const handleJump = useCallback((event, id) => {
    const target = document.getElementById(id);
    // Off the home page the link is a router navigation to /#id, which
    // RouteTransition resolves once home has rendered. Nothing to intercept.
    if (!target) {
      setOpen(false);
      return;
    }
    event.preventDefault();
    // Tells handleClose not to restore the previous scroll position.
    jumpingRef.current = true;
    setOpen(false);
    // Wait for the dialog to finish closing and the scroll lock to lift, so the
    // element's position is measured against the unlocked document.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      });
    });
  }, []);

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <div
        className={styles.bar}
        data-scrolled={scrolled ? 'true' : 'false'}
        data-route={isHome ? 'home' : 'sub'}
      >
        <Link to="/" className={styles.brand}>
          <span className={styles.brandName}>{profile.name}</span>
          <span className={styles.brandRole}>{profile.title}</span>
        </Link>

        <div className={styles.barActions}>
          {/* Off the home page there is no rail, so at desktop widths the
              sections go inline in the bar. Hiding five short links behind a
              hamburger on a 1440px screen costs a click for nothing; the
              hamburger is kept for narrow viewports, where it earns its place. */}
          {!isHome && (
            <nav className={styles.inlineNav} aria-label="Sections">
              <ul>
                {navSections.map((section) => (
                  <li key={section.id}>
                    <Link to={`/#${section.id}`} className={styles.inlineLink}>
                      {section.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <Preferences compact />

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <Icon name="menu" size={18} />
            <span className="u-sr-only">Open menu</span>
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        data-route={isHome ? 'home' : 'sub'}
        onClose={handleClose}
        onClick={handleDialogClick}
        aria-labelledby="mobile-menu-title"
      >
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <h2 id="mobile-menu-title" className={styles.panelTitle}>
              Navigate
            </h2>
            <button type="button" className={styles.closeButton} onClick={closeMenu}>
              <Icon name="close" size={18} />
              <span className="u-sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Sections">
            <ul className={styles.menuList}>
              {navSections.map((section, i) => {
                const body = (
                  <>
                    <span className={styles.menuIndex} aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {section.label}
                  </>
                );

                return (
                  <li key={section.id} className={styles.menuItem} style={{ '--i': i }}>
                    {isHome ? (
                      <a
                        href={`#${section.id}`}
                        className={styles.menuLink}
                        onClick={(event) => handleJump(event, section.id)}
                        // autoFocus gives the dialog a sensible initial focus
                        // target instead of the dialog box itself.
                        autoFocus={i === 0}
                      >
                        {body}
                      </a>
                    ) : (
                      // Routes home, then RouteTransition scrolls to the
                      // section. A bare "#about" here would be a dead link.
                      <Link
                        to={`/#${section.id}`}
                        className={styles.menuLink}
                        onClick={() => setOpen(false)}
                        autoFocus={i === 0}
                      >
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.panelFoot}>
            <div className={styles.panelActions}>
              <ResumeActions />
            </div>
            <a className={styles.panelContact} href={`mailto:${profile.email}`}>
              <Icon name="mail" size={15} />
              {profile.email}
            </a>
            {links.linkedin && (
              <Action href={links.linkedin} variant="ghost" icon="arrowUpRight" external>
                LinkedIn
              </Action>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
