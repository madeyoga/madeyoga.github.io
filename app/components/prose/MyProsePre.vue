<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array as () => number[],
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})

const toast = useToast()
const slotWrapper = ref<Element | undefined>()
function copyCode() {
  if (!slotWrapper.value) return

  const codeElement = slotWrapper.value.querySelector('code')
  if (codeElement) {
    const text = codeElement.textContent
    navigator.clipboard.writeText(text).then(() => {
      toast.add({
        title: 'Copied to clipboard!',
        icon: 'i-lucide-check'
      })
    }).catch(err => {
      toast.add({
        title: 'Copy failed',
        icon: 'i-lucide-x'
      })
      console.error('Copy failed:', err)
    })
  }
}
</script>

<template>
  <div class="w-full relative">
    <UButton
      icon="i-lucide-copy"
      class="absolute top-[12px] right-[12px] z-10 hover:cursor-pointer"
      @click="copyCode"
      variant="subtle"
      color="neutral"
    ></UButton>
    <div ref="slotWrapper">
      <pre :class="$props.class" class="rounded-lg"><slot /></pre>
    </div>
  </div>
</template>

<style>
pre code .line {
  display: block;
}
</style>
