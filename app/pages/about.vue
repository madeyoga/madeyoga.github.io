<script setup>
const { data: page } = await useAsyncData('about', () => queryCollection('about').first())
const { locale } = useI18n()

const t = (obj) => obj?.[locale.value] || obj?.en || ''

useSeoMeta({
  title: t(page?.personal?.title) || 'About Me',
  ogTitle: t(page?.personal?.title) || 'About Me',
  description: t(page?.personal?.bio) || '',
})
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />

      <main class="py-16">
        <h1 class="text-3xl font-bold dark:text-white mb-16">{{ $t('about.title') }}</h1>

        <!-- Personal -->
        <section class="flex flex-col md:flex-row gap-10 mb-20">
          <div class="shrink-0">
            <img
              :src="page.personal.image"
              :alt="page.personal.name"
              class="border border-gray-400 w-40 h-40 object-cover rounded-full"
            />
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <h2 class="text-2xl font-bold dark:text-white">{{ page.personal.name }}</h2>
              <p class="text-green-800 dark:text-green-400 font-medium">{{ t(page.personal.title) }}</p>
              <p class="text-muted text-sm mt-1">{{ t(page.personal.location) }}</p>
            </div>

            <p class="text-muted text-[15px] leading-relaxed text-pretty whitespace-pre-line">
              {{ t(page.personal.bio) }}
            </p>

            <div class="flex items-center gap-3 mt-2">
              <a
                v-for="link in page.personal.links"
                :key="`about-${link.url}`"
                :href="link.url"
                target="_blank"
                rel="noreferrer noopener"
                :aria-label="`Visit ${link.icon.split('-').pop()} profile`"
                :title="`Visit ${link.icon.split('-').pop()} profile`"
              >
                <UIcon :name="link.icon" class="w-6 h-6 text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors" />
              </a>
            </div>
          </div>
        </section>

        <!-- Values -->
        <section class="mb-20">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">{{ $t('about.values') }}</h2>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div
              v-for="value in page.values"
              :key="`value-${t(value.title)}`"
              class="flex flex-col gap-3 p-5 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <UIcon :name="value.icon" class="w-8 h-8 text-green-800 dark:text-green-400" />
              <h3 class="font-semibold dark:text-white">{{ t(value.title) }}</h3>
              <p class="text-sm text-muted text-pretty">{{ t(value.description) }}</p>
            </div>
          </div>
        </section>

        <!-- CTA -->
        <CTABanner />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
