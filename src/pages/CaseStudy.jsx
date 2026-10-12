import { Link, useParams } from 'react-router-dom';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import { getProject, getRelatedProjects, links } from '../lib/content';
import { buildCaseStudySchema } from '../lib/schema';
import { profile } from '../data/portfolioData';
import { Seo } from '../components/Seo/Seo';
import { Action } from '../components/ui/Action';
import { Icon } from '../components/ui/Icon';
import { TechTags } from '../components/ui/TechTags';
import { ConfidentialityNote } from '../components/ui/ConfidentialityNote';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram/ArchitectureDiagram';
import { SyntheticChart } from '../components/SyntheticChart/SyntheticChart';
import NotFound from './NotFound';
import styles from './CaseStudy.module.css';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Case study
 * ─────────────────────────────────────────────────────────────────────────────
 * A real route rather than an in-page accordion, because the URL is worth
 * having: it can be pasted into an email to a hiring manager, it carries its
 * own title and description, and the back button behaves.
 *
 * Order is deliberate. The outcome strip comes before any narrative so a
 * 20-second reader gets the result without scrolling; the deep technical
 * material sits inside <details> phrased as interview questions, so the
 * recruiter self-selects out of it and the engineer self-selects in.
 *
 * This is also the only route that loads Motion. The home page ships zero
 * animation JavaScript; here the orchestration earns the ~20kb, and the route
 * is code-split so the cost is never paid by someone who does not open it.
 */

// The two case studies where the live demo actually illustrates the work.
const DEMO_SLUGS = new Set(['analytics-dashboards', 'timezone-sync']);

