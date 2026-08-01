<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
})
</script>

<template>
  <div class="flex flex-col gap-3 p-5 rounded-lg border border-default hover:border-primary transition-colors">
    <UIcon :name="icon" class="w-8 h-8 text-primary" />
    <h3 class="font-semibold dark:text-white text-lg">{{ title }}</h3>
    <p class="text-sm text-muted text-pretty">{{ description }}</p>
  </div>
</template>
