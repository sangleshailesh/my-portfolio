import { useReveal } from '../../hooks/useReveal';

/**
 * Wraps children in a scroll-revealed element.
 *
 * Renders a plain element with no styles of its own — `as` lets a caller keep
 * the semantic tag it actually needs (li, article, section) rather than being
 * forced into a wrapper div that would break list and landmark semantics.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, ...rest }) {
  const ref = useReveal({ delay });
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
