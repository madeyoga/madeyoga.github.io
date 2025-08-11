<script setup lang="ts">
const route = useRoute()
const normalizedPath = route.path.replace(/\/$/, '') // remove trailing slash
const { data: post1 } = await useAsyncData(route.path, () => queryCollection('posts').first())
const { data: post } = await useAsyncData(route.path, () => queryCollection('posts').path(normalizedPath).first())

if (!post.value) {
  console.log(post.value)
  console.log(post1.value)
  console.log(route.path, normalizedPath)
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('posts', route.path, {
    fields: ['description']
  })
})

const title = post.value?.seo?.title || post.value?.title
const description = post.value?.seo?.description || post.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

if (post.value?.image?.src) {
  defineOgImage({
    url: post.value.image.src
  })
} else {
  defineOgImageComponent('Saas', {
    headline: 'Blog'
  })
}

const { formattedDate } = useFormattedDate(post.value?.date || new Date())
</script>

<template>
  <UContainer>
    <div class="relative border-b border-default py-8">
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

    <div>
      <div>
        <ContentRenderer
          v-if="post"
          :value="post"
        />

        <USeparator v-if="surround?.length" />
      </div>
    </div>
  </UContainer>
</template>