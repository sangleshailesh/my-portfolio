import styles from './ConfidentialityNote.module.css';

/**
 * A stated editorial policy, not an apology.
 *
 * All of this work is client and internal product work, so there are no
 * screenshots, demos or repositories to link. Phrased as a deliberate rule the
 * same absence reads as professional discipline rather than as a gap — and it
 * pre-empts the "can I see it?" question by answering it up front.
 */
export function ConfidentialityNote({ variant = 'full' }) {
  if (variant === 'inline') {
    return (
      <p className={styles.inline}>
        <span className={styles.badge}>Client work</span>
        No production UI, data or source is reproduced here. Architecture and
        approach are my own description of my own work.
      </p>
    );
  }

  return (
    <aside className={styles.note} aria-label="Note on confidentiality">
      <p className={styles.noteTitle}>How I write about client work</p>
      <ul className={styles.rules}>
        <li>Employers are named; client projects are named only where the résumé already names them.</li>
        <li>Technical detail — architecture, approach, tradeoffs — is described in full.</li>
        <li>No production interface, dataset or source code is reproduced, so there are no screenshots or demo links.</li>
        <li>Figures are quoted exactly as I can support them, and labelled where they are qualitative.</li>
      </ul>
      <p className={styles.noteFoot}>
        Happy to walk through any of it — architecture, tradeoffs, what I'd change — on a call.
      </p>
    </aside>
  );
}
