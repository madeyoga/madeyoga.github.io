<script setup>
const { data: projects } = await useAsyncData('projects_list', () => queryCollection('projectsDetail').all())

useSeoMeta({
  title: 'Projects',
  ogTitle: 'Projects — Made Yoga Mahardika',
  description: 'Portfolio of software development projects — web apps, custom systems, and landing pages.',
})
</script>

<template>
  <div class="min-h-screen max-w-[47.5rem] mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />

      <main class="py-16">
        <h1 class="text-3xl font-bold dark:text-white mb-4">{{ $t('nav.projects') }}</h1>
        <p class="text-muted text-[15px] leading-relaxed mb-12">
          {{ $t('section.projects_description') }}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CaseStudyCard
            v-for="project in projects"
            :key="project.slug"
            :slug="project.slug"
            :title="project.title"
            :description="project.description"
            :image="project.image"
            :techstack="project.techstack"
            :client="project.client"
          />
        </div>

        <CTABanner class="mt-16" />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
