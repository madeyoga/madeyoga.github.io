<script setup lang="ts">
const route = useRoute()
/** Article routes only. The index stays on the narrow column. */
const isArticle = computed(() => /\/blog\/[^/]+\/?$/.test(route.path))
</script>

<template>
  <div
    class="min-h-screen mx-auto pt-10 border-default sm:border-x"
    :class="isArticle ? 'max-w-7xl' : 'max-w-190'"
  >
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />
      <NuxtPage />
      <AppFooter />
    </div>
  </div>
</template>
