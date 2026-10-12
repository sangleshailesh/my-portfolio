import { useCallback } from 'react';
import { profile } from '../../data/portfolioData';
import { links } from '../../lib/content';
import { Icon } from '../ui/Icon';
import styles from './Footer.module.css';

/**
 * Footer.
 *
 * The year is computed at render rather than hardcoded — a visibly stale
 * copyright line is one of the cheapest ways to make a site look abandoned.
 */
export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = useCallback(() => {
    const reduced =
      document.documentElement.dataset.motion === 'reduced' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    // Return focus to the top of the document so the next Tab starts from the
    // beginning, matching what the scroll just did visually.
    document.getElementById('top')?.focus({ preventScroll: true });
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.identity}>
        <p className={styles.name}>{profile.name}</p>
        <p className={styles.role}>{profile.title}</p>
      </div>

      <ul className={styles.links}>
        <li>
          <a className={styles.link} href={`mailto:${profile.email}`}>
            Email
          </a>
        </li>
        {links.linkedin && (
          <li>
            <a
              className={styles.link}
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </li>
        )}
        {links.github && (
          <li>
            <a
              className={styles.link}
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
        )}
      </ul>

      <div className={styles.meta}>
        <p className={styles.copyright}>
          © <span className="u-tabular">{year}</span> {profile.name}
        </p>
        <button type="button" className={styles.toTop} onClick={scrollToTop}>
          <span>Back to top</span>
          <Icon name="arrowUpRight" size={14} className={styles.toTopIcon} />
        </button>
      </div>

      <p className={styles.colophon}>
        Built with React and Vite. No animation library on this page — the motion
        is CSS and one shared IntersectionObserver.
      </p>
    </footer>
  );
}
