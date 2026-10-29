import { canonicalUrl, personJsonLd, useJsonLdGraph } from '~/composables/useJsonLd'
import { indexablePath } from '~/utils/blog-seo'

export default defineNuxtPlugin(() => {
  const route = useRoute()
  const path = indexablePath(route.path, useRuntimeConfig().public.untranslatedBlogSlugs)

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
      '@id': `${canonicalUrl(path)}#webpage`,
      url: canonicalUrl(path),
      isPartOf: { '@id': 'https://madeyoga.harten.id/#website' },
      about: { '@id': 'https://madeyoga.harten.id/#person' },
    },
  ])
})
