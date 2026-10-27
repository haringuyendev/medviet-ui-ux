---
name: build
description: Build or redesign screens for MedViet apps (turbo-web apps, the MedViet starter, internal tools) the same way everywhere - the shared MedViet design system (turbo-web tokens, EMR teal, Roboto, web-emr status colours), screens composed only from @medviet/ui primitives and the MedViet blocks (StatusBadge, TimeInput, RowActionsMenu, ConfirmDialog, ReadonlyField…), purposeful data colour, band layouts for dashboards, vi-VN formatting and a rendered-page self-check with medviet-ui-ux verify. Use when the user asks to create or change a page, screen, dashboard, form, table or prototype in a MedViet app, or says the UI looks generic, cluttered or inconsistent.
hooks:
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: node "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" hook skill-nudge
          once: true
---

# MedViet build: one design system, compose from @medviet/ui and the MedViet blocks

> `node` not found ("command not found", "not recognized")? Run the `medviet-ui-ux:setup` skill first: it installs Node.js for the user, no admin rights needed.

`${CLAUDE_PLUGIN_ROOT}` is the medviet-ui-ux plugin folder (Claude Code fills it in; with other agents, use the folder where the medviet-ui-ux repo is cloned).

## Before building
1. **New app?** Inside turbo-web, an app that ships: `bun run gen:app` (turbo-web's generator), then `medviet-ui-ux init` at
   the monorepo root. A prototype or a standalone tool: the `medviet-ui-ux:new-app` skill (MedViet starter +
   `medviet-ui-ux init`). The starter is turbo-web's stack: React 19 + Vite + TypeScript + Tailwind v4 + @medviet/ui
   primitives (shadcn base-vega on Base UI, copied from `packages/ui`) + lucide + react-router + TanStack Query +
   TanStack Table v9 + react-hook-form/zod + zustand + nuqs + react-error-boundary, the MedViet tokens and Roboto,
   MedViet blocks (`src/components/blocks`) and vi-VN formatters (`src/lib/format.ts`). Don't switch frameworks or
   add another UI library.
   **Form controls and actions:** compose screens from the token-driven primitives in `src/components/blocks`
   (TextField, DateField, DateRangeField, SelectField, AutocompleteField, PhoneField, MaskedField,
   TextAreaField, SearchField, CheckboxGroup/RadioList, CheckboxField, SwitchField, ActionButton, GridTable,
   SectionTitle, TabBar, DialogFrame, ExpandableText). They follow the theme: DS v1 by default, the web-emr look with
   `<html data-theme="emr">` when a screen must match EMR (porting an EMR screen: same component names in the catalog,
   `btnType` works on ActionButton). Don't size or colour a control by hand to look like EMR.
2. **Existing app without `.medviet-ui-ux/`?** Run the `medviet-ui-ux:init` skill first (one-time scan).
3. **Find components with the `medviet-ui-ux:find` skill** (`node .medviet-ui-ux/bin/medviet-ui-ux.mjs find "<need>"`, `snippet`,
   `tokens`) instead of reading component folders. Prefer a block over re-assembling its primitives.
   **A primitive the project lacks** (find says `MISSING PRIMITIVE`): ask the user, and add it with
   `medviet-ui-ux add <name>` only if they agree; otherwise compose from what exists. Never hand-build it from divs.
   For a rich text editor, an A4 print sheet or a very long list in a starter app, `medviet-ui-ux find` prints the
   add-on's install command. Excel export/import and the PDF/Word/Excel viewer are already in the starter.
4. **Start a new page from a scaffold** in an existing project:
   `node .medviet-ui-ux/bin/medviet-ui-ux.mjs scaffold <dashboard|list|detail|form> <path/to/page.tsx> [--name Orders]`. It writes
   the page from the project's own components with the right structure already in place (what needs action
   first, KPI band with exception colors, one `STATUS` map on the project's badge variants, vi-VN number and
   date formats, a table, filters/empty state, a form with field primitives). Wire the route, replace sample
   data and TODO text, keep the structure. A look a primitive lacks (an Item per severity, an accent bar):
   `medviet-ui-ux variant <Component> <name> --write`, never a styled `div`.
5. Agent hooks check every UI edit, including edits made with shell commands. If one blocks you, follow the
   `medviet-ui-ux:check` skill. After creating a component, describe it (`medviet-ui-ux:describe`) so the next agent finds it.
