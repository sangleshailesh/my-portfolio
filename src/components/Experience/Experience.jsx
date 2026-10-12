import { experience, education } from '../../data/portfolioData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { TechTags } from '../ui/TechTags';
import styles from './Experience.module.css';

/**
 * Experience.
 *
 * Impact-first: each entry leads with what changed, with the supporting detail
 * underneath. A mono date rail carries the chronology on wide screens and
 * becomes an eyebrow on narrow ones — no connector line or dot column, which is
 * the part of a conventional timeline that overflows at 320px.
 */
export function Experience() {
  return (
    <section
      id="experience"
      className={styles.section}
      tabIndex={-1}
      aria-labelledby="experience-title"
    >
      <SectionHeading
        index="02"
        eyebrow="Experience"
        title="Where I've worked"
        id="experience-title"
      />

      <ol className={styles.list}>
        {experience.map((role, i) => (
          <Reveal as="li" key={role.id} delay={i * 60} className={styles.item}>
            <div className={styles.period}>
              <span className={styles.periodText}>{role.period}</span>
              {role.current && <span className={styles.currentTag}>Current</span>}
            </div>

            <div className={styles.body}>
              <h3 className={styles.role}>
                {role.role}
                <span className={styles.at}> · </span>
                <span className={styles.company}>{role.company}</span>
              </h3>

              <p className={styles.domain}>{role.domain}</p>
              <p className={styles.summary}>{role.summary}</p>

              <ul className={styles.highlights}>
                {role.highlights.map((highlight) => (
                  <li key={highlight.impact} className={styles.highlight}>
                    <strong className={styles.impact}>{highlight.impact}</strong>
                    <span className={styles.detail}>{highlight.detail}</span>
                  </li>
                ))}
              </ul>

              <TechTags
                items={role.stack}
                label={`Technologies used at ${role.company}`}
              />
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={60} className={styles.education}>
        <h3 className={styles.educationTitle}>Education</h3>
        <p className={styles.educationBody}>
          <span className={styles.educationDegree}>{education.degree}</span>
          <span className={styles.educationMeta}>
            {education.institution} · {education.period}
          </span>
        </p>
      </Reveal>
    </section>
  );
}
