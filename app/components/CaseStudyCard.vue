<script setup>
const localePath = useLocalePath()

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  techstack: { type: Array, default: () => [] },
  slug: { type: String, required: true },
  client: { type: String, default: '' }
})
</script>

<template>
  <NuxtLink :to="localePath(`/projects/${slug}`)" class="block group">
    <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-green-400 dark:hover:border-green-600 transition-colors">
      <div class="overflow-hidden">
        <img
          :src="image"
          :alt="title"
          class="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div class="p-5">
        <p v-if="client" class="text-xs text-green-800 dark:text-green-400 font-medium mb-1">{{ client }}</p>
        <h3 class="font-semibold dark:text-white text-lg mb-2">{{ title }}</h3>
        <p class="text-sm text-muted line-clamp-2 mb-4">{{ description }}</p>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tech in techstack"
            :key="tech.title"
            size="sm"
            color="neutral"
            variant="subtle"
            class="rounded-full"
          >
            {{ tech.title }}
          </UBadge>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
