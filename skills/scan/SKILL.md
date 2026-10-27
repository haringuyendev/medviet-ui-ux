---
name: scan
description: Refresh and inspect the medviet-ui-ux registry of a project - full rescan, status summary, what changed since the last scan, and resetting the baseline of accepted findings. Use when the user asks to rescan, sync or refresh medviet-ui-ux, asks what components or tokens the project has overall, after large refactors, branch switches or merges, or to accept current findings as the new baseline.
---

# medviet-ui-ux scan

> `node` not found ("command not found", "not recognized")? Run the `medviet-ui-ux:setup` skill first: it installs Node.js for the user, no admin rights needed.

Run from the repo root (it has `.medviet-ui-ux/`; if not, use the `medviet-ui-ux:init` skill). Prefer the vendored CLI
`node .medviet-ui-ux/bin/medviet-ui-ux.mjs`, or `npm run medviet-ui-ux --` when the npm script exists.

| Need | Command |
|---|---|
| Summary of the design system and components (what agents get at session start) | `node .medviet-ui-ux/bin/medviet-ui-ux.mjs status` |
| Full rescan (after a big refactor, branch switch, merge, or if results look stale) | `node .medviet-ui-ux/bin/medviet-ui-ux.mjs scan` |
| Colors, fonts, radius, status tokens and which are text-safe | `node .medviet-ui-ux/bin/medviet-ui-ux.mjs tokens` |
| What medviet-ui-ux couldn't detect here, and the rules.json key that fixes it | `node .medviet-ui-ux/bin/medviet-ui-ux.mjs doctor` |
| Findings per rule (new vs existing) and the files with the most | `node .medviet-ui-ux/bin/medviet-ui-ux.mjs stats` |
| Accept the current findings as existing (hooks then block only new ones) | `node .medviet-ui-ux/bin/medviet-ui-ux.mjs baseline` |

Notes:
- Every medviet-ui-ux command already refreshes incrementally (by file mtime/size): added, deleted and moved
  components are picked up without a scan. `scan` forces a full re-read, including tokens.
- `status` and `scan` print "Changes since last scan: +added −removed ~updated moved". Report removals
  that other code still imports (check with `medviet-ui-ux usage <Name>` before deleting a component).
- Reset the baseline only when the user agrees the current findings are accepted debt; otherwise fix them
  (see the `medviet-ui-ux:check` skill).
- If the summary shows components "without a description", offer the `medviet-ui-ux:describe` skill.
