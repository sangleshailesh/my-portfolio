import { useCallback } from 'react';
import { profile, navSections } from '../../data/portfolioData';
import { links } from '../../lib/content';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { Icon } from '../ui/Icon';
import { Preferences } from '../ui/Preferences';
import { ResumeActions } from '../ui/ResumeActions';
import styles from './Rail.module.css';

const SECTION_IDS = navSections.map((s) => s.id);

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * The identity rail — desktop's sticky left column, and the page's <h1>.
 * ─────────────────────────────────────────────────────────────────────────────
 * This portfolio has no screenshots, no live demos and no public repositories:
 * the work is all client and internal. A rail that keeps name, role, stack,
 * résumé and email permanently on screen is what stands in for the visual proof
 * a project-thumbnail grid would normally carry.
 *
 * On viewports below 1024px it stops being sticky and simply becomes the first
 * thing on the page, with the section nav moving into the mobile menu.
 */
export function Rail() {
  const activeId = useScrollSpy(SECTION_IDS, { topOffset: 96 });

  // After an in-page jump, move focus to the section as well as scrolling to
  // it. Without this the next Tab press continues from the nav rather than
  // from the content the user just asked for.
  const handleJump = useCallback((event, id) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
  }, []);

  return (
    <header className={styles.rail}>
      <div className={styles.identity}>
        {/* Also the back-to-top focus target. Sending focus to the <h1> means
            a screen reader announces "Shailesh Sangle, heading level 1" on
            arrival, where an empty aria-hidden anchor would announce nothing. */}
        <h1 id="top" tabIndex={-1} className={`${styles.name} u-enter`}>
          {profile.name}
        </h1>

        <p className={`${styles.title} u-enter`} style={{ animationDelay: '60ms' }}>
          {profile.title}
        </p>

        <p className={`${styles.micro} u-enter`} style={{ animationDelay: '120ms' }}>
          {profile.microLabel}
        </p>

        <p className={`${styles.positioning} u-enter`} style={{ animationDelay: '180ms' }}>
          {profile.headline}
        </p>

        {/* Desktop-only section nav. On mobile the same list lives in the menu
            dialog, so it is not duplicated into the tab order here. */}
        <nav className={styles.nav} aria-label="Sections">
          <ul>
            {navSections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(event) => handleJump(event, section.id)}
                  >
                    {/* The rule doubles in length on hover and focus, and the
                        label changes weight and colour — the active state is
                        never signalled by colour alone. */}
                    <span className={styles.navRule} aria-hidden="true" />
                    <span className={styles.navLabel}>{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className={styles.footer}>
        <div className={styles.actions}>
          <ResumeActions />
        </div>

        <ul className={styles.contactList}>
          <li>
            <a className={styles.contactLink} href={`mailto:${profile.email}`}>
              <Icon name="mail" size={15} />
              <span className={styles.contactText}>{profile.email}</span>
            </a>
          </li>
          {/* Rendered only when a real URL exists. A placeholder or '#' profile
              link is a visible credibility cost on a page whose whole job is
              credibility, so the list simply shortens instead. */}
          {links.linkedin && (
            <li>
              <a
                className={styles.contactLink}
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="linkedin" size={15} />
                <span className={styles.contactText}>LinkedIn</span>
                <Icon name="arrowUpRight" size={13} />
              </a>
            </li>
          )}
          {links.github && (
            <li>
              <a
                className={styles.contactLink}
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="github" size={15} />
                <span className={styles.contactText}>GitHub</span>
                <Icon name="arrowUpRight" size={13} />
              </a>
            </li>
          )}
        </ul>

        <div className={styles.prefsRow}>
          <p className={styles.availability}>
            <span className={styles.availabilityDot} aria-hidden="true" />
            {profile.availability}
          </p>
          <div className={styles.prefs}>
            <Preferences compact />
          </div>
        </div>
      </div>
    </header>
  );
}
