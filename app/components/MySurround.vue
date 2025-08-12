<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

defineProps<{
  surround: ContentNavigationItem[] | undefined,
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-8" v-if="surround">
    <template v-if="surround[0]">
      <NuxtLink :to="surround[0].path">
        <UCard variant="outline">
          <UButton icon="i-lucide-arrow-left" size="md" color="primary" variant="outline" class="rounded-full mb-4" />
          <p class="font-medium text-[15px] text-highlighted mb-1 truncate">{{ surround[0].title }}</p>
          <p class="text-sm text-muted line-clamp-2">{{ surround[0].description }}</p>
        </UCard>
      </NuxtLink>
    </template>
    <template v-else>
      <span class="hidden lg:block">&nbsp;</span>
    </template>

    <template v-if="surround[1]">
      <NuxtLink :to="surround[1].path">
        <UCard variant="outline" class="text-right">
          <UButton icon="i-lucide-arrow-right" size="md" color="primary" variant="outline" class="rounded-full mb-4" />
          <p class="font-medium text-[15px] text-highlighted mb-1 truncate">{{ surround[1].title }}</p>
          <p class="text-sm text-muted line-clamp-2">{{ surround[1].description }}</p>
        </UCard>
      </NuxtLink>
    </template>
    <template v-else>
      <span class="hidden lg:block">&nbsp;</span>
    </template>
  </div>
</template>
