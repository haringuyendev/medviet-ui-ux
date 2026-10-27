---
name: studio
description: Open medviet-ui-ux Studio, a local Lovable-style page for the project - chat on the left (each message runs Claude Code in the repo, with medviet-ui-ux's skills and hooks), the live dev server on the right with 1440/768/390 frames, Approve/Decline buttons for new primitives. Use when the user asks for a Lovable-like page, a chat UI to edit the app, a visual editor, or to "open studio" / "medviet-ui-ux studio".
---

# medviet-ui-ux Studio

> `node` not found ("command not found", "not recognized")? Run the `medviet-ui-ux:setup` skill first: it installs Node.js for the user, no admin rights needed.

```bash
node .medviet-ui-ux/bin/medviet-ui-ux.mjs studio                 # http://localhost:4400, opens the browser
node .medviet-ui-ux/bin/medviet-ui-ux.mjs studio --app apps/web  # monorepo: which app the preview shows first (switchable on the page)
node .medviet-ui-ux/bin/medviet-ui-ux.mjs studio --port 4500 --model sonnet --no-open
```
Start it in the background (it is a server: it keeps running until Ctrl+C) and give the user the URL.
It needs the `claude` CLI on PATH, logged in. An existing project needs `.medviet-ui-ux/` first (the `medviet-ui-ux:init` skill).

A brand-new app: run it from the plugin in an empty folder, or name the folder to create:
```bash
node "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" studio                   # in an empty folder
node "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" studio --new lich-kham    # creates ./lich-kham
```
The page opens on "describe your app": it creates the app from the MedViet starter (copy, install, medviet-ui-ux init, git init),
starts the dev server and sends the description as the first message, which builds the first screens.

What it does:
- Each chat message runs `claude -p` in the repo (`--permission-mode auto` by default; `"studio": { "permissionMode", "model", "port" }`
  in `.medviet-ui-ux/rules.json`). Replies stream in; tool steps show as a collapsible list; medviet-ui-ux hook messages show as notes.
  The conversation continues across messages (same Claude session) until the user starts a new one.
- The preview is the app's dev server (found like `medviet-ui-ux verify` finds it). If none is running, the page offers to start
  `<package manager> run dev`, and stops it with Studio.
- A new primitive (`medviet-ui-ux add`, a new file in the primitives folder) can't get a permission prompt headless: the hook denies
  it, Studio shows Approve/Decline, and an approval is recorded in `.medviet-ui-ux/cache/studio-approved.json` so the agent can retry.
- No Playwright in the project: Studio tells the agent to verify with `--skip-inspect` and shows the user an install button.

Attachments: the user can attach files (picker, drag and drop on the chat, pasted screenshots), also on the new-app
screen. They are saved in `.medviet-ui-ux/cache/studio-uploads/` (git-ignored) and the message lists their paths with how to use
them: images as mockups or bug screenshots (rebuild with the project's components and tokens), CSV/JSON as sample data,
PDF/text as requirements, Excel/Word through the xlsx/docx skills. 20MB per file, 10 per message.

Debugging: `.medviet-ui-ux/cache/studio.json` holds the transcript (a new conversation archives the old one in
`.medviet-ui-ux/cache/studio-history/`), `.medviet-ui-ux/cache/studio-last.jsonl` the last turn's raw stream.
