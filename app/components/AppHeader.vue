<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <div class="fixed top-2 sm:top-4 mx-auto left-1/2 transform -translate-x-1/2 z-10 animate-brand-fade-in">
    <nav class="relative flex gap-1.5 [&>div]:min-w-0 items-center justify-between bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-3 border border-muted/50 shadow-sm shadow-neutral-950/5">
      <div style="position: relative;">
        <ul class="isolate min-w-0 flex items-center">
          <li class="py-2 min-w-0">
            <NuxtLink :to="localePath('/')" class="w-full flex items-center gap-1.5 font-semibold text-sm px-2 py-1 text-primary tracking-tight">
              <span class="truncate">Made Yoga</span>
            </NuxtLink>
          </li>
          <li class="py-2 min-w-0">
            <NuxtLink :to="localePath('/services')" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">{{ $t('nav.services') }}</NuxtLink>
          </li>
          <li class="py-2 min-w-0">
            <NuxtLink :to="localePath('/projects')" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">{{ $t('nav.projects') }}</NuxtLink>
          </li>
          <li class="py-2 min-w-0">
            <NuxtLink :to="localePath('/blog')" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">{{ $t('nav.blog') }}</NuxtLink>
          </li>
          <li class="py-2 min-w-0">
            <NuxtLink :to="localePath('/contact')" class="w-full flex items-center gap-1.5 font-medium text-sm px-2 py-1">{{ $t('nav.contact') }}</NuxtLink>
          </li>
        </ul>

      </div>

      <div class="flex items-center gap-1">
        <LanguageSwitcher />
        <ColorModeButton />
      </div>
    </nav>
  </div>
</template>
