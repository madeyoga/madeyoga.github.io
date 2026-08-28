<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { locale, t: i18nT } = useI18n()

const slug = computed(() => String(route.params.slug || '').toLowerCase())
const { data: project } = await useAsyncData(`project-${slug.value}`, () =>
  queryCollection('projectsDetail').where('slug', '=', slug.value).first()
)
if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const t = (obj: any) => obj?.[locale.value] || obj?.en || ''
const localize = useLocalizedField()
const isOpenSource = computed(() => project.value?.category === 'opensource')
const openSourceLabel = computed(() => i18nT('section.open_source'))
const description = computed(() => localize(project.value?.description))

useSeoMeta({
  title: project.value?.title || 'Project',
  ogTitle: `${project.value?.title} | Made Yoga Mahardika`,
  description,
})
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />

      <main class="py-16" v-if="project">
        <!-- Back Link -->
        <NuxtLink :to="localePath('/projects')" class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-8">
          <UIcon name="i-lucide-arrow-left" class="w-4 h-4" />
          Back to Projects
        </NuxtLink>

        <!-- Hero Image -->
        <img
          :src="project.image"
          :alt="project.title"
          class="w-full rounded-xl mb-8 border border-default"
        />

        <!-- Title & Client -->
        <div class="mb-8">
          <p class="text-primary font-medium text-sm mb-2">
            {{ isOpenSource ? openSourceLabel : project.client }}
          </p>
          <h1 class="text-3xl font-bold dark:text-white mb-3">{{ project.title }}</h1>
          <p class="text-muted text-[15px] leading-relaxed">{{ description }}</p>

          <div class="mt-4 flex flex-wrap gap-3">
            <UButton
              v-if="project.docs"
              icon="i-lucide-book-open"
              size="md"
              color="primary"
              variant="solid"
              :to="project.docs"
              target="_blank"
              rel="noreferrer noopener"
            >
              {{ $t('hero.cta_docs') }}
            </UButton>
            <UButton
              v-if="project.repo"
              icon="i-simple-icons-github"
              size="md"
              color="neutral"
              variant="outline"
              :to="project.repo"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </UButton>
            <UButton
              v-if="project.link && !project.docs"
              icon="i-lucide-external-link"
              size="md"
              color="neutral"
              variant="outline"
              :to="project.link"
              target="_blank"
              rel="noreferrer noopener"
            >
              Visit Site
            </UButton>
          </div>
        </div>

        <!-- Tech Stack -->
        <div class="flex flex-wrap gap-2 mb-10">
          <template v-for="tech in project.techstack" :key="tech.title">
            <a
              v-if="tech.url"
              :href="tech.url"
              target="_blank"
              rel="noreferrer noopener"
            >
              <UBadge
                size="md"
                color="neutral"
                variant="outline"
                class="gap-1.5"
              >
                <UIcon :name="tech.icon" class="w-4 h-4" />
                {{ tech.title }}
              </UBadge>
            </a>
            <UBadge
              v-else
              size="md"
              color="neutral"
              variant="outline"
              class="gap-1.5"
            >
              <UIcon :name="tech.icon" class="w-4 h-4" />
              {{ tech.title }}
            </UBadge>
          </template>
        </div>

        <!-- Problem -->
        <section v-if="project.problem" class="mb-10">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-sm pb-4">The Problem</h2>
          <p class="text-muted text-[15px] leading-relaxed">{{ t(project.problem) }}</p>
        </section>

        <!-- Solution -->
        <section v-if="project.solution" class="mb-10">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-sm pb-4">The Solution</h2>
          <p class="text-muted text-[15px] leading-relaxed">{{ t(project.solution) }}</p>
        </section>

        <!-- Key Features -->
        <section class="mb-10">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-sm pb-4">Key Features</h2>
          <ul class="grid md:grid-cols-2 gap-3">
            <LiFeature
              v-for="feature in project.features"
              :key="feature.title"
              :icon="feature.icon"
              :description="feature.title"
            />
          </ul>
        </section>

        <!-- Results -->
        <section v-if="project.results" class="mb-10">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-sm pb-4">Results</h2>
          <p class="text-muted text-[15px] leading-relaxed">{{ t(project.results) }}</p>
        </section>

        <CTABanner />
      </main>

      <main class="py-16" v-else>
        NULL PROJECT
      </main>

      <AppFooter />
    </div>
  </div>
</template>
