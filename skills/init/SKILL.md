---
name: init
description: Set up the medviet-ui-ux component manager in a repository - scan the project's stack, design tokens, components and conventions into .medviet-ui-ux/ (registry, profile, rules, baseline, vendored CLI) and add npm scripts, so agents ask medviet-ui-ux instead of scanning the repo and hooks check component edits. Use when the user asks to install, add or set up medviet-ui-ux in a project, or when a UI task starts in a repo that has no .medviet-ui-ux/ folder.
---

# medviet-ui-ux init

> `node` not found ("command not found", "not recognized")? Run the `medviet-ui-ux:setup` skill first: it installs Node.js for the user, no admin rights needed.

`${CLAUDE_PLUGIN_ROOT}` is the medviet-ui-ux plugin folder (Claude Code fills it in; with other agents, use the folder where the medviet-ui-ux repo is cloned).

## Steps
1. Go to the repository root. **In a monorepo** (package.json `workspaces` or `pnpm-workspace.yaml`), run it
   at the workspace root, not inside a package: one `.medviet-ui-ux/` covers every app and package, the shadcn package
   (e.g. `packages/ui`) is the primitive source, usage is counted across apps, and hooks check every app.
   If `.medviet-ui-ux/registry.json` already exists, re-running only rescans and refreshes `.medviet-ui-ux/bin` (rules and
   baseline are kept); for a plain refresh use the `medviet-ui-ux:scan` skill.
2. Run:
   ```bash
   node "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" init            # add --scripts to also add npm scripts medviet-ui-ux / medviet-ui-ux:check
   ```
   It is read-only on source code. It writes:
   - `.medviet-ui-ux/registry.json`: every component (primitives in `components/ui`, shared components, sections/
     blocks) with exports, props, variants, what it is built on, usage count and where it is used;
     shadcn-style primitives get descriptions from the catalog.
   - `.medviet-ui-ux/profile.json`: stack, UI library, token files and dark selector, colors, fonts, status and
     chart tokens (with contrast), conventions (e.g. Payload blocks).
   - `.medviet-ui-ux/rules.json`: rule severities (`error` blocks the agent, `warn`, `info`, `off`).
   - `.medviet-ui-ux/baseline.json`: findings that already exist, so hooks only block new ones.
   - `.medviet-ui-ux/bin/`: a copy of the CLI, so the team and CI can run it without the plugin.
   - `package.json` is left untouched unless you pass `--scripts` (ask the user first in a shared repo).
3. **Adapt medviet-ui-ux to this repo.** Init ends with "Check these" notes (also `node .medviet-ui-ux/bin/medviet-ui-ux.mjs doctor`):
   what it couldn't detect, each with the fix. Work through them:
   - read the folders or files a note points at to confirm (e.g. where base components really live);
   - set the keys in `.medviet-ui-ux/rules.json` (`primitivesDir`, `tokenFiles`, `allowUiLibraries`), or add a
     missing alias to tsconfig `paths` only if the user agrees to touch project config;
   - run `node .medviet-ui-ux/bin/medviet-ui-ux.mjs scan`, then `doctor` again, until only notes that are true facts about
     the project remain (e.g. "no dark mode").
   What medviet-ui-ux handles on its own: npm/pnpm/yarn/bun workspaces (Turborepo, Nx), tsconfig `paths`/`baseUrl`/
   `extends`, package.json `#imports` and `exports` (including built `dist/` mapped back to `src/`), barrel
   `index.ts` files, shadcn `components.json` (React, Vue, Svelte), a `ui`/`design-system` package, UI
   libraries used directly (antd, MUI, Chakra, Mantine, Headless UI… their components become the
   primitives), Tailwind v3 configs and presets anywhere in the repo, Tailwind v4 `@theme` through `@import`,
   and themes defined in code (createTheme, extendTheme).
4. Report to the user in a few lines, from the printed summary:
   - the stack, UI library, token file, number of components (and packages, in a monorepo);
   - if primitives show `?` or tokens look wrong, set `primitivesDir` / `tokenFiles` in `.medviet-ui-ux/rules.json`
     (see `medviet-ui-ux:check`); if a library the project relies on is reported as foreign, add it to
     `allowUiLibraries`;
   - **findings** worth fixing (undefined tokens, status colors not text-safe, missing info/chart tokens,
     raw colors) and the baseline count;
   - how many components have no description yet; offer the `medviet-ui-ux:describe` skill to fill them.
   - what you set in `rules.json` and why;
5. Tell the user to **commit `.medviet-ui-ux/`** (the cache folder is git-ignored) and, for people who edit code by
   hand, to add `node .medviet-ui-ux/bin/medviet-ui-ux.mjs check --changed` to their pre-commit hook or CI. If init notes a
   leftover per-package `.medviet-ui-ux/` in a monorepo, suggest deleting it.

## After init
- The plugin's hooks are active in this repo: session-start summary, checks after Write/Edit, registry sync
  after Bash, and a stop gate. They stay silent in repos without `.medviet-ui-ux/`.
- Agents use the `medviet-ui-ux:find` skill to pick components and `medviet-ui-ux:check` when a hook blocks.
- Don't edit `registry.json` by hand except through `medviet-ui-ux describe`; it is regenerated from code.
