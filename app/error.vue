<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const localePath = useLocalePath()
const isNotFound = computed(() => props.error?.statusCode === 404)
const title = computed(() =>
  isNotFound.value ? 'Page not found' : 'Something went wrong'
)

useHead({
  htmlAttrs: { lang: 'en' },
  title: () => `${title.value} · Made Yoga Mahardika`,
})

useSeoMeta({
  title: () => title.value,
  robots: 'noindex',
})
</script>

<template>
  <UApp>
    <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
      <div class="px-4 sm:px-6 pt-18">
        <AppHeader />

        <main class="py-24 text-center">
          <p class="text-primary font-semibold text-sm tracking-widest uppercase mb-4">
            {{ error?.statusCode || 404 }}
          </p>
          <h1 class="text-3xl sm:text-4xl font-bold text-highlighted mb-4">
            {{ title }}
          </h1>
          <p class="text-muted text-[15px] mb-8">
            {{ isNotFound ? 'That URL is not on this site.' : 'The page failed to load.' }}
          </p>
          <UButton
            :to="localePath('/')"
            color="primary"
            variant="solid"
          >
            Back to home
          </UButton>
        </main>

        <AppFooter />
      </div>
    </div>
  </UApp>
</template>
