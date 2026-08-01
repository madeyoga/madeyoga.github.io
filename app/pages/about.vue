<script setup lang="ts">
const localePath = useLocalePath()

await navigateTo(localePath('/services'), { redirectCode: 301 })
</script>

<template>
  <div />
</template>
