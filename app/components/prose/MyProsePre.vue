<script setup lang="ts">
const props = defineProps({
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

const labels: Record<string, string> = {
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  shellscript: 'Shell',
  cs: 'C#',
  csharp: 'C#',
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  vue: 'Vue',
  xml: 'XML',
  html: 'HTML',
  css: 'CSS',
  md: 'Markdown',
  markdown: 'Markdown',
  py: 'Python',
  python: 'Python',
  php: 'PHP',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
}

const label = computed(() => {
  if (props.filename) return props.filename
  const lang = props.language?.toLowerCase()
  if (!lang) return 'Text'
  return labels[lang] || props.language
})

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | undefined

onUnmounted(() => {
  clearTimeout(resetTimer)
})

async function copyCode() {
  const text = (props.code || '').replace(/\s+$/u, '')
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
      copied.value = false
    }, 1600)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <figure class="blog-pre my-8 min-w-0 max-w-full">
    <figcaption class="flex items-center gap-3 rounded-t-lg border border-b-0 border-default bg-elevated px-3 py-1.5">
      <span class="min-w-0 truncate text-sm text-muted">{{ label }}</span>
      <UButton
        class="ms-auto shrink-0"
        :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        size="xs"
        color="neutral"
        variant="ghost"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copyCode"
      />
    </figcaption>
    <div class="overflow-x-auto rounded-b-lg border border-default bg-muted">
      <pre :class="props.class" class="m-0 w-max min-w-full bg-transparent px-4 py-3 text-sm leading-6"><slot /></pre>
    </div>
  </figure>
</template>

<style scoped>
.blog-pre :deep(pre) {
  margin: 0;
  overflow: visible;
  white-space: pre;
  background: transparent;
  padding: 0.85rem 1rem;
}

.blog-pre :deep(code) {
  display: block;
}

.blog-pre :deep(.line) {
  display: block;
  white-space: pre;
}
</style>
