Display RepoLens help — available commands, workflow, and usage examples.

Print the following exactly:

---

# RepoLens — Command Reference

Point any Claude Code session at a codebase. Extract a structured knowledge base. Generate docs.
No API key. No subprocess. Runs natively inside Claude Code.

---

## Commands

### `/repolens-inspect [path]`
**Start here.** Walks the file tree and slices the codebase into logical modules (Pass 1+2).
Shows a module table, then asks which modules you want to extract.
- Reply `all` → proceeds to full extraction immediately
- Reply `M01, M03` → extracts only those modules
- Reply `none` → stops, saves the module map only

### `/repolens-crawl [path] [module-ids|all]`
Runs extraction on specific modules (Pass 3–5). Use this when you already have a module map
from a previous inspect and want to extract more modules or re-run specific ones.
- Requires `.repolens/module-manifest.json` to exist (run inspect first)
- Checkpointed — safe to interrupt and resume

### `/repolens-format [path] [format] [module-id]`
Generates a formatted output document from the extracted KB. Optional — the KB is useful on its own.
- Formats: `prd`, `wiki`, `summary`
- Scope: a specific module ID, or omit for all modules
- Requires extraction to have run first

### `/repolens-help`
Show this reference.

---

## Typical Workflow

```
1. /repolens-inspect /path/to/repo     ← see what modules exist
   → reply: M02, M05                   ← pick what to extract
   → extraction runs automatically

2. /repolens-format wiki               ← optional: generate developer wiki
```

---

## Selective Re-extraction

Come back later and extract more modules without re-slicing:
```
/repolens-crawl M08, M11
```

---

## Output Structure

All output lands inside the target repo:
```
.repolens/
  repo-map.json          ← file tree + stats (Pass 1)
  module-manifest.json   ← module list + file groupings (Pass 2)
  state.json             ← checkpoint state (Pass 3–5)
  kb/
    M01/
      overview.md
      api.md
      data-models.md
      dependencies.md
      patterns.md
      errors.md
      config.md
      design-rationale.md
    _meta/
      architecture.md
      cross-cutting.md
      module-index.md

docs/
  prd/      ← /repolens-format prd
  wiki/     ← /repolens-format wiki
  summary/  ← /repolens-format summary
```

---

## Agents (used internally)

| Agent | Role |
|-------|------|
| `repolens-crawler` | Runs Pass 1–5 extraction pipeline |
| `repolens-formatter` | Generates PRD / wiki / summary from KB |
