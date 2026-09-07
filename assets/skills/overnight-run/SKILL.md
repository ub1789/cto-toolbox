---
name: overnight-run
description: Apply when the user asks for an unsupervised / autonomous / overnight run that should complete a large multi-step task while they're away and have results ready by morning — e.g. "do this overnight", "run unsupervised", "have it ready by morning", "kick it off and ping me when done", "run autonomously". Covers pre-flight checks, durable setup, the failures to avoid, model/context discipline, recovery, and the morning report. Works for both document/data runs and code runs. Not for quick foreground tasks the user is actively watching.
---

# Overnight / Unsupervised Runs

The user is stepping away and wants a large task done by morning with no one watching. Optimise for **durability and not silently freezing** — not speed. A half-finished run that's recoverable beats a fast run that loses everything or stalls at 2am waiting for an answer nobody's awake to give.

## Pre-flight (do these BEFORE kicking off — each prevents a silent overnight death)
1. **Stop the machine sleeping (macOS).** A sleeping Mac freezes loops, cron jobs, and background work — no error, just zero progress by morning. Start `caffeinate -i &` (or `caffeinate -s` on power) first. This is the most common darwin overnight failure.
2. **Check the auth mode.** If `$ANTHROPIC_API_KEY` is set (standard dev setup), cloud features — `/schedule`, push notifications, remote control — go **silent with no warning**. Don't promise "ping me when done" you can't keep: detect this and fall back to an on-disk morning report the user reads when they wake.
3. **Pick a mechanism that actually survives unattended, and confirm it exists in this environment.** Good options: **CronCreate** (durable cron schedule), a **background Workflow** (multi-stage pipeline, runs detached, resumable), `/loop` (interval), `/schedule` (cloud). Note: `ScheduleWakeup` only self-paces an *already-running* `/loop` — it is **not** a fire-and-forget scheduler. Don't hard-bind to one tool; use what's available.
4. **Verify credentials/tokens won't expire mid-run.** DB sessions, staging logins, API tokens, OAuth — if any expires or locks at 3am the run stalls. (We've been bitten by locked staging accounts before.) Refresh/confirm them up front.
5. **If the run edits code, isolate it in a worktree** (`EnterWorktree` / `isolation: "worktree"`). Background sessions can't safely edit a shared checkout — file writes stall otherwise.

## Setup
- **One kickoff doc the run reads first** — the mission · what "done" looks like (point at the source-of-truth files) · resources (seed scripts, credentials, URLs, existing tests) · known issues · output format.
- **Bound the scope** — a finite work list (N stages, N scenarios), never an open loop. It must not be able to run away.
- **Write to disk as you go** — agents write files (per-unit outputs, a running results/bug sheet). Never hold the only copy in memory; partial results must survive a crash, a limit, or the session ending.

## Hard rules for an unsupervised run (no one is awake)
- **NEVER block on a question.** No `AskUserQuestion`, no interactive prompt mid-run — it stalls indefinitely. Hit ambiguity → **log it to the morning report with a recommended default and keep going** on everything else.
- **NEVER `git push`, open a PR, or deploy** without prior explicit confirmation. Overnight is exactly when an over-eager model "decides it's done and ships." Commit locally at most.
- **Don't invent decisions** — policy/compliance/ambiguous calls get parked, not guessed.
- **Stop before any step that could overwrite good work** (assemble/merge/clobber) if earlier units failed or inputs are missing.

## Keep context & usage in check
The orchestrator's own context is the scarce resource. **Delegate everything heavy to subagents — they have their own context windows** and return only a *compact result* (a verdict, a bug list), never file dumps. The main loop never reads big files itself.
- **Read lean.** Never read a 2,000-line spec/dictionary in full — read the slice (offset/limit) or `grep`; give agents a **section map** so they can cite `§X` without opening the file. (Reading big files in full overflows an agent's input and kills it — "prompt is too long.")
- **Route models by task.** **Sonnet** for the volume (drafting, sweeps, running scenarios, extracting); **Opus** for the judgment (review against rules, synthesis, assembly, morning report); **Haiku** for trivial checks. Most units Sonnet, a few Opus.
- **Bound the agent count + watch the shared budget** (in a workflow, spend is pooled across the main loop and every agent).

## Structure the work
**Draft → review → assemble.** A cheaper model drafts each unit; a stronger model reviews against the rules; a final step assembles. Keep units independent so one failure doesn't sink the rest.

## On failure — recover, don't restart
The good work is **on disk** (agents wrote it as they went) — don't redo it. Find the root cause (usually over-reading), fix only the failed units with lean reads, and resume. (Workflows: `TaskStop`, edit the script, re-run with the same `scriptPath` + `resumeFromRunId` — cached units return instantly. Plain background agents don't resume — re-spawn only the failed ones.)

## Definition of done (don't declare done falsely)
- **Docs/data run:** the deliverable is written to disk **and** a morning report exists.
- **Code run:** the build passes, typecheck is clean, and the relevant tests are green — a morning report saying "complete" over a broken build is a failure, not a success. Verify, then report.

## The morning report (always leave one)
Write a `MORNING-REPORT.md` the human reads first: what got done (and what's partial) · every decision parked for them, each with a recommended default · anything needing their eyes (review, sign-off) · how to resume if it stopped partway. Make the deliverable durable **before** declaring done. Usage/context can still halt a run — because everything's on disk and resumable, say plainly what's done and how to continue; never pretend it finished.
