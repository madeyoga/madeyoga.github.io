<script setup>
useSeoMeta({
  title: 'Contact',
  ogTitle: 'Contact Made Yoga Mahardika',
  description: 'Get in touch — available for freelance projects and consulting.',
})
</script>

<template>
  <div class="min-h-screen max-w-190 mx-auto pt-10 border-default sm:border-x">
    <div class="px-4 sm:px-6 pt-18">
      <AppHeader />

      <main class="py-16">
        <h1 class="text-3xl font-bold dark:text-white mb-4">{{ $t('nav.contact') }}</h1>
        <p class="text-muted text-[15px] leading-relaxed mb-12">
          {{ $t('cta.description') }}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-20">
          <!-- Email -->
          <div>
            <h2 class="uppercase tracking-widest dark:text-white font-bold text-sm pb-4">Email</h2>
            <a
              href="mailto:madeybog@gmail.com?subject=Project%20Inquiry"
              class="text-primary text-lg font-medium hover:underline"
              aria-label="Send email to Made Yoga Mahardika"
            >
              madeybog@gmail.com
            </a>
            <p class="text-muted text-sm mt-2">Available for freelance projects and consulting.</p>
          </div>

          <!-- Social -->
          <div>
            <h2 class="uppercase tracking-widest dark:text-white font-bold text-sm pb-4">Social</h2>
            <div class="space-y-3">
              <a href="https://github.com/madeyoga" target="_blank" rel="noreferrer noopener" class="flex items-center gap-3 text-muted hover:text-primary transition-colors" aria-label="Visit GitHub profile">
                <UIcon name="i-simple-icons-github" class="w-5 h-5" />
                <span>GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/made-mahardika-4a205a379/" target="_blank" rel="noreferrer noopener" class="flex items-center gap-3 text-muted hover:text-primary transition-colors" aria-label="Visit LinkedIn profile">
                <UIcon name="i-simple-icons-linkedin" class="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a href="https://www.youtube.com/@madey02" target="_blank" rel="noreferrer noopener" class="flex items-center gap-3 text-muted hover:text-primary transition-colors" aria-label="Visit YouTube channel">
                <UIcon name="i-simple-icons-youtube" class="w-5 h-5" />
                <span>YouTube</span>
              </a>
              <a href="https://www.tiktok.com/@boggg_" target="_blank" rel="noreferrer noopener" class="flex items-center gap-3 text-muted hover:text-primary transition-colors" aria-label="Visit TikTok profile">
                <UIcon name="i-simple-icons-tiktok" class="w-5 h-5" />
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="py-8 px-6 rounded-lg border border-gray-200 dark:border-gray-700 text-center">
          <p class="text-muted">🏠 Based in <span class="dark:text-white font-medium">{{ $t('hero.location') }}</span></p>
        </div>

        <CTABanner />
      </main>

      <AppFooter />
    </div>
  </div>
</template>
