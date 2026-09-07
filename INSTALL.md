# Installing the CTO Toolbox

`install-cto-toolbox.sh` sets up the full UB Labs agent ecosystem on your machine in one step. It needs only `bash` — nothing else to install first.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/ub1789/cto-toolbox/main/install-cto-toolbox.sh | bash
```

That's it. Restart Claude Code afterwards, then type `/` to see the new agents and commands.

## What it installs

| Asset | Goes to |
| :--- | :--- |
| Agents (P0 suite, RepoLens suite, `tech-advisor`, `grounding-check`) | `~/.claude/agents/` |
| Skills (`audience-proof-writing`, `fresh-thread`, `overnight-run`, `portfolio-management`) | `~/.claude/skills/` |
| Commands (`repolens-crawl`, `repolens-format`, `repolens-help`, `repolens-inspect`) | `~/.claude/commands/` |
| Templates (BIBLE, PROGRESS, build sequence, rules) | `~/cto-toolbox/templates/` |

## Safe to re-run

Running the script again is safe. If it's about to overwrite a file you already have, it copies the existing version first into a timestamped backup folder:

```
~/.claude/cto-toolbox-backup-<YYYYMMDD-HHMMSS>/
```

Nothing is ever deleted — only backed up before being replaced.

## Custom install locations

Override any destination with an environment variable before running the script:

```bash
CLAUDE_AGENTS_DIR=/custom/agents \
CLAUDE_SKILLS_DIR=/custom/skills \
CLAUDE_COMMANDS_DIR=/custom/commands \
CTO_TEMPLATES_DIR=/custom/templates \
  bash install-cto-toolbox.sh
```

(Omit any you don't want to change — each falls back to its default under `~/.claude/` or `~/cto-toolbox/`.)

## Verifying what got installed

```bash
ls ~/.claude/agents | grep -E '^(p0-|repolens-|tech-advisor|grounding-check)'
ls ~/.claude/skills
ls ~/.claude/commands
ls ~/cto-toolbox/templates
```

## Troubleshooting

- **"command not found: bash"** — you're on a system without bash on `PATH`; install it or run the script with a compatible shell explicitly (`bash install-cto-toolbox.sh` after downloading it).
- **Nothing shows up after restarting Claude Code** — confirm the files actually landed in `~/.claude/agents` and `~/.claude/commands` (see verification commands above), then fully quit and reopen Claude Code rather than just starting a new session.
- **Want to inspect before running it** — download first, read it, then run:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/ub1789/cto-toolbox/main/install-cto-toolbox.sh -o install-cto-toolbox.sh
  less install-cto-toolbox.sh
  bash install-cto-toolbox.sh
  ```

## For an existing npm/Node setup instead

If you already work in a Node environment and want the CLI's `list`/`update` commands as well, see the alternate installer in [README.md](README.md#-quick-start).
