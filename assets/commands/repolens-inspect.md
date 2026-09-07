Run a RepoLens inspection — walks the file tree and slices the codebase into logical modules. This is always the first step before extraction.

Invoke the `repolens-crawler` agent with these specific instructions:

**Target path:** $ARGUMENTS (if empty, the agent will ask for it)

**Run Pass 1 and Pass 2 only.** Do not proceed to Pass 3, 4, or 5.

After Pass 2 completes:
1. Print the full module breakdown in a table:
   | ID | Module | Files | Primary Language | Description |
2. Print total file count and total line count
3. Print any files that ended up ungrouped (if any)
4. Then ask the user:
   > "Which modules do you want to extract? Reply with:
   > - `all` — extract every module
   > - A comma-separated list of IDs (e.g. `M01, M03, M07`) — extract only those
   > - `none` — stop here, I just wanted the module map"

If the user replies with module IDs or `all`, immediately proceed to run Pass 3, Pass 4, and Pass 5 on the selected modules only.

If the user replies `none`, stop. Write `.repolens/module-manifest.json` and exit — no state.json needed.

**Pass 4 note:** Always run cross-module synthesis across ALL extracted modules, even if only a subset was selected — the architecture and cross-cutting docs should reflect what was actually extracted.
