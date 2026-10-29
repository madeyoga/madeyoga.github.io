import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Indonesian article files, first match wins:
 * - content/id/blog/<slug>.md
 * - content/blog/id/<slug>.md
 * - content/blog/<slug>.id.md
 * A missing file, an empty body, or a body identical to the English post is not a translation.
 */
const INDONESIAN_POST_FILES = [
  (root, slug) => join(root, 'content', 'id', 'blog', `${slug}.md`),
  (root, slug) => join(root, 'content', 'blog', 'id', `${slug}.md`),
  (root, slug) => join(root, 'content', 'blog', `${slug}.id.md`),
]

function isSafeSlug(slug) {
  return typeof slug === 'string'
    && slug.length > 0
    && !slug.includes('/')
    && !slug.includes('\\')
    && !slug.includes('..')
}

export function listEnglishBlogSlugs(root) {
  const dir = join(root, 'content', 'blog')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(name => name.endsWith('.md') && !name.endsWith('.id.md'))
    .filter(name => statSync(join(dir, name)).isFile())
    .map(name => name.slice(0, -3))
    .filter(isSafeSlug)
    .sort()
}

export function readIndonesianPost(root, slug) {
  if (!isSafeSlug(slug)) return null
  for (const candidate of INDONESIAN_POST_FILES) {
    const file = candidate(root, slug)
    if (existsSync(file) && statSync(file).isFile()) return readFileSync(file, 'utf8')
  }
  return null
}

export function markdownBody(raw) {
  const text = String(raw || '').replace(/^\uFEFF/, '')
  if (!text.startsWith('---')) return text
  const end = text.indexOf('\n---', 3)
  if (end === -1) return text
  return text.slice(end + 4)
}

export function normalizeArticleBody(raw) {
  return markdownBody(raw)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim()
    .normalize('NFC')
}

export function hasRealIndonesianTranslation(root, slug) {
  if (!isSafeSlug(slug)) return false
  const englishFile = join(root, 'content', 'blog', `${slug}.md`)
  if (!existsSync(englishFile) || !statSync(englishFile).isFile()) return false
  const indonesian = readIndonesianPost(root, slug)
  if (indonesian == null) return false
  const indonesianBody = normalizeArticleBody(indonesian)
  if (!indonesianBody) return false
  const englishBody = normalizeArticleBody(readFileSync(englishFile, 'utf8'))
  return indonesianBody !== englishBody
}

export function untranslatedBlogSlugs(root = process.cwd()) {
  return listEnglishBlogSlugs(root).filter(slug => !hasRealIndonesianTranslation(root, slug))
}
