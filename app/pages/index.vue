<script setup>
import ProjectCard from '~/components/ProjectCard.vue'

const { data: page } = await useAsyncData(() => queryCollection('index').first())
const { data: posts } = await useAsyncData('home_ai_posts', () => queryCollection('posts').all())

useHead({
  title: page.value?.title
})

const openSourceProjects = computed(() =>
  (page.value?.projects || []).filter(p => p.category === 'opensource')
)

const aiPosts = computed(() => {
  const list = posts.value || []
  return list
    .filter((post) => {
      const label = post.badge?.label?.toLowerCase() || ''
      const haystack = `${post.title || ''} ${post.description || ''} ${label}`.toLowerCase()
      return label.includes('ai') || haystack.includes('llm') || haystack.includes('hermes') || haystack.includes('agent')
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
})

const localePath = useLocalePath()
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">

      <AppHeader />

      <main>
        <!-- Hero -->
        <section id="hero" class="py-16 flex flex-col md:flex-row gap-10">
          <div class="flex items-center justify-center animate-brand-fade-up">
            <img src="/images/profile2.jpg" alt="Made Yoga Mahardika" class="border border-default w-32 h-32 min-w-32 min-h-32 object-cover rounded-full">
          </div>

          <div class="flex flex-col gap-6 justify-center h-full">
            <div class="animate-brand-fade-up animate-brand-delay-1">
              <h1 class="text-center md:text-start font-bold text-4xl tracking-tight leading-tight">
                <span class="text-primary">{{ $t('hero.name') }}</span>
              </h1>
              <p class="text-center md:text-start font-semibold text-xl mt-2 dark:text-white">
                {{ $t('hero.title') }}
              </p>
              <p class="text-center md:text-start text-muted mt-3 text-[15px] leading-relaxed">
                {{ $t('hero.tagline') }}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 animate-brand-fade-up animate-brand-delay-2">
              <UButton
                :to="localePath('/projects/authendpoints')"
                color="primary"
                variant="solid"
                size="md"
              >
                {{ $t('hero.cta_work') }}
              </UButton>
              <UButton
                :to="localePath('/blog')"
                color="neutral"
                variant="outline"
                size="md"
              >
                {{ $t('hero.cta_blog') }}
              </UButton>
            </div>

            <div class="w-full flex flex-col md:flex-row items-center justify-between animate-brand-fade-up animate-brand-delay-3">
              <div class="text-muted text-sm mb-4 md:mb-0">
                {{ $t('hero.location') }}
              </div>

              <div class="flex items-center gap-2">
                <a
                  v-for="link in page.hero.links"
                  :href="link.url"
                  target="_blank"
                  rel="noreferrer noopener"
                  :key="`hero-link-${link.url}`"
                  :aria-label="`Visit ${link.icon.split('-').pop()} profile`"
                  class="text-muted hover:text-primary transition-colors"
                >
                  <UIcon :name="link.icon" class="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Tech Stack -->
        <section id="techstack" class="py-16">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">{{ $t('section.techstack') }}</h2>

          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 dark:text-muted">
            <TechStackCard
              v-for="tech in page.techstack"
              :key="`techstack-${tech.title}`"
              :title="tech.title"
            >
              <UIcon :name="tech.icon" class="w-12 h-12" />
            </TechStackCard>
          </div>
        </section>

        <!-- Open Source -->
        <section id="opensource" class="pt-16 pb-8">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg">{{ $t('section.open_source') }}</h2>

          <p class="text-muted mt-6 text-[15px]">
            {{ $t('section.open_source_description') }}
          </p>

          <div class="mt-10">
            <ProjectCard
              v-for="project in openSourceProjects"
              :key="project.title"
              :title="project.title"
              :description="project.description"
              :link="project.link"
              :image="project.image"
              :techstack="project.techstack"
              :features="project.features"
              :slug="project.slug"
              :category="project.category"
              :repo="project.repo"
              :docs="project.docs"
              class="mb-8"
            />
          </div>
        </section>

        <!-- Lab -->
        <section id="lab" class="pt-16 pb-8">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg">{{ $t('section.lab') }}</h2>
          <p class="text-muted mt-6 text-[15px] mb-10">
            {{ $t('section.lab_description') }}
          </p>

          <div class="space-y-4">
            <div
              v-for="item in page.lab"
              :key="item.title"
              class="p-5 rounded-lg border border-default hover:border-primary transition-colors"
            >
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <h3 class="font-semibold dark:text-white text-lg">{{ item.title }}</h3>
                <UBadge color="primary" variant="subtle" size="sm">
                  {{ $t(`lab.${item.status}`) }}
                </UBadge>
              </div>
              <p class="text-muted text-[15px] leading-relaxed">{{ item.description }}</p>
              <div v-if="item.link" class="mt-3">
                <UButton
                  :to="localePath(item.link)"
                  color="neutral"
                  variant="link"
                  size="sm"
                  trailing-icon="i-lucide-arrow-right"
                  class="px-0"
                >
                  {{ $t('section.read_more') }}
                </UButton>
              </div>
            </div>
          </div>
        </section>

        <!-- Building with AI & LLMs -->
        <section id="ai" class="pt-16 pb-8">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg">{{ $t('section.ai') }}</h2>
          <p class="text-muted mt-6 text-[15px] mb-8">
            {{ $t('section.ai_description') }}
          </p>

          <div v-if="aiPosts.length" class="space-y-6 mb-8">
            <NuxtLink
              v-for="post in aiPosts"
              :key="post.path"
              :to="localePath(post.path)"
              class="block group p-5 rounded-lg border border-default hover:border-primary transition-colors"
            >
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <UBadge v-if="post.badge?.label" color="neutral" variant="subtle" size="sm">
                  {{ post.badge.label }}
                </UBadge>
              </div>
              <h3 class="font-semibold dark:text-white text-lg group-hover:text-primary transition-colors">
                {{ post.title }}
              </h3>
              <p class="text-muted text-sm mt-2 line-clamp-2">{{ post.description }}</p>
            </NuxtLink>
          </div>

          <UButton
            :to="localePath('/blog')"
            color="neutral"
            variant="outline"
            size="sm"
          >
            {{ $t('section.view_blog') }}
          </UButton>
        </section>
      </main>

      <AppFooter />
    </div>
  </div>
</template>
