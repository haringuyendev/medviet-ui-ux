# medviet-ui-ux

Bộ skill nội bộ của MedViet để làm UI/UX nhanh và đồng bộ giữa các app. Plugin cho Claude Code CLI và tab **Code** của
Claude Desktop, gồm 4 phần:
- **Design system của turbo-web:** màu EMR teal theo web-emr, font Roboto, màu trạng thái dùng chung.
- **Primitive của `@medviet/ui`:** làm template.
- **Block dùng chung:** những component các app đang viết lại mỗi app một kiểu, nay gom thành bản chuẩn.
- **Add-on và lớp kiểm tra của medviet-ui-ux:** hook chặn UI tự dựng, chặn màu thô, chặn component trùng; `medviet-ui-ux verify` kiểm tra
  trang đã render.

## Cài đặt
```
/plugin marketplace add haringuyendev/medviet-ui-ux      # repo private: cần quyền đọc repo và gh auth login
/plugin install medviet-ui-ux@medviet-ui-ux
/medviet-ui-ux:setup
```
Đang sửa plugin trên máy thì có thể thêm marketplace từ thư mục local: `/plugin marketplace add ~/MedViet/medviet-ui-ux`.
- CLI và phiên local của Desktop đọc chung cấu hình, nên cài ở một chỗ là chỗ kia cũng có. Tab chat thường không chạy được
  hook: hãy dùng tab **Code**.
- Máy chưa có Node.js: `/medviet-ui-ux:setup` hỏi một câu rồi tự cài bản LTS chính thức vào `~/.medviet-ui-ux/node` (trên
  Windows là `%LOCALAPPDATA%\medviet-ui-ux\node`), không cần quyền admin. Cài xong, thoát hẳn Claude Desktop rồi mở lại.
- Trong mỗi repo, plugin lưu danh sách component, luật kiểm tra và bản CLI ở thư mục `.medviet-ui-ux/` (commit thư mục này;
  `.medviet-ui-ux/cache` đã được ignore). Repo tạo bằng bản cũ hơn 1.2.1 có thư mục `.aura/`: lần chạy đầu tự chuyển sang
  `.medviet-ui-ux/`.

## Có gì
**Design system v1** (`design/DESIGN.md`, xem trực quan ở `design/preview.html`, token ở `design/tokens.json`; bản tóm tắt cho
skill ở `references/design-system.md`). Bản v1 bổ sung so với turbo-web: `primary` đổi sang `#287a6f` (chữ trắng đạt 5,1:1, thay
vì 2,97:1), `brand` `#38a696` dùng cho logo và biểu đồ, chữ trạng thái `*-text` đạt chuẩn tương phản, 11 cặp màu phân loại,
`readonly`/`disabled`. Các bổ sung này nằm trong một khối riêng của `index.css`; bản vá cho turbo-web ở
`upstream/turbo-web-theme-v1.patch`.

Gốc lấy từ turbo-web (`references/design-system.md`). Token y hệt `turbo-web/tooling/tailwind/theme.css`:
- màu chính `#38a696`, nền `#f8f8f9`, chữ `#3d4c63`;
- màu trạng thái: info `#3b9bf3` (đang làm, đang duyệt), warning `#ffb762` (chờ), success `#36b37e` (xong), destructive
  `#ff5075` (thiếu, huỷ);
- `chart-1…5` theo đúng thứ tự trạng thái của web-emr; Roboto Variable; radius 0.625rem; dark mode dẫn xuất.

Không app nào tự đổi màu hay font. Muốn đổi thì đổi ở turbo-web trước, rồi chạy `scripts/sync-turbo.mjs`.

**Theme và primitive dùng token.** Kích thước, cỡ chữ, nền nút, đầu bảng… cũng là token. Có hai theme:
- **DS v1** (mặc định);
- **EMR** (`<html data-theme="emr">`): giống hệt web-emr.

20 primitive trong `components/blocks` dựng lại theo chức năng `libs/cake` của web-emr, chỉ dùng token, nên chạy được ở cả
hai theme mà không phải sửa code. Gồm TextField, DateField, DatePickerField, DateRangeField, SelectField, AutocompleteField,
PhoneField, MaskedField, TextAreaField, SearchField, CheckboxGroup/RadioList, CheckboxField, SwitchField, ActionButton
(nhận `btnType` của EMR), GridTable, SectionTitle, TabBar, DialogFrame, ExpandableText, ControlField. Xem `design/DESIGN.md` §15.

**Template (MedViet starter, `template/`).** Cùng stack với turbo-web: React 19, Vite, TypeScript, Tailwind v4, TanStack
Query, TanStack Table v9, react-hook-form/zod, zustand, nuqs, react-error-boundary, Biome.
- `src/components/ui/`: 63 primitive chép nguyên từ `packages/ui` (shadcn `base-vega` trên Base UI), có `data-table` và
  `date-picker`. Giữ nguyên như bản gốc để dễ đồng bộ.
