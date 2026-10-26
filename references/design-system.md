# MedViet design system

One design system for every MedViet app. The source of truth is turbo-web: `tooling/tailwind/theme.css` and
`globals.css` (`@medviet/tailwind-config`), with the palette ported from web-emr's `root.css` (the EMR brand). The
starter's `src/index.css` inlines the same tokens so an app runs outside the monorepo; a screen built here renders the
same when it moves into turbo-web.

**Don't re-theme an app.** No per-app brand colour, font or radius. A token that is missing or wrong is fixed in
turbo-web first (a PR to `tooling/tailwind`), then copied here.

## 1. Tokens and what they are for
| Token (class) | Value (web-emr source) | Use |
|---|---|---|
| `background` | #f8f8f9 (body bg) | page ground, slightly tinted so white cards stand out |
| `foreground` | #3d4c63 (--normal) | body text: slate, not black |
| `card`, `popover` | #ffffff | surfaces above the ground: cards, panels, menus, dialogs |
| `primary` / `primary-foreground` | #38a696 teal / white | the brand: main action, selected state, links, focus |
| `accent` / `accent-foreground` | #eefffd / #3e9084 | hover and selected rows/options (the antd hover of web-emr) |
| `secondary`, `muted` | #f3f3f3 | quiet buttons, tags, empty areas |
| `muted-foreground` | #646464 | captions, hints, secondary text |
| `border` | #f0f0f0 | dividers, table lines, card edges |
| `input` | #e3e3e3 | form control borders (a step darker so fields read on the tinted ground) |
| `ring` | #bae6df | focus outline |
| `surface` | #fbfbfb | a third level: toolbars, table headers, code |
| `destructive` | #ff5075 | errors, delete, missing, clinical warnings |
| `success` | #36b37e | done, completed, archived |
| `warning` | #ffb762 | waiting, needs attention |
| `info` | #3b9bf3 | in progress, reviewing, waiting for approval |
| `chart-1…5` | brand → reviewing → completed → waiting → missing | charts, in that order of meaning |
| `sidebar-*`, `selection` | — | app shell and text selection |

Radius: `--radius` 0.625rem (`rounded-lg`); `rounded-md`/`rounded-sm` are 0.8×/0.6× of it. Breakpoints add `3xl` (1600px)
and `4xl` (2000px) for wide monitors at the clinic.

## 2. Status colours (the meaning is shared across apps)
The status palette is web-emr's workflow palette. Map every status of an app onto these tones, the same way everywhere:

| Tone | Meaning | Examples |
|---|---|---|
| `neutral` | not started | Chưa đăng ký, Nháp |
| `info` | in progress / under review | Đang khám, Đang duyệt, Chờ phê duyệt |
| `warning` | waiting / needs attention | Chờ khám, Chờ duyệt, Sắp hết hạn |
| `success` | done | Đã khám, Hoàn thành, Đã lưu trữ |
| `destructive` | missing / rejected / cancelled / unsafe | Thiếu hồ sơ, Bổ sung, Đã huỷ, Dị ứng |

Use the `StatusBadge` block (`defineStatuses` maps an app's status type to tone + label). Status colours are identical
in light and dark mode: a status hue must not change meaning between themes.

**Status colours as text.** On the light ground `success`/`warning`/`info` are below 4.5:1, so don't colour body text
with them. Use a tint plus normal text (`bg-success/10 text-foreground`, which is what StatusBadge does), or a dot/icon in
the status colour next to normal text. `text-destructive` is acceptable for short critical words (an error under a
field, "Dị ứng"). `*-foreground` tokens are the text colour *on* a filled status background (dark `#333` on
success/warning/info, white on destructive).

## 3. Font
Roboto Variable everywhere, headings included (`--font-sans`, `--font-heading`), self-hosted with
`@fontsource-variable/roboto` (clinics may run without outside network). Numbers in tables and KPIs: `tabular-nums`.

## 4. Density and layout
- Clinical screens are dense and read for hours: body `text-sm`, captions `text-xs`, controls at the primitive's default
  height (h-8). Don't enlarge controls for "air".
- Cards (`bg-card`) on the tinted `bg-background`; group with spacing and `Separator`, not nested cards.
- Wide screens: content up to `3xl`/`4xl` breakpoints, tables use the full width.

## 5. Variants instead of overrides
A look that a primitive lacks is a variant on the primitive (cva), not classes on an element:
```tsx
// ❌ <div className="rounded-lg border-l-4 border-l-destructive bg-destructive/5 p-3">…
// ✅ <Alert variant="destructive">…   or a new variant in alert.tsx
```
In turbo-web, `@medviet/ui` mirrors the shadcn registry (added with `bun run ui-add`); a variant added there goes in a
PR to `packages/ui`. Patterns that 2+ apps need (status badge, time input, row actions…) live as blocks in the starter
and are candidates for `@medviet/*`.

## 6. Pitfalls
- Base UI states orientation as `data-orientation="vertical"`: keep the `data-horizontal`/`data-vertical` custom
  variants in `index.css`, or sliders, scrollbars and tabs flatten silently.
- `#root { isolation: isolate }` keeps portaled popups above page content; don't remove it.
- In turbo-web an app's CSS must `@source "../../../packages/ui"` so Tailwind sees the primitives' classes.
- A token used in a component but missing from `@theme inline` produces no class and fails silently; aura check reports
  it (`undefined-token`).
- Dark mode is derived (web-emr has none): neutrals are kept, only brand tokens are retinted. Test both with `?theme=dark`.
