import { GITHUB_URL, LINKEDIN_URL, projects } from '../data/portfolioData';

/**
 * Placeholder guard. Any URL still set to 'NEEDS_INPUT' (or left empty) is
 * treated as absent, so the UI simply omits that link instead of rendering a
 * dead one. Fill the constants in `src/data/portfolioData.js` and the links
 * appear everywhere at once.
 */
export function hasLink(url) {
  return typeof url === 'string' && url.length > 0 && !url.startsWith('NEEDS_INPUT');
}

export const links = {
  get linkedin() {
    return hasLink(LINKEDIN_URL) ? LINKEDIN_URL : null;
  },
  get github() {
    return hasLink(GITHUB_URL) ? GITHUB_URL : null;
  },
};

export function getProject(slug) {
  return projects.find((p) => p.slug === slug) ?? null;
}

/** The two other case studies to offer at the end of a detail page. */
export function getRelatedProjects(slug, count = 2) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return projects.slice(0, count);
  const rotated = [...projects.slice(index + 1), ...projects.slice(0, index)];
  return rotated.slice(0, count);
}
