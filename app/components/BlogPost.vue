<script setup lang="ts">
import { NuxtImg } from '#components';

const props = defineProps<{
  title: string,
  description: string,
  image?: { src: string, alt?: string },
  date: string,
  authors: Array<{ name: string, to: string, avatar?: { src: string } }>,
  badge?: { label: string },
  to?: string,
}>()

const { isoDate, formattedDate } = useFormattedDate(props.date)
</script>

<template>
  <article class="relative group/blog-post flex flex-col rounded-lg overflow-hidden lg:grid lg:grid-cols-2 lg:items-center gap-x-8 p-0 sm:p-0 transition col-span-full">
    <div class="relative overflow-hidden aspect-[16/9] w-full pointer-events-none shadow-lg rounded-lg">
      <ClientOnly>
        <NuxtImg 
          :alt="props.image?.alt" 
          class="object-cover object-top w-full h-full transform transition-transform duration-200 group-hover/blog-post:scale-110" 
          :src="props.image?.src"
        />
      </ClientOnly>
    </div>

    <div class="min-w-0 flex-1 flex flex-col justify-center p-4 sm:p-6 lg:px-0">
      <a 
        :href="props.to || '#'" 
        tabindex="-1" 
        :aria-label="props.title" 
        class="focus:outline-none peer">
        <span class="absolute inset-0" aria-hidden="true"></span>
      </a>
      <div class="flex items-center gap-2 mb-2">
        <span class="font-medium inline-flex items-center text-xs px-2 py-1 gap-1 rounded-md ring ring-inset ring-accented text-default bg-elevated">
          <span class="truncate">{{ props.badge?.label }}</span>
        </span>
        <time :datetime="isoDate" class="text-sm text-toned">
          {{ formattedDate }}
        </time>
      </div>

      <h2 class="text-xl text-pretty font-semibold text-highlighted">
        {{ props.title }}
      </h2>
      <div class="mt-1 text-base text-pretty text-muted line-clamp-2">
        {{ props.description }}
      </div>
      <div class="pt-4 mt-auto flex flex-wrap gap-x-3 gap-y-1.5">
        <div data-orientation="horizontal" class="relative group/user flex items-center gap-2">
          <span class="inline-flex items-center justify-center select-none rounded-full align-middle bg-elevated size-8 text-base shrink-0 transform transition-transform duration-200 group-hover/user:scale-115">
            <ClientOnly>
              <NuxtImg 
                width="32" 
                height="32" 
                :alt="props.authors[0]?.name" 
                role="img" 
                class="h-full w-full rounded-[inherit] object-cover" 
                :src="props.authors[0]?.avatar?.src" />
            </ClientOnly>
          </span>
          <div class="">
            <a 
              tabindex="-1" 
              rel="noopener noreferrer" 
              :aria-label="props.authors[0]?.name" 
              class="focus:outline-none peer">
              <span class="absolute inset-0" aria-hidden="true"></span>
            </a>
            <p class="font-medium text-default peer-hover:text-highlighted transition-colors text-sm">
              {{ props.authors[0]?.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
