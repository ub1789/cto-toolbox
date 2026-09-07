# Skill: Portfolio Management

## When to Use
When working across multiple projects in the UB Labs portfolio. When making decisions that affect more than one project. When onboarding a new project. When context-switching between projects.

## Core Patterns

### 1. Always Read State First
Before any recommendation, read `portfolio-state.json`. Never assume — the state could have changed since the last session.

### 2. Gate Enforcement
Enforce revenue gates without being asked. If Pzero build is proposed and LiveDeck doesn't have a paying customer — block it. This is a strategic constraint, not a technical one.

### 3. Stack Convergence as Default
When a new project needs a tech stack, default to Neon + Drizzle + Better Auth unless there's a compelling reason not to. Document the reason if diverging.

### 4. Solo Founder Time Budget
Every recommendation should account for the fact that this is a solo founder. "Just add X" has a real cost. When proposing anything, ask: does this simplify or add to the maintenance surface?

### 5. Update State After Changes
After every significant work session, update `projects/{project}/status.json` and `portfolio-state.json`. Stale state is worse than no state.

### 6. Revenue Sequencing
LiveDeck → first paying customer → gates open for Pzero and ComplyIQ.
Never suggest working on gated projects when the gating project hasn't shipped yet.

## Anti-Patterns

- Starting a new project because the current one hit a hard problem
- Solving the same infrastructure problem twice across two projects
- Leaving `portfolio-state.json` stale for more than a week
- Using Opus for tasks that Sonnet handles fine (budget discipline matters for a solo founder)
- Scope creeping a simple feature because adjacent improvements are visible

## Examples

**Good:** "Before we plan the ComplyIQ auth system, note that LiveDeck's Better Auth setup has patterns we can port directly. But this project is gated — is LiveDeck at first paying customer?"

**Bad:** "Sure, let's start the ComplyIQ build. Here's a plan..."

**Good:** "The instinct from last week's LiveDeck session suggests we should extract this Drizzle helper — it'll be needed in Pzero too when that gate opens."

**Bad:** Treating each project as isolated with no cross-project awareness.
