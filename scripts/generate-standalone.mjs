#!/usr/bin/env node
// Generates install-cto-toolbox.sh: a single, dependency-free bash script
// that embeds every asset file via heredocs. Run after any change under
// assets/ to keep the generated script in sync:
//   node scripts/generate-standalone.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const OUT_FILE = path.join(ROOT, 'install-cto-toolbox.sh');

const TARGETS = [
  { src: path.join(ASSETS, 'agents'), destVar: 'AGENTS_DIR', label: 'agents' },
  { src: path.join(ASSETS, 'skills'), destVar: 'SKILLS_DIR', label: 'skills' },
  { src: path.join(ASSETS, 'commands'), destVar: 'COMMANDS_DIR', label: 'commands' },
  { src: path.join(ASSETS, 'templates'), destVar: 'TEMPLATES_DIR', label: 'templates' },
];

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

let counter = 0;
const chunks = [];
const countsByLabel = {};

for (const { src, destVar, label } of TARGETS) {
  const files = walk(src).sort();
  countsByLabel[label] = files.length;

  for (const file of files) {
    const rel = path.relative(src, file);
    const destExpr = `"$${destVar}/${rel}"`;
    const content = fs.readFileSync(file, 'utf8');
    counter += 1;
    const delim = `CTO_EOF_${counter}`;

    chunks.push(
      `mkdir -p "$(dirname ${destExpr})"`,
      `backup_if_needed ${destExpr}`,
      `cat > ${destExpr} <<'${delim}'`,
      content.replace(/\n$/, ''),
      delim,
      ''
    );
  }
}

const header = `#!/usr/bin/env bash
# CTO Toolbox installer (generated, do not edit by hand).
# Regenerate with: node scripts/generate-standalone.mjs
#
# Fully self-contained: every asset is embedded below. Needs only bash.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/ub1789/cto-toolbox/main/install-cto-toolbox.sh | bash

set -euo pipefail

AGENTS_DIR="\${CLAUDE_AGENTS_DIR:-$HOME/.claude/agents}"
SKILLS_DIR="\${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
COMMANDS_DIR="\${CLAUDE_COMMANDS_DIR:-$HOME/.claude/commands}"
TEMPLATES_DIR="\${CTO_TEMPLATES_DIR:-$HOME/cto-toolbox/templates}"
BACKUP_DIR="$HOME/.claude/cto-toolbox-backup-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$AGENTS_DIR" "$SKILLS_DIR" "$COMMANDS_DIR" "$TEMPLATES_DIR"

backup_if_needed() {
  local dest="$1"
  if [[ -f "$dest" ]]; then
    local rel="\${dest#$HOME/}"
    mkdir -p "$BACKUP_DIR/$(dirname "$rel")"
    cp "$dest" "$BACKUP_DIR/$rel"
  fi
}

`;

const footer = `
echo
echo "=============================================="
echo " CTO Toolbox installation complete"
echo "=============================================="
echo "Agents:    $AGENTS_DIR (${countsByLabel.agents} files)"
echo "Skills:    $SKILLS_DIR (${countsByLabel.skills} files)"
echo "Commands:  $COMMANDS_DIR (${countsByLabel.commands} files)"
echo "Templates: $TEMPLATES_DIR (${countsByLabel.templates} files)"
if [[ -d "$BACKUP_DIR" ]]; then echo; echo "Existing files backed up to: $BACKUP_DIR"; fi
echo
echo "Restart Claude Code, then type / to see the new agents and commands."
`;

fs.writeFileSync(OUT_FILE, header + chunks.join('\n') + footer);
fs.chmodSync(OUT_FILE, 0o755);

console.log(`Generated ${OUT_FILE}`);
console.log(countsByLabel);
