<script setup>
const localePath = useLocalePath()
const { t } = useI18n()
const localize = useLocalizedField()

const { data: page } = await useAsyncData('about', () => queryCollection('about').first())

useSeoMeta({
  title: t('about.title'),
  ogTitle: `${t('about.title')} | Made Yoga Mahardika`,
  description: localize(page.value?.personal?.bio) || '',
})
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />

      <main class="py-16" v-if="page">
        <h1 class="text-3xl font-bold dark:text-white mb-16">{{ $t('about.title') }}</h1>

        <!-- Bio -->
        <section class="flex flex-col md:flex-row gap-10 mb-20">
          <div class="shrink-0">
            <img
              :src="page.personal.image"
              :alt="page.personal.name"
              class="border border-default w-40 h-40 object-cover rounded-full"
            />
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <h2 class="text-2xl font-bold dark:text-white">{{ page.personal.name }}</h2>
              <p class="text-primary font-medium">{{ localize(page.personal.title) }}</p>
              <p class="text-muted text-sm mt-1">{{ localize(page.personal.location) }}</p>
            </div>

            <p class="text-muted text-[15px] leading-relaxed text-pretty whitespace-pre-line">
              {{ localize(page.personal.bio) }}
            </p>

            <div class="flex items-center gap-3 mt-2">
              <a
                v-for="link in page.personal.links"
                :key="`about-${link.url}`"
                :href="link.url"
                target="_blank"
                rel="noreferrer noopener"
                :aria-label="`Visit ${link.icon.split('-').pop()} profile`"
              >
                <UIcon :name="link.icon" class="w-6 h-6 text-muted hover:text-primary transition-colors" />
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
              :key="`value-${localize(value.title)}`"
              class="flex flex-col gap-3 p-5 rounded-lg border border-default"
            >
              <UIcon :name="value.icon" class="w-8 h-8 text-primary" />
              <h3 class="font-semibold dark:text-white">{{ localize(value.title) }}</h3>
              <p class="text-sm text-muted text-pretty">{{ localize(value.description) }}</p>
            </div>
          </div>
        </section>

        <!-- Work Experience -->
        <section v-if="page.experiences?.length" class="mb-20">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">{{ $t('section.experience') }}</h2>

          <div
            class="flex flex-col gap-2 sm:flex-row sm:gap-8 py-6"
            v-for="exp in page.experiences"
            :key="`${exp.timeframe}-${exp.company}`"
          >
            <div class="text-muted shrink-0 sm:w-36">{{ exp.timeframe }}</div>

            <div>
              <h3 class="dark:text-white">{{ exp.title }}</h3>
              <div class="text-muted">
                {{ exp.company }}
                <template v-if="exp.domainName">
                  •
                  <a
                    v-if="exp.url"
                    class="text-primary"
                    :href="exp.url"
                    target="_blank"
                    rel="noreferrer noopener"
                    :aria-label="`Visit ${exp.company} website`"
                  >
                    {{ exp.domainName }}
                  </a>
                  <span v-else>{{ exp.domainName }}</span>
                </template>
                • {{ exp.jobtype }}
              </div>
            </div>
          </div>
        </section>

        <UButton
          :to="localePath('/projects')"
          color="neutral"
          variant="outline"
          size="sm"
          class="mb-8"
        >
          {{ $t('section.view_all_projects') }}
        </UButton>

        <CTABanner />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
