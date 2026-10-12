import { projects } from '../data/portfolioData';
import { Seo } from '../components/Seo/Seo';
import { Action } from '../components/ui/Action';
import styles from './NotFound.module.css';

/**
 * 404. Offers the case-study list rather than a dead end — if someone followed
 * a stale link to a piece of work, the thing they wanted is probably one of
 * these.
 */
export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="That page does not exist." path="/404" />

      <main id="content" className={styles.page} tabIndex={-1}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>That page doesn't exist.</h1>
        <p className={styles.body}>
          The link may be out of date. The case studies are all here:
        </p>

        <ul className={styles.list}>
          {projects.map((project) => (
            <li key={project.slug}>
              <Action to={`/work/${project.slug}`} variant="ghost" icon="arrowRight">
                {project.title}
              </Action>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Action to="/" variant="solid" icon="arrowLeft" iconPosition="start">
            Back to the portfolio
          </Action>
        </div>
      </main>
    </>
  );
}
