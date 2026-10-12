import { skillGroups } from '../../data/portfolioData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import styles from './Skills.module.css';

/**
 * Skills.
 *
 * No percentage bars, star ratings or proficiency dots. A self-assigned
 * "React — 95%" communicates nothing verifiable, is invisible to any parser,
 * and reads as a junior tell — especially under a senior-level claim.
 *
 * What replaces it is an honest two-tier split: the things used daily are
 * marked, the rest are listed plainly. That also defuses the interviewer's
 * favourite trap of picking the most peripheral item to see whether you bluff.
 *
 * Everything is real selectable text, so Ctrl+F and search crawlers both find
 * it — icons or a canvas cloud would be invisible to the recruiter's actual
 * search behaviour.
 */
export function Skills() {
  return (
    <section id="skills" className={styles.section} tabIndex={-1} aria-labelledby="skills-title">
      <SectionHeading index="04" eyebrow="Skills" title="What I work with" id="skills-title" />

      <Reveal>
        <p className={styles.legend}>
          <span className={styles.legendMark} aria-hidden="true" />
          Marked items are what I use day to day. The rest I've shipped with.
        </p>
      </Reveal>

      <div className={styles.groups}>
        {skillGroups.map((group, i) => (
          <Reveal as="section" key={group.id} delay={i * 50} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.label}</h3>
            {group.note && <p className={styles.groupNote}>{group.note}</p>}
            <ul className={styles.skills}>
              {group.skills.map((skill) => (
                <li
                  key={skill.name}
                  className={`${styles.skill} ${skill.core ? styles.core : ''}`}
                >
                  {skill.core && (
                    <>
                      <span className={styles.coreMark} aria-hidden="true" />
                      <span className="u-sr-only">Used day to day: </span>
                    </>
                  )}
                  {skill.name}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
