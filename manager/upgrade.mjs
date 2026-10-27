// Upgrade an app made from the starter to the plugin's current template: new and updated blocks, primitives, lib
// helpers, themes and scripts, plus the dependencies and scripts they need. A file the team changed is never
// overwritten: "unchanged" means equal to what the starter (or the last upgrade) put there, known from the hashes in
// .medviet-ui-ux/template.json, or for an app without them from its first "starter" commit in git.
// Pages, App.tsx, main.tsx and index.css are the app's own and are never touched.
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { runSync } from './proc.mjs'

/** Folders of the template that belong to the starter rather than to the app. */
export const MANAGED = ['src/components/ui/', 'src/components/blocks/', 'src/lib/', 'src/hooks/', 'src/themes/', 'scripts/']
const SKIP = /(^|\/)(node_modules|dist|\.DS_Store)(\/|$)/

const hash = (buf) => crypto.createHash('sha256').update(String(buf).replace(/\r\n/g, '\n')).digest('hex').slice(0, 16)
const walk = (root, dir = '') => {
  const abs = path.join(root, dir)
  if (!fs.existsSync(abs)) return []
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((e) => {
    const rel = dir ? `${dir}/${e.name}` : e.name
    if (SKIP.test(rel)) return []
    return e.isDirectory() ? walk(root, rel) : [rel]
  })
}

/** The template's managed files: { rel: absolute path }. */
export function templateFiles(templateDir) {
  return Object.fromEntries(MANAGED.flatMap((m) => walk(templateDir, m.slice(0, -1))).map((rel) => [rel, path.join(templateDir, rel)]))
}

const manifestFile = (dataDir) => path.join(dataDir, 'template.json')
const readManifest = (dataDir) => { try { return JSON.parse(fs.readFileSync(manifestFile(dataDir), 'utf8')) } catch { return null } }

/**
 * Record what the starter put in the app (after `new`, and after every upgrade). Files the team changed or removed keep
 * the starter's hash (plan.known), so the next upgrade still sees them as theirs.
 */
export function writeManifest(repo, dataDir, templateDir, version, plan = null) {
  const files = {}
  const theirs = new Set([...(plan?.keep ?? []), ...(plan?.skipDeleted ?? [])])
  for (const rel of Object.keys(templateFiles(templateDir))) {
    const abs = path.join(repo, rel)
    if (theirs.has(rel)) { if (plan.known[rel]) files[rel] = plan.known[rel] }
    else if (fs.existsSync(abs)) files[rel] = hash(fs.readFileSync(abs))
  }
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(manifestFile(dataDir), JSON.stringify({ $comment: 'What medviet-ui-ux put in this app (hash per file), so upgrade can tell files the team changed. Commit it.', version, files }, null, 1) + '\n')
}

/** The app's first commit when it is the starter's ("medviet-ui-ux starter", "Aura starter"), for apps without a manifest. */
function starterCommit(repo) {
  const r = runSync('git', ['log', '--reverse', '--format=%H %s'], { cwd: repo, encoding: 'utf8' })
  const first = r?.status === 0 ? r.stdout.split('\n')[0] : ''
  return /starter/i.test(first) ? first.split(' ')[0] : null
}
const atCommit = (repo, commit, rel) => {
  const r = runSync('git', ['show', `${commit}:${rel}`], { cwd: repo, encoding: 'buffer', maxBuffer: 64 << 20 })
  return r?.status === 0 ? r.stdout : null
}

/**
 * What an upgrade would do. Returns { add, update, keep, skipDeleted, current, deps, scripts, gitignore, biome, baseline }:
 * add = new in the template; update = unchanged by the team and different now; keep = changed by the team (left alone).
 */
