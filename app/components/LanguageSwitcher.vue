<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const availableLocales = computed(() => locales.value.map(loc => ({
  code: typeof loc === 'string' ? loc : loc.code,
  name: typeof loc === 'string' ? loc : (loc.name || loc.code)
})))
</script>

<template>
  <ClientOnly>
    <UDropdownMenu
      :items="availableLocales.map(l => ({
        label: l.name,
        type: 'link' as const,
        checked: locale === l.code,
        to: switchLocalePath(l.code),
      }))"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="xs"
        class="rounded-full"
        :label="locale.toUpperCase()"
        trailing-icon="i-lucide-chevron-down"
      />
    </UDropdownMenu>
    <template #fallback>
      <div class="w-10 h-6" />
    </template>
  </ClientOnly>
</template>