6. **Plan color and emphasis before laying out a screen** (write it down in code, not in your head):
   - **One status map per domain.** Put every status of the domain in one `defineStatuses` map next to its type
     and render it with `StatusBadge` everywhere the status shows. MedViet tones (web-emr palette, see
     `references/design-system.md`): waiting → `warning`, in progress / reviewing → `info`, done → `success`,
     missing / rejected / cancelled → `destructive`, not started / draft → `neutral`. Five statuses in one gray
     outline is a defect (`medviet-ui-ux inspect` reports it).
   - **Pick the key numbers.** Name the 3–5 numbers the user acts on; they get the KPI treatment
     (`text-2xl`–`3xl` semibold tabular-nums), and when one is in exception (overdue, over a limit) its
     value or card takes the status color with the words. Zero states are muted.
   - **Each fact lives in one block.** Decide where each fact is shown (alert list, KPI, detail list)
     before building; a summary block links to the detail, it doesn't repeat it.

## Working in turbo-web
- Primitives come from `@medviet/ui/components/<name>` (`cn` from `@medviet/ui/utils/cn`), hooks from `@medviet/hook/*`.
  `packages/ui` mirrors the shadcn registry: a missing primitive is added there with `bun run ui-add` (after the user
  agrees), not hand-built in an app.
- The MedViet blocks are not in `@medviet/ui` yet: copy the block you need from the starter
  (`${CLAUDE_PLUGIN_ROOT}/template/src/components/blocks/<name>.tsx`) into the app's `src/components/<group>/`,
  rewriting `@/components/ui/x` → `@medviet/ui/components/x` and `@/lib/utils` → `@medviet/ui/utils/cn`. When a second
  app needs it, propose moving it to a shared package (turbo-web rule: promote what 2+ apps use).
- Follow the repo's rules in `.agents/rules/` and its `AGENTS.md`: feature folders, i18n through react-i18next (labels
  of blocks come in as props, so pass `t(...)`), zustand per feature, effects only to sync external systems, list keys
  are ids. Check with `bun run typecheck` and `bun run check` (Biome).

