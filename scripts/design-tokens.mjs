#!/usr/bin/env node
// design/tokens.json from the starter's index.css: every colour token in light and dark, with the hex and source note
// written next to it, and which block it comes from (turbo-web or the DS v1 additions). Re-run after sync-turbo.
//   node scripts/design-tokens.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const css = fs.readFileSync(path.join(root, 'template', 'src', 'index.css'), 'utf8')
const v1At = css.indexOf('MedViet Design System v1')

const tokens = {}
// :root { … } and .dark { … } blocks, in file order, so a later declaration overrides an earlier one
for (const block of css.matchAll(/(^|\n)(:root|\.dark)\s*\{([\s\S]*?)\n\}/g)) {
  const mode = block[2] === ':root' ? 'light' : 'dark'
  const fromV1 = v1At >= 0 && block.index > v1At
  for (const decl of block[3].matchAll(/--([\w-]+):\s*([\s\S]*?);(?:[ \t]*\/\*\s*([\s\S]*?)\s*\*\/)?/g)) {
    const [, name, value, note] = decl
    if (name.startsWith('font') || name === 'radius') continue
    const t = (tokens[name] ??= { name })
    const hex = note?.match(/#[0-9a-fA-F]{6}\b/)?.[0] ?? null
    t[mode] = { value: value.replace(/\s+/g, ' ').trim(), ...(hex && { hex }), ...(note && { note: note.replace(/\s+/g, ' ') }) }
    if (mode === 'light') t.source = fromV1 ? 'medviet-ds-v1' : 'turbo-web'
  }
}
const out = {
  name: 'MedViet Design System',
  version: '1.0.0',
  generatedFrom: 'template/src/index.css',
  font: { sans: 'Roboto Variable', heading: 'Roboto Variable' },
  radius: '0.625rem',
  tokens: Object.values(tokens).sort((a, b) => a.name.localeCompare(b.name)),
}
fs.mkdirSync(path.join(root, 'design'), { recursive: true })
fs.writeFileSync(path.join(root, 'design', 'tokens.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`design/tokens.json: ${out.tokens.length} tokens (${out.tokens.filter((t) => t.source === 'medviet-ds-v1').length} from DS v1)`)
