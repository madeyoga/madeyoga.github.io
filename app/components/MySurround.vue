<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

defineProps<{
  surround: ContentNavigationItem[] | undefined
}>()

const localePath = useLocalePath()
</script>

<template>
  <div v-if="surround" class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
    <NuxtLink
      v-if="surround[0]"
      :to="localePath(surround[0].path)"
      class="group flex h-full flex-col rounded-lg bg-elevated p-4 transition-colors hover:bg-accented/50 focus-visible:outline-primary"
    >
      <span class="inline-flex items-center gap-1.5 text-sm text-muted">
        <UIcon name="i-lucide-arrow-left" class="size-4" />
        Previous
      </span>
      <span class="mt-2 line-clamp-2 font-medium text-highlighted group-hover:text-primary">{{ surround[0].title }}</span>
      <span v-if="surround[0].description" class="mt-1 line-clamp-2 text-sm leading-6 text-muted">{{ surround[0].description }}</span>
    </NuxtLink>
    <span v-else class="hidden sm:block" />

    <NuxtLink
      v-if="surround[1]"
      :to="localePath(surround[1].path)"
      class="group flex h-full flex-col rounded-lg bg-elevated p-4 transition-colors hover:bg-accented/50 focus-visible:outline-primary sm:items-end sm:text-right"
    >
      <span class="inline-flex items-center gap-1.5 text-sm text-muted sm:flex-row-reverse">
        Next
        <UIcon name="i-lucide-arrow-right" class="size-4" />
      </span>
      <span class="mt-2 line-clamp-2 font-medium text-highlighted group-hover:text-primary">{{ surround[1].title }}</span>
      <span v-if="surround[1].description" class="mt-1 line-clamp-2 text-sm leading-6 text-muted">{{ surround[1].description }}</span>
    </NuxtLink>
    <span v-else class="hidden sm:block" />
  </div>
</template>
