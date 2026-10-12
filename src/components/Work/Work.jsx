import { Link } from 'react-router-dom';
import { projects } from '../../data/portfolioData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Icon } from '../ui/Icon';
import { ConfidentialityNote } from '../ui/ConfidentialityNote';
import styles from './Work.module.css';

/**
 * Work — the case-study index.
 *
 * Deliberately a compact list, not an image grid: there are no screenshots to
 * put in one, and a grid of generated gradient placeholders is the universally
 * recognised signal for "there was no image". Each row carries a headline
 * outcome so the list is readable without opening anything.
 *
 * Hover de-emphasises siblings rather than lifting the hovered row, which
 * reads as considered rather than as a card effect — and it is mirrored on
 * :focus-within so keyboard users get the same signal.
 */
export function Work() {
  return (
    <section id="work" className={styles.section} tabIndex={-1} aria-labelledby="work-title">
      <SectionHeading
        index="03"
        eyebrow="Selected work"
        title="Problems I've solved"
        id="work-title"
      />

      <Reveal>
        <p className={styles.intro}>
          Five pieces of production work from the last five years. Each one opens
          into the problem, the approach, what I owned, and what changed.
        </p>
      </Reveal>

      <ol className={styles.list}>
        {projects.map((project, i) => {
          const headline = project.outcome[0];
          return (
            <Reveal as="li" key={project.slug} delay={i * 50} className={styles.item}>
              <article className={styles.card}>
                <div className={styles.meta}>
                  <span className={styles.index} aria-hidden="true">
                    {project.index}
                  </span>
                  <span className={styles.period}>{project.period}</span>
                </div>

                <div className={styles.main}>
                  <h3 className={styles.title}>
                    {/* The whole row is one link target: the ::after overlay
                        below expands the hit area to the full card, so there is
                        a bounded tap target on touch where hover cannot help. */}
                    <Link to={`/work/${project.slug}`} className={styles.link}>
                      {project.title}
                      <Icon name="arrowUpRight" size={15} className={styles.linkIcon} />
                    </Link>
                  </h3>

                  <p className={styles.company}>
                    {project.company} · {project.domain}
                  </p>

                  <p className={styles.tagline}>{project.tagline}</p>

                  <div className={styles.footer}>
                    <p className={styles.outcome}>
                      <span className={styles.outcomeValue}>{headline.value}</span>
                      <span className={styles.outcomeLabel}>{headline.label}</span>
                    </p>
                    {/* Three tokens, not the full stack — the complete list is
                        on the case-study page. A repeated twelve-tag dump on
                        every card carries no signal. */}
                    <ul className={styles.stack} aria-label="Key technologies">
                      {project.stack.slice(0, 3).map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </ol>

      <Reveal delay={60} className={styles.note}>
        <ConfidentialityNote />
      </Reveal>
    </section>
  );
}
