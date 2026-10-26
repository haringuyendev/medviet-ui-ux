#!/usr/bin/env node
// design/preview.html: a self-contained page of the MedViet design system built from the starter's real tokens (the
// :root/.dark blocks of template/src/index.css are copied in), with contrast measured live in the browser.
//   node scripts/design-preview.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const css = fs.readFileSync(path.join(root, 'template', 'src', 'index.css'), 'utf8')
const vars = [...css.matchAll(/(^|\n)(:root|\.dark)\s*\{([\s\S]*?)\n\}/g)]
  .map((m) => `${m[2] === ':root' ? ':root' : 'html.dark'} {${m[3]}\n}`)
  .join('\n')
// themes (template/src/themes/*.css), switchable on the page
const themesDir = path.join(root, 'template', 'src', 'themes')
const themeCss = fs.existsSync(themesDir) ? fs.readdirSync(themesDir).filter((f) => f.endsWith('.css')).map((f) => fs.readFileSync(path.join(themesDir, f), 'utf8')).join('\n') : ''
// component tokens block (sizes, button fills…) as plain CSS
const compBlock = (css.match(/component tokens[\s\S]*?\n(:root \{[\s\S]*?\n\})/) || [, ''])[1]
const tokens = JSON.parse(fs.readFileSync(path.join(root, 'design', 'tokens.json'), 'utf8'))
const TAGS = ['blue', 'cyan', 'green', 'navy', 'orange', 'pink', 'red', 'violet', 'yellow', 'brown', 'gray']

const swatch = (bg, fg, label, sub = '') =>
  `<div class="sw"><div class="chip" style="background:var(--${bg});color:var(--${fg})" data-bg="${bg}" data-fg="${fg}"><b>Aa</b><span class="ratio"></span></div><div class="lbl">${label}</div><div class="sub">${sub}</div></div>`

