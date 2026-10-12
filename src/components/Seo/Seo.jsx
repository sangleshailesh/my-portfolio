import { SITE_URL, profile } from '../../data/portfolioData';

/**
 * Per-route metadata.
 *
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree into
 * <head> natively, so this needs no helmet library and no extra dependency.
 *
 * Note on indexing: this is a client-rendered SPA. Google executes JavaScript
 * and will index it, but the crawl is a second pass and slower. The static
 * fallbacks in index.html mean the name, title and description are in the
 * initial HTML response regardless — which is what matters for ranking on a
 * search for the person's own name.
 */
export function Seo({ title, description, path = '/', type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} · ${profile.name}` : `${profile.name} — ${profile.title}`;
  const desc = description ?? profile.metaDescription;
  const url = `${SITE_URL}${path}`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={profile.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </>
  );
}
