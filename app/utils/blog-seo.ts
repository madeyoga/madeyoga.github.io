export interface HeadLink {
  rel?: string
  href?: string
  hreflang?: string
  [key: string]: unknown
}

export interface HeadMeta {
  property?: string
  name?: string
  content?: string
  [key: string]: unknown
}

/** `/blog/<slug>` or `/id/blog/<slug>`, ignoring a trailing slash. */
export function blogPostSlug(path: string): string | null {
  const match = path.match(/^\/(?:id\/)?blog\/([^/]+)\/?$/)
  const slug = match?.[1]
  if (!slug || slug === 'index' || slug.includes('..')) return null
  return slug
}

export function isIndonesianBlogPost(path: string): boolean {
  return /^\/id\/blog\/[^/]+\/?$/.test(path) && blogPostSlug(path) !== null
}

export function isUntranslatedBlogPost(path: string, untranslatedSlugs: readonly string[]): boolean {
  const slug = blogPostSlug(path)
  return !!slug && untranslatedSlugs.includes(slug)
}

export function isUntranslatedIndonesianPost(path: string, untranslatedSlugs: readonly string[]): boolean {
  return isIndonesianBlogPost(path) && isUntranslatedBlogPost(path, untranslatedSlugs)
}

/** Path search engines should treat as the post, when the Indonesian URL only repeats English. */
export function indexablePath(path: string, untranslatedSlugs: readonly string[]): string {
  if (!isUntranslatedIndonesianPost(path, untranslatedSlugs)) return path
  return path.replace(/^\/id(?=\/blog\/)/, '')
}

export function isIndonesianHreflang(hreflang: string | undefined): boolean {
  if (!hreflang) return false
  const value = hreflang.toLowerCase()
  return value === 'id' || value.startsWith('id-')
}

export function isIndonesianOgLocale(content: string | undefined): boolean {
  if (!content) return false
  const value = content.toLowerCase()
  return value === 'id' || value.startsWith('id_')
}

/** Point an absolute or site-relative Indonesian post URL at the English post. */
export function toEnglishPostUrl(href: string): string {
  try {
    const url = new URL(href, 'https://madeyoga.harten.id')
    const match = url.pathname.match(/^\/id(\/blog\/[^/]+\/?)$/)
    if (!match?.[1]) return href
    url.pathname = match[1]
    if (/^https?:\/\//i.test(href)) return url.toString()
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return href
  }
}

/**
 * Untranslated posts must not advertise an Indonesian version.
 * The `/id/` URL canonicalizes to English and is noindex; a real translation is left alone.
 */
export function adjustBlogHead<TLink extends HeadLink, TMeta extends HeadMeta>(input: {
  path: string
  untranslatedSlugs: readonly string[]
  links: readonly TLink[]
  meta: readonly TMeta[]
}): { links: TLink[], meta: TMeta[], robots: 'noindex' | null } {
  const untranslated = isUntranslatedBlogPost(input.path, input.untranslatedSlugs)
  const indonesianDuplicate = isUntranslatedIndonesianPost(input.path, input.untranslatedSlugs)
  const links = input.links.flatMap((link) => {
    if (untranslated && link.rel === 'alternate' && isIndonesianHreflang(link.hreflang)) return []
    if (indonesianDuplicate && link.rel === 'canonical' && typeof link.href === 'string') {
      return [{ ...link, href: toEnglishPostUrl(link.href) }]
    }
    return [link]
  })
  const meta = input.meta.flatMap((item) => {
    if (untranslated && item.property === 'og:locale:alternate' && isIndonesianOgLocale(item.content)) return []
    if (indonesianDuplicate && item.property === 'og:url' && typeof item.content === 'string') {
      return [{ ...item, content: toEnglishPostUrl(item.content) }]
    }
    return [item]
  })
  return {
    links,
    meta,
    robots: indonesianDuplicate ? 'noindex' : null,
  }
}
