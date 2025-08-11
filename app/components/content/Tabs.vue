<script setup lang="ts">
const slots = useSlots()

const tabs = computed(() => {
  const children = slots.default?.() || []
  return children.map((vnode, index) => {
    const props = vnode.props || {}
    const label = props.label || `Tab ${index + 1}`
    const icon = props.icon || null
    return {
      label,
      icon,
      index,
    }
  })
})
</script>

<template>
  <ClientOnly>
    <UTabs
      color="neutral"
      variant="link"
      :items="tabs"
    >
      <template #content="{ item }">
        <template v-if="slots.default">
          <component :is="slots.default()[item.index]" />
        </template>
      </template>
    </UTabs>
  </ClientOnly>
</template>
