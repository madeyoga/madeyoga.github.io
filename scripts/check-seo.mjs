import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { untranslatedBlogSlugs } from './blog-translations.mjs'

const site = 'https://madeyoga.harten.id'
const output = join(process.cwd(), '.output', 'public')
const slugs = untranslatedBlogSlugs(process.cwd())

function decode(value) {
  return value
    .replace(/&#(\d+);/g, (_, digits) => String.fromCodePoint(Number(digits)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function headOf(html) {
  const end = html.search(/<\/head>/i)
  return end === -1 ? html : html.slice(0, end)
}

function elements(html, tagName) {
  return headOf(html).match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) || []
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i'))
  if (!match) return null
  return decode(match[1] ?? match[2] ?? '')
}

function readPage(routePath) {
  const relativePath = routePath.replace(/^\/+|\/+$/g, '')
  const candidates = relativePath
    ? [join(output, relativePath, 'index.html'), join(output, `${relativePath}.html`)]
    : [join(output, 'index.html')]
  const file = candidates.find(candidate => existsSync(candidate) && statSync(candidate).isFile())
  if (!file) throw new Error(`Missing generated page for /${relativePath}`)
  return readFileSync(file, 'utf8')
}

function titleOf(html) {
  const match = headOf(html).match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return match ? decode(match[1]).trim() : ''
}

function htmlLang(html) {
  const match = html.match(/<html\b[^>]*>/i)
  return match ? attr(match[0], 'lang') : null
}

function metaContent(html, attribute, value) {
  const tags = elements(html, 'meta').filter(tag => attr(tag, attribute) === value)
  return tags.map(tag => attr(tag, 'content'))
}

function linkHrefs(html, rel, hreflang) {
  return elements(html, 'link')
    .filter(tag => attr(tag, 'rel') === rel && (hreflang == null || attr(tag, 'hreflang') === hreflang))
    .map(tag => attr(tag, 'href'))
}

function robotsTokens(content) {
  return content.split(',').map(token => token.trim().toLowerCase()).filter(Boolean)
}

function assertPage(routePath, checks) {
  const html = readPage(routePath)
  const label = routePath || '/'
  checks(html, label)
  return html
}

function printHead(routePath) {
  const html = readPage(routePath)
  const lines = [`<html lang="${htmlLang(html)}">`, `<title>${titleOf(html)}</title>`]
  for (const tag of elements(html, 'meta')) {
    const name = attr(tag, 'name')
    const property = attr(tag, 'property')
    const key = name || property
    if (!key) continue
    if (!/^(description|robots|og:title|og:description|og:url|og:locale|og:locale:alternate|twitter:description)$/.test(key)) continue
    lines.push(name
      ? `<meta name="${name}" content="${attr(tag, 'content')}">`
      : `<meta property="${property}" content="${attr(tag, 'content')}">`)
  }
  for (const tag of elements(html, 'link')) {
    const rel = attr(tag, 'rel')
    if (rel !== 'canonical' && rel !== 'alternate') continue
    const hreflang = attr(tag, 'hreflang')
    lines.push(hreflang
      ? `<link rel="${rel}" hreflang="${hreflang}" href="${attr(tag, 'href')}">`
      : `<link rel="${rel}" href="${attr(tag, 'href')}">`)
  }
  console.log(`\n=== ${routePath || '/'} ===`)
  console.log(lines.join('\n'))
}

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name)
    if (entry.isDirectory()) walkHtml(file, files)
    else if (entry.name.endsWith('.html')) files.push(file)
  }
  return files
}

if (!existsSync(output)) {
  throw new Error('Missing .output/public. Run nuxt generate first.')
}
if (slugs.length === 0) {
  throw new Error('Expected at least one untranslated Indonesian blog post.')
}

console.log('Untranslated /id/ posts:')
for (const slug of slugs) console.log(`- ${slug}`)

printHead('/id/blog/mapidentityapi-alternative/')
printHead('/blog/mapidentityapi-alternative/')
printHead('/')

