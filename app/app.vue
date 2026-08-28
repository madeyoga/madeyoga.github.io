<script setup lang="ts">
const { locale } = useI18n()
const i18nHead = useLocaleHead({
  lang: true,
  dir: true,
  seo: true,
})

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs?.lang || locale.value,
  },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
}))

useSeoMeta({
  ogImage: 'https://madeyoga.github.io/og-image.png',
  twitterImage: 'https://madeyoga.github.io/og-image.png',
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
