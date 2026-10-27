---
name: setup
description: Get medviet-ui-ux working on this machine for people who don't know what Node.js is - checks Node.js 20+, npm, git, the Claude Code CLI (for medviet-ui-ux Studio) and Playwright, and installs Node.js itself (official build, no admin rights) when it is missing, on macOS, Windows and Linux, for Claude Desktop (Code tab) and the Claude Code CLI. Use right after installing the medviet-ui-ux plugin, whenever a medviet-ui-ux command or hook fails with "node: command not found" / "node is not recognized", when medviet-ui-ux Studio says claude or npm is missing, or when the user asks whether medviet-ui-ux works on their machine.
---

# medviet-ui-ux setup

Runs on the user's machine only: the Claude Code CLI or the **Code** tab of Claude Desktop (local session). In the Desktop
chat tab or on claude.ai the skill runs in a cloud sandbox: say so in one line and point to the Code tab instead.

Users are often not developers. Talk about what they get ("để medviet-ui-ux chạy được"), not about PATH or runtimes, and keep
each message short. `${CLAUDE_PLUGIN_ROOT}` is the medviet-ui-ux plugin folder.

## 1. Is Node there?
```bash
node "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" setup
```
It works → go to step 3. `node` not found → look for one that is installed but not on PATH:
- macOS / Linux / Git Bash: `sh "${CLAUDE_PLUGIN_ROOT}/scripts/find-node.sh"`
- Windows PowerShell: `powershell -NoProfile -ExecutionPolicy Bypass -File "${CLAUDE_PLUGIN_ROOT}/scripts/find-node.ps1"`

Found (prints a path) → run the report with it: `"<path>" "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" setup`; it prints the
one PATH line to add (step 3). Nothing found → step 2.

## 2. Install Node (missing or older than 20)
Ask once, in plain words, e.g.: *"medviet-ui-ux cần Node.js để chạy (miễn phí, khoảng 50MB, cài vào thư mục riêng của anh,
không cần mật khẩu admin). Em cài luôn nhé?"* On yes:
- macOS / Linux: `sh "${CLAUDE_PLUGIN_ROOT}/scripts/install-node.sh"`
- Windows: `powershell -NoProfile -ExecutionPolicy Bypass -File "${CLAUDE_PLUGIN_ROOT}/scripts/install-node.ps1"`

The script downloads the current LTS from nodejs.org, checks its SHA-256 against nodejs.org's list, installs it in
`~/.medviet-ui-ux/node` (Windows: `%LOCALAPPDATA%\medviet-ui-ux\node`) and adds it to PATH (macOS/Linux: a line in `~/.zprofile` /
`~/.profile`; Windows: the user PATH). It prints the path of `node`. Use that path for the rest of this session
(`"<path>" "${CLAUDE_PLUGIN_ROOT}/manager/medviet-ui-ux.mjs" setup`), because the session started before PATH changed.

Then tell the user the one thing they must do: **quit Claude Desktop completely and open it again** (CLI: open a new
terminal and run `claude` again). medviet-ui-ux's checks start working in the new session.

Download blocked (no network, proxy) → give the link https://nodejs.org (LTS installer) and say to run it, then restart.

## 3. Fix the rest from the report
`✓` ok, `✗` required, `○` optional; each missing item has its command. Ask before running anything that installs or
changes settings.
- **Node not on the session's PATH** (`✗ Node có trong PATH của phiên Claude`): add the line the report prints (with
  the user's OK), then restart Claude Desktop / the terminal.
- **Claude Code CLI** (only for medviet-ui-ux Studio): the official installer, no Node needed. The copy inside Claude Desktop
  can't be started by other programs, so Studio needs it even in Desktop. macOS/Linux:
  `curl -fsSL https://claude.ai/install.sh | bash`; Windows PowerShell: `irm https://claude.ai/install.ps1 | iex`.
- **git**: optional; macOS offers it with `xcode-select --install`, Windows `winget install Git.Git`.
- **Playwright**: optional, per project; Studio has an install button.

## 4. Check it works (after the restart)
In a project with `.medviet-ui-ux/`, ask for a page with a raw `<button>`. medviet-ui-ux should stop it ("medviet-ui-ux blocked this change").
Nothing happens → run step 1 again in that session.

## Where medviet-ui-ux runs
| Where | Works |
|---|---|
| Claude Code CLI (macOS, Linux, Windows) | everything |
| Claude Desktop, Code tab (local session) | everything; Studio also needs the Claude Code CLI |
| Claude Desktop chat tab, claude.ai | not supported: no hooks or local processes |