for (const slug of slugs) {
  const englishUrl = `${site}/blog/${slug}/`
  assertPage(`/blog/${slug}/`, (html, label) => {
    const title = titleOf(html)
    assert.ok(title.length > 0 && title.length <= 60, `${label} title is ${title.length} chars: ${title}`)
    assert.equal(title.includes('| Made Yoga Mahardika'), false, label)
    assert.deepEqual(metaContent(html, 'property', 'og:title'), [title], `${label} og:title`)
    assert.deepEqual(linkHrefs(html, 'canonical'), [englishUrl], `${label} canonical`)
    assert.deepEqual(linkHrefs(html, 'alternate', 'id'), [], `${label} id hreflang`)
    assert.deepEqual(linkHrefs(html, 'alternate', 'en'), [englishUrl], `${label} en hreflang`)
    assert.equal(metaContent(html, 'property', 'og:locale:alternate').includes('id'), false, label)
    const robots = robotsTokens(metaContent(html, 'name', 'robots').join(','))
    assert.equal(robots.includes('noindex'), false, `${label} robots`)
    const description = metaContent(html, 'name', 'description')
    assert.deepEqual(metaContent(html, 'name', 'twitter:description'), description, `${label} twitter:description`)
  })

  assertPage(`/id/blog/${slug}/`, (html, label) => {
    const title = titleOf(html)
    assert.ok(title.length > 0 && title.length <= 60, `${label} title is ${title.length} chars: ${title}`)
    assert.deepEqual(metaContent(html, 'property', 'og:title'), [title], `${label} og:title`)
    assert.equal(htmlLang(html), 'id', label)
    assert.deepEqual(linkHrefs(html, 'canonical'), [englishUrl], `${label} canonical`)
    assert.deepEqual(metaContent(html, 'property', 'og:url'), [englishUrl], `${label} og:url`)
    assert.deepEqual(linkHrefs(html, 'alternate', 'id'), [], `${label} id hreflang`)
    assert.deepEqual(linkHrefs(html, 'alternate', 'en'), [englishUrl], `${label} en hreflang`)
    const robotsTags = metaContent(html, 'name', 'robots')
    assert.equal(robotsTags.length, 1, `${label} robots count ${robotsTags.join(' | ')}`)
    const robots = robotsTokens(robotsTags[0])
    assert.equal(robots.includes('noindex'), true, `${label} robots ${robotsTags[0]}`)
    assert.equal(robots.includes('index'), false, `${label} robots ${robotsTags[0]}`)
    const description = metaContent(html, 'name', 'description')
    assert.deepEqual(metaContent(html, 'name', 'twitter:description'), description, `${label} twitter:description`)
  })
}

assertPage('/', (html) => {
  assert.deepEqual(linkHrefs(html, 'canonical'), [`${site}/`])
  assert.deepEqual(linkHrefs(html, 'alternate', 'id'), [`${site}/id/`])
  assert.equal(robotsTokens(metaContent(html, 'name', 'robots').join(',')).includes('noindex'), false)
  const description = metaContent(html, 'name', 'description')
  assert.ok(description[0]?.length, 'homepage description')
  assert.deepEqual(metaContent(html, 'name', 'twitter:description'), description)
})

assertPage('/id/', (html) => {
  assert.deepEqual(linkHrefs(html, 'canonical'), [`${site}/id/`])
  assert.deepEqual(linkHrefs(html, 'alternate', 'id'), [`${site}/id/`])
  assert.deepEqual(metaContent(html, 'name', 'twitter:description'), metaContent(html, 'name', 'description'))
})

assertPage('/projects/', (html) => {
  assert.deepEqual(linkHrefs(html, 'alternate', 'id'), [`${site}/id/projects/`])
  assert.deepEqual(metaContent(html, 'name', 'twitter:description'), metaContent(html, 'name', 'description'))
})

for (const file of walkHtml(output)) {
  const html = readFileSync(file, 'utf8')
  const description = metaContent(html, 'name', 'description').filter(Boolean)
  if (description.length === 0) continue
  const twitter = metaContent(html, 'name', 'twitter:description')
  assert.deepEqual(twitter, description, relative(output, file))
}

const sitemapFile = join(output, 'sitemap.xml')
assert.equal(statSync(sitemapFile).isFile(), true, 'sitemap.xml should be a file')
const sitemap = readFileSync(sitemapFile, 'utf8')
assert.match(sitemap, /<loc>https:\/\/madeyoga\.harten\.id\/id\/blog\/<\/loc>/)
assert.match(sitemap, /<loc>https:\/\/madeyoga\.harten\.id\/blog\/mapidentityapi-alternative\/<\/loc>/)
for (const slug of slugs) {
  assert.equal(sitemap.includes(`/id/blog/${slug}`), false, `sitemap still lists /id/blog/${slug}`)
  assert.match(sitemap, new RegExp(`<loc>https://madeyoga\\.harten\\.id/blog/${slug}/</loc>`))
}

console.log(`\nSEO check passed for ${slugs.length} untranslated posts.`)
