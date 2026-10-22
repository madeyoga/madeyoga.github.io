<script setup lang="ts">
const props = defineProps<{
  readingTime: number
  target?: HTMLElement | null
}>()

const progress = ref(0)
const minutesLeft = computed(() => Math.ceil(props.readingTime * (1 - progress.value)))

function update() {
  const el = props.target
  if (!el) return
  const rect = el.getBoundingClientRect()
  const range = rect.height - window.innerHeight
  progress.value = range <= 0
    ? (rect.bottom <= window.innerHeight ? 1 : 0)
    : Math.min(1, Math.max(0, -rect.top / range))
}

let frame = 0
function scheduleUpdate() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(update)
}

function backToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  update()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate, { passive: true })
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', scheduleUpdate)
})
</script>

<template>
  <div class="flex min-w-0 max-w-full flex-col border-t border-default pt-2">
    <UButton
      color="neutral"
      variant="ghost"
      trailing-icon="i-lucide-arrow-up"
      class="w-full min-w-0 max-w-full justify-between gap-2 px-0 text-muted"
      @click="backToTop"
    >
      <template #leading>
        <svg viewBox="0 0 16 16" aria-hidden="true" class="size-4 shrink-0 -rotate-90">
          <circle
            cx="8"
            cy="8"
            r="6.5"
            fill="none"
            stroke-width="2"
            class="stroke-(--ui-border-accented)"
          />
          <circle
            cx="8"
            cy="8"
            r="6.5"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            pathLength="100"
            stroke-dasharray="100"
            :stroke-dashoffset="100 - progress * 100"
            class="stroke-primary"
          />
        </svg>
      </template>

      <span class="min-w-0 flex-1 truncate text-start tabular-nums">
        {{ minutesLeft ? `${minutesLeft} min left` : 'Finished' }}<span class="sr-only">, back to top</span>
      </span>
    </UButton>
  </div>
</template>
