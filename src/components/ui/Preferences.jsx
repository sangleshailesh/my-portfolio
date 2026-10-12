import { Icon } from './Icon';
import { useTheme } from '../../hooks/useTheme';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import styles from './Preferences.module.css';

/**
 * Theme and motion controls.
 *
 * Both are real toggle buttons carrying `aria-pressed`, not decorative
 * switches, and both announce what they will do rather than what they are.
 */
export function Preferences({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const { reduced, toggleMotion } = useMotionPreference();

  return (
    <div className={`${styles.group} ${compact ? styles.compact : ''}`}>
      <button
        type="button"
        className={styles.button}
        onClick={toggleTheme}
        aria-pressed={theme === 'light'}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
      </button>

      {/* The icon shows the current state — slashed once motion is reduced —
          rather than the action, because "animations are currently off" is the
          thing a reader needs to be able to see at a glance. The label and
          tooltip carry the action. */}
      <button
        type="button"
        className={`${styles.button} ${reduced ? styles.active : ''}`}
        onClick={toggleMotion}
        aria-pressed={reduced}
        aria-label={
          reduced ? 'Motion reduced — turn animations on' : 'Reduce motion — turn animations off'
        }
        title={
          reduced ? 'Motion reduced — turn animations on' : 'Reduce motion — turn animations off'
        }
      >
        <Icon name={reduced ? 'motionOff' : 'motion'} size={16} />
      </button>
    </div>
  );
}
