<script setup lang="ts">
import { withCanonicalSlash } from '~/composables/useJsonLd'

const { locale } = useI18n()
const site = useSiteConfig()
const i18nHead = useLocaleHead({
  lang: true,
  dir: true,
  seo: true,
})

function toCanonical(href: string) {
  return withCanonicalSlash(href, site.trailingSlash)
}

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang || locale.value,
  },
  link: (i18nHead.value.link || []).map((link) => {
    if (typeof link.href !== 'string') return link
    if (link.rel !== 'alternate' && link.rel !== 'canonical') return link
    return { ...link, href: toCanonical(link.href) }
  }),
  meta: (i18nHead.value.meta || []).map((meta) => {
    if (meta.property === 'og:url' && typeof meta.content === 'string') {
      return { ...meta, content: toCanonical(meta.content) }
    }
    return meta
  }),
  titleTemplate: (title?: string) => {
    const site = 'Made Yoga Mahardika'
    if (!title) return site
    return title.includes(site) ? title : `${title} | ${site}`
  },
}))

useSeoMeta({
  ogImage: 'https://madeyoga.harten.id/og-image.png',
  twitterImage: 'https://madeyoga.harten.id/og-image.png',
  twitterCard: 'summary_large_image',
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
