# MedViet Design System v1

Phiên bản 1.0 · 27/10/2026 · trạng thái: **đề xuất**, chờ đưa vào turbo-web.

Đây là chuẩn giao diện chung cho mọi app MedViet (EMR, gmhs, health-exam, manage-form và các app mới). MedViet chưa có
bộ nhận diện hay Figma chính thức, nên v1 lấy màu thương hiệu EMR trong `web-emr/public/assets/css/root.css` (đã được
turbo-web chuyển sang `tooling/tailwind/theme.css`), rồi bổ sung những gì còn thiếu và sửa những chỗ không đạt chuẩn
tương phản. Mỗi giá trị đều ghi rõ nguồn: lấy nguyên từ web-emr, hay suy ra từ màu web-emr cùng tông.

- Token đang dùng: `turbo-web/tooling/tailwind/theme.css`, chép vào `template/src/index.css` của medviet-ui-ux.
- Token bổ sung v1: khối "MedViet Design System v1" trong `template/src/index.css`, bản vá cho turbo-web ở
  `upstream/turbo-web-theme-v1.patch`.
- Xem trực quan: `design/preview.html` (mở bằng trình duyệt, có đo tương phản trực tiếp).
- Danh sách token máy đọc được: `design/tokens.json`.

## 1. Nguyên tắc
1. **Rõ ràng hơn trang trí.** Người dùng là bác sĩ, điều dưỡng, lễ tân, kế toán, làm việc cả ngày trên màn hình.
   Bề mặt trung tính; không gradient, không glow, không ảnh trang trí trên màn hình làm việc.
2. **Màu mang ý nghĩa.** Màu dùng để báo trạng thái, ngoại lệ và hành động chính. Một màu, một nghĩa, ở mọi app.
3. **Dày đặc vừa phải.** Màn hình lâm sàng chứa nhiều thông tin: bảng và form gọn; khối đọc thì có khoảng thở.
4. **Nhất quán giữa các app.** Cùng primitive (`@medviet/ui`), cùng block, cùng token. Không app nào tự đổi màu, font
   hay bo góc.
5. **Ai cũng đọc được.** Chữ đạt WCAG AA (4,5:1; chữ lớn từ 18px hoặc 14px đậm: 3:1), thành phần giao diện 3:1, có focus
   rõ, không truyền thông tin chỉ bằng màu.

## 2. Màu thương hiệu và hành động chính
| Token | Giá trị | Nguồn | Dùng cho |
|---|---|---|---|
| `brand` | `#38a696` | web-emr `--primary-brand` | logo, minh hoạ, biểu đồ (`chart-1`), mảng màu lớn |
| `primary` | `#287a6f` | **v1**, suy ra từ `#38a696` | nút chính, liên kết, mục đang chọn, focus |
| `primary-foreground` | `#ffffff` | web-emr `--whites` | chữ trên nút chính |
| `accent` / `accent-foreground` | `#eefffd` / `#287a6f` | web-emr `--primary-hover` / **v1** (`primary`) | nền hover, dòng hoặc mục đang chọn; chữ trên nền đó (5,0:1; `#3e9084` cũ chỉ 3,7:1) |

**Vì sao đổi `primary`.** Chữ trắng trên `#38a696` chỉ đạt **2,97:1**, dưới chuẩn AA, nên mọi nút chính hiện tại đều
khó đọc. `#287a6f` cùng họ teal, đậm hơn: chữ trắng đạt **5,1:1**, dùng làm chữ trên nền trang đạt **4,8:1**.
Màu thương hiệu `#38a696` vẫn giữ (token `brand`) cho những chỗ không mang chữ. Muốn giữ nút màu cũ thì phải đổi chữ trên
nút sang màu tối, nhưng cách đó lệch xa với giao diện quen thuộc của EMR hơn.

