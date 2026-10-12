import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import styles from './Action.module.css';

/**
 * The single action primitive — renders as <a>, <button> or react-router <Link>
 * depending on what it is given, so callers never have to choose between
 * correct semantics and consistent styling.
 *
 * Variants: `solid` (one per view, at most), `outline`, `ghost`, `text`.
 */
export function Action({
  as,
  to,
  href,
  variant = 'outline',
  icon,
  iconPosition = 'end',
  external = false,
  className = '',
  children,
  ...rest
}) {
  const classes = [styles.action, styles[variant], className].filter(Boolean).join(' ');

  const content = (
    <>
      {icon && iconPosition === 'start' && <Icon name={icon} className={styles.icon} />}
      <span className={styles.label}>{children}</span>
      {icon && iconPosition === 'end' && <Icon name={icon} className={styles.icon} />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    // `noopener` is the meaningful half; `noreferrer` also strips the referrer,
    // which matters for outbound profile links.
    const externalProps = external
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};
    return (
      <a href={href} className={classes} {...externalProps} {...rest}>
        {content}
      </a>
    );
  }

  const Tag = as ?? 'button';
  return (
    <Tag className={classes} type={Tag === 'button' ? 'button' : undefined} {...rest}>
      {content}
    </Tag>
  );
}
