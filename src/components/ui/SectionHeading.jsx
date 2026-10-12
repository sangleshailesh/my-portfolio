import styles from './SectionHeading.module.css';

/**
 * The section header used across the page: a mono index, an uppercase mono
 * eyebrow, and the heading itself.
 *
 * On small screens this becomes a sticky bar so the reader always knows which
 * section they are in — mobile's substitute for the desktop rail's scroll-spy.
 */
export function SectionHeading({ index, eyebrow, title, id }) {
  return (
    <header className={styles.header}>
      <p className={styles.meta}>
        <span className={styles.index} aria-hidden="true">
          {index}
        </span>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <span className={styles.rule} aria-hidden="true" />
      </p>
      <h2 className={styles.title} id={id}>
        {title}
      </h2>
    </header>
  );
}