## 3. Nền, chữ, đường kẻ
| Token | Giá trị | Nguồn | Dùng cho |
|---|---|---|---|
| `background` | `#f8f8f9` | web-emr body | nền trang (hơi ngả xám để thẻ trắng nổi lên) |
| `card`, `popover` | `#ffffff` | web-emr `--whites` | thẻ, panel, menu, dialog |
| `surface` | `#fbfbfb` | web-emr `--bg-teriary` | thanh công cụ, đầu bảng |
| `foreground` | `#3d4c63` | web-emr `--normal` | chữ chính (8,2:1 trên nền) |
| `muted-foreground` | `#646464` | web-emr `--text-secondary` | chú thích, chữ phụ (5,6:1) |
| `secondary`, `muted` | `#f3f3f3` | web-emr `--bg-secondary` | nút phụ, vùng trống |
| `border` | `#f0f0f0` | web-emr `--border_tbl` | đường kẻ bảng, cạnh thẻ |
| `input` | `#e3e3e3` | turbo-web | viền ô nhập |
| `ring` | `#bae6df` | web-emr `--primary-active` | vòng focus |
| `readonly` | `#f5f5f5` | **v1**, web-emr `--bg-readonly` | ô chỉ đọc |
| `disabled` / `disabled-foreground` | `#e3e3e3` / `#888888` | **v1**, web-emr `--bg-disable` / `--text-teriary` | thành phần bị vô hiệu |

## 4. Trạng thái
Màu trạng thái của web-emr, nghĩa giống nhau ở mọi app:

| Tone | Nền, chấm, icon | Chữ (v1) | Tương phản chữ | Nghĩa | Ví dụ |
|---|---|---|---|---|---|
| `info` | `#3b9bf3` | `info-text` `#2055ad` (web-emr `--info-dark`) | 6,7:1 | đang làm, đang duyệt | Đang khám, Chờ phê duyệt |
| `warning` | `#ffb762` | `warning-text` `#a15c00` (suy ra) | 4,9:1 | chờ, cần chú ý | Chờ khám, Sắp hết hạn |
| `success` | `#36b37e` | `success-text` `#16794d` (từ web-emr `--green-dark` `#1a8054`) | 5,1:1 | xong | Đã khám, Hoàn thành |
| `destructive` | `#ff5075` | `destructive-text` `#c8173f` (suy ra) | 5,4:1 | thiếu, từ chối, huỷ, nguy hiểm | Thiếu hồ sơ, Đã huỷ, Dị ứng |
| `neutral` | `#646464` | `muted-foreground` | 5,6:1 | chưa bắt đầu | Chưa đăng ký, Nháp |

Quy tắc:
- **Màu gốc** (`bg-success`, `bg-success/15`, chấm, icon) **không dùng làm chữ**: trên nền sáng chỉ đạt 1,6–3:1. Chữ
  dùng `text-success-text`, `text-info-text`, `text-warning-text`, `text-destructive-text`. Hook của Aura cảnh báo
  khi gặp `text-success` và gợi ý token đúng.
- **Chip trạng thái dùng `StatusBadge`** (nền nhạt + chấm màu + chữ đạt chuẩn), khai báo một lần bằng `defineStatuses`.
- **Bình thường thì không đánh dấu.** Chỉ những gì cần chú ý mới có màu; mỗi sự việc chỉ báo một lần (màu chữ, hoặc
  badge, hoặc tô dòng); luôn kèm chữ hay icon ("Quá hạn 3 ngày", "↑ Cao"), không chỉ dùng màu.
- Màu trạng thái **giống nhau ở chế độ sáng và tối**; chỉ màu chữ được làm sáng hơn trên nền tối.

## 5. Màu phân loại
11 cặp màu của web-emr (nền nhạt + chữ đậm) cho **danh mục**: khoa, loại dịch vụ, gói khám, nhóm khách hàng. Không
dùng cho trạng thái. Dùng block `CategoryTag`: mỗi danh mục một màu, giống nhau trên mọi màn hình.

| Màu | Nền | Chữ | Tương phản | Ghi chú |
|---|---|---|---|---|
| blue | `#caf2ff` | `#006d91` | 4,9:1 | nguyên web-emr |
| cyan | `#b3e5e3` | `#116a6a` | 4,6:1 | chữ đậm hơn `#158484` (3,3:1) |
| green | `#a2e5a7` | `#156743` | 4,7:1 | chữ đậm hơn `#1a8054` (3,4:1) |
| navy | `#c2e3ff` | `#283d89` | 7,4:1 | nguyên web-emr |
| orange | `#ffe9ce` | `#9e5704` | 4,7:1 | chữ đậm hơn `#da7805` (2,7:1) |
| pink | `#ffc7fd` | `#ad0391` | 4,6:1 | chữ đậm hơn `#b70399` (4,3:1) |
| red | `#fec9d4` | `#ba0c31` | 4,6:1 | chữ đậm hơn `#f23059` (2,7:1) |
| violet | `#f4e6ff` | `#9518fb` | 4,6:1 | nguyên web-emr |
| yellow | `#f8f29f` | `#906300` | 4,6:1 | chữ đậm hơn `#9f6d00` (3,9:1) |
| brown | `#dbbdbe` | `#772a2a` | 5,6:1 | nguyên web-emr |
| gray | `#f3f3f3` | `#5c5c5c` | 6,0:1 | nguyên web-emr |

