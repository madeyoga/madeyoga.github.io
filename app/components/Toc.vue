<script setup lang="ts">
import type { Toc } from '@nuxt/content';

const props = defineProps<{
  toc?: Toc
}>()

const title = props.toc?.title || 'On this page'
</script>

<template>
  <div class="pt-4 sm:pt-6 pb-2.5 sm:pb-4.5 lg:py-8 border-b border-dashed border-default lg:border-0 flex flex-col">
    <div>
      <p class="group text-sm font-semibold flex-1 items-center gap-1.5 py-1.5 -mt-1.5 focus-visible:outline-primary hidden lg:flex">
        <span class="truncate">{{ title }}</span>
      </p>
    </div>

    <UCollapsible class="flex flex-col flex-1 gap-2 lg:hidden">
      <UButton
        :label="title"
        color="neutral"
        variant="ghost"
        trailing-icon="i-lucide-chevron-down"
        block
        class="px-0"
      />

      <template #content>
        <TocContent 
          v-if="toc" 
          :links="toc.links"
        ></TocContent>
      </template>
    </UCollapsible>

    <div class="data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden focus:outline-none hidden lg:flex">
      <TocContent 
        v-if="toc" 
        :links="toc.links"
      ></TocContent>
    </div>
  </div>
</template>
