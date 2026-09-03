---
name: fresh-thread
description: Create a new, sequentially-versioned checkpoint document capturing current session state, then output a ready-to-paste resume prompt for starting a fresh thread. Use when context is running low (or the user says "/fresh-thread", "checkpoint and resume", "new thread") and work needs to continue in a new conversation without losing state.
---

# /fresh-thread

Writes a new, versioned checkpoint file — never edits a previous one — then gives the user a resume prompt to paste into a fresh thread.

## Why versioned, not a single file

A long-running project fills context multiple times over its life. Repeatedly editing one `CHECKPOINT.md` (the old pattern) turns it into an unreadable stack of "UPDATE —" sections. Each `/fresh-thread` call instead writes a brand-new file, so old checkpoints remain a clean audit trail of how the project evolved.

## Steps

1. **Find the next version number.**
   - Check `~/Desktop/ub-labs/checkpoints/` for files matching `CHECKPOINT-*.md`.
   - If the directory doesn't exist, create it — this call is version `001`.
   - Otherwise take the highest existing sequence number and increment by 1.

2. **Write the new checkpoint** at `~/Desktop/ub-labs/checkpoints/CHECKPOINT-<NNN>-<YYYY-MM-DD>.md` (zero-padded sequence, e.g. `CHECKPOINT-003-2026-08-11.md`), with these sections:
   - **Header** — version number, date, one-line session summary.
   - **What just happened** — 2-5 bullets on this session's substantive work: the load-bearing decisions and *why*, not a transcript.
   - **Open threads** — everything unresolved, in priority order, with enough context that the new thread can act without re-deriving it.
   - **Do NOT re-litigate** — decisions already finalized, named explicitly, so the new thread doesn't waste a turn re-deciding them.
   - **Pointers, not duplication** — reference relevant memory files (under `~/.claude/projects/<current-project-slug>/memory/*.md` — the memory dir for whichever project this session belongs to) and project docs by path instead of copying their content in. The checkpoint is a session-state snapshot, not a knowledge dump.
   - **Immediate next action** — the single most useful first move for the new thread.

3. **Never edit a prior checkpoint file.** Read the most recent one for continuity if useful, but always write a new file for this call.

4. **After writing, output a resume prompt** — plain-text delimiters (not a markdown blockquote, since this gets copy-pasted into another chat and `>` corrupts on paste), containing:
   - The exact new checkpoint file path.
   - An instruction to read it first, before anything else.
   - One line of top-level context so the new thread's first reply isn't blind.

## Resume prompt template

```
---- Start of prompt ----
Resume from checkpoint: ~/Desktop/ub-labs/checkpoints/CHECKPOINT-<NNN>-<DATE>.md

Read that file first — it has current state, what's open, and what not to re-litigate.
[one-line context on where things stand]
---- End of Prompt ----
```

## Notes

- The old root-level `~/Desktop/ub-labs/CHECKPOINT.md` stays as a historical record — stop appending to it once this skill is in use.
- If `~/Desktop/ub-labs` ever becomes a real git repo, these files get proper git history for free; nothing about this skill needs to change.
- Keep each checkpoint focused — link out to memory/docs rather than re-explaining things already captured there.
