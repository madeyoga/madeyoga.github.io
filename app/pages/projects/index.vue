<script setup>
const { data: projects } = await useAsyncData('projects_list', () => queryCollection('projectsDetail').all())

const workProjects = computed(() =>
  (projects.value || []).filter(p => (p.category || 'work') === 'work')
)
const openSourceProjects = computed(() =>
  (projects.value || []).filter(p => p.category === 'opensource')
)

useSeoMeta({
  title: 'Projects',
  ogTitle: 'Projects — Made Yoga Mahardika',
  description: 'Open-source software and client work — libraries like AuthEndpoints, plus web apps, custom systems, and landing pages.',
})
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />

      <main class="py-16">
        <h1 class="text-3xl font-bold dark:text-white mb-4">{{ $t('nav.projects') }}</h1>
        <p class="text-muted text-[15px] leading-relaxed mb-12">
          {{ $t('section.projects_description') }}
        </p>

        <section v-if="openSourceProjects.length" class="mb-16">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg mb-6">
            {{ $t('section.open_source') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CaseStudyCard
              v-for="project in openSourceProjects"
              :key="project.slug"
              :slug="project.slug"
              :title="project.title"
              :description="project.description"
              :image="project.image"
              :techstack="project.techstack"
              :client="project.client"
              :category="project.category"
              :repo="project.repo"
              :docs="project.docs"
            />
          </div>
        </section>

        <section v-if="workProjects.length" class="mb-16">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg mb-6">
            {{ $t('section.client_work') }}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CaseStudyCard
              v-for="project in workProjects"
              :key="project.slug"
              :slug="project.slug"
              :title="project.title"
              :description="project.description"
              :image="project.image"
              :techstack="project.techstack"
              :client="project.client"
              :category="project.category || 'work'"
              :repo="project.repo"
              :docs="project.docs"
            />
          </div>
        </section>

        <CTABanner class="mt-16" />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
