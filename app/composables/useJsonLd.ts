const SITE_URL = 'https://madeyoga.harten.id'

export const personJsonLd = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: 'Made Yoga Mahardika',
  url: SITE_URL,
  image: 'https://media.harten.id/images/madeyoga-avatar.png',
  jobTitle: 'Software Engineer',
  email: 'madeyoga@harten.id',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Samarinda',
    addressCountry: 'ID',
  },
  sameAs: [
    'https://github.com/madeyoga',
    'https://x.com/madey_bog',
    'https://www.youtube.com/@madey02',
  ],
}

/** Same slash rule as nuxt-site-config `fixSlashes` (the canonical resolver). */
export function withCanonicalSlash(href: string, trailingSlash?: boolean) {
  try {
    const url = new URL(href, SITE_URL)
    const last = url.pathname.split('/').pop() || ''
    if (/\.[0-9a-z]+$/i.test(last)) return href
    if (trailingSlash) {
      if (!url.pathname.endsWith('/')) url.pathname = `${url.pathname}/`
    } else if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '')
    }
    return url.toString()
  } catch {
    return href
  }
}

export function canonicalUrl(path: string) {
  const site = useSiteConfig()
  const origin = String(site.url || SITE_URL).replace(/\/+$/, '')
  const absolute = /^https?:\/\//i.test(path)
    ? path
    : `${origin}${!path || path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`}`
  return withCanonicalSlash(absolute, site.trailingSlash)
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