export function planUpgrade(repo, dataDir, templateDir, { overwrite = [] } = {}) {
  const manifest = readManifest(dataDir)
  const commit = manifest ? null : starterCommit(repo)
  const plan = { add: [], update: [], keep: [], skipDeleted: [], known: {}, current: 0, deps: {}, scripts: {}, gitignore: [], biome: [], baseline: manifest ? 'manifest' : commit ? 'git' : 'none' }
  for (const [rel, src] of Object.entries(templateFiles(templateDir))) {
    const abs = path.join(repo, rel)
    const next = fs.readFileSync(src)
    const original = !manifest && commit ? atCommit(repo, commit, rel) : null
    const known = manifest ? manifest.files?.[rel] ?? null : original ? hash(original) : null
    plan.known[rel] = known
    if (!fs.existsSync(abs)) {
      // the starter had it and it's gone: the team removed it on purpose
      if (known && !overwrite.includes(rel)) plan.skipDeleted.push(rel)
      else plan.add.push(rel)
      continue
    }
    const now = hash(fs.readFileSync(abs))
    if (now === hash(next)) { plan.current++; continue }
    if (now === known || overwrite.includes(rel)) plan.update.push(rel)
    else plan.keep.push(rel)
  }
  // dependencies and scripts the template has and the app lacks (an app's own versions are never changed)
  const tpkg = JSON.parse(fs.readFileSync(path.join(templateDir, 'package.json'), 'utf8'))
  let apkg = {}
  try { apkg = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8')) } catch {}
  for (const field of ['dependencies', 'devDependencies'])
    for (const [name, range] of Object.entries(tpkg[field] ?? {}))
      if (!apkg.dependencies?.[name] && !apkg.devDependencies?.[name]) (plan.deps[field] ??= {})[name] = range
  for (const [name, cmd] of Object.entries(tpkg.scripts ?? {})) if (!apkg.scripts?.[name] && /^(postinstall)$/.test(name)) plan.scripts[name] = cmd
  // .gitignore lines and biome ignores the template added (public/pdfjs…)
  const lines = (f) => { try { return fs.readFileSync(f, 'utf8').split(/\r?\n/).map((l) => l.trim()) } catch { return [] } }
  const have = new Set(lines(path.join(repo, '.gitignore')))
  plan.gitignore = lines(path.join(templateDir, '.gitignore')).filter((l) => l && !l.startsWith('#') && !have.has(l))
  try {
    const tb = JSON.parse(fs.readFileSync(path.join(templateDir, 'biome.json'), 'utf8')).files?.includes ?? []
    const ab = JSON.parse(fs.readFileSync(path.join(repo, 'biome.json'), 'utf8')).files?.includes
    if (Array.isArray(ab)) plan.biome = tb.filter((p) => p.startsWith('!') && !ab.includes(p))
  } catch {}
  return plan
}

/** Apply a plan: copy files, merge package.json / .gitignore / biome.json. Returns whether dependencies changed. */
export function applyUpgrade(repo, templateDir, plan) {
  for (const rel of [...plan.add, ...plan.update]) {
    fs.mkdirSync(path.dirname(path.join(repo, rel)), { recursive: true })
    fs.copyFileSync(path.join(templateDir, rel), path.join(repo, rel))
  }
  const depsChanged = Object.keys(plan.deps).length > 0
  if (depsChanged || Object.keys(plan.scripts).length) {
    const file = path.join(repo, 'package.json'), raw = fs.readFileSync(file, 'utf8'), pkg = JSON.parse(raw)
    for (const [field, deps] of Object.entries(plan.deps)) pkg[field] = Object.fromEntries(Object.entries({ ...pkg[field], ...deps }).sort(([a], [b]) => a.localeCompare(b)))
    pkg.scripts = { ...pkg.scripts, ...plan.scripts }
    fs.writeFileSync(file, JSON.stringify(pkg, null, raw.match(/^(\s+)"/m)?.[1].length ?? 2) + '\n')
  }
  if (plan.gitignore.length) fs.appendFileSync(path.join(repo, '.gitignore'), `\n# added by medviet-ui-ux upgrade\n${plan.gitignore.join('\n')}\n`)
  if (plan.biome.length) {
    const file = path.join(repo, 'biome.json'), cfg = JSON.parse(fs.readFileSync(file, 'utf8'))
    cfg.files.includes = [...cfg.files.includes, ...plan.biome]
    fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n')
  }
  return depsChanged
}

/** The plan as text for the user. */
export function formatPlan(plan, { dryRun = false } = {}) {
  const out = []
  const list = (title, items) => items.length && out.push(`${title} (${items.length}):\n  ${items.join('\n  ')}`)
  list(dryRun ? 'Would add' : 'Added', plan.add)
  list(dryRun ? 'Would update' : 'Updated', plan.update)
  list('Kept, changed in this app (not overwritten; --overwrite <file,…> to take the template version)', plan.keep)
  list('Not re-added, removed from this app', plan.skipDeleted)
  const deps = Object.values(plan.deps).flatMap((d) => Object.entries(d).map(([n, v]) => `${n}@${v}`))
  if (deps.length) out.push(`${dryRun ? 'Would add' : 'Added'} dependencies: ${deps.join(', ')}`)
  if (Object.keys(plan.scripts).length) out.push(`${dryRun ? 'Would add' : 'Added'} scripts: ${Object.keys(plan.scripts).join(', ')}`)
  if (plan.gitignore.length) out.push(`.gitignore: ${plan.gitignore.join(', ')}`)
  if (plan.biome.length) out.push(`biome.json ignores: ${plan.biome.join(', ')}`)
  if (plan.baseline === 'none' && plan.keep.length) out.push('This app has no starter commit or .medviet-ui-ux/template.json, so every file that differs from the template counts as changed here.')
  out.push(`${plan.current} file(s) already current.`)
  return out.join('\n')
}
