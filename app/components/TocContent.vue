<script setup lang="ts">
import type { TocLink } from '@nuxt/content';

defineProps<{ links: TocLink[] }>()
</script>

<template>
  <ul class="min-w-0">
    <li v-for="link in links">
      <a :href="`#${link.id}`"
        class="group relative text-sm flex items-center focus-visible:outline-primary py-1 text-muted hover:text-default transition-colors">
        <span class="truncate">{{ link.text }}</span>
      </a>
      <template v-if="link.children">
        <ul class="ms-3" v-for="childDepth3 in link.children">
          <li class="min-w-0">
            <a :href="`#${childDepth3.id}`"
              class="group relative text-sm flex items-center focus-visible:outline-primary py-1 text-muted hover:text-default transition-colors">
              <span class="truncate">{{ childDepth3.text }}</span>
            </a>
          </li>
        </ul>
      </template>
    </li>
  </ul>
</template>