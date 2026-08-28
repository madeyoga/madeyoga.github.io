<script setup>
const localePath = useLocalePath()
const localize = useLocalizedField()

const props = defineProps({
  title: { type: String, required: true },
  description: { type: [String, Object], required: true },
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
  <article class="relative group">
    <NuxtLink
      :to="localePath(`/projects/${String(props.slug).toLowerCase()}`)"
      class="absolute inset-0 z-10"
      :aria-label="props.title"
    >
      <span class="sr-only">{{ props.title }}</span>
    </NuxtLink>

    <div class="rounded-lg border border-default overflow-hidden group-hover:border-primary transition-colors">
      <div class="overflow-hidden">
        <img
          :src="props.image"
          :alt="props.title"
          class="w-full aspect-video object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div class="p-5">
        <p class="text-xs text-primary font-medium mb-1">
          {{ props.category === 'opensource' ? $t('section.open_source') : props.client }}
        </p>
        <h3 class="font-semibold dark:text-white text-lg mb-2">{{ props.title }}</h3>
        <p class="text-sm text-muted line-clamp-2 mb-4">{{ localize(props.description) }}</p>
        <div class="flex flex-wrap gap-2">
          <template v-for="tech in props.techstack" :key="tech.title">
            <a
              v-if="tech.url"
              :href="tech.url"
              target="_blank"
              rel="noreferrer noopener"
              class="relative z-20"
            >
              <UBadge size="sm" color="neutral" variant="subtle">
                {{ tech.title }}
              </UBadge>
            </a>
            <UBadge v-else size="sm" color="neutral" variant="subtle">
              {{ tech.title }}
            </UBadge>
          </template>
        </div>
      </div>
    </div>
  </article>
</template>
