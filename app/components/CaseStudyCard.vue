<script setup>
const localePath = useLocalePath()

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  techstack: { type: Array, default: () => [] },
  slug: { type: String, required: true },
  client: { type: String, default: '' },
  category: { type: String, default: 'work' },
  repo: { type: String, default: '' },
  docs: { type: String, default: '' }
})
</script>

<template>
  <NuxtLink :to="localePath(`/projects/${slug}`)" class="block group">
    <div class="rounded-lg border border-default overflow-hidden hover:border-primary transition-colors">
      <div class="overflow-hidden">
        <img
          :src="image"
          :alt="title"
          class="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div class="p-5">
        <p class="text-xs text-primary font-medium mb-1">
          {{ category === 'opensource' ? $t('section.open_source') : client }}
        </p>
        <h3 class="font-semibold dark:text-white text-lg mb-2">{{ title }}</h3>
        <p class="text-sm text-muted line-clamp-2 mb-4">{{ description }}</p>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tech in techstack"
            :key="tech.title"
            size="sm"
            color="neutral"
            variant="subtle"
          >
            {{ tech.title }}
          </UBadge>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
