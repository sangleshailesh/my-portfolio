/**
 * Inline icon set. Kept as a tiny hand-rolled sprite rather than an icon
 * package — the whole set below costs less than the import statement for one.
 *
 * Every icon is `aria-hidden`; the accessible name always comes from the text
 * or `aria-label` of the control that wraps it.
 */

const paths = {
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  arrowUpRight: 'M7 17 17 7M8 7h9v9',
  arrowLeft: 'M19 12H5M11 18l-6-6 6-6',
  mail: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M3.5 7.5 12 13l8.5-5.5',
  phone:
    'M5 3h3.5l1.8 4.5-2.2 1.6a12 12 0 0 0 5.8 5.8l1.6-2.2L20 14.5V18a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 6.2 2 2 0 0 1 5 4z',
  document: 'M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z M14 3v5h5 M9 13h6 M9 17h4',
  linkedin: 'M6 9v10M6 5.5v.01M11 19v-5.5a2.5 2.5 0 0 1 5 0V19M11 9v10',
  github:
    'M9 19c-4 1.2-4-2.2-6-2.7m12 5v-3.3a2.9 2.9 0 0 0-.8-2.2c2.6-.3 5.4-1.3 5.4-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6 0C6.4 3.1 5.4 3.4 5.4 3.4a4.3 4.3 0 0 0-.1 3.2A4.7 4.7 0 0 0 4 9.8c0 4.7 2.8 5.7 5.4 6a2.9 2.9 0 0 0-.8 2.2V21',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  chevronDown: 'M6 9l6 6 6-6',
  // Motion preference. The previous glyph was an ECG trace, which readers
  // consistently took for a heart-rate or health icon rather than an animation
  // control. Speed lines plus a chevron read as movement; the slashed variant
  // makes the "off" state unmistakable at 16px.
  motion: 'M3 8h5M3 12h7M3 16h5 M14 7l5 5-5 5',
  motionOff: 'M3 8h5M3 12h7M3 16h5 M14 7l5 5-5 5 M4 20 20 4',
};

export function Icon({ name, size = 16, strokeWidth = 1.6, className }) {
  const d = paths[name];
  if (!d) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* One path per icon — a single `d` may hold several subpaths, so there
          is no need to split the string on move commands. */}
      <path d={d} />
    </svg>
  );
}
