import { canonicalUrl, personJsonLd, useJsonLdGraph } from '~/composables/useJsonLd'

export default defineNuxtPlugin(() => {
  const route = useRoute()

  const website = {
    '@type': 'WebSite',
    '@id': 'https://madeyoga.github.io/#website',
    url: 'https://madeyoga.github.io/',
    name: 'Made Yoga Mahardika',
    inLanguage: ['en', 'id'],
    publisher: { '@id': 'https://madeyoga.github.io/#person' },
  }

  useJsonLdGraph([
    personJsonLd,
    website,
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl(route.path)}#webpage`,
      url: canonicalUrl(route.path),
      isPartOf: { '@id': 'https://madeyoga.github.io/#website' },
      about: { '@id': 'https://madeyoga.github.io/#person' },
    },
  ])
})
