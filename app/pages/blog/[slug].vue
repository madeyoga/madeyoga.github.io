<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(route.path, () => queryCollection('blogPosts').path(route.path).first())
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('blogPosts', route.path, {
    fields: ['description']
  })
})

const title = post.value.seo?.title || post.value.title
const description = post.value.seo?.description || post.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

if (post.value.image?.src) {
  defineOgImage({
    url: post.value.image.src
  })
} else {
  defineOgImageComponent('Saas', {
    headline: 'Blog'
  })
}

const { formattedDate } = useFormattedDate(post.value.date)
</script>

<template>
  <UContainer v-if="post">
    <!-- Page Header -->
    <div class="relative border-b border-default py-8">
      <div class="mb-2.5 text-sm font-semibold text-primary flex items-center gap-1.5">
        <UBadge
          v-bind="post.badge"
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
            v-for="(author, index) in post.authors"
            :key="index"
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

        <!-- <UContentSurround :surround="surround" /> -->
      </div>

      <!-- <template
        v-if="post?.body?.toc?.links?.length"
        #right
      >
        <UContentToc :links="post.body.toc.links" />
      </template> -->
    </div>
  </UContainer>
</template>