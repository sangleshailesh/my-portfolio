import { SITE_URL, profile } from '../data/portfolioData';

/**
 * JSON-LD Person schema.
 *
 * Only fields that are actually true are emitted. `sameAs` is omitted entirely
 * rather than carrying a placeholder profile URL — structured data pointing at
 * a 404 is worse than structured data that is merely incomplete.
 */
export function buildPersonSchema({ linkedin, github } = {}) {
  const sameAs = [linkedin, github].filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    url: SITE_URL,
    description: profile.metaDescription,
    knowsAbout: [
      'React',
      'Redux',
      'TypeScript',
      'Next.js',
      'JavaScript',
      'Highcharts',
      'Data visualization',
      'Web performance optimization',
      'API security',
      'Optimizely CMS',
    ],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'VESIT, Mumbai',
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/** Schema for a single case-study route. */
export function buildCaseStudySchema(project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    abstract: project.tagline,
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    about: project.stack,
    url: `${SITE_URL}/work/${project.slug}`,
  };
}
