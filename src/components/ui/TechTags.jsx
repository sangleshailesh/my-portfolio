import styles from './TechTags.module.css';

/**
 * Plain monospace technology tokens.
 *
 * No brand logos, no coloured chips, no shields.io badges — a badge dump reads
 * as "every technology I have touched" and dilutes the ones that matter. On the
 * compact home list only the first few are shown; the full set lives on the
 * case-study page.
 */
export function TechTags({ items, limit, label = 'Technologies used' }) {
  const shown = typeof limit === 'number' ? items.slice(0, limit) : items;

  return (
    <ul className={styles.list} aria-label={label}>
      {shown.map((item) => (
        <li key={item} className={styles.tag}>
          {item}
        </li>
      ))}
    </ul>
  );
}
