#!/usr/bin/env bash
# Installs the native (GSD-free) Claude Code statusline:
# model | current task | directory | context usage bar | git branch | 5h/7d rate limits
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/ub1789/cto-toolbox/main/install-statusline.sh | bash
#
# Runtime requirements (checked and reported, not installed for you):
#   node — runs the hook script itself
#   jq   — parses git branch / rate-limit fields in the statusLine command
#   git  — for the branch display

set -euo pipefail

CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
HOOKS_DIR="$CLAUDE_DIR/hooks"
SETTINGS_PATH="$CLAUDE_DIR/settings.json"
BACKUP_DIR="$CLAUDE_DIR/statusline-backup-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$HOOKS_DIR"

backup_if_needed() {
  local dest="$1"
  if [[ -f "$dest" ]]; then
    mkdir -p "$BACKUP_DIR"
    cp "$dest" "$BACKUP_DIR/$(basename "$dest")"
  fi
}

backup_if_needed "$HOOKS_DIR/statusline.js"
cat > "$HOOKS_DIR/statusline.js" <<'STATUSLINE_JS_EOF'
#!/usr/bin/env node
// Claude Code Statusline (native, no GSD dependency)
// Shows: model | current task | directory | context usage

const fs = require('fs');
const path = require('path');
const os = require('os');

function runStatusline() {
  let input = '';
  // Timeout guard: if stdin doesn't close within 3s (e.g. pipe issues on
  // Windows/Git Bash), exit silently instead of hanging.
  const stdinTimeout = setTimeout(() => process.exit(0), 3000);
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => input += chunk);
  process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  try {
    const data = JSON.parse(input);
    const model = data.model?.display_name || 'Claude';
    const dir = data.workspace?.current_dir || process.cwd();
    const session = data.session_id || '';
    const remaining = data.context_window?.remaining_percentage;

    const totalCtx = data.context_window?.total_tokens || 1_000_000;
    const acw = parseInt(process.env.CLAUDE_CODE_AUTO_COMPACT_WINDOW || '0', 10);
    const AUTO_COMPACT_BUFFER_PCT = acw > 0
      ? Math.min(100, (acw / totalCtx) * 100)
      : 16.5;
    let ctx = '';
    if (remaining != null) {
      const usableRemaining = Math.max(0, ((remaining - AUTO_COMPACT_BUFFER_PCT) / (100 - AUTO_COMPACT_BUFFER_PCT)) * 100);
      const used = Math.max(0, Math.min(100, Math.round(100 - usableRemaining)));

      const filled = Math.floor(used / 10);
      const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);

      if (used < 50) {
        ctx = ` \x1b[32m${bar} ${used}%\x1b[0m`;
      } else if (used < 65) {
        ctx = ` \x1b[33m${bar} ${used}%\x1b[0m`;
      } else if (used < 80) {
        ctx = ` \x1b[38;5;208m${bar} ${used}%\x1b[0m`;
      } else {
        ctx = ` \x1b[5;31m💀 ${bar} ${used}%\x1b[0m`;
      }
    }

    let task = '';
    const homeDir = os.homedir();
    const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(homeDir, '.claude');
    const todosDir = path.join(claudeDir, 'todos');
    if (session && fs.existsSync(todosDir)) {
      try {
        const files = fs.readdirSync(todosDir)
          .filter(f => f.startsWith(session) && f.includes('-agent-') && f.endsWith('.json'))
          .map(f => ({ name: f, mtime: fs.statSync(path.join(todosDir, f)).mtime }))
          .sort((a, b) => b.mtime - a.mtime);

        if (files.length > 0) {
          try {
            const todos = JSON.parse(fs.readFileSync(path.join(todosDir, files[0].name), 'utf8'));
            const inProgress = todos.find(t => t.status === 'in_progress');
            if (inProgress) task = inProgress.activeForm || '';
          } catch (e) {}
        }
      } catch (e) {}
    }

    const dirname = path.basename(dir);
    const middle = task ? `\x1b[1m${task}\x1b[0m` : null;

    if (middle) {
      process.stdout.write(`\x1b[2m${model}\x1b[0m │ ${middle} │ \x1b[2m${dirname}\x1b[0m${ctx}`);
    } else {
      process.stdout.write(`\x1b[2m${model}\x1b[0m │ \x1b[2m${dirname}\x1b[0m${ctx}`);
    }
  } catch (e) {}
});
}

