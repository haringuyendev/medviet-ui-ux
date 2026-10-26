#!/usr/bin/env node
// Install an optional heavy block (add-on) into an app made from the MedViet starter.
//   node add-block.mjs list
//   node add-block.mjs <addon> [app-dir=.] [--force]
// Copies the add-on's files into the app, installs its npm dependencies, and copies runtime assets.
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const addonsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'addons')
const args = process.argv.slice(2)
const force = args.includes('--force')
const [name, appArg = '.'] = args.filter((a) => a !== '--force')

const addons = fs.readdirSync(addonsDir).filter((d) => fs.existsSync(path.join(addonsDir, d, 'addon.json')))
if (!name || name === 'list') {
  for (const a of addons) console.log(`${a.padEnd(20)} ${JSON.parse(fs.readFileSync(path.join(addonsDir, a, 'addon.json'), 'utf8')).summary}`)
  process.exit(name ? 0 : 2)
}
if (!addons.includes(name)) {
  console.error(`Unknown add-on "${name}". Available: ${addons.join(', ')}`)
  process.exit(1)
}

const app = path.resolve(appArg)
if (!fs.existsSync(path.join(app, 'package.json')) || !fs.existsSync(path.join(app, 'src', 'components', 'ui'))) {
  console.error(`${app} doesn't look like an app made from the MedViet starter (needs package.json and src/components/ui).`)
  process.exit(1)
}

const spec = JSON.parse(fs.readFileSync(path.join(addonsDir, name, 'addon.json'), 'utf8'))
const filesRoot = path.join(addonsDir, name, 'files')

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
const files = walk(filesRoot).map((f) => path.relative(filesRoot, f))
const clashes = files.filter((f) => fs.existsSync(path.join(app, f)))
if (clashes.length && !force) {
  console.error(`These files already exist (re-run with --force to overwrite):\n  ${clashes.join('\n  ')}`)
  process.exit(1)
}
for (const f of files) {
  fs.mkdirSync(path.dirname(path.join(app, f)), { recursive: true })
  fs.copyFileSync(path.join(filesRoot, f), path.join(app, f))
  console.log(`+ ${f}`)
}

// stylesheets the add-on needs in the app's CSS entry (its tokens registered with Tailwind): "css": ["src/…/x.css"]
const entry = path.join(app, 'src', 'index.css')
for (const css of [spec.css ?? []].flat()) {
  if (!fs.existsSync(entry)) { console.log(`Add to your CSS entry: @import "${css}";`); continue }
  const src = fs.readFileSync(entry, 'utf8')
  const rel = './' + path.relative(path.dirname(entry), path.join(app, css)).split(path.sep).join('/')
  if (src.includes(`"${rel}"`)) continue
  // after the last top-of-file @import, so it can use the theme (and Tailwind sees its @theme block)
  const imports = [...src.matchAll(/^@import [^\n]+\n/gm)]
  const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0
  fs.writeFileSync(entry, src.slice(0, at) + `@import "${rel}";\n` + src.slice(at))
  console.log(`+ @import "${rel}" in src/index.css`)
}

const deps = Object.entries(spec.dependencies || {}).map(([pkg, v]) => (/^(https?:|file:|git)/.test(v) ? v : `${pkg}@${v}`))
if (deps.length) {
  console.log(`npm install ${deps.join(' ')}`)
  execSync(`npm install --no-audit --no-fund ${deps.map((d) => JSON.stringify(d)).join(' ')}`, { cwd: app, stdio: 'inherit' })
}

for (const { from, to } of spec.assets || []) {
  fs.cpSync(path.join(app, from), path.join(app, to), { recursive: true })
  console.log(`+ ${to}/ (from ${from})`)
}
console.log(`\nAdded ${name}. See: node ${path.relative(process.cwd(), path.join(path.dirname(fileURLToPath(import.meta.url)), 'catalog.mjs'))} show ${name}`)
