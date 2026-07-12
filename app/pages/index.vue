<script setup>
import ProjectCard from '~/components/ProjectCard.vue'

const { data: page } = await useAsyncData(() => queryCollection('index').first())

useHead({
  title: page.value.title
})

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">

      <AppHeader />

      <main>
        <!-- Hero -->
        <section id="hero" class="py-16 flex flex-col md:flex-row gap-10">
          <div class="flex items-center justify-center">
            <img src="/images/profile2.jpg" alt="profile" class="border border-gray-400 w-32 h-32 min-w-32 min-h-32 object-cover rounded-full">
          </div>

          <div class="flex flex-col gap-6 justify-center h-full">
            <div>
              <h1 class="text-center md:text-start font-bold text-3xl dark:text-muted leading-normal">
                <span class="dark:text-green-400 text-green-800">{{ $t('hero.greeting') }}</span><br>{{ $t('hero.title') }}
              </h1>
              <p class="text-center md:text-start text-muted mt-3 text-[15px] leading-relaxed">
                {{ $t('hero.tagline') }}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3">
              <UButton
                to="/projects"
                color="neutral"
                variant="solid"
                size="md"
                class="rounded-full"
              >
                {{ $t('hero.cta_work') }}
              </UButton>
              <UButton
                to="mailto:madeybog@gmail.com?subject=Project%20Inquiry"
                color="neutral"
                variant="outline"
                size="md"
                class="rounded-full"
              >
                {{ $t('hero.cta_contact') }}
              </UButton>
            </div>

            <div class="w-full flex flex-col md:flex-row items-center justify-between">
              <div class="dark:text-muted mb-4 md:mb-0">
                🏠 {{ $t('hero.location') }}
              </div>

              <div class="flex items-center gap-2">
                <a
                  v-for="link in page.hero.links"
                  :href="link.url"
                  target="_blank"
                  rel="noreferrer noopener"
                  :key="`hero-link-${link.url}`"
                  :aria-label="`Visit ${link.icon.split('-').pop()} profile`"
                >
                  <UIcon :name="link.icon" class="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Stats Bar -->
        <StatBar :years="5" :projects="10" :clients="4" />

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

        <!-- Services Preview -->
        <section id="services" class="py-16">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">{{ $t('section.services') }}</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ServiceCard
              icon="i-lucide-globe"
              :title="$t('services.web_dev_title') || 'Web Development'"
              :description="$t('services.web_dev_desc') || 'Fullstack websites and web apps built with modern frameworks.'"
            />
            <ServiceCard
              icon="i-lucide-settings"
              :title="$t('services.custom_sw_title') || 'Custom Software'"
              :description="$t('services.custom_sw_desc') || 'Tailor-made business systems — ERP, POS, inventory management.'"
            />
            <ServiceCard
              icon="i-lucide-palette"
              :title="$t('services.landing_title') || 'Landing Pages'"
              :description="$t('services.landing_desc') || 'High-converting, beautifully designed pages for your product or company.'"
            />
            <ServiceCard
              icon="i-lucide-lightbulb"
              :title="$t('services.consulting_title') || 'Consulting'"
              :description="$t('services.consulting_desc') || 'Honest tech stack advice, code review, and architecture planning.'"
            />
          </div>
        </section>

        <!-- Work Experience -->
        <section id="workexperience" class="pt-16 pb-8">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">{{ $t('section.experience') }}</h2>

          <div
            class="flex flex-col gap-2 sm:flex-row sm:gap-8 py-6"
            v-for="exp in page.experiences"
            :key="`${exp.timeframe}-${exp.company}`"
          >
            <div class="text-muted">{{ exp.timeframe }}</div>

            <div>
              <h3 class="dark:text-white">{{ exp.title }}</h3>
              <div class="text-muted">
                {{ exp.company }} •
                <a
                  class="text-green-800 dark:text-green-400"
                  :href="exp.url"
                  target="_blank"
                  :aria-label="`Visit ${exp.company} website`"
                  :title="`Visit ${exp.company} at ${exp.domainName}`">
                  {{ exp.domainName }}
                </a> •
                {{ exp.jobtype }}
              </div>

              <p>

              </p>
            </div>
          </div>
        </section>

        <!-- Projects -->
        <section id="projects" class="pt-16 pb-8">
          <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg">{{ $t('section.projects') }}</h2>

          <p class="text-muted mt-6 text-[15px]">
            {{ $t('section.projects_description') }}
          </p>

          <div class="mt-10 mb-4">
            <UButton
              to="/projects"
              color="neutral"
              variant="outline"
              size="sm"
              class="rounded-full"
            >
              {{ $t('section.view_all_projects') }}
            </UButton>
          </div>

          <ProjectCard
            v-for="project in page.projects"
            :key="project.title"
            :title="project.title"
            :description="project.description"
            :link="project.link"
            :image="project.image"
            :techstack="project.techstack"
            :features="project.features"
            :slug="project.slug"
            class="mb-8"
          ></ProjectCard>
        </section>

        <!-- CTA Banner -->
        <!-- <CTABanner /> -->
      </main>

      <AppFooter />
    </div>
  </div>
</template>
