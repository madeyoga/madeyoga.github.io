import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import {
  hasRealIndonesianTranslation,
  listEnglishBlogSlugs,
  untranslatedBlogSlugs,
} from '../scripts/blog-translations.mjs'

const english = `---
title: English title
date: 2026-01-01
---

The same article body.
`

function writePost(root, relativePath, body) {
  const file = join(root, relativePath)
  mkdirSync(join(file, '..'), { recursive: true })
  writeFileSync(file, body)
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'blog-i18n-'))
  writePost(root, 'content/blog/copied.md', english)
  writePost(root, 'content/blog/missing.md', english)
  writePost(root, 'content/blog/translated.md', english)
  writePost(root, 'content/blog/empty-id.md', english)
  writePost(root, 'content/id/blog/copied.md', english.replace('date: 2026-01-01', 'date: 2026-02-02'))
  writePost(root, 'content/blog/id/translated.md', `---
title: Judul
---

Ini artikel yang berbeda.
`)
  writePost(root, 'content/blog/empty-id.id.md', `---
title: Kosong
---

`)
  return root
}

describe('Indonesian blog translation detection', () => {
  it('treats a missing file, an empty body, and an identical body as untranslated', () => {
    const root = fixture()
    assert.deepEqual(listEnglishBlogSlugs(root), ['copied', 'empty-id', 'missing', 'translated'])
    assert.equal(hasRealIndonesianTranslation(root, 'missing'), false)
    assert.equal(hasRealIndonesianTranslation(root, 'copied'), false)
    assert.equal(hasRealIndonesianTranslation(root, 'empty-id'), false)
    assert.equal(hasRealIndonesianTranslation(root, 'translated'), true)
    assert.deepEqual(untranslatedBlogSlugs(root), ['copied', 'empty-id', 'missing'])
  })

  it('reads a content/blog/<slug>.id.md file as a real translation when the body differs', () => {
    const root = fixture()
    writePost(root, 'content/blog/suffix-only.id.md', `---
title: Suffix
---

Bukan salinan.
`)
    writePost(root, 'content/blog/suffix-only.md', english)
    assert.equal(hasRealIndonesianTranslation(root, 'suffix-only'), true)
  })

  it('marks the live English-only posts as untranslated', () => {
    const slugs = untranslatedBlogSlugs(process.cwd())
    for (const slug of [
      'mapidentityapi-alternative',
      'authendpoints-4-0',
      '5-years-of-django-pros-and-cons',
      'hermes-bot-mode',
    ]) {
      assert.equal(slugs.includes(slug), true, slug)
    }
    const english = listEnglishBlogSlugs(process.cwd())
    for (const slug of slugs) assert.equal(english.includes(slug), true, slug)
  })
})