- `src/components/blocks/`: các block MedViet:

  | Block | Lấy từ | Dùng cho |
  |---|---|---|
  | `status-badge` (`defineStatuses`) | health-exam, gmhs | trạng thái hồ sơ/phiếu: nền nhạt + chấm màu, một tone cho mỗi trạng thái |
  | `time-input` | gmhs, health-exam | nhập giờ `HH:mm` 24h có mặt nạ |
  | `row-actions-menu` | gmhs | thao tác của dòng trong bảng sau nút ⋯ |
  | `confirm-dialog` | health-exam | "Bỏ thay đổi?", "Xoá hồ sơ?" |
  | `readonly-field` | health-exam | chế độ Xem giống hệt form, tone cảnh báo cho dị ứng |
  | `retry-alert` | health-exam | lỗi tải/lưu ngay tại chỗ, có nút Thử lại |
  | `info-hint` | gmhs | ⓘ giải thích ngắn |
  | `required-mark` | gmhs, manage-form | dấu * của trường bắt buộc |
  | `category-tag` | DS v1 | nhãn danh mục (khoa, loại dịch vụ) bằng 11 màu phân loại |
  | `page-header`, `stat`, `description-list`, `form`, `number-input`, `file-upload`, `stepper` | chung | tiêu đề trang, KPI, form… |

- `src/pages`: `NotFound` và `ServerError` dựng bằng token (bản trong template của turbo-web dùng màu xám thô).
  `src/lib/format.ts`: định dạng vi-VN. `src/hooks`: các hook của `@medviet/hook`.

**Add-on** (cài khi cần: `node scripts/add-block.mjs <tên> <app>`; `medviet-ui-ux find` tự in lệnh cài khi khớp nhu cầu):

| Add-on | Dùng cho |
|---|---|
| `signature-pad` | người bệnh ký tên (health-exam) |
| `data-export` | nút Xuất Excel/CSV cho bảng, danh sách |
| `excel-import` | nhập danh sách từ Excel, file mẫu, báo dòng lỗi (health-exam) |
| `print-sheet` | bản in A4: phiếu, biên bản, bảng bàn giao (gmhs) |
| `virtual-list` | danh sách hàng nghìn dòng (health-exam) |
| `rich-text-editor` | soạn văn bản có định dạng (Tiptap) |
| `file-lightbox` | xem ảnh, PDF, Word, Excel |

**Skill** (`/medviet-ui-ux:<tên>`):

| Skill | Việc |
|---|---|
| `build` | luật thiết kế màn hình MedViet, tự kích hoạt khi làm UI |
| `find` | tìm component phù hợp bằng tiếng Việt |
| `check` | sửa lỗi khi hook chặn |
| `inspect` | `medviet-ui-ux verify` trước khi báo xong |
| `init`, `scan` | quét repo |
| `describe` | mô tả component cho registry |
| `new-app` | app mới từ MedViet starter |
| `studio` | trang chat và preview kiểu Lovable |
| `setup` | kiểm tra máy, tự cài Node |

## Dùng trong turbo-web
Ở thư mục gốc turbo-web chạy `/medviet-ui-ux:init` một lần (tạo `.medviet-ui-ux/`). Sau đó:
- Primitive lấy từ `@medviet/ui/components/*`; primitive còn thiếu thêm bằng `bun run ui-add` trong `packages/ui`, sau khi
  người dùng đồng ý.
- Block MedViet chưa có trong `@medviet/ui`: agent chép block cần dùng từ `template/src/components/blocks` vào app, rồi
  đổi import sang `@medviet/ui/...`. Khi đã có 2 app cùng dùng thì đề xuất đưa lên package chung, đúng quy tắc của
  turbo-web.
- App mới để ship thì tạo bằng `bun run gen:app`; prototype hoặc tool riêng thì dùng `/medviet-ui-ux:new-app` hoặc Studio.

## Giữ đồng bộ với turbo-web
```bash
node scripts/sync-turbo.mjs --dry-run        # xem khác gì (chỉ đọc turbo-web)
node scripts/sync-turbo.mjs                  # chép primitive, hook, utils, token vào template
cd template && npm install && npx tsc -b && npx biome check .
node scripts/catalog.mjs sync                # primitive mới cần mục trong catalog (từ khoá tiếng Việt)
node scripts/smoke.mjs                       # test end-to-end: app mới, check, scaffold, hook, verify, Studio
node scripts/design-tokens.mjs && node scripts/design-preview.mjs   # cập nhật design/tokens.json và preview.html
```

## Cấu trúc
```
.claude-plugin/   plugin.json, marketplace.json (medviet-ui-ux 1.2.3)
hooks/            hook của medviet-ui-ux (SessionStart, PreToolUse, PostToolUse, Stop, SubagentStop)
skills/           10 skill ở trên
manager/          engine medviet-ui-ux: medviet-ui-ux.mjs (init, find, add, scaffold, variant, check, verify, inspect, studio, new, setup…)
template/         MedViet starter
catalog/          components.json: 108 mục, từ điển Việt–Anh cho medviet-ui-ux find
addons/           7 add-on
design/           DESIGN.md (Design System v1), preview.html, tokens.json
upstream/         turbo-web-theme-v1.patch (token v1 + badge cho turbo-web)
references/       design-system.md (MedViet), dashboard.md
scripts/          sync-turbo.mjs, add-block.mjs, catalog.mjs, smoke.mjs, install-node.sh|ps1, find-node.sh|ps1
```
Lệnh của engine: `node manager/medviet-ui-ux.mjs help`.
