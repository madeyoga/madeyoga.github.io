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
const heading = post.value?.title
const lede = post.value?.description
const profileImagePng = 'https://media.harten.id/images/madeyoga-avatar.png'
const articleImage = post.value?.image?.src
  ? (post.value.image.src.startsWith('http')
      ? post.value.image.src
      : `https://madeyoga.harten.id${post.value.image.src}`)
  : profileImagePng

const usesProfileShareImage = articleImage === profileImagePng

useSeoMeta({
  ...(post.value.seo || {}),
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: articleImage,
  twitterImage: articleImage,
  // Cover images are not the 460px avatar. Drop the avatar dimensions so
  // those posts are not described as a square PNG.
  ogImageWidth: usesProfileShareImage ? 460 : null,
  ogImageHeight: usesProfileShareImage ? 460 : null,
  ogImageType: usesProfileShareImage ? 'image/png' : null,
})

useJsonLdGraph([
  {
    '@type': 'Article',
    '@id': `${canonicalUrl(contentPath.value)}#article`,
    headline: title,
    name: title,
    description,
    image: articleImage,
    datePublished: post.value.date,
    dateModified: post.value.date,
    inLanguage: 'en',
    author: { '@id': 'https://madeyoga.harten.id/#person' },
    publisher: { '@id': 'https://madeyoga.harten.id/#person' },
    mainEntityOfPage: { '@id': `${canonicalUrl(contentPath.value)}#webpage` },
  },
], 'jsonld-article')

const { formattedDate, isoDate } = useFormattedDate(post.value?.date || new Date())

const localePath = useLocalePath()
const localize = useLocalizedField()
const { data: profile } = await useAsyncData('blog-author-profile', () => queryCollection('about').first())
const authorTitle = computed(() => localize(profile.value?.personal?.title))
const authorBio = computed(() => localize(profile.value?.personal?.bio))
const authorAvatar = 'https://media.harten.id/images/madeyoga-avatar.webp'
const authorName = 'Made Yoga Mahardika'

function minimarkText(node: unknown): string {
  if (typeof node === 'string') return node
  if (!Array.isArray(node)) return ''
  if (typeof node[0] === 'string') {
    if (node[0] === 'pre' || node[0] === 'style') return ''
    return node.slice(2).map(minimarkText).join(' ')
  }
  return node.map(minimarkText).join(' ')
}

const readingMinutes = computed(() => {
  const body = post.value?.body as { value?: unknown } | undefined
  const words = minimarkText(body?.value).trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
})

const tocLinks = computed(() => post.value?.body?.toc?.links || [])
const articleBody = ref<HTMLElement | null>(null)

type MiniNode = string | MiniElement
type MiniElement = [string, Record<string, unknown>, ...MiniNode[]]

function isElement(node: MiniNode): node is MiniElement {
  return Array.isArray(node) && typeof node[0] === 'string'
}

/** Break URL-like link text after slashes so a long path wraps on a boundary. */
function softenUrls(node: MiniNode): MiniNode {
  if (!isElement(node)) return node
  const [tag, props, ...children] = node
  const next = children.map(softenUrls)
  if (tag === 'a' && next.length === 1 && typeof next[0] === 'string') {
    const text = next[0]
    if (text.includes('/') && !/\s/.test(text)) {
      const broken: MiniNode[] = []
      for (const [index, part] of text.split('/').entries()) {
        if (index > 0) {
          broken.push('/')
          broken.push(['wbr', {}])
        }
        if (part) broken.push(part)
      }
      return [tag, props, ...broken]
    }
  }
  return [tag, props, ...next]
}

/**
 * Shiki appends a `<style>` to the markdown tree. Rendering it inside the
 * article fails validation, and stripping it from the HTML string afterwards
 * desyncs hydration. Lift the CSS into `<head>` and leave it out of the tree.
 */
function prepareArticle(doc: NonNullable<typeof post.value>) {
  const body = doc.body as { type?: string, value?: MiniNode[], toc?: unknown } | undefined
  if (!body || body.type !== 'minimark' || !Array.isArray(body.value)) {
    return { doc, shikiCss: '' }
  }
  const css: string[] = []
  const value = body.value.flatMap((node) => {
    if (isElement(node) && node[0] === 'style' && typeof node[2] === 'string' && node[2].includes('.shiki')) {
      css.push(node[2])
      return []
    }
    return [softenUrls(node)]
  })
  return {
    doc: { ...doc, body: { ...body, value } },
    shikiCss: css.join(''),
  }
}

