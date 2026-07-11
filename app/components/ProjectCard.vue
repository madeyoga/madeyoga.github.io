<script setup>
const localePath = useLocalePath()
const props = defineProps([
  'title',
  'description',
  'link',
  'image',
  'techstack',
  'features',
  'slug'
])
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

    <div class="rounded-lg w-full border border-gray-200 dark:border-gray-700 p-5 flex flex-col gap-5 transition-colors" :class="props.slug ? 'group-hover:border-green-400 dark:group-hover:border-green-600' : ''">
      <div class="relative overflow-hidden rounded-xl">
        <img
          :src="props.image"
          :alt="`${props.title} project showcase`"
          :title="`${props.title} project showcase`"
          class="w-full aspect-video object-cover"
          :class="props.slug ? 'group-hover:scale-105 transition-transform duration-300' : ''"
        />
        <div v-if="props.link && props.slug" class="absolute top-3 right-3 z-20">
          <UButton
            icon="i-lucide-external-link"
            size="sm"
            color="neutral"
            variant="solid"
            :to="props.link"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open project website"
          />
        </div>
      </div>

      <h3 class="font-semibold dark:text-white text-xl tracking-wide">{{ props.title }}</h3>

      <p class="dark:text-muted text-pretty text-[15px]">
        {{ props.description }}
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4" v-if="props.techstack">
        <UBadge
          v-for="tech in props.techstack"
          :key="`${props.title} - techstack - ${tech.title} - ${tech.icon}`"
          size="md"
          color="neutral"
          variant="outline"
          class="justify-center rounded-full gap-1.5"
        >
          <UIcon :name="tech.icon" class="w-4 h-4" />
          {{ tech.title }}
        </UBadge>
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

      <div v-if="props.link && !props.slug" class="mt-4 relative z-20">
        <UButton
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
