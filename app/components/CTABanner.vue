<template>
  <div class="py-16 border-t border-gray-200 dark:border-gray-800 text-center">
    <h2 class="text-2xl font-bold dark:text-white mb-4">{{ $t('cta.title') }}</h2>
    <p class="text-muted mb-6 max-w-md mx-auto">{{ $t('cta.description') }}</p>
    <UButton
      size="lg"
      color="neutral"
      variant="solid"
      class="rounded-full px-8"
      to="mailto:madeybog@gmail.com?subject=Project%20Inquiry"
    >
      {{ $t('cta.button') }}
    </UButton>
  </div>
</template>