export default function CaseStudy() {
  const { slug } = useParams();
  const project = getProject(slug);
  const prefersReduced = useReducedMotion();

  if (!project) return <NotFound />;

  const related = getRelatedProjects(slug);
  const showDemo = DEMO_SLUGS.has(slug);

  // Motion is opt-in per user preference, and collapses to a plain fade when
  // reduced motion is requested rather than being removed outright.
  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: prefersReduced ? 0 : 0.06, delayChildren: 0.05 },
    },
  };

  const item = prefersReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.18 } } }
    : {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.165, 0.84, 0.44, 1] },
        },
      };

  return (
    <LazyMotion features={domAnimation} strict>
      <Seo
        title={project.title}
        description={`${project.tagline} — ${project.company}. ${project.problem.slice(0, 120)}`}
        path={`/work/${project.slug}`}
        type="article"
        jsonLd={buildCaseStudySchema(project)}
      />

      <main id="content" className={styles.page} tabIndex={-1}>
        <m.article initial="hidden" animate="visible" variants={container}>
          <m.div variants={item}>
            <Link to="/#work" className={styles.back}>
              <Icon name="arrowLeft" size={15} />
              All work
            </Link>
          </m.div>

          {/* ── Header ─────────────────────────────────────────────────── */}
          <m.header variants={item} className={styles.header}>
            <p className={styles.meta}>
              <span className={styles.index}>{project.index}</span>
              <span>{project.company}</span>
              <span className={styles.dot} aria-hidden="true">
                ·
              </span>
              <span className="u-tabular">{project.period}</span>
              <span className={styles.domain}>{project.domain}</span>
            </p>

            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.tagline}>{project.tagline}</p>

            {project.clients && (
              <p className={styles.clients}>
                Client projects: {project.clients.join(' · ')}
              </p>
            )}
          </m.header>

          {/* ── Outcome first ──────────────────────────────────────────── */}
          <m.section variants={item} className={styles.outcomes} aria-label="Outcome">
            {project.outcome.map((entry) => (
              <div key={entry.label} className={styles.outcome}>
                <span className={styles.outcomeValue}>{entry.value}</span>
                <span className={styles.outcomeLabel}>{entry.label}</span>
                {entry.note && <span className={styles.outcomeNote}>{entry.note}</span>}
              </div>
            ))}
          </m.section>

          {/* ── Architecture ───────────────────────────────────────────── */}
          <m.section variants={item} className={styles.block} aria-labelledby="arch-title">
            <h2 className={styles.blockTitle} id="arch-title">
              Architecture
            </h2>
            <ArchitectureDiagram architecture={project.architecture} />
          </m.section>

          {/* ── Narrative ──────────────────────────────────────────────── */}
          <m.section variants={item} className={styles.block} aria-labelledby="problem-title">
            <h2 className={styles.blockTitle} id="problem-title">
              The problem
            </h2>
            <p className={styles.prose}>{project.problem}</p>
          </m.section>

          <m.section variants={item} className={styles.block} aria-labelledby="approach-title">
            <h2 className={styles.blockTitle} id="approach-title">
              Approach
            </h2>
            <p className={styles.prose}>{project.approach}</p>
          </m.section>

          <m.section variants={item} className={styles.block} aria-labelledby="contribution-title">
            <h2 className={styles.blockTitle} id="contribution-title">
              What I owned
            </h2>
            <ul className={styles.ownedList}>
              {project.contribution.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </m.section>

          {/* ── Live demonstration ─────────────────────────────────────── */}
          {showDemo && (
            <m.section variants={item} className={styles.block} aria-labelledby="demo-heading">
              <h2 className={styles.blockTitle} id="demo-heading">
                A working illustration
              </h2>
              <p className={styles.demoIntro}>
                The production dashboards cannot be shown. This is a standalone
                rebuild of the idea, written for this page with no charting
                library — synthetic data, real time-zone resolution.
              </p>
              <SyntheticChart />
            </m.section>
          )}

          {/* ── Depth, behind disclosure ───────────────────────────────── */}
          <m.section variants={item} className={styles.block} aria-labelledby="tradeoffs-title">
            <h2 className={styles.blockTitle} id="tradeoffs-title">
              Challenges &amp; tradeoffs
            </h2>
            <div className={styles.details}>
              {project.challenges.map((entry, i) => (
                <details key={entry.challenge} className={styles.detail} open={i === 0}>
                  <summary className={styles.detailSummary}>
                    <span>{entry.challenge}</span>
                    <Icon name="chevronDown" size={16} className={styles.detailChevron} />
                  </summary>
                  <p className={styles.detailBody}>{entry.resolution}</p>
                </details>
              ))}
            </div>
          </m.section>

          {/* ── Stack ──────────────────────────────────────────────────── */}
          <m.section variants={item} className={styles.block} aria-labelledby="stack-title">
            <h2 className={styles.blockTitle} id="stack-title">
              Stack
            </h2>
            <TechTags items={project.stack} label={`Technologies used on ${project.title}`} />
          </m.section>

          {/* ── Interview surface ──────────────────────────────────────── */}
          <m.section variants={item} className={styles.block} aria-labelledby="hooks-title">
            <h2 className={styles.blockTitle} id="hooks-title">
              Questions this work invites
            </h2>
            <p className={styles.hooksIntro}>
              If you're interviewing me, these are the threads worth pulling.
            </p>
            <ul className={styles.hooks}>
              {project.interviewHooks.map((hook) => (
                <li key={hook} className={styles.hook}>
                  {hook}
                </li>
              ))}
            </ul>
          </m.section>

          <m.div variants={item} className={styles.block}>
            <ConfidentialityNote variant="inline" />
          </m.div>

          {/* ── Related ────────────────────────────────────────────────── */}
          <m.section variants={item} className={styles.related} aria-labelledby="related-title">
            <h2 className={styles.blockTitle} id="related-title">
              More work
            </h2>
            <ul className={styles.relatedList}>
              {related.map((other) => (
                <li key={other.slug}>
                  <Link to={`/work/${other.slug}`} className={styles.relatedLink}>
                    <span className={styles.relatedIndex}>{other.index}</span>
                    <span className={styles.relatedBody}>
                      <span className={styles.relatedTitle}>{other.title}</span>
                      <span className={styles.relatedTagline}>{other.tagline}</span>
                    </span>
                    <Icon name="arrowRight" size={16} className={styles.relatedArrow} />
                  </Link>
                </li>
              ))}
            </ul>
          </m.section>

          {/* ── CTA ────────────────────────────────────────────────────── */}
          <m.section variants={item} className={styles.cta}>
            <h2 className={styles.ctaTitle}>Want the detail behind this?</h2>
            <p className={styles.ctaBody}>
              Happy to walk through the architecture, the alternatives I rejected
              and what I'd do differently now.
            </p>
            <div className={styles.ctaActions}>
              <Action href={`mailto:${profile.email}`} variant="solid" icon="arrowRight">
                Email me
              </Action>
              {links.linkedin && (
                <Action href={links.linkedin} variant="outline" icon="arrowUpRight" external>
                  LinkedIn
                </Action>
              )}
              <Action to="/" variant="ghost" icon="arrowLeft" iconPosition="start">
                Back to portfolio
              </Action>
            </div>
          </m.section>
        </m.article>
      </main>
    </LazyMotion>
  );
}
