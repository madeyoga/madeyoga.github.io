<script setup lang="ts">
import { withCanonicalSlash } from '~/composables/useJsonLd'
import { adjustBlogHead, blogPostSlug } from '~/utils/blog-seo'

const { locale } = useI18n()
const route = useRoute()
const site = useSiteConfig()
const untranslatedBlogSlugs = useRuntimeConfig().public.untranslatedBlogSlugs
const i18nHead = useLocaleHead({
  lang: true,
  dir: true,
  seo: true,
})

function toCanonical(href: string) {
  return withCanonicalSlash(href, site.trailingSlash)
}

useHead(() => {
  const adjusted = adjustBlogHead({
    path: route.path,
    untranslatedSlugs: untranslatedBlogSlugs,
    links: i18nHead.value.link || [],
    meta: i18nHead.value.meta || [],
  })
  return {
    htmlAttrs: {
      lang: i18nHead.value.htmlAttrs?.lang || locale.value,
    },
    link: adjusted.links.map((link) => {
      if (typeof link.href !== 'string') return link
      if (link.rel !== 'alternate' && link.rel !== 'canonical') return link
      return { ...link, href: toCanonical(link.href) }
    }),
    meta: [
      ...adjusted.meta.map((meta) => {
        if (meta.property === 'og:url' && typeof meta.content === 'string') {
          return { ...meta, content: toCanonical(meta.content) }
        }
        return meta
      }),
      ...(adjusted.robots
        ? [{ name: 'robots', content: adjusted.robots, tagPriority: 'critical' as const }]
        : []),
    ],
    // Blog post titles omit the site name so the document title stays within 60 characters.
    titleTemplate: (title?: string) => {
      const siteName = 'Made Yoga Mahardika'
      if (!title) return siteName
      if (blogPostSlug(route.path)) return title
      return title.includes(siteName) ? title : `${title} | ${siteName}`
    },
  }
})

useSeoMeta({
  ogImage: 'https://media.harten.id/images/madeyoga-avatar.png',
  ogImageWidth: 460,
  ogImageHeight: 460,
  ogImageType: 'image/png',
  twitterImage: 'https://media.harten.id/images/madeyoga-avatar.png',
  twitterCard: 'summary_large_image',
  twitterSite: '@madey_bog',
  twitterCreator: '@madey_bog',
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