Class: `bg-tag-<màu>` + `text-tag-<màu>-foreground`. Ở chế độ tối: nền là màu đậm pha trong suốt 28%, chữ là màu nhạt.

## 6. Biểu đồ
`chart-1…5` theo thứ tự trạng thái của web-emr: thương hiệu `#38a696` → đang duyệt `#3b9bf3` → hoàn thành `#36b37e` →
chờ `#ffb762` → thiếu `#ff5075`. Chuỗi số liệu chính dùng `chart-1`, chuỗi so sánh dùng `muted-foreground` hoặc nét đứt.
Biểu đồ theo trạng thái thì dùng đúng màu của trạng thái đó. Biểu đồ theo danh mục (hơn 5 nhóm) dùng màu phân loại, cùng
màu với `CategoryTag` của danh mục đó. Luôn có chú thích hoặc nhãn trực tiếp.

## 7. Chữ
Roboto Variable cho mọi chữ, kể cả tiêu đề (tự host bằng `@fontsource-variable/roboto`, chạy được khi không có mạng ngoài).

| Vai trò | Class | Cỡ / dòng | Độ đậm |
|---|---|---|---|
| Tiêu đề trang | `text-2xl font-semibold tracking-tight` | 24/32 | 600 |
| Tiêu đề khu vực | `text-lg font-semibold` | 18/28 | 600 |
| Tiêu đề thẻ | `text-base font-semibold` | 16/24 | 600 |
| Chữ thường, ô nhập, bảng | `text-sm` | 14/20 | 400 |
| Nhãn trường | `text-sm font-medium` | 14/20 | 500 |
| Chú thích, nhãn phụ | `text-xs text-muted-foreground` | 12/16 | 400 |
| Số KPI | `text-2xl` đến `text-3xl font-semibold tabular-nums` | 24–30 | 600 |

Số trong bảng và KPI luôn `tabular-nums`. Đoạn văn dài tối đa khoảng 80 ký tự mỗi dòng. Không viết hoa toàn bộ.

## 8. Khoảng cách, bố cục, kích thước
- Bước 4px theo thang Tailwind. Thẻ và panel `p-5` hoặc `p-6`; khoảng giữa các thẻ `gap-4` đến `gap-6`; giữa các khu
  vực `space-y-6` đến `space-y-8`.
- Bảng: dòng 40–48px. Ô nhập và nút: cao 32px (`h-8`, mặc định của primitive). Ở quầy dùng máy tính bảng, vùng chạm
  tối thiểu 44px.
- Trang xếp thành các dải ngang, mỗi dải chứa một loại khối có chiều cao tương đương. Không đặt một khối cao cạnh các
  thẻ thấp.
- Điểm ngắt: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536, `3xl` 1600, `4xl` 2000. Kiểm tra ở 1440, 768 và 390;
  ở 390, bảng chuyển thành danh sách xếp chồng.

## 9. Bo góc, viền, đổ bóng
- `--radius` 0.625rem (10px): thẻ, dialog `rounded-xl`; nút, ô nhập `rounded-lg` hoặc `rounded-md`; badge bo tròn hẳn.
- Phân lớp bằng nền (`background` → `card`) và viền `border`, không dùng đổ bóng đậm. Ô nhập `shadow-xs`, dialog và
  popover `shadow-lg`.

## 10. Icon
`lucide-react`. Cỡ 16px (`size-4`) trong nút và dòng chữ, 20px ở tiêu đề. Icon luôn đi kèm chữ; nút chỉ có icon thì
phải có `aria-label` hoặc chữ ẩn (`sr-only`). Một nghĩa, một icon trên mọi app: in → `Printer`, xuất → `Download`,
sửa → `Pencil`, xoá → `Trash2`, thao tác khác → `Ellipsis`.