const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MedViet Design System v1</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${vars}
${compBlock}
${themeCss}
:root { --font-sans: "Roboto", "Helvetica Neue", Arial, sans-serif; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--background); color: var(--foreground); font: 14px/20px var(--font-sans); }
main { max-width: 1200px; margin: 0 auto; padding: 32px 16px 64px; }
header.top { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; flex-wrap: wrap; margin-bottom: 32px; }
h1 { font-size: 24px; line-height: 32px; font-weight: 600; margin: 0; letter-spacing: -0.01em; }
h2 { font-size: 18px; line-height: 28px; font-weight: 600; margin: 40px 0 4px; }
p.lead, p.note { color: var(--muted-foreground); margin: 4px 0 16px; max-width: 80ch; }
.card { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px; }
.grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
.sw .chip { height: 72px; border-radius: 10px; border: 1px solid var(--border); display: flex; align-items: flex-end; justify-content: space-between; padding: 8px 10px; font-size: 16px; }
.sw .ratio { font-size: 11px; font-variant-numeric: tabular-nums; background: color-mix(in oklab, var(--card) 85%, transparent); color: var(--foreground); padding: 1px 6px; border-radius: 999px; }
.sw .ratio.fail { background: var(--destructive); color: #fff; }
.sw .lbl { font-weight: 500; margin-top: 6px; font-size: 13px; }
.sw .sub { color: var(--muted-foreground); font-size: 12px; }
.row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.btn { height: 32px; padding: 0 14px; border-radius: 8px; border: 1px solid transparent; font: 500 14px var(--font-sans); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.btn.primary { background: var(--primary); color: var(--primary-foreground); }
.btn.old { background: var(--brand); color: #fff; }
.btn.outline { background: var(--card); border-color: var(--input); color: var(--foreground); }
.btn.destructive { background: var(--destructive); color: var(--destructive-foreground); }
.btn:focus-visible { outline: 3px solid var(--ring); outline-offset: 2px; }
.badge { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; height: 22px; padding: 0 8px; border-radius: 999px; font-size: 12px; font-weight: 500; }
.dot { width: 6px; height: 6px; border-radius: 999px; }
.t-info { background: color-mix(in oklab, var(--info) 15%, transparent); color: var(--info-text); } .t-info .dot { background: var(--info); }
.t-warning { background: color-mix(in oklab, var(--warning) 25%, transparent); color: var(--warning-text); } .t-warning .dot { background: var(--warning); }
.t-success { background: color-mix(in oklab, var(--success) 15%, transparent); color: var(--success-text); } .t-success .dot { background: var(--success); }
.t-destructive { background: color-mix(in oklab, var(--destructive) 10%, transparent); color: var(--destructive-text); } .t-destructive .dot { background: var(--destructive); }
.t-neutral { background: var(--secondary); color: var(--muted-foreground); } .t-neutral .dot { background: var(--muted-foreground); }
${TAGS.map((t) => `.tag-${t} { background: var(--tag-${t}); color: var(--tag-${t}-foreground); }`).join('\n')}
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
th { text-align: left; font-weight: 500; color: var(--muted-foreground); background: var(--surface); padding: 10px 12px; border-bottom: 1px solid var(--border); }
td { padding: 10px 12px; border-bottom: 1px solid var(--border); }
tr.sel td { background: var(--accent); color: var(--accent-foreground); }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-weight: 500; }
.input { height: 32px; border: 1px solid var(--input); border-radius: 8px; padding: 0 10px; background: var(--card); color: var(--foreground); font: 14px var(--font-sans); }
.input.ro { background: var(--readonly); }
.input:disabled { background: var(--disabled); color: var(--disabled-foreground); }
.req { color: var(--destructive-text); }
.alert { display: flex; justify-content: space-between; align-items: center; gap: 8px; border: 1px solid color-mix(in oklab, var(--destructive) 20%, transparent); background: color-mix(in oklab, var(--destructive) 5%, transparent); border-radius: 8px; padding: 8px 12px; }
.type div { padding: 6px 0; border-bottom: 1px dashed var(--border); display: flex; justify-content: space-between; gap: 16px; }
.type code, code { font-size: 12px; color: var(--muted-foreground); }
.two { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
.kpi b { font-size: 28px; line-height: 36px; font-weight: 600; font-variant-numeric: tabular-nums; display: block; }
.kpi .bad { color: var(--destructive-text); }
.cf { display: inline-flex; align-items: center; gap: var(--label-gap); }
.cl { font-size: var(--label-font-size); font-weight: var(--label-font-weight); color: var(--label-color); white-space: nowrap; }
.cl sup { color: var(--required-color); font-size: var(--required-size); }
.ci { height: var(--control-height); font: inherit; font-size: var(--control-font-size); color: var(--control-fg); border: var(--control-border-width) solid var(--input); border-radius: var(--control-radius); padding: 0 var(--control-padding-x); background: var(--card); width: 140px; }
.ci.ro { background: var(--control-readonly); }
.ci::placeholder { color: var(--control-placeholder); font-size: var(--control-placeholder-size); }
.cb { display: inline-flex; align-items: center; height: var(--button-height); padding: 0 var(--button-padding-x); border-radius: var(--button-radius); font-size: var(--button-font-size); font-weight: var(--button-font-weight); }
.cb.p { background: var(--button-primary-bg); color: var(--button-primary-fg); }
.cb.w { background: var(--button-warning-bg); color: var(--button-warning-fg); }
.cb.d { background: var(--button-destructive-bg); color: var(--button-destructive-fg); }
.cb.n { background: var(--button-neutral-bg); color: var(--button-neutral-fg); }
.gt { font-size: var(--table-font-size); border: 1px solid var(--table-border); }
.gt th { background: var(--table-header-bg); color: var(--table-header-fg); font-weight: var(--table-header-weight); padding: var(--table-cell-padding-y) var(--table-cell-padding-x); text-align: var(--table-align); border-bottom: 0; }
.gt td { padding: var(--table-cell-padding-y) var(--table-cell-padding-x); text-align: var(--table-align); border-bottom: 1px solid var(--table-border); }
.gt th:first-child { border-top-left-radius: var(--table-radius); } .gt th:last-child { border-top-right-radius: var(--table-radius); }
@media (max-width: 640px) { th:nth-child(4), td:nth-child(4) { display: none; } }
</style>
</head>
<body>
<main>
<header class="top">
  <div>
    <h1>MedViet Design System v1</h1>
    <p class="lead">Token thật của MedViet starter (turbo-web + bổ sung v1), tạo từ <code>template/src/index.css</code>. Số trên mỗi ô là độ tương phản giữa chữ và nền, đo ngay trong trình duyệt; ô đỏ là chưa đạt 4,5:1.</p>
  </div>
  <div class="row">
    <button class="btn outline" id="theme" type="button">Theme EMR</button>
    <button class="btn outline" id="mode" type="button">Chế độ tối</button>
  </div>
</header>

<h2>Thương hiệu và hành động chính</h2>
<p class="note">Chữ trắng trên màu thương hiệu #38a696 chỉ đạt 2,97:1. v1 dùng teal đậm hơn #287a6f cho nút và liên kết; #38a696 giữ cho logo, biểu đồ, mảng màu lớn.</p>
<div class="grid">
  ${swatch('primary', 'primary-foreground', 'primary', '#287a6f · nút, liên kết')}
  ${swatch('brand', 'brand-foreground', 'brand', '#38a696 · không mang chữ')}
  ${swatch('accent', 'accent-foreground', 'accent', 'hover, mục đang chọn')}
</div>
<div class="card row" style="margin-top:12px">
  <button class="btn primary" type="button">Lưu hồ sơ</button>
  <button class="btn old" type="button">Lưu hồ sơ (màu cũ)</button>
  <button class="btn outline" type="button">Huỷ</button>
  <button class="btn destructive" type="button">Xoá hồ sơ</button>
</div>

<h2>Nền và chữ</h2>
<div class="grid">
  ${swatch('background', 'foreground', 'background / foreground', 'nền trang, chữ chính')}
  ${swatch('card', 'foreground', 'card', 'thẻ, panel, dialog')}
  ${swatch('card', 'muted-foreground', 'muted-foreground', 'chú thích')}
  ${swatch('surface', 'foreground', 'surface', 'đầu bảng, thanh công cụ')}
  ${swatch('secondary', 'secondary-foreground', 'secondary', 'nút phụ, vùng trống')}
  ${swatch('readonly', 'foreground', 'readonly', 'ô chỉ đọc')}
  ${swatch('disabled', 'disabled-foreground', 'disabled', 'vô hiệu (không yêu cầu tương phản)')}
</div>

<h2>Trạng thái</h2>
<p class="note">Màu gốc dùng cho nền nhạt, chấm, icon; chữ dùng token <code>*-text</code>. Nghĩa giống nhau ở mọi app.</p>
<div class="grid">
  ${swatch('card', 'info-text', 'info-text', 'đang làm, đang duyệt')}
  ${swatch('card', 'warning-text', 'warning-text', 'chờ, cần chú ý')}
  ${swatch('card', 'success-text', 'success-text', 'xong')}
  ${swatch('card', 'destructive-text', 'destructive-text', 'thiếu, huỷ, nguy hiểm')}
  ${swatch('card', 'success', 'success (không dùng làm chữ)', 'chỉ cho nền, chấm, icon')}
  ${swatch('card', 'warning', 'warning (không dùng làm chữ)', 'chỉ cho nền, chấm, icon')}
</div>
<div class="card row" style="margin-top:12px">
  <span class="badge t-neutral"><span class="dot"></span>Chưa đăng ký</span>
  <span class="badge t-warning"><span class="dot"></span>Chờ khám</span>
  <span class="badge t-info"><span class="dot"></span>Đang khám</span>
  <span class="badge t-success"><span class="dot"></span>Đã khám</span>
  <span class="badge t-destructive"><span class="dot"></span>Đã huỷ</span>
</div>

<h2>Màu phân loại</h2>
<p class="note">Cho danh mục (khoa, loại dịch vụ, gói khám), không cho trạng thái. Block <code>CategoryTag</code>.</p>
<div class="grid">
  ${TAGS.map((t) => swatch(`tag-${t}`, `tag-${t}-foreground`, t, `bg-tag-${t}`)).join('\n  ')}
</div>
<div class="card row" style="margin-top:12px">
  <span class="badge tag-blue">Khoa Nội</span><span class="badge tag-cyan">Khoa Ngoại</span><span class="badge tag-pink">Sản</span><span class="badge tag-orange">Nhi</span><span class="badge tag-violet">Gói VIP</span><span class="badge tag-navy">BHYT</span>
</div>

<h2>Biểu đồ</h2>
<div class="grid">
  ${[1, 2, 3, 4, 5].map((i) => `<div class="sw"><div class="chip" style="background:var(--chart-${i})"></div><div class="lbl">chart-${i}</div><div class="sub">${['thương hiệu', 'đang duyệt', 'hoàn thành', 'chờ', 'thiếu'][i - 1]}</div></div>`).join('\n  ')}
</div>

<h2>Chữ</h2>
<div class="card type">
  <div><span style="font-size:24px;line-height:32px;font-weight:600">Lịch khám hôm nay</span><code>text-2xl font-semibold · tiêu đề trang</code></div>
  <div><span style="font-size:18px;line-height:28px;font-weight:600">Ca trễ giờ cần xử lý</span><code>text-lg font-semibold · khu vực</code></div>
  <div><span style="font-size:16px;line-height:24px;font-weight:600">Bệnh nhân đang chờ</span><code>text-base font-semibold · tiêu đề thẻ</code></div>
  <div><span>Nguyễn Thị Lan · 08:30 · BS. Trần Quang Minh</span><code>text-sm · chữ thường, bảng</code></div>
  <div><span style="font-size:12px;line-height:16px;color:var(--muted-foreground)">Cập nhật lúc 10:30 · số liệu tạm tính</span><code>text-xs muted · chú thích</code></div>
  <div class="kpi"><span><b>44</b></span><code>text-3xl font-semibold tabular-nums · KPI</code></div>
</div>

<h2>Control theo token component</h2>
<p class="note">Cùng một đoạn HTML; kích thước, cỡ chữ, viền, nền nút (có thể là gradient) và đầu bảng lấy từ token component. Bấm "Theme EMR" để thấy giao diện EMR.</p>
<div class="card" style="display:flex;flex-direction:column;gap:14px">
  <div class="row" style="gap:16px">
    <label class="cf"><span class="cl">Mã NB:</span><input class="ci ro" value="NB-00128" readonly></label>
    <label class="cf"><span class="cl">Tên NB:<sup class="req">*</sup></span><input class="ci" value="Nguyễn Thị Lan"></label>
    <label class="cf"><span class="cl">Ngày sinh:<sup class="req">*</sup></span><input class="ci" placeholder="DD/MM/YYYY" style="text-align:center"></label>
  </div>
  <div class="row" style="gap:16px">
    <span class="cb p">Lưu</span><span class="cb w">Sửa</span><span class="cb d">Huỷ</span><span class="cb n">Đóng</span>
  </div>
  <table class="gt"><thead><tr><th>STT</th><th>Tên</th><th>Tuổi</th></tr></thead><tbody><tr><td>1</td><td>Nguyễn Văn A</td><td>30</td></tr><tr><td>2</td><td>Trần Thị B</td><td>28</td></tr></tbody></table>
</div>

<h2>Mẫu màn hình</h2>
<div class="two">
  <div class="card">
    <table>
      <thead><tr><th>Giờ hẹn</th><th>Bệnh nhân</th><th>Khoa</th><th>Bác sĩ</th><th>Trạng thái</th></tr></thead>
      <tbody>
        <tr><td>08:30</td><td>Nguyễn Thị Lan</td><td><span class="badge tag-blue">Nội</span></td><td>BS. Trần Quang Minh</td><td><span class="badge t-destructive"><span class="dot"></span>Trễ 45 phút</span></td></tr>
        <tr class="sel"><td>08:45</td><td>Lê Văn Phúc</td><td><span class="badge tag-orange">Nhi</span></td><td>BS. Phạm Thu Hà</td><td><span class="badge t-info"><span class="dot"></span>Đang khám</span></td></tr>
        <tr><td>09:00</td><td>Đỗ Minh Châu</td><td><span class="badge tag-cyan">Ngoại</span></td><td>BS. Vũ Ngọc Lan</td><td><span class="badge t-warning"><span class="dot"></span>Chờ khám</span></td></tr>
        <tr><td>09:15</td><td>Hoàng Minh Tuấn</td><td><span class="badge tag-blue">Nội</span></td><td>BS. Lê Đăng Khoa</td><td><span class="badge t-success"><span class="dot"></span>Đã khám</span></td></tr>
      </tbody>
    </table>
  </div>
  <div class="card" style="display:flex;flex-direction:column;gap:12px">
    <div class="row">
      <div class="kpi" style="flex:1"><span class="sub" style="color:var(--muted-foreground);font-size:12px">Ca hôm nay</span><b>44</b></div>
      <div class="kpi" style="flex:1"><span style="color:var(--muted-foreground);font-size:12px">Ca trễ giờ</span><b class="bad">4</b></div>
    </div>
    <div class="field"><label for="n">Họ tên <span class="req">*</span></label><input class="input" id="n" value="Nguyễn Thị Lan"></div>
    <div class="field"><label for="m">Mã hồ sơ</label><input class="input ro" id="m" value="HS-2026-00128" readonly></div>
    <div class="field"><label for="d">Bác sĩ phụ trách</label><input class="input" id="d" value="Chưa phân công" disabled></div>
    <div class="alert" role="alert"><span>Không tải được lịch sử khám.</span><button class="btn outline" type="button">Thử lại</button></div>
  </div>
</div>
<p class="note" style="margin-top:24px">${tokens.tokens.length} token · ${tokens.tokens.filter((t) => t.source === 'medviet-ds-v1').length} từ bổ sung v1 · chi tiết: design/DESIGN.md, design/tokens.json</p>
</main>
<script>
// contrast of each swatch: the browser resolves oklch/var/color-mix, a 1px canvas reads back sRGB
const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
// translucent colours (color-mix with transparent) are composited over the card, as on the page
const rgb = (css, base) => { ctx.clearRect(0, 0, 1, 1); for (const c of [base, css]) if (c) { ctx.fillStyle = '#000'; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1) } return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3) }
const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
function measure() {
  for (const chip of document.querySelectorAll('.chip[data-fg]')) {
    const s = getComputedStyle(chip)
    const card = getComputedStyle(document.body).backgroundColor
    const bgRgb = rgb(s.backgroundColor, card)
    const a = lum(rgb(s.color, \`rgb(\${bgRgb.join(',')})\`)), b = lum(bgRgb)
    const r = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    const el = chip.querySelector('.ratio')
    el.textContent = r.toFixed(1).replace('.', ',') + ':1'
    el.classList.toggle('fail', r < 4.5 && !chip.dataset.bg.startsWith('disabled'))
  }
}
document.getElementById('theme').onclick = (e) => { const emr = document.documentElement.dataset.theme !== 'emr'; if (emr) document.documentElement.dataset.theme = 'emr'; else delete document.documentElement.dataset.theme; e.target.textContent = emr ? 'Theme DS v1' : 'Theme EMR'; measure() }
document.getElementById('mode').onclick = (e) => { const dark = document.documentElement.classList.toggle('dark'); e.target.textContent = dark ? 'Chế độ sáng' : 'Chế độ tối'; measure() }
measure()
</script>
</body>
</html>
`
fs.writeFileSync(path.join(root, 'design', 'preview.html'), html)
console.log('design/preview.html written')
