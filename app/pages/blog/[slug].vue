<script setup lang="ts">
const route = useRoute()
const { locales, defaultLocale } = useI18n()

/** Content collection paths are locale-agnostic; strip i18n prefix for queries. */
const contentPath = computed(() => {
  let path = route.path.replace(/\/$/, '') || '/'
  for (const loc of locales.value) {
    const code = typeof loc === 'string' ? loc : loc.code
    if (code === defaultLocale) continue
    if (path === `/${code}`) return '/'
    if (path.startsWith(`/${code}/`)) {
      path = path.slice(code.length + 1)
      break
    }
  }
  return path
})

const { data: post } = await useAsyncData(
  () => `blog-post-${contentPath.value}`,
  () => queryCollection('posts').path(contentPath.value).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(
  () => `blog-surround-${contentPath.value}`,
  () => queryCollectionItemSurroundings('posts', contentPath.value, {
    fields: ['description']
  })
)

const title = post.value?.seo?.title || post.value?.title
const description = post.value?.seo?.description || post.value?.description

// Ensure the schema.org is rendered
useSeoMeta(post.value.seo || {
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: post.value.image.src
})
useSchemaOrg(post.value.schemaOrg || {})

const { formattedDate } = useFormattedDate(post.value?.date || new Date())
</script>

<template>
  <UContainer>
    <div class="relative border-b border-default">
      <div class="mb-2.5 text-sm font-semibold text-primary flex items-center gap-1.5">
        <UBadge
          v-bind="post!.badge"
          variant="subtle"
        />
        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ formattedDate }}</time>
      </div>
      <div>
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted">
            {{ title }}
          </h1>
        </div>
        <div class="text-lg text-pretty text-muted mt-4">
          {{ description }}
        </div>
        <div class="flex flex-wrap items-center gap-3 mt-4">
          <UButton
            v-for="(author, index) in post!.authors"
            :key="`slug-authorbutton-${author.name}-${author.to}-${index}`"
            :to="author.to"
            color="neutral"
            variant="subtle"
            target="_blank"
            size="sm"
          >
            <UAvatar
              v-bind="author.avatar"
              alt="Author avatar"
              size="2xs"
            />

            {{ author.name }}
          </UButton>
        </div>
      </div>
    </div>

    <div class="relative flex flex-col lg:block">
      <!-- Mobile TOC: collapsible, above content -->
      <div class="mb-8 lg:hidden">
        <Toc :toc="post?.body.toc" />
      </div>

      <div class="lg:max-w-[65ch]">
        <ContentRenderer
          v-if="post"
          :value="post"
        />

        <USeparator class="my-16" />

        <MySurround :surround="surround" class="mb-16" />
      </div>

      <!-- Desktop TOC: fixed sidebar on the right -->
      <nav class="hidden lg:block fixed right-[max(1rem,calc((100vw-47.5rem)/2-16rem))] top-24 w-52 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <p class="text-xs font-semibold text-muted uppercase tracking-wider mb-3">On this page</p>
        <TocContent v-if="post?.body.toc" :links="post.body.toc.links" />
      </nav>
    </div>
  </UContainer>
</template>
