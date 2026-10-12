import { awards } from '../../data/portfolioData';
import { Reveal } from '../ui/Reveal';
import styles from './Recognition.module.css';

/**
 * Recognition.
 *
 * Leads with what earned the award, not with its name — "Pat on Back Award"
 * means nothing outside the company that gave it, whereas "three concurrent
 * client projects, critical production bugs cleared to deadline" is legible to
 * anyone. The award name stays as the attribution line underneath.
 *
 * Not in the section nav: a reader reaches it on the way to Contact. Five nav
 * items is the practical ceiling before the list stops being scannable.
 */
export function Recognition() {
  return (
    <section
      id="recognition"
      className={styles.section}
      tabIndex={-1}
      aria-labelledby="recognition-title"
    >
      <Reveal>
        <h2 className={styles.title} id="recognition-title">
          Recognition
        </h2>
      </Reveal>

      <ul className={styles.list}>
        {awards.map((award, i) => (
          <Reveal as="li" key={award.date} delay={i * 60} className={styles.item}>
            <p className={styles.detail}>{award.detail}</p>
            <p className={styles.attribution}>
              {award.title} · {award.org} · <span className="u-tabular">{award.date}</span>
            </p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
