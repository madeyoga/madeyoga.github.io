<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('blog', () => queryCollection('blog').first())
const { data: posts } = await useAsyncData(route.path, () => queryCollection('blogPosts').all())

const title = page.value?.seo?.title || page.value?.title
const description = page.value?.seo?.description || page.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})
</script>

<template>
  <UContainer>
    <div class="relative border-b border-default py-[50px]">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted">
          {{ title }}
        </h1>
      </div>

      <div class="text-lg text-pretty text-muted mt-4">
        {{ description }}
      </div>
    </div>

    <div class="mt-8 pb-24 space-y-12">
      <BlogPost
        v-for="(post, index) in posts"
        :key="`${post.path}-${post.title}-${index}`"
        :to="post.path"
        :title="post.title"
        :description="post.description"
        :image="post.image"
        :date="post.date"
        :authors="post.authors"
        :badge="post.badge"
        :class="[index === 0 && 'col-span-full']"
      />
    </div>
  </UContainer>
</template>