<script setup lang="ts">
import { UCard } from '#components'

defineProps<{
  card?: boolean
}>()
</script>

<template>
  <component :is="card ? UCard : 'div'">
    <div class="flex flex-col items-center justify-center">
      <div>
        <slot name="image" />
      </div>
      <div class="text-center mt-[-24px] italic">
        <slot />
      </div>
    </div>
  </component>
</template>
