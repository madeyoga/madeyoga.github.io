import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  adjustBlogHead,
  blogPostSlug,
  indexablePath,
  isUntranslatedIndonesianPost,
} from '../app/utils/blog-seo.ts'

const links = [
  { id: 'i18n-xd', rel: 'alternate', href: 'https://madeyoga.harten.id/blog/example/', hreflang: 'x-default' },
  { id: 'i18n-alt-en', rel: 'alternate', href: 'https://madeyoga.harten.id/blog/example/', hreflang: 'en' },
  { id: 'i18n-alt-id', rel: 'alternate', href: 'https://madeyoga.harten.id/id/blog/example/', hreflang: 'id' },
  { id: 'i18n-can', rel: 'canonical', href: 'https://madeyoga.harten.id/id/blog/example/' },
]

const meta = [
  { id: 'i18n-og-url', property: 'og:url', content: 'https://madeyoga.harten.id/id/blog/example/' },
  { id: 'i18n-og', property: 'og:locale', content: 'id' },
  { id: 'i18n-og-alt-en', property: 'og:locale:alternate', content: 'en' },
]

describe('blog post head for untranslated Indonesian URLs', () => {
  it('drops the id hreflang, canonicalizes to English, and noindexes the /id/ page', () => {
    const adjusted = adjustBlogHead({
      path: '/id/blog/example/',
      untranslatedSlugs: ['example'],
      links,
      meta,
    })
    assert.equal(adjusted.robots, 'noindex')
    assert.deepEqual(adjusted.links.map(link => link.hreflang || link.rel), ['x-default', 'en', 'canonical'])
    assert.equal(adjusted.links.find(link => link.rel === 'canonical')?.href, 'https://madeyoga.harten.id/blog/example/')
    assert.equal(adjusted.meta.find(item => item.property === 'og:url')?.content, 'https://madeyoga.harten.id/blog/example/')
    assert.equal(adjusted.meta.some(item => item.content === 'id' && item.property === 'og:locale:alternate'), false)
  })

  it('drops the id hreflang on the English page and keeps its own canonical', () => {
    const adjusted = adjustBlogHead({
      path: '/blog/example/',
      untranslatedSlugs: ['example'],
      links: links.map(link => link.rel === 'canonical'
        ? { ...link, href: 'https://madeyoga.harten.id/blog/example/' }
        : link),
      meta: [
        { property: 'og:url', content: 'https://madeyoga.harten.id/blog/example/' },
        { property: 'og:locale', content: 'en' },
        { property: 'og:locale:alternate', content: 'id' },
      ],
    })
    assert.equal(adjusted.robots, null)
    assert.equal(adjusted.links.some(link => link.hreflang === 'id'), false)
    assert.equal(adjusted.links.find(link => link.rel === 'canonical')?.href, 'https://madeyoga.harten.id/blog/example/')
    assert.equal(adjusted.meta.some(item => item.property === 'og:locale:alternate'), false)
  })

  it('leaves a real translation indexed with both hreflang alternates', () => {
    const adjusted = adjustBlogHead({
      path: '/id/blog/example/',
      untranslatedSlugs: ['other-post'],
      links,
      meta,
    })
    assert.equal(adjusted.robots, null)
    assert.deepEqual(adjusted.links.map(link => link.hreflang || link.rel), ['x-default', 'en', 'id', 'canonical'])
    assert.equal(adjusted.links.find(link => link.rel === 'canonical')?.href, 'https://madeyoga.harten.id/id/blog/example/')
    assert.equal(indexablePath('/id/blog/example/', ['other-post']), '/id/blog/example/')
  })

  it('does not change portfolio pages that are not blog posts', () => {
    const homeLinks = [
      { rel: 'alternate', href: 'https://madeyoga.harten.id/', hreflang: 'x-default' },
      { rel: 'alternate', href: 'https://madeyoga.harten.id/', hreflang: 'en' },
      { rel: 'alternate', href: 'https://madeyoga.harten.id/id/', hreflang: 'id' },
      { rel: 'canonical', href: 'https://madeyoga.harten.id/id/' },
    ]
    const adjusted = adjustBlogHead({
      path: '/id/',
      untranslatedSlugs: ['example'],
      links: homeLinks,
      meta: [{ property: 'og:locale:alternate', content: 'en' }],
    })
    assert.equal(adjusted.robots, null)
    assert.deepEqual(adjusted.links, homeLinks)
    assert.equal(blogPostSlug('/id/'), null)
    assert.equal(blogPostSlug('/blog/'), null)
    assert.equal(isUntranslatedIndonesianPost('/id/projects/prima/', ['example']), false)
  })
})
