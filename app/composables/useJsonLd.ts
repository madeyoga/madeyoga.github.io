const SITE_URL = 'https://madeyoga.github.io'

export const personJsonLd = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Made Yoga Mahardika',
  url: SITE_URL,
  image: `${SITE_URL}/images/profile2.jpg`,
  jobTitle: 'Fullstack Software Developer',
  email: 'madeybog@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Samarinda',
    addressCountry: 'ID',
  },
  sameAs: [
    'https://github.com/madeyoga',
    'https://www.linkedin.com/in/made-mahardika-4a205a379/',
    'https://www.youtube.com/@madey02',
  ],
}

export function canonicalUrl(path: string) {
  if (!path || path === '/') return `${SITE_URL}/`
  const trimmed = path.replace(/\/+$/, '')
  return `${SITE_URL}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`
}

export function useJsonLdGraph(nodes: Record<string, unknown>[], key = 'jsonld-graph') {
  useHead({
    script: [
      {
        key,
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': nodes,
        }),
      },
    ],
  })
}
