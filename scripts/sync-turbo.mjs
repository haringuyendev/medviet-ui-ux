#!/usr/bin/env node
// Bring the MedViet starter back in line with turbo-web: @medviet/ui primitives, @medviet/hook hooks, the ui utils and
// the design tokens (tooling/tailwind/theme.css). Run it after turbo-web changes its primitives or palette.
//   node scripts/sync-turbo.mjs [path/to/turbo-web] [--dry-run]     (default: ~/MedViet/Frontend/turbo-web)
// Reads turbo-web only. Then: cd template && npm install && npx tsc -b, and node scripts/catalog.mjs sync.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const dry = args.includes('--dry-run')
const turbo = path.resolve(args.find((a) => !a.startsWith('--')) ?? path.join(os.homedir(), 'MedViet', 'Frontend', 'turbo-web'))
const T = path.join(root, 'template')
const from = {
  ui: path.join(turbo, 'packages', 'ui', 'src', 'components'),
  utils: path.join(turbo, 'packages', 'ui', 'src', 'utils'),
  hook: path.join(turbo, 'packages', 'hook', 'src'),
  theme: path.join(turbo, 'tooling', 'tailwind', 'theme.css'),
}
for (const [k, p] of Object.entries(from)) if (!fs.existsSync(p)) { console.error(`Not a turbo-web checkout: missing ${k} (${p})`); process.exit(1) }

// package-internal aliases → the starter's
const rewrite = (src) => src
  .replace(/from "#utils\/cn"/g, 'from "@/lib/utils"')
  .replace(/from "#utils\/([\w-]+)"/g, 'from "@/lib/$1"')
  .replace(/from "#components\/([\w-]+)"/g, 'from "@/components/ui/$1"')
  .replace(/from "@medviet\/hook\/([\w-]+)"/g, 'from "@/hooks/$1"')

const changes = []
const write = (dest, content) => {
  const before = fs.existsSync(dest) ? fs.readFileSync(dest, 'utf8') : null
  if (before === content) return
  changes.push(`${before === null ? 'added  ' : 'updated'} ${path.relative(root, dest)}`)
  if (!dry) { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, content) }
}

// primitives (and primitives turbo-web removed)
const uiDir = path.join(T, 'src', 'components', 'ui')
const upstream = fs.readdirSync(from.ui).filter((f) => f.endsWith('.tsx'))
for (const f of upstream) write(path.join(uiDir, f), rewrite(fs.readFileSync(path.join(from.ui, f), 'utf8')))
for (const f of fs.readdirSync(uiDir).filter((f) => f.endsWith('.tsx') && !upstream.includes(f)))
  changes.push(`only in the starter (removed or never in turbo-web, kept): src/components/ui/${f}`)

// ui utils (cn → lib/utils.ts, others → lib/), hooks
for (const f of fs.readdirSync(from.utils).filter((f) => f.endsWith('.ts')))
  write(path.join(T, 'src', 'lib', f === 'cn.ts' ? 'utils.ts' : f), rewrite(fs.readFileSync(path.join(from.utils, f), 'utf8')))
for (const f of fs.readdirSync(from.hook).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts')))
  write(path.join(T, 'src', 'hooks', f), rewrite(fs.readFileSync(path.join(from.hook, f), 'utf8')))

// tokens: the marked block of index.css
const cssPath = path.join(T, 'src', 'index.css')
const css = fs.readFileSync(cssPath, 'utf8')
const START = /\/\* turbo-web theme\.css: start[^\n]*\*\/\n/, END = '/* turbo-web theme.css: end */'
const m = css.match(START)
if (!m || !css.includes(END)) console.error('index.css has no "turbo-web theme.css" markers: tokens not synced')
else {
  const head = css.slice(0, m.index + m[0].length), tail = css.slice(css.indexOf(END))
  write(cssPath, head + fs.readFileSync(from.theme, 'utf8').trimEnd() + '\n' + tail)
}

// dependencies the primitives import that the starter lacks
const pkg = JSON.parse(fs.readFileSync(path.join(T, 'package.json'), 'utf8'))
const have = new Set(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }))
const imported = new Set()
for (const f of fs.readdirSync(uiDir)) for (const x of fs.readFileSync(path.join(uiDir, f), 'utf8').matchAll(/from "((?:@[\w.-]+\/)?[\w.-]+)[^"]*"/g)) if (!x[1].startsWith('@/') && x[1] !== 'react') imported.add(x[1])
const missingDeps = [...imported].filter((d) => !have.has(d))

console.log(changes.length ? changes.join('\n') : 'Already in sync with turbo-web.')
if (missingDeps.length) console.log(`\nAdd to template/package.json (see turbo-web packages/ui/package.json for versions): ${missingDeps.join(', ')}`)
if (changes.length && !dry) console.log('\nNext: cd template && npm install && npx tsc -b; node scripts/catalog.mjs sync (new primitives need a catalog entry with Vietnamese keywords).')
