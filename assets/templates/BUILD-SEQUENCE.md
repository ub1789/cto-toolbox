# {{PROJECT_NAME}} — Build Sequence

> The global atlas for building this project.
> For each phase, this file tells Claude exactly what to read first and in what order to build.
> Claude does not decide the order — this file does.

---

## How to use this file

Before starting any phase:
1. Find the phase below
2. Read the listed Bible sections (do not skip)
3. Follow the module build order exactly
4. Run the gate before moving to the next phase

---

## Phase 0 — Scaffolding

**Bible sections to read first:** None (infrastructure only)
**Goal:** Project skeleton, DB connected, auth working, CI green

| Step | Module | Files | Gate |
|------|--------|-------|------|
| 1 | DB setup | `drizzle.config.ts`, `schema/index.ts` | migration runs |
| 2 | Auth | `lib/auth.ts`, `app/api/auth/[...]` | login/logout works |
| 3 | Base layout | `app/layout.tsx`, `components/ui/` | renders without error |

**Phase gate:** `verify.sh` ✓ + `typecheck` ✓ + auth flow works in browser

---

## Phase {{N}} — {{PHASE_NAME}}

**Bible sections to read first:**
- BIBLE.md § {{SECTION_NUMBER}} — {{SECTION_NAME}}
- BIBLE.md § {{SECTION_NUMBER}} — {{SECTION_NAME}}

**Goal:** {{PHASE_GOAL}}

| Step | Module | Files | Gate |
|------|--------|-------|------|
| 1 | {{MODULE}} | {{FILES}} | {{GATE}} |
| 2 | {{MODULE}} | {{FILES}} | {{GATE}} |
| 3 | {{MODULE}} | {{FILES}} | {{GATE}} |

**Phase gate:** {{GATE_CRITERIA}}

---

## Phase {{N+1}} — {{PHASE_NAME}}

**Bible sections to read first:**
- BIBLE.md § {{SECTION_NUMBER}} — {{SECTION_NAME}}

**Goal:** {{PHASE_GOAL}}

| Step | Module | Files | Gate |
|------|--------|-------|------|
| 1 | {{MODULE}} | {{FILES}} | {{GATE}} |

**Phase gate:** {{GATE_CRITERIA}}

---

## Global gates (must pass before any phase ships)

- [ ] `verify.sh` exits 0
- [ ] `{{TYPECHECK_COMMAND}}` exits 0
- [ ] `{{TEST_COMMAND}}` — 100% pass, zero skipped
- [ ] Tested in browser end-to-end
- [ ] PROGRESS.md updated