## 11. Thành phần và cách dùng
| Nhu cầu | Dùng | Không dùng |
|---|---|---|
| Hành động chính của màn hình (tối đa 1) | `Button` (mặc định) | nhiều nút màu chính cạnh nhau |
| Hành động phụ | `Button variant="outline"` / `"ghost"` | — |
| Xoá, huỷ | `Button variant="destructive"` + `ConfirmDialog` | xoá không hỏi lại |
| Trạng thái | `StatusBadge` + `defineStatuses` | `Badge` tự chọn màu, chữ tô màu trạng thái |
| Danh mục | `CategoryTag` | màu trạng thái cho danh mục |
| Danh sách bản ghi | `DataTable` + `RowActionsMenu` | `div` giả bảng |
| Form | `Field`, `FieldLabel` + `RequiredMark`, `Form` (react-hook-form + zod) | nhãn tự viết |
| Ngày, giờ | `DatePicker`/`DatePickerInput` (dd/mm/yyyy), `TimeInput` (HH:mm 24h) | `input type="date"`/`"time"` gốc |
| Chế độ xem | `ReadonlyField` | `input readOnly` |
| Lỗi một phần trang | `RetryAlert` | toast cho lỗi cần thử lại |
| Không có dữ liệu | `Empty` | khoảng trắng |
| Giải thích ngắn | `InfoHint` | chữ phụ dài trên màn hình |

## 12. Nội dung và định dạng
- Tiếng Việt, câu ngắn, nói thẳng việc cần làm. Nhãn viết hoa chữ đầu câu ("Ngày khám", không phải "Ngày Khám").
- Nút là động từ nói rõ kết quả: "Lưu", "Xoá hồ sơ", "Gửi duyệt". Hộp xác nhận nói rõ hậu quả ("Nội dung chưa lưu sẽ mất").
- Định dạng vi-VN qua `src/lib/format.ts`: `1.250.000 ₫`, `12,8%`, `23/10/2026`, `14:30`, thời lượng bằng chữ
  (`1 giờ 35 phút`). Không in ngày ISO hay `toFixed()` thô.
- Mã định danh (mã hồ sơ, BHYT) dùng font thường với `tabular-nums`; không cắt ngắn mã.

## 13. Tiếp cận
- Chữ 4,5:1, chữ lớn 3:1, viền và icon có nghĩa 3:1. Mọi cặp màu trong tài liệu này đã được đo.
- Mọi thành phần tương tác có focus nhìn thấy được (`focus-visible:ring`), kể cả dòng và thẻ bấm được.
- Không truyền thông tin chỉ bằng màu; trạng thái luôn có chữ.
- `aura verify` đo tương phản và kiểm tra bố cục trên trang thật trước khi báo xong.

## 14. Quản lý thay đổi
- **turbo-web là nguồn chuẩn.** Đổi token: sửa `tooling/tailwind/theme.css` trong một MR, rồi `node scripts/sync-turbo.mjs`
  để chép sang medviet-ui-ux. Token v1 hiện nằm trong khối bổ sung; khi turbo-web nhận bản vá
  `upstream/turbo-web-theme-v1.patch` thì xoá khối đó.
- Component mới dùng chung: thêm vào `@medviet/ui` (primitive) hoặc block khi đã có 2 app cùng cần.
- **Nhận diện chính thức:** khi MedViet có bộ nhận diện hoặc Figma, thay `brand` và `primary` theo đó, đo lại tương
  phản và nâng lên v2.

**Chưa xử lý trong v1:**
- Vòng focus `#bae6df` chỉ đạt khoảng 1,3:1 so với nền. Cần phương án đạt 3:1 mà vẫn nhẹ nhàng.
- Bảng màu biểu đồ chưa được kiểm tra với người mù màu.
- Chưa có quy chuẩn chuyển động và quy chuẩn cho in ấn ngoài khổ A4.

## 15. Theme và token component
Màu, cỡ chữ, chiều cao control, bo góc, nền nút, đầu bảng… đều là **token của design system**. Primitive chỉ đọc
token, không gắn cứng giá trị nào. Một theme là một bộ giá trị cho cùng các token đó.

| Theme | Bật bằng | Dùng khi |
|---|---|---|
| **DS v1** (mặc định) | không cần gì | app mới, màn hình mới: chuẩn MedViet, đạt tương phản AA |
| **EMR** | `<html data-theme="emr">` (xem thử: `?ds=emr`) | màn hình phải nhìn giống hệt web-emr: chuyển màn EMR sang, hoặc app chạy cạnh EMR |

