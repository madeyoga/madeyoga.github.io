<template>
  <h3 :id="props.id" class="relative mt-10 mb-3 scroll-mt-32 text-xl font-semibold tracking-tight text-highlighted lg:scroll-mt-28 [&>a]:rounded-sm [&>a]:focus-visible:outline-primary [&>a>code]:border-0 [&>a>code]:bg-transparent [&>a>code]:p-0 [&>a>code]:text-[0.92em] [&>a>code]:font-semibold">
    <a
      v-if="fragment"
      :href="`#${props.id}`"
    >
      <slot />
    </a>
    <slot v-else />
  </h3>
</template>

<script setup lang="ts">
import { computed, useSlots, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()
const slots = useSlots()

const { headings } = useRuntimeConfig().public.mdc
const anchorLinks = computed(() => props.id && ((typeof headings?.anchorLinks === 'boolean' && headings?.anchorLinks === true) || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h3)))

function hasLink(node: unknown): boolean {
  if (node == null) return false
  if (Array.isArray(node)) return node.some(hasLink)
  if (typeof node !== 'object') return false
  const vnode = node as { type?: unknown, props?: { href?: unknown } | null, children?: unknown }
  if (vnode.type === 'a') return true
  if (typeof vnode.props?.href === 'string' && vnode.props.href.length > 0) return true
  return hasLink(vnode.children)
}

// The fragment link wraps the heading text. A docs link in that text would nest anchors.
const fragment = computed(() => Boolean(anchorLinks.value) && !hasLink(slots.default?.()))
</script>
