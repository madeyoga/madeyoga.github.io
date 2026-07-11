<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <footer class="pt-10 pb-6 border-t border-gray-200 dark:border-gray-800">
    <div class="flex flex-col sm:flex-row gap-8 sm:gap-12">
      <div class="flex-1">
        <p class="text-sm text-muted text-pretty">{{ $t('footer.tagline') }}</p>
      </div>

      <nav class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <NuxtLink :to="localePath('/')" class="text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors">{{ $t('nav.home') }}</NuxtLink>
        <NuxtLink :to="localePath('/about')" class="text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors">{{ $t('nav.about') }}</NuxtLink>
        <NuxtLink :to="localePath('/services')" class="text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors">{{ $t('nav.services') }}</NuxtLink>
        <NuxtLink :to="localePath('/projects')" class="text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors">{{ $t('nav.projects') }}</NuxtLink>
        <NuxtLink :to="localePath('/blog')" class="text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors">{{ $t('nav.blog') }}</NuxtLink>
        <NuxtLink :to="localePath('/contact')" class="text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors">{{ $t('nav.contact') }}</NuxtLink>
      </nav>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="text-xs text-muted">&copy; {{ new Date().getFullYear() }} {{ $t('footer.copyright') }}</div>

      <div class="flex items-center gap-4">
        <a href="https://github.com/madeyoga" target="_blank" rel="noreferrer noopener" title="Visit GitHub profile" aria-label="Visit GitHub profile">
          <UIcon name="i-simple-icons-github" class="w-5 h-5 text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors" />
        </a>
        <a href="https://www.linkedin.com/in/made-mahardika-4a205a379/" target="_blank" rel="noreferrer noopener" title="Visit LinkedIn profile" aria-label="Visit LinkedIn profile">
          <UIcon name="i-simple-icons-linkedin" class="w-5 h-5 text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors" />
        </a>
        <a href="https://www.youtube.com/@madey02" target="_blank" rel="noreferrer noopener" title="Visit YouTube channel" aria-label="Visit YouTube channel">
          <UIcon name="i-simple-icons-youtube" class="w-5 h-5 text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors" />
        </a>
        <a href="mailto:madeybog@gmail.com" title="Send email to Made Yoga Mahardika" aria-label="Send email to Made Yoga Mahardika">
          <UIcon name="i-lucide-mail" class="w-5 h-5 text-muted hover:text-green-800 dark:hover:text-green-400 transition-colors" />
        </a>
      </div>
    </div>
  </footer>
</template>
