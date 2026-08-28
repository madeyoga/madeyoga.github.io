<script setup>
const localePath = useLocalePath()
const { locale } = useI18n()

const { data: page } = await useAsyncData('services', () => queryCollection('services').first())
const { data: about } = await useAsyncData('about_on_services', () => queryCollection('about').first())
const { data: projects } = await useAsyncData('services_client_projects', () => queryCollection('projectsDetail').all())

const t = (obj) => obj?.[locale.value] || obj?.en || ''

const workProjects = computed(() =>
  (projects.value || []).filter(p => (p.category || 'work') === 'work')
)

useSeoMeta({
  title: t(page.value?.title) || 'Services',
  ogTitle: `${t(page.value?.title) || 'Services'} | Made Yoga Mahardika`,
  description: t(about.value?.personal?.bio) || t(page.value?.description) || '',
})
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />

      <main class="py-16" v-if="page && about">
        <h1 class="text-3xl font-bold dark:text-white mb-4">{{ t(page.title) }}</h1>
        <p class="text-muted text-[15px] leading-relaxed mb-16">{{ t(page.description) }}</p>

        <!-- Bio -->
        <section class="flex flex-col md:flex-row gap-10 mb-20">
          <div class="shrink-0">
            <img
              :src="about.personal.image"
              :alt="about.personal.name"
              class="border border-default w-40 h-40 object-cover rounded-full"
            />
          </div>

          <div class="flex flex-col gap-4">
            <div>
              <h2 class="text-2xl font-bold dark:text-white">{{ about.personal.name }}</h2>
              <p class="text-primary font-medium">{{ t(about.personal.title) }}</p>
              <p class="text-muted text-sm mt-1">{{ t(about.personal.location) }}</p>
            </div>

            <p class="text-muted text-[15px] leading-relaxed text-pretty whitespace-pre-line">
              {{ t(about.personal.bio) }}
            </p>

            <div class="flex items-center gap-3 mt-2">
              <a
                v-for="link in about.personal.links"
                :key="`services-about-${link.url}`"
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
              v-for="value in about.values"
              :key="`value-${t(value.title)}`"
              class="flex flex-col gap-3 p-5 rounded-lg border border-default"
            >
              <UIcon :name="value.icon" class="w-8 h-8 text-primary" />
              <h3 class="font-semibold dark:text-white">{{ t(value.title) }}</h3>
              <p class="text-sm text-muted text-pretty">{{ t(value.description) }}</p>
            </div>
          </div>
        </section>

        <!-- What I Offer -->
        <section class="mb-20">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">{{ $t('section.offerings') }}</h2>

          <div class="space-y-8">
            <div
              v-for="item in page.items"
              :key="t(item.title)"
              class="p-6 rounded-lg border border-default"
            >
              <div class="flex items-start gap-4">
                <UIcon :name="item.icon" class="w-10 h-10 text-primary shrink-0 mt-1" />
                <div>
                  <h2 class="text-xl font-semibold dark:text-white mb-2">{{ t(item.title) }}</h2>
                  <p class="text-muted text-[15px] leading-relaxed mb-4">{{ t(item.description) }}</p>
                  <ul class="space-y-2">
                    <li
                      v-for="d in item.deliverables"
                      :key="t(d)"
                      class="flex items-start gap-2 text-sm text-muted"
                    >
                      <UIcon name="i-lucide-check" class="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {{ t(d) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Process -->
        <section class="mb-20">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">{{ $t('section.process') }}</h2>

          <div class="space-y-6">
            <div
              v-for="step in page.process"
              :key="step.step"
              class="flex items-start gap-4"
            >
              <div class="shrink-0 w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                <span class="text-primary font-bold text-sm">{{ step.step }}</span>
              </div>
              <div>
                <h3 class="font-semibold dark:text-white">{{ t(step.title) }}</h3>
                <p class="text-sm text-muted">{{ t(step.description) }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Work Experience -->
        <section v-if="about.experiences?.length" class="mb-20">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">{{ $t('section.experience') }}</h2>

          <div
            class="flex flex-col gap-2 sm:flex-row sm:gap-8 py-6"
            v-for="exp in about.experiences"
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

        <!-- Client Work -->
        <section v-if="workProjects.length" class="mb-20">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg mb-6">
            {{ $t('section.client_work') }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <CaseStudyCard
              v-for="project in workProjects"
              :key="project.slug"
              :slug="project.slug"
              :title="project.title"
              :description="t(project.description) || project.description"
              :image="project.image"
              :techstack="project.techstack"
              :client="project.client"
              :category="project.category || 'work'"
            />
          </div>

          <UButton
            :to="localePath('/projects')"
            color="neutral"
            variant="outline"
            size="sm"
          >
            {{ $t('section.view_client_work') }}
          </UButton>
        </section>

        <CTABanner />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
