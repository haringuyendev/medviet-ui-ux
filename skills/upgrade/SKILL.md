---
name: upgrade
description: Bring an app made from the MedViet starter up to the plugin's current template - new and fixed blocks (date fields with a calendar, Excel export/import, PDF viewer, signature pad, CCCD scan, print sheet…), primitives, lib helpers, themes, scripts and the dependencies they need - without overwriting files the team changed. Use when the user asks to update, upgrade or sync an existing app with the new medviet-ui-ux version ("cập nhật app theo bản mới", "app cũ chưa có component mới", "đồng bộ block"), or after the plugin was updated and an app lacks a component the catalog lists.
---

# medviet-ui-ux upgrade

> `node` not found ("command not found", "not recognized")? Run the `medviet-ui-ux:setup` skill first.

Only for apps made from the MedViet starter (they have `src/components/blocks`). In turbo-web, primitives come from
`@medviet/ui` and blocks are copied by hand. Run it from the app's folder with the **plugin's** CLI (it needs the
plugin's `template/`, which the copy in `.medviet-ui-ux/bin` doesn't have):

```
node "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" upgrade --dry-run     # what would change
node "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" upgrade               # apply, then npm install if needed
node "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" upgrade --overwrite src/components/blocks/stat.tsx
```

1. Run `--dry-run` first and tell the user what will be added, updated and kept, in plain words.
2. Apply. The command copies new files and updates the ones the team never changed (it compares with
   `.medviet-ui-ux/template.json`, or for an older app with its first "starter" commit), adds missing dependencies
   and the `postinstall` script, the `.gitignore` and `biome.json` lines the template added, then runs the install.
   Pages, `App.tsx`, `main.tsx` and `index.css` are never touched.
3. **Kept** files differ from the template because the team changed them. Don't overwrite them on your own: show
   the user the difference (`diff` the file with the plugin's `template/<path>`) and use `--overwrite <file>` only if
   they agree, or port the template's fix into their version by hand. A kept file that carries a real improvement
   belongs in the plugin's template too: tell the user.
4. Check: `npx tsc -b`, `npm run lint`, `node .medviet-ui-ux/bin/medviet-ui-ux.mjs check --changed`, and open the
   screens that use updated blocks. Then suggest a commit that includes `.medviet-ui-ux/template.json`.

Without git history or `template.json` every file that differs counts as changed and is kept; that's safe, the user
picks what to take with `--overwrite`.
