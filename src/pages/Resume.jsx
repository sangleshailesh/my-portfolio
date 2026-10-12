import { Link } from 'react-router-dom';
import {
  RESUME_PDF,
  about,
  awards,
  education,
  experience,
  profile,
  skillGroups,
} from '../data/portfolioData';
import { links } from '../lib/content';
import { Seo } from '../components/Seo/Seo';
import { Action } from '../components/ui/Action';
import { Icon } from '../components/ui/Icon';
import styles from './Resume.module.css';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Résumé
 * ─────────────────────────────────────────────────────────────────────────────
 * Built from the same data as the rest of the site, so it cannot drift out of
 * date and cannot 404 — which is what a "Download résumé" button wired to a
 * file that was never uploaded does.
 *
 * Laid out for print as much as for screen: at A4 it comes out as a clean
 * two-page document with the navigation, buttons and theme controls removed.
 * Recruiters who want a PDF can print to one; if a real PDF is dropped into
 * `public/` and RESUME_PDF is set, a download button appears here too.
 */
export default function Resume() {
  const handlePrint = () => window.print();

  return (
    <>
      <Seo
        title="Résumé"
        description={`Résumé of ${profile.name}, ${profile.title} — ${profile.microLabel}.`}
        path="/resume"
      />

      <main id="content" className={styles.page} tabIndex={-1}>
        <div className={`${styles.toolbar} u-no-print`}>
          <Link to="/" className={styles.back}>
            <Icon name="arrowLeft" size={15} />
            Back to portfolio
          </Link>

          <div className={styles.toolbarActions}>
            <Action onClick={handlePrint} variant="outline" icon="document" iconPosition="start">
              Print / save as PDF
            </Action>
            {RESUME_PDF && (
              <Action href={RESUME_PDF} variant="solid" icon="arrowUpRight" external>
                Download PDF
              </Action>
            )}
          </div>
        </div>

        <article className={styles.sheet}>
          <header className={styles.header}>
            <h1 className={styles.name}>{profile.name}</h1>
            <p className={styles.role}>{profile.title}</p>
            {/* Contact details are literal text so that a PDF printed from this
                page still yields the email and phone to a text extractor. */}
            <ul className={styles.contact}>
              <li>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </li>
              {profile.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
                </li>
              ))}
              {links.linkedin && (
                <li>
                  <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
              )}
              {links.github && (
                <li>
                  <a href={links.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
              )}
            </ul>
          </header>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <p className={styles.summary}>{profile.positioning}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <dl className={styles.skills}>
              {skillGroups.map((group) => (
                <div key={group.id} className={styles.skillRow}>
                  <dt className={styles.skillLabel}>{group.label}</dt>
                  <dd className={styles.skillValue}>
                    {group.skills.map((s) => s.name).join(' · ')}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            {experience.map((role) => (
              <div key={role.id} className={styles.role_}>
                <div className={styles.roleHead}>
                  <h3 className={styles.roleTitle}>
                    {role.role} — {role.company}
                  </h3>
                  <p className={styles.rolePeriod}>{role.period}</p>
                </div>
                <p className={styles.roleDomain}>{role.domain}</p>
                <ul className={styles.bullets}>
                  {role.highlights.map((highlight) => (
                    <li key={highlight.impact}>
                      <strong>{highlight.impact}.</strong> {highlight.detail}
                    </li>
                  ))}
                </ul>
                <p className={styles.roleStack}>{role.stack.join(' · ')}</p>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className={styles.roleHead}>
              <h3 className={styles.roleTitle}>{education.degree}</h3>
              <p className={styles.rolePeriod}>{education.period}</p>
            </div>
            <p className={styles.roleDomain}>{education.institution}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Recognition</h2>
            <ul className={styles.bullets}>
              {awards.map((award) => (
                <li key={award.date}>
                  <strong>
                    {award.title}, {award.org} ({award.date}).
                  </strong>{' '}
                  {award.detail}
                </li>
              ))}
            </ul>
          </section>

          <section className={`${styles.section} ${styles.domains}`}>
            <h2 className={styles.sectionTitle}>Domains</h2>
            <p>{about.domains.join(' · ')}</p>
          </section>
        </article>
      </main>
    </>
  );
}
