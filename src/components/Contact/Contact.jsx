import { contact, profile } from '../../data/portfolioData';
import { links } from '../../lib/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { Icon } from '../ui/Icon';
import { ResumeActions } from '../ui/ResumeActions';
import styles from './Contact.module.css';

/**
 * Contact.
 *
 * Email is written out as selectable text, not hidden behind a form. A form as
 * the only route means a recruiter cannot forward the address to a hiring
 * manager, cannot attach a job description, and gets no delivery confirmation —
 * so it is the one contact pattern that actively costs replies.
 *
 * Phone numbers are real `tel:` links, which are worth more on the phone a
 * recruiter is probably holding than on a desktop.
 */
export function Contact() {
  return (
    <section id="contact" className={styles.section} tabIndex={-1} aria-labelledby="contact-title">
      <SectionHeading index="05" eyebrow="Contact" title={contact.heading} id="contact-title" />

      <Reveal>
        <p className={styles.body}>{contact.body}</p>
      </Reveal>

      <Reveal delay={60}>
        <ul className={styles.channels}>
          <li>
            <a className={styles.channel} href={`mailto:${profile.email}`}>
              <Icon name="mail" size={18} className={styles.channelIcon} />
              <span className={styles.channelBody}>
                <span className={styles.channelLabel}>Email</span>
                <span className={styles.channelValue}>{profile.email}</span>
              </span>
              <Icon name="arrowRight" size={16} className={styles.channelArrow} />
            </a>
          </li>

          {profile.phones.map((phone, i) => (
            <li key={phone}>
              <a className={styles.channel} href={`tel:${phone.replace(/\s/g, '')}`}>
                <Icon name="phone" size={18} className={styles.channelIcon} />
                <span className={styles.channelBody}>
                  <span className={styles.channelLabel}>
                    {i === 0 ? 'Phone' : 'Phone (alt)'}
                  </span>
                  <span className={styles.channelValue}>{phone}</span>
                </span>
                <Icon name="arrowRight" size={16} className={styles.channelArrow} />
              </a>
            </li>
          ))}

          {/* Rendered only when a real URL is present — an empty 44px tap target
              where a profile link should be is worse than a shorter list. */}
          {links.linkedin && (
            <li>
              <a
                className={styles.channel}
                href={links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="linkedin" size={18} className={styles.channelIcon} />
                <span className={styles.channelBody}>
                  <span className={styles.channelLabel}>LinkedIn</span>
                  <span className={styles.channelValue}>Profile</span>
                </span>
                <Icon name="arrowUpRight" size={16} className={styles.channelArrow} />
              </a>
            </li>
          )}

          {links.github && (
            <li>
              <a
                className={styles.channel}
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="github" size={18} className={styles.channelIcon} />
                <span className={styles.channelBody}>
                  <span className={styles.channelLabel}>GitHub</span>
                  <span className={styles.channelValue}>Profile</span>
                </span>
                <Icon name="arrowUpRight" size={16} className={styles.channelArrow} />
              </a>
            </li>
          )}
        </ul>
      </Reveal>

      <Reveal delay={120} className={styles.actions}>
        <ResumeActions />
      </Reveal>

      <Reveal delay={150}>
        <p className={styles.nda}>
          Most of the work above sits behind client NDAs — happy to walk through
          the architecture and the tradeoffs in detail on a call.
        </p>
      </Reveal>
    </section>
  );
}
