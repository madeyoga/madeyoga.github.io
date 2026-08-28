<script setup>
const localePath = useLocalePath()
const props = defineProps([
  'title',
  'description',
  'link',
  'image',
  'techstack',
  'features',
  'slug',
  'category',
  'repo',
  'docs'
])

const hasExternalCtas = computed(() => !!(props.docs || props.repo || props.link))
</script>

<template>
  <article class="relative group mb-8">
    <!-- Overlay link — avoids nesting interactive elements inside <a> -->
    <NuxtLink
      v-if="props.slug"
      :to="localePath(`/projects/${props.slug}`)"
      class="absolute inset-0 z-10"
      :aria-label="props.title"
    >
      <span class="sr-only">{{ props.title }}</span>
    </NuxtLink>

    <div class="rounded-lg w-full border border-default p-5 flex flex-col gap-5 transition-colors" :class="props.slug ? 'group-hover:border-primary' : ''">
      <div class="relative overflow-hidden rounded-xl">
        <img
          :src="props.image"
          :alt="`${props.title} project showcase`"
          :title="`${props.title} project showcase`"
          class="w-full aspect-video object-cover"
          :class="props.slug ? 'group-hover:scale-105 transition-transform duration-300' : ''"
        />
      </div>

      <div>
        <p v-if="props.category === 'opensource'" class="text-xs text-primary font-medium mb-1">
          {{ $t('section.open_source') }}
        </p>
        <h3 class="font-semibold dark:text-white text-xl tracking-wide">{{ props.title }}</h3>
      </div>

      <p class="dark:text-muted text-pretty text-[15px]">
        {{ props.description }}
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4" v-if="props.techstack">
        <template v-for="tech in props.techstack" :key="`${props.title} - techstack - ${tech.title} - ${tech.icon}`">
          <a
            v-if="tech.url"
            :href="tech.url"
            target="_blank"
            rel="noreferrer noopener"
            class="relative z-20 justify-self-stretch"
          >
            <UBadge
              size="md"
              color="neutral"
              variant="outline"
              class="w-full justify-center gap-1.5"
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
            class="justify-center gap-1.5"
          >
            <UIcon :name="tech.icon" class="w-4 h-4" />
            {{ tech.title }}
          </UBadge>
        </template>
      </div>

      <div class="mt-4" v-if="props.features">
        <ul class="grid md:grid-cols-2 gap-2">
          <LiFeature
            v-for="feature in props.features"
            :key="`${props.title} - feature - ${feature.title}`"
            :icon="feature.icon"
            :description="feature.title"
          />
        </ul>
      </div>

      <div v-if="hasExternalCtas" class="mt-4 relative z-20 flex flex-wrap gap-2">
        <UButton
          v-if="props.docs"
          icon="i-lucide-book-open"
          size="md"
          color="primary"
          variant="solid"
          :to="props.docs"
          target="_blank"
          rel="noreferrer noopener"
        >
          {{ $t('hero.cta_docs') }}
        </UButton>
        <UButton
          v-if="props.repo"
          icon="i-simple-icons-github"
          size="md"
          color="neutral"
          variant="outline"
          :to="props.repo"
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub
        </UButton>
        <UButton
          v-if="props.link && !props.docs"
          icon="i-lucide-external-link"
          size="md"
          color="neutral"
          variant="outline"
          :to="props.link"
          target="_blank"
          rel="noreferrer noopener"
        >
          Visit Site
        </UButton>
      </div>
    </div>
  </article>
</template>