## Working in another existing project
The project's design system wins over the starter:
- **Rule 8 becomes "compose only from the project's components"** (what `medviet-ui-ux find` returns). Never add a
  second UI library or copy starter files in. If a primitive is missing, ask the user and add it with
  `medviet-ui-ux add <name>` (shadcn with the project's `components.json` and package manager), or port an catalog block by rewriting it for the
  project's primitives: Radix-based shadcn uses `asChild`, the starter's Base UI uses `render`; import
  `cn` from the project's path.
- **Tokens are the project's** (`medviet-ui-ux tokens`). If a status, info or chart token is missing or not
  text-safe, add it in the project's token file following its `:root` / dark-selector / `@theme` pattern
  and say so. Don't restyle the brand.
- **Follow its conventions** (listed in the session-start summary): file layout, CMS blocks (e.g. Payload:
  a new section is a new block with config + component, registered where blocks are rendered), routing,
  data fetching, i18n, existing formatting helpers.
- Keep the design rules below (surface type, data color, spacing and layout, vi-VN, the 390/768/1440
  check). Showcase sites may use the project's existing gradients and motion; tools stay restrained.
- Don't refactor or move existing components unless the task needs it; if you do, say what changed.

## Hard rules
1. **The design system is MedViet's, and it is fixed.** All colors, radii and fonts are the turbo-web tokens
   (`tooling/tailwind/theme.css`; inlined in the starter's `src/index.css`). Components only use them:
   `bg-primary`, `text-muted-foreground`, `bg-card`, `border-input`. Don't re-theme an app (no new brand colour,
   font, gradient or radius); a missing token is proposed for turbo-web's `tooling/tailwind` first.
2. **No raw colors in `className`.** Never `text-white`, `bg-black`, `bg-blue-500`, hex or `oklch()`
   in components. If you need a new look, add a token or a variant.
3. **Customize components with variants, not overrides.** A look a primitive lacks is a `cva` variant on that
   primitive (in turbo-web: a PR to `packages/ui`), then `<Alert variant="…">`. Don't stack long override classes at
   the call site. Statuses use the StatusBadge block, not ad-hoc badge classes.
4. **One color format.** The starter uses `oklch()` in `index.css`. Keep every token in that format,
   and reference tokens through Tailwind classes or `var(--token)`; never wrap them in another color
   function.
5. **Check contrast in both modes.** The common bug is white text on a white surface (or dark on
   dark), e.g. light text on shadcn's `outline` button, which is not transparent. Make every variant
   readable on the surface it sits on.
6. **If the user specifies a design, follow it to the letter** (colors, font, layout, reference site).
7. **Format for the user's locale.** Numbers, money, percentages, dates and times go through `Intl`
   with the UI's locale (Vietnamese UI → `vi-VN`: `12,8`, `1.250.000 ₫`, `23/10/2026`); use the helpers
   in `src/lib/format.ts` (formatMoney, formatPercent, formatDuration, formatDate…). Never print
   raw `toFixed()` output or ISO dates. Durations read as words (`2 phút 5 giây`,
   `1 giờ 35 phút`), never `2:05`.
8. **Compose only from the starter's components.** Every card, table, chart, badge, tab, toggle, sheet,
   dialog, tooltip and form control comes from `src/components/ui/` or `src/components/blocks/`
   (charts through `chart.tsx` / recharts). Do not hand-roll an equivalent with raw `div`s or inline `<svg>`. If something is missing,
   add a variant to the closest component or compose existing ones; layout wrappers (grid, flex, spacing)
   are the only free-form markup. A box with rounded corners plus border/shadow/tint and padding is a
   Card or Item, a tinted or left-accented row is an Alert or Item variant, a small rounded label is a Badge:
   the `hand-built-surface` hook rule blocks these when they are styled `div`/`li`/`span`s.
9. **Dates are picked on a calendar.** Every date in a form or a filter bar is `DateField` (one date) or
   `DateRangeField` (từ ngày – đến ngày) from `src/components/blocks`: a calendar to pick from, typing DD/MM/YYYY still
   works. Never a plain `Input`, `type="date"` or a box with a DD/MM/YYYY placeholder (the `date-without-picker` hook
   rule blocks them); `picker={false}` only when the user asks for typing alone.
10. **Excel, file viewing, CCCD, signatures and history are built in.** A table or list of records that users report on gets an `ExportMenu`
   (Xuất Excel .xlsx / CSV) in its toolbar; importing a list uses `readSheet` and `downloadImportTemplate` from
   `src/lib/excel-import` with `FileUpload`; opening an attached PDF, Word, Excel or image uses `FileLightbox`.
   Patient registration reads the CCCD with `CitizenIdScanButton` (reader or camera, fills số CCCD, họ tên, ngày sinh,
   giới tính, địa chỉ) and shows `AgeHint` beside Ngày sinh; a signature is `SignaturePad`; a record's history is
   `ActivityTimeline`. Don't build these by hand or add another library.

## First build of a new app
Before writing code, post a short brief in chat (5–10 lines, no more):
0. **Surface type**: *showcase* (landing page, marketing site, portfolio, consumer onboarding) or
   *tool* (an app someone works in: tables, records, forms, dashboards, back office). This decides
   how much the design may decorate; see "Tool screens" below.
1. **What it evokes**: the mood and the kind of product, and 1–3 well-designed existing products to
   draw from (unless the user named one). For tools, pick products known for clarity, not flair.
2. **v1 features**: the few features this first version will have. Keep it small so the user can
   iterate; make it look good rather than do everything.
3. **Who uses it and where**: role (bác sĩ, điều dưỡng, lễ tân, kế toán, người bệnh), device (desktop at the desk,
   tablet at the counter, phone) and the one task the first screen must make fast. The visual direction is fixed:
   the MedViet design system. Do not build a light/dark switcher unless asked.

Then implement in this order:
1. **Design system**: nothing to set up: the MedViet tokens and Roboto are in place. Read
   `${CLAUDE_PLUGIN_ROOT}/references/design-system.md` once for what each token and status tone means.
2. **Variants and statuses**: the `defineStatuses` maps of the domain, and any primitive variant you are about to use.
3. **Screens**: small, focused components in their own files (`src/components/<feature>/…`); pages in
   `src/pages/`; routes in `src/App.tsx` above the catch-all. Replace the placeholder `Index.tsx`.
   Use realistic sample data in the user's language; never lorem ipsum.
4. **Images**: no placeholder images or gray boxes. Use assets the user gave, a real image you can
   source legitimately, or a layout that doesn't need a photo.

"Less is more" for text and file count unless the user asked for a full landing page or website.

## Tool screens: restraint over wow
On a *showcase*, gradients, glow, motion and bold color sell the product. On a *tool*, the user
comes back every day to find something and act on it, so the design must make **exceptions** loud
and everything else quiet:
- **Color carries data, not decoration.** Surfaces stay neutral (no tinted backgrounds, gradients,
  glows or decorative icon tiles), but the *data* should be colored with intent. A tool that is all
  black and white is as wrong as one that is all gradients:
  - **Deltas and comparisons** are colored by meaning: an arrow/icon in `text-success` when the change is good,
    `text-destructive` when bad (wait time up = bad, revenue up = good), with the number in `text-foreground`;
    muted only when the change is too small to matter. (MedViet's success/warning/info are not text-safe on the
    light ground: colour icons, dots and tints with them, not sentences.)
  - **Values past a threshold** take the status color with words: amber `warning` near a limit, red
    over it (e.g. capacity bars, days of stock, overdue days).
  - **Charts** use the `chart-1…5` palette with confidence: the current series in a solid chart color,
    the comparison series in muted gray or dashed, categories (channels, revenue parts) in distinct
    chart colors used consistently everywhere they appear, with a legend or direct labels.
  - **Status chips** are `StatusBadge`; status-coloured text uses `text-*-text` tokens (`text-success-text`…), never
    `text-success`. **Categories** (khoa, loại dịch vụ) are `CategoryTag` with one tag colour per category.
  - The MedViet Design System v1 (`${CLAUDE_PLUGIN_ROOT}/design/DESIGN.md`) is the reference for colour, type,
    spacing, icons and component usage; `references/design-system.md` is its short version.
  - Brand color marks primary actions, the active selection and key links.
- **Normal is unmarked.** Flag only what needs attention; an "OK/normal/active" value gets no badge,
  pill or tint. If most rows carry a marker, nothing stands out. (This is about status flags; chart
  series and good/bad deltas are still colored.)
- **One signal per fact.** Show an exception once (e.g. colored value *or* badge *or* row tint),
  not three ways at once.
- **Exceptions must be unmistakable.** The one signal you pick uses a status color *and* words or an
  icon, never color alone and never a cryptic code: "↑ Cao", "↓ Thấp", "Quá hạn 3 ngày", not "H"/"L".
- **Every element earns its place.** No charts, avatars or summary cards unless they drive a decision
  the user makes on this screen (on a dashboard, 4–5 KPI cards do; on a record or list screen they
  usually repeat what the list shows). Fields the user rarely needs go to a detail view, not a column.

**Building a dashboard or overview page?** Read `${CLAUDE_PLUGIN_ROOT}/references/dashboard.md` before the brief.

## Spacing and layout
Dense where the user scans many similar items, airy where they read. Cramped is not "efficient".
- **Tables** may be compact (rows 40–48px). Everything else gets room: cards and panels `p-5`–`p-6`,
  gaps between cards `gap-4`–`gap-6`, sections separated by `space-y-6`–`space-y-8`.
- **Lists of sentences** (alerts, insights, activity) use `space-y-3` between items, `leading-relaxed`,
  an icon aligned to the first line, and no divider lines between short items. Each item states the
  fact, then the context or the recommended action ("Tỷ lệ giao trễ 8%, gấp đôi tuần trước. Nên kiểm tra
  kho Bình Dương."). With many items on a wide screen, use two columns.
- **Bands of like content.** Stack the page as full-width rows; each row holds one kind of block
  (summary banner, KPI cards, a chart, a table, a pair of lists) with similar heights. Never put a
  tall block beside short cards; a card that is half empty because its neighbor is tall is a bug.
- **Type scale with clear steps**: page title `text-xl`/`text-2xl` semibold, card titles `text-base`
  semibold, body `text-sm`, captions `text-xs` muted. KPI numbers `text-2xl`–`text-3xl` tabular.
- **Line length** for prose stays under ~80 characters; don't stretch one sentence across 1440px.

## Later requests
- Keep changes small and within the request. No unrequested features, no speculative abstractions.
- Before each change, check whether a token or variant already covers it; extend the design system
  rather than styling one spot.
- Refactor when a file grows large or styles start to repeat.

## Done means
1. The build passes with no type or CSS errors: `npm run build` in a starter app; `bun run typecheck` and
   `bun run check` in turbo-web.
2. The dev server runs (`npm run dev`) and the page loads with no console errors.
   **Run `node .medviet-ui-ux/bin/medviet-ui-ux.mjs verify` and keep fixing until it prints `✓ verified`** (`medviet-ui-ux:inspect`).
   It checks every UI file you changed (also through shell commands), finds the pages that render them
   through imports and the router, opens them at 1440/768/390 and reports layout breaks, KPI emphasis, status
   colors, contrast, repeated content and button problems as text. The Stop hook does not let you finish
   until the files you changed are verified. A page with a parameter needs a real one
   (`medviet-ui-ux verify /orders/123`); pages behind a login need `--storage` or, if they can't be opened,
   `--skip-inspect "<why>"` and you tell the user. A finding that is wrong for the page:
   `--accept <rule> --reason "<why>"` (the user sees the reason). Don't judge screenshots; take one at the end
   only if the user wants to see it. At 390px wide tables become a stacked list and multi-column grids
   collapse to one column. Also tab through the page: every interactive element, including clickable rows and
   cards, shows a visible focus ring (`focus-visible:ring-2 ring-ring`).
3. Grep your new files for raw colors and fix any hit:
   `grep -rnE "(bg|text|border|from|to|via)-(white|black|slate|gray|zinc|neutral|red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|pink|rose)(-[0-9]+)?\b|#[0-9a-fA-F]{3,6}\b" src --include=*.tsx | grep -v components/ui`
4. Tell the user the URL to open. Keep the closing message to a couple of lines.
