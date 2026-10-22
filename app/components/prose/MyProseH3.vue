<template>
  <h3 :id="props.id" class="relative mt-10 mb-3 scroll-mt-32 text-xl font-semibold tracking-tight text-highlighted lg:scroll-mt-28 [&>a]:rounded-sm [&>a]:focus-visible:outline-primary [&>a>code]:border-0 [&>a>code]:bg-transparent [&>a>code]:p-0 [&>a>code]:text-[0.92em] [&>a>code]:font-semibold">
    <a
      v-if="props.id && generate"
      :href="`#${props.id}`"
    >
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>

<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h3)))
</script>