module.exports = { runStatusline };

if (require.main === module) runStatusline();
STATUSLINE_JS_EOF

echo "Installed: $HOOKS_DIR/statusline.js"

STATUSLINE_CMD=$(cat <<'CMD_EOF'
input=$(cat); base=$(printf '%s' "$input" | node "$HOME/.claude/hooks/statusline.js"); d=$(printf '%s' "$input" | jq -r '.workspace.current_dir // .cwd // "."'); b=$(git --no-optional-locks -C "$d" branch --show-current 2>/dev/null); f=$(printf '%s' "$input" | jq -r '.rate_limits.five_hour.used_percentage // empty'); w=$(printf '%s' "$input" | jq -r '.rate_limits.seven_day.used_percentage // empty'); printf '%s' "$base"; [ -n "$b" ] && printf ' \033[2m| %s\033[0m' "$b"; [ -n "$f" ] && printf ' \033[2m| 5h %.0f%%\033[0m' "$f"; [ -n "$w" ] && printf ' \033[2m 7d %.0f%%\033[0m' "$w"; true
CMD_EOF
)
export STATUSLINE_CMD SETTINGS_PATH

backup_if_needed "$SETTINGS_PATH"

if command -v node >/dev/null 2>&1; then
  MERGE_SCRIPT="$(mktemp "${TMPDIR:-/tmp}/statusline-merge.XXXXXX").cjs"
  cat > "$MERGE_SCRIPT" <<'NODE_EOF'
const fs = require('fs');
const p = process.env.SETTINGS_PATH;
let cur = {};
try { cur = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) {}
cur.statusLine = { type: 'command', command: process.env.STATUSLINE_CMD };
fs.writeFileSync(p, JSON.stringify(cur, null, 2) + '\n');
NODE_EOF
  node "$MERGE_SCRIPT"
  rm -f "$MERGE_SCRIPT"
  echo "Merged statusLine into $SETTINGS_PATH (via node)"
elif command -v python3 >/dev/null 2>&1; then
  MERGE_SCRIPT="$(mktemp "${TMPDIR:-/tmp}/statusline-merge.XXXXXX").py"
  cat > "$MERGE_SCRIPT" <<'PY_EOF'
import json, os
p = os.environ['SETTINGS_PATH']
try:
    with open(p) as f:
        cur = json.load(f)
except Exception:
    cur = {}
cur['statusLine'] = {'type': 'command', 'command': os.environ['STATUSLINE_CMD']}
with open(p, 'w') as f:
    json.dump(cur, f, indent=2)
    f.write('\n')
PY_EOF
  python3 "$MERGE_SCRIPT"
  rm -f "$MERGE_SCRIPT"
  echo "Merged statusLine into $SETTINGS_PATH (via python3)"
else
  ESCAPED_CMD=$(printf '%s' "$STATUSLINE_CMD" | sed 's/\\/\\\\/g; s/"/\\"/g')
  echo
  echo "Neither node nor python3 found on PATH — could not auto-merge settings.json."
  echo "Add this manually as a top-level key in $SETTINGS_PATH:"
  echo
  printf '  "statusLine": {\n    "type": "command",\n    "command": "%s"\n  }\n' "$ESCAPED_CMD"
fi

echo
MISSING=()
command -v node >/dev/null 2>&1 || MISSING+=("node")
command -v jq >/dev/null 2>&1 || MISSING+=("jq")
command -v git >/dev/null 2>&1 || MISSING+=("git")

if [ ${#MISSING[@]} -gt 0 ]; then
  echo "Config installed, but missing at runtime: ${MISSING[*]}"
  echo "Install via Homebrew: brew install ${MISSING[*]}"
else
  echo "All runtime dependencies present (node, jq, git)."
fi

if [[ -d "$BACKUP_DIR" ]]; then echo; echo "Existing files backed up to: $BACKUP_DIR"; fi
echo
echo "Restart Claude Code to see the new statusline."
