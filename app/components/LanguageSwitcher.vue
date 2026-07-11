<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => locales.value.map(loc => ({
  code: loc.code,
  name: loc.name || loc.code
})))

function switchLocale(code: string) {
  setLocale(code)
}
</script>

<template>
  <ClientOnly>
    <UDropdownMenu
      :items="availableLocales.map(l => ({ label: l.name, type: 'checkbox' as const, checked: locale === l.code, onSelect: () => switchLocale(l.code) }))"
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
