#!/usr/bin/env bash
# CTO Toolbox installer — bootstraps agents, skills, commands, and templates.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/ub1789/cto-toolbox/main/install.sh | bash
#
# Requires: git, node (>=18), npm

set -euo pipefail

REPO_URL="https://github.com/ub1789/cto-toolbox.git"

for bin in git node npm; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    echo "Error: $bin is required but not installed. Install it and re-run this script." >&2
    exit 1
  fi
done

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Error: Node.js 18+ required (found $(node -v))." >&2
  exit 1
fi

WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

echo "Cloning CTO Toolbox..."
git clone --depth 1 "$REPO_URL" "$WORK_DIR" --quiet

cd "$WORK_DIR"

echo "Installing dependencies..."
npm install --silent

echo "Building..."
npm run build --silent

echo
node bin/cto-toolbox.js install "$@"
