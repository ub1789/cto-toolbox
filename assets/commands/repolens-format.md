Generate a formatted output document from a completed RepoLens knowledge base.

Invoke the `repolens-formatter` agent with the following context:

**Arguments:** $ARGUMENTS

Pass arguments in any order:
- Repo path (absolute) — defaults to current working directory
- Format: `prd`, `wiki`, or `summary` — agent will ask if not specified
- Module ID (e.g. `M03`) — omit to process all modules

Examples:
- `/repolens-format` — agent asks for path and format
- `/repolens-format prd` — generate PRDs for all modules in current repo
- `/repolens-format /path/to/repo wiki M05` — generate wiki doc for module M05 only
- `/repolens-format summary` — single combined summary of the whole codebase

This step is optional. The KB in `.repolens/kb/` is the primary output of `/repolens-crawl` and is useful on its own. Only run this when you need a deliverable document.

Requires: `.repolens/kb/` must exist (run `/repolens-crawl` first).
