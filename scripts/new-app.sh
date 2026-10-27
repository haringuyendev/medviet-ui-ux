#!/usr/bin/env bash
# Copy the MedViet starter into a new directory and install dependencies (kept for older docs: medviet-ui-ux new does the work).
# Usage: new-app.sh <target-dir> [app-name]
set -euo pipefail
target="${1:?usage: new-app.sh <target-dir> [app-name]}"
exec node "$(cd "$(dirname "$0")/.." && pwd)/manager/medviet-ui-ux.mjs" new "$target" ${2:+--name "$2"}