const prepared = prepareArticle(post.value!)
const article = prepared.doc

useHead({
  style: prepared.shikiCss
    ? [{ key: 'shiki-token-colors', innerHTML: prepared.shikiCss }]
    : [],
})
</script>

<template>
  <div class="blog-post text-[1.125rem] leading-[1.7] text-default lg:grid lg:grid-cols-[minmax(0,calc(68ch+2.75rem))_13.5rem] lg:items-start lg:justify-center lg:gap-x-6 xl:gap-x-8">
    <header class="min-w-0 lg:col-start-1">
      <p v-if="post!.badge?.label" class="text-sm font-medium text-primary">
        {{ post!.badge.label }}
      </p>
      <h1 class="mt-3 text-4xl font-semibold tracking-tight text-balance text-highlighted sm:text-5xl">
        {{ heading }}
      </h1>
      <p v-if="lede" class="mt-5 text-lg leading-relaxed text-pretty text-muted sm:text-xl">
        {{ lede }}
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
        <NuxtLink :to="localePath('/')" class="inline-flex items-center gap-2.5 font-medium text-highlighted hover:text-primary">
          <UAvatar
            :src="authorAvatar"
            :alt="authorName"
            size="sm"
          />
          {{ authorName }}
        </NuxtLink>
        <span aria-hidden="true">&middot;</span>
        <time :datetime="isoDate">{{ formattedDate }}</time>
        <span aria-hidden="true">&middot;</span>
        <span>{{ readingMinutes }} min read</span>
      </div>
    </header>

    <UContentToc
      v-if="tocLinks.length"
      :links="tocLinks"
      title="On this page"
      highlight
      highlight-variant="circuit"
      :default-open="false"
      aria-label="On this page"
      class="mt-8 mb-2 min-w-0 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:mb-0 mx-0 px-0 sm:mx-0 sm:px-0 top-20 lg:top-28 lg:max-h-[calc(100vh-8rem)]"
      :ui="{ container: 'border-b-0 lg:py-0' }"
    >
      <template #bottom>
        <BlogReadingProgress :reading-time="readingMinutes" :target="articleBody" />
      </template>
    </UContentToc>

    <article class="blog-prose min-w-0 lg:col-start-1 lg:row-start-2">
      <div ref="articleBody">
        <ContentRenderer
          v-if="article"
          :value="article"
          class="mt-8 lg:mt-10"
        />
      </div>

      <div class="mt-16 flex gap-4 rounded-xl bg-elevated p-5">
        <UAvatar
          :src="authorAvatar"
          :alt="authorName"
          size="lg"
          class="shrink-0"
        />
        <div class="min-w-0">
          <p class="text-base font-semibold text-highlighted">
            <NuxtLink :to="localePath('/')" class="hover:text-primary">{{ authorName }}</NuxtLink>
          </p>
          <p v-if="authorTitle" class="text-sm text-muted">{{ authorTitle }}</p>
          <p v-if="authorBio" class="mt-2 text-sm leading-6 text-default">{{ authorBio }}</p>
        </div>
      </div>

      <MySurround :surround="surround" />
    </article>
  </div>
</template>

<style scoped>
.blog-prose :deep(p),
.blog-prose :deep(ul),
.blog-prose :deep(ol),
.blog-prose :deep(blockquote) {
  max-width: 68ch;
  overflow-wrap: break-word;
}

.blog-prose :deep(p) {
  margin-top: 0;
  margin-bottom: 1.35rem;
  font-size: 1.125rem;
  line-height: 1.7;
}

.blog-prose :deep(li) {
  margin-top: 0.45rem;
  margin-bottom: 0.45rem;
  font-size: 1.125rem;
  line-height: 1.7;
}

.blog-prose :deep(ul),
.blog-prose :deep(ol) {
  margin-top: 1.35rem;
  margin-bottom: 1.35rem;
}

.blog-prose :deep(p:has(> img:only-child)) {
  max-width: none;
}

.blog-prose :deep(img) {
  max-width: 100%;
  height: auto;
}

.blog-prose :deep(a) {
  overflow-wrap: break-word;
}
</style>
