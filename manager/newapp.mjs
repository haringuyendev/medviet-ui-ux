// A new app from the MedViet starter (template/): copy, name it, install dependencies, medviet-ui-ux init, first git commit.
// Plain Node, so it works on Windows without bash (scripts/new-app.sh only calls this).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { packageManager } from './primitives.mjs'
import { run, which } from './proc.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
export const templateDir = () => path.join(here, '..', 'template')
export const isEmptyDir = (dir) => !fs.existsSync(dir) || fs.readdirSync(dir).every((f) => f.startsWith('.') && f !== '.medviet-ui-ux')
const SKIP = /(^|[\\/])(node_modules|dist|\.medviet-ui-ux|\.vite|\.turbo)([\\/]|$)/

const exec = (cmd, args, cwd, onLog) => new Promise((resolve, reject) => {
  const child = run(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] })
  const out = (d) => String(d).split(/\r?\n/).map((l) => l.trim()).filter(Boolean).forEach(onLog)
  child.stdout.on('data', out); child.stderr.on('data', out)
  child.on('error', (e) => reject(new Error(e.code === 'ENOENT' ? `không tìm thấy lệnh ${cmd}` : e.message)))
  child.on('close', (code) => code ? reject(new Error(`${cmd} ${args[0] ?? ''} lỗi (exit ${code})`)) : resolve())
})

/** Create the app in `target` (must be empty or missing). onLog(line) gets progress. Returns the target folder. */
export async function createApp({ target, name = path.basename(target), onLog = console.log }) {
  const template = templateDir()
  if (!fs.existsSync(path.join(template, 'package.json'))) throw new Error('Không thấy starter của medviet-ui-ux (template/). Chạy lệnh từ plugin medviet-ui-ux.')
  if (!isEmptyDir(target)) throw new Error(`Thư mục ${target} đã có file.`)
  fs.mkdirSync(target, { recursive: true })
  // the long form of the path: Windows temp folders come as 8.3 names (C:\Users\RUNNER~1), and Vite refuses (403)
  // files whose real path doesn't start with the root it was given
  target = fs.realpathSync.native(target)
  onLog(`Chép starter vào ${target}`)
  fs.cpSync(template, target, { recursive: true, filter: (src) => !SKIP.test(path.relative(template, src)) })
  const pkgFile = path.join(target, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
  pkg.name = String(name).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '') || 'app'
  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + '\n')

  // the starter's lockfile is npm's; use npm unless only another package manager is installed
  const pm = which('npm') ? 'npm' : packageManager({ pkg, repo: target })
  onLog(`Cài thư viện (${pm} install)…`)
  await exec(pm, pm === 'npm' ? ['install', '--no-audit', '--no-fund'] : ['install'], target, onLog)

  onLog('Khởi tạo medviet-ui-ux (.medviet-ui-ux/)')
  await exec(process.execPath, [path.join(here, 'medviet-ui-ux.mjs'), 'init', '--scripts'], target, () => {})

  if (which('git')) {
    try {
      await exec('git', ['init', '-q'], target, onLog)
      await exec('git', ['add', '-A'], target, onLog)
      // the user's git identity; a placeholder only when none is configured
      await exec('git', ['commit', '-qm', 'medviet-ui-ux starter'], target, () => {})
        .catch(() => exec('git', ['-c', 'user.name=medviet-ui-ux', '-c', 'user.email=medviet-ui-ux@localhost', 'commit', '-qm', 'medviet-ui-ux starter'], target, onLog))
    } catch { onLog('(bỏ qua git)') }
  } else onLog('Không có git: bỏ qua bước tạo lịch sử thay đổi')
  return target
}
