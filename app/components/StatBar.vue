<script setup>
const props = defineProps({
  years: { type: Number, required: true },
  projects: { type: Number, required: true },
  clients: { type: Number, required: true }
})
</script>

<template>
  <div class="grid grid-cols-3 gap-4 py-10">
    <div class="text-center">
      <div class="text-3xl font-bold text-green-800 dark:text-green-400">{{ props.years }}+</div>
      <div class="text-sm text-muted mt-1">{{ $t('stats.years') }}</div>
    </div>
    <div class="text-center">
      <div class="text-3xl font-bold text-green-800 dark:text-green-400">{{ props.projects }}+</div>
      <div class="text-sm text-muted mt-1">{{ $t('stats.projects') }}</div>
    </div>
    <div class="text-center">
      <div class="text-3xl font-bold text-green-800 dark:text-green-400">{{ props.clients }}+</div>
      <div class="text-sm text-muted mt-1">{{ $t('stats.clients') }}</div>
    </div>
  </div>
</template>
