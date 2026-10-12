import { about, metrics } from '../../data/portfolioData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import styles from './About.module.css';

/**
 * About.
 *
 * Leads with the four real figures from the résumé rather than with prose — a
 * recruiter reads the strip, a hiring manager reads the passages. Every number
 * here is resume-backed; none is rounded up or invented.
 */
export function About() {
  return (
    <section id="about" className={styles.section} tabIndex={-1} aria-labelledby="about-title">
      <SectionHeading index="01" eyebrow="About" title="Profile" id="about-title" />

      <Reveal>
        <p className={styles.lead}>{about.lead}</p>
      </Reveal>

      <Reveal delay={60}>
        <ul className={styles.metrics}>
          {metrics.map((metric) => (
            <li key={metric.label} className={styles.metric}>
              <span className={styles.metricValue}>{metric.value}</span>
              <span className={styles.metricLabel}>{metric.label}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className={styles.prose}>
        {about.passages.map((passage, i) => (
          <Reveal key={i} as="p" delay={i * 60} className={styles.passage}>
            {passage}
          </Reveal>
        ))}
      </div>

      <Reveal delay={60}>
        <h3 className={styles.principlesTitle}>How I work</h3>
        <ul className={styles.principles}>
          {about.principles.map((principle) => (
            <li key={principle.title} className={styles.principle}>
              <h4 className={styles.principleTitle}>{principle.title}</h4>
              <p className={styles.principleBody}>{principle.body}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
