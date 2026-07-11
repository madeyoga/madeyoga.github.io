<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
})
</script>

<template>
  <div class="flex flex-col gap-3 p-5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600 transition-colors">
    <UIcon :name="icon" class="w-8 h-8 text-green-800 dark:text-green-400" />
    <h3 class="font-semibold dark:text-white text-lg">{{ title }}</h3>
    <p class="text-sm text-muted text-pretty">{{ description }}</p>
  </div>
</template>
