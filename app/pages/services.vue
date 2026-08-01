<script setup>
const { data: page } = await useAsyncData('services', () => queryCollection('services').first())
const { locale } = useI18n()

const t = (obj) => obj?.[locale.value] || obj?.en || ''

useSeoMeta({
  title: t(page?.title) || 'Services',
  ogTitle: t(page?.title) || 'Services',
  description: t(page?.description) || '',
})
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />

      <main class="py-16">
        <h1 class="text-3xl font-bold dark:text-white mb-4">{{ t(page.title) }}</h1>
        <p class="text-muted text-[15px] leading-relaxed mb-16">{{ t(page.description) }}</p>

        <!-- Service Items -->
        <section class="space-y-8 mb-20">
          <div
            v-for="item in page.items"
            :key="t(item.title)"
            class="p-6 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-start gap-4">
              <UIcon :name="item.icon" class="w-10 h-10 text-green-800 dark:text-green-400 shrink-0 mt-1" />
              <div>
                <h3 class="text-xl font-semibold dark:text-white mb-2">{{ t(item.title) }}</h3>
                <p class="text-muted text-[15px] leading-relaxed mb-4">{{ t(item.description) }}</p>
                <ul class="space-y-2">
                  <li
                    v-for="d in item.deliverables"
                    :key="t(d)"
                    class="flex items-start gap-2 text-sm text-muted"
                  >
                    <UIcon name="i-lucide-check" class="w-4 h-4 text-green-800 dark:text-green-400 shrink-0 mt-0.5" />
                    {{ t(d) }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Process -->
        <section class="mb-20">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">How I Work</h2>

          <div class="space-y-6">
            <div
              v-for="step in page.process"
              :key="step.step"
              class="flex items-start gap-4"
            >
              <div class="shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span class="text-green-800 dark:text-green-400 font-bold text-sm">{{ step.step }}</span>
              </div>
              <div>
                <h3 class="font-semibold dark:text-white">{{ t(step.title) }}</h3>
                <p class="text-sm text-muted">{{ t(step.description) }}</p>
              </div>
            </div>
          </div>
        </section>

        <CTABanner />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
