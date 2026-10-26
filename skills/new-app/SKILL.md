---
name: new-app
description: Create a new MedViet app or prototype outside turbo-web from the MedViet starter - turbo-web's stack (React 19 + Vite + TypeScript + Tailwind v4 + @medviet/ui primitives on Base UI + TanStack Query/Table v9 + react-hook-form/zod + zustand + nuqs), the MedViet design system (EMR teal, Roboto, web-emr status colours), MedViet blocks (status badge, time input, row actions, confirm dialog, readonly field, retry alert, KPI stat, form, file upload, stepper…), vi-VN formatters - with the Aura component manager already initialised. Use when the user asks to start, scaffold or prototype a new MedViet app, internal tool, admin panel or dashboard from scratch. Inside turbo-web, apps that ship are created with `bun run gen:app` instead.
---

# MedViet new app

`${CLAUDE_PLUGIN_ROOT}` is the medviet-ui-ux plugin folder (Claude Code fills it in; with other agents, use the folder where the medviet-ui-ux repo is cloned).

```bash
node "${CLAUDE_PLUGIN_ROOT}/manager/aura.mjs" new <target-dir> [--name app-name]
```
It copies `${CLAUDE_PLUGIN_ROOT}/template`, runs `npm install` (needs network or an npm mirror; versions are pinned by the
lockfile), `aura init` and a first git commit. Plain Node, so it works on macOS, Linux and Windows. The target must be
empty or missing. `node` not found: run the `medviet-ui-ux:setup` skill first.

What the app has:
- `src/components/ui/`: the 63 @medviet/ui primitives, copied from turbo-web `packages/ui` (Base UI: use `render`,
  not `asChild`), including `data-table` (TanStack Table v9) and `date-picker` (DatePicker, DatePickerInput,
  DateRangePicker). Keep them as they are: they mirror turbo-web.
- `src/components/blocks/`: the MedViet blocks: status-badge (`defineStatuses`), time-input, row-actions-menu,
  confirm-dialog, readonly-field, retry-alert, info-hint, required-mark, page-header, stat + delta, description-list,
  form (react-hook-form + zod), number-input, file-upload, stepper.
- `src/lib/format.ts`: vi-VN money, numbers, percent, dates, durations. `src/hooks/`: use-is-mobile, use-debounce,
  use-media-query, use-copy-to-clipboard (from `@medviet/hook`).
- `src/index.css`: the turbo-web tokens (light + derived dark), Roboto, Base UI orientation variants.
- `src/App.tsx` (error boundary, query client, tooltip provider, toaster, router, nuqs), `src/pages/Index.tsx`
  placeholder, `NotFound` and `ServerError` pages. Biome with turbo-web's formatter settings (`npm run lint`).
- `.aura/`: registry pre-described from the catalog, so `aura find` works in Vietnamese immediately.

Then build the first screen with the `medviet-ui-ux:build` skill (brief first: who uses it, v1 features; then status
maps, screens). Add-ons, installed on demand (`aura find` prints the command when a need matches): signature-pad,
data-export (Excel/CSV), excel-import, print-sheet (A4), virtual-list, rich-text-editor, file-lightbox
(PDF/Word/Excel/image viewer). `node "${CLAUDE_PLUGIN_ROOT}/scripts/add-block.mjs" list` shows them. Run
`npm run dev` and give the user the URL.

Then offer Aura Studio (the `medviet-ui-ux:studio` skill): a chat + live preview page to keep shaping the app by prompting.
When the user wants to describe the app and watch it being built from the start, skip `aura new` and open Studio in
the empty target folder instead: `node "${CLAUDE_PLUGIN_ROOT}/manager/aura.mjs" studio --new <target-dir>`. Its first
screen asks what the app is for, creates it from the starter (same script), starts the dev server and sends the
description as the first message.
