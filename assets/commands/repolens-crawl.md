Run RepoLens extraction on specific modules (Pass 3–5 only).

Use this when you've already run `/repolens-inspect` and know which modules you want.

Invoke the `repolens-crawler` agent with the following context:

**Arguments:** $ARGUMENTS

Expected format: `[path] [module-ids]`
- Path — absolute path to the repo (required if not already inspected in this session)
- Module IDs — comma-separated list (e.g. `M01,M03,M07`) or `all`

Examples:
- `/repolens-crawl all` — extract all modules (assumes inspect already ran in current repo)
- `/repolens-crawl M01,M04,M09` — extract only these 3 modules
- `/repolens-crawl /path/to/repo all` — extract all modules in a different repo

**Assumes `.repolens/module-manifest.json` already exists.** If it doesn't, run `/repolens-inspect` first.

The agent will:
1. Read module-manifest.json — validate requested module IDs exist
2. Pass 3 — extract 7 KB files per selected module into `.repolens/kb/{MODULE_ID}/`
3. Pass 4 — synthesise cross-module architecture docs across all extracted modules
4. Pass 5 — write design rationale per extracted module

State is checkpointed after each module — if interrupted, re-run and it resumes where it left off.

When done, run `/repolens-format` if you want a PRD, wiki, or summary doc.
