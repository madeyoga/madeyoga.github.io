import { defineConfig } from '@nuxtjs/mdc/config'

type HastNode = {
  type?: string
  value?: string
  children?: HastNode[]
}

function textOf(node: HastNode | undefined): string {
  if (!node) return ''
  if (node.type === 'text') return node.value || ''
  return (node.children || []).map(textOf).join('')
}

function stripTrailingNewlines(node: HastNode | undefined) {
  if (!node?.children?.length) return
  const last = node.children[node.children.length - 1]
  if (last?.type === 'text' && typeof last.value === 'string') {
    last.value = last.value.replace(/\n+$/g, '')
    return
  }
  stripTrailingNewlines(last)
}

/**
 * Shiki appends a newline to every highlighted line, which paints a blank
 * row after the last line of a fence. Drop that row, and any fence that
 * already ended on blank lines.
 */
export default defineConfig({
  shiki: {
    transformers: [
      {
        name: 'trim-trailing-blank-lines',
        code(node) {
          const lines = (node.children || []) as HastNode[]
          const blank = (line: HastNode) => {
            if (line.type === 'text') return !(line.value || '').trim()
            return textOf(line).replace(/\n/g, '').trim() === ''
          }
          while (lines.length > 1 && blank(lines[lines.length - 1]!)) {
            lines.pop()
          }
          for (const line of lines) {
            if (line.type === 'element') stripTrailingNewlines(line)
          }
        },
      },
    ],
  },
})