Theme EMR (`template/src/themes/emr.css`) lấy mọi giá trị từ web-emr: `root.css`, `app.scss`, theme antd trong
`ProviderAntd` và SCSS của `libs/cake`. Nó giữ cả những gì web-emr đang có, kể cả nút chính `#38a696` với chữ trắng chỉ
đạt 2,97:1. Vì vậy chỉ dùng theme EMR khi cần giống EMR; màn hình mới dùng DS v1.

**Nhóm token component** (giá trị DS v1 → EMR):

| Nhóm | Token | DS v1 | EMR |
|---|---|---|---|
| Control | `--control-height`, `--control-font-size`, `--control-radius`, `--control-border-width`, `--control-placeholder` | 32px, 14px, 8px, 1px, muted | 24px, 12px, 5px, 0,5px, `#586983` |
| Nhãn | `--label-font-size`, `--label-font-weight`, `--required-color` | 14px, 500, `destructive-text` | 12px, 400, `#ff5075` (`*` chỉ số trên) |
| Checkbox | `--check-size`, `--check-border-width`, `--check-checked-bg/fg`, `--check-label-on` | 16px, 1px, tô kín | 16px, 2px, ô trắng tick teal, nhãn teal |
| Nút | `--button-height`, `--button-font-size/weight`, `--button-<intent>-bg/fg` | 32px, 14/500, màu phẳng | 24px, 12/600, gradient EMR |
| Bảng | `--table-header-bg/fg`, `--table-font-size`, `--table-cell-padding-*`, `--table-row-hover/selected`, `--table-align` | nền surface, 14px, trái | teal + chữ trắng, 12px, đệm 4px, giữa |
| Tab | `--tab-bg`, `--tab-active-bg/fg`, `--tab-radius`, `--tab-line` | muted, thẻ trắng | `#f3f3f3`, thẻ trắng chữ teal, 8px |
| Switch | `--switch-width/height/knob`, `--switch-track(-on)`, `--switch-border` | 32 × 18 | 40 × 20, viền 2px |
| Hộp thoại | `--dialog-radius`, `--dialog-border`, `--dialog-padding`, `--dialog-overlay(-blur)`, `--dialog-title-*` | đen 10% có blur, tiêu đề trái | teal 20% không blur, tiêu đề giữa `#1d535d` |
| Tiêu đề khu vực | `--section-title-size/weight/color` | 18px, 600, foreground | 16px, 700, teal |

**Primitive dùng token** (`template/src/components/blocks`), dựng lại theo chức năng của `libs/cake` trong web-emr:
`TextField`, `DateField`, `DatePickerField`, `DateRangeField`, `SelectField`, `AutocompleteField`, `PhoneField`,
`MaskedField`, `TextAreaField`, `SearchField`, `CheckboxGroup` / `RadioList`, `CheckboxField`, `SwitchField`,
`ActionButton` (nhận cả 29 tên `btnType` của EMR), `GridTable`, `SectionTitle`, `TabBar`, `DialogFrame`, `ExpandableText`,
`ControlField` / `ControlLabel`. Danh mục ghi kèm tên component EMR tương ứng, nên `aura find "ModalPro"` hay
`aura find "CheckGroup"` đều ra primitive đúng.

Thêm token: khai báo giá trị DS v1 trong khối "component tokens" của `index.css` (đăng ký màu trong `@theme inline`),
rồi khai báo giá trị cho từng theme. Theme mới: thêm `template/src/themes/<tên>.css` với selector `:root[data-theme="<tên>"]`.

## Thay đổi
- **v1.1 (27/10/2026):**
  - thêm token component và theme EMR;
  - thêm 20 primitive dùng token, dựng lại theo `libs/cake` của web-emr (chức năng giống EMR, giao diện theo theme).
- **v1.0 (27/10/2026):**
  - lần đầu viết thành văn bản;
  - `primary` đổi sang `#287a6f`, thêm `brand`, `accent-foreground` dùng `primary`;
  - thêm chữ trạng thái (`*-text`), 11 cặp màu phân loại, `readonly` và `disabled`;
  - `StatusBadge` dùng chữ đạt chuẩn, thêm block `CategoryTag`.
