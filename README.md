# 🛠️ CTO Toolbox

The **CTO Toolbox** is a professional distribution system for the UB Labs agent and skill ecosystem. It allows you to bootstrap your Claude Code environment with high-integrity "P0" and "RepoLens" agents, ensuring your projects meet the 100/100 readiness standard.

## 🚀 Quick Start

The fastest way to install is via `npx`:

```bash
npx @ublabs/cto-toolbox install
```

### What this does:
1. **Deploys Agents**: Copies P0 and RepoLens agent definitions to `~/.claude/agents/`.
2. **Deploys Templates**: Sets up project boilerplate (BIBLE.md, PROGRESS.md, etc.) in `~/cto-toolbox/templates/`.
3. **Configures Environment**: Merges recommended settings into `~/.claude/settings.json` for optimal performance.

## 🛠️ Available Commands

| Command | Description |
| :--- | :--- |
| `install` | Performs a full environment setup. |
| `update` | Updates agents and templates to the latest version using SHA-256 checksums. |
| `list` | Audits currently installed toolbox assets. |

## 📚 The Ecosystem

### 🛡️ P0 Setup
Designed for high-integrity delivery. Use agents like `p0-planner`, `p0-executor`, and `p0-verifier` to move from idea to production without shipping technical debt.

### 🔍 RepoLens Setup
Designed for codebase intelligence. Use `repolens-crawler` to extract a Knowledge Base (KB) from existing code and `repolens-ba-writer` to generate professional PRDs.

## ⚙️ Configuration
By default, templates are installed to `~/cto-toolbox/templates`. You can change this using the `-t` flag:

```bash
npx @ublabs/cto-toolbox install -t /your/custom/path
```

## 🛠️ Development
To contribute or modify the toolbox:
1. Clone this repo.
2. Run `npm install`.
3. Run `npm run build`.
4. Test locally using `./bin/cto-toolbox.js install`.
