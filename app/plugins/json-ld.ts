import { canonicalUrl, personJsonLd, useJsonLdGraph } from '~/composables/useJsonLd'

export default defineNuxtPlugin(() => {
  const route = useRoute()

  const website = {
    '@type': 'WebSite',
    '@id': 'https://madeyoga.harten.id/#website',
    url: 'https://madeyoga.harten.id/',
    name: 'Made Yoga Mahardika',
    inLanguage: ['en', 'id'],
    publisher: { '@id': 'https://madeyoga.harten.id/#person' },
  }

  useJsonLdGraph([
    personJsonLd,
    website,
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl(route.path)}#webpage`,
      url: canonicalUrl(route.path),
      isPartOf: { '@id': 'https://madeyoga.harten.id/#website' },
      about: { '@id': 'https://madeyoga.harten.id/#person' },
    },
  ])
})
