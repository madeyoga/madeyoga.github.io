<script setup>
import ProjectCard from '~/components/ProjectCard.vue'

const { data: page } = await useAsyncData(() => queryCollection('index').first())

useHead({
  title: page.value.title
})

console.log(page.value)

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
    <div class="min-h-screen max-w-[47.5rem] mx-auto  pt-10 border-default sm:border-x">

      <div class="px-4 sm:px-6 pt-18">

        <AppHeader />

        <main>
          <section id="hero" class="py-16 flex flex-col md:flex-row gap-10">

            <div class="flex items-center justify-center">
              <img src="/images/profile2.jpg" alt="profile" class="border border-gray-400 w-[128px] h-[128px] min-w-[128px] min-h-[128px] object-cover rounded-full">
            </div>

            <div class="flex flex-col gap-6 justify-center h-full">
              <div>
                <MDC
                  :value="page.hero.title"
                  class="text-center md:text-start font-bold text-3xl dark:text-muted leading-[1.5]"
                />
              </div>

              <div class="w-full flex flex-col md:flex-row items-center justify-between">
                <div class="dark:text-muted mb-8 md:mb-0">
                  🏠 {{ page.hero.location }}
                </div>

                <div class="flex items-center gap-2">
                  <a 
                    v-for="link in page.hero.links"
                    :href="link.url" 
                    target="_blank" 
                    rel="noreferrer noopener"
                    :key="`hero-link-${link.url}`"
                  >
                    <UIcon :name="link.icon" class="w-[24px] h-[24px]" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section id="techstack" class="py-16">
            <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">Tech Stack</h2>

            <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 dark:text-muted">
              <tech-stack-card 
                v-for="tech in page.techstack"
                :key="`techstack-${tech.title}`"
                :title="tech.title"
              >
                <UIcon :name="tech.icon" class="w-[48px] h-[48px]" />
              </tech-stack-card>
            </div>
          </section>

          <section id="workexperience" class="pt-16 pb-8">
            <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg pb-12">Work Experience</h2>

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
                    target="_blank">
                    {{ exp.domainName }}
                  </a> • 
                  {{ exp.jobtype }}
                </div>

                <p>

                </p>
              </div>
            </div>
          </section>

          <section id="projects" class="pt-16 pb-8">
            <h2 class="uppercase tracking-widest dark:text-white font-bold text-lg">Projects</h2>

            <p class="text-muted mt-6">
              Over the years, I've built digital experiences that focus on clarity, usability, and thoughtful design.
              Here are some of my favorite projects, highlighting the journey.
            </p>

            <div class="mt-10 mb-16">
              <!-- <UButton label="Email me"></UButton> -->
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
              class="mb-8"
            ></ProjectCard>
          </section>
        </main>

        <footer>
          <section id="contact" class="pt-6 pb-2 border-t-1 border-neutral-800">
            <div class="flex justify-between">

              <div class="text-muted">{{ page.contact.email }}</div>

              <div class="flex items-center justify-end gap-4">
                <a 
                  v-for="link in page.contact.links"
                  :key="`contact-${link.title}-${link.url}`"
                  :href="link.url" 
                  :title="link.title"
                  target="_blank" 
                  rel="noreferrer noopener"
                >
                  <UIcon :name="link.icon" class="w-[20px] h-[20px]" />
                </a>
              </div>
            </div>
          </section>
        </footer>
      </div>
    </div>
</template>
