# {{PROJECT_NAME}} — DEVELOPMENT MANDATE

{{PROJECT_DESCRIPTION}}

**Mode:** {{MODE}}  <!-- FAST (ship-and-iterate) | DELIBERATE (spec-first) -->
**Spec:** {{SPEC_FILE}}  <!-- BIBLE.md (deliberate) | .planning/INVARIANTS.md (fast) -->
**Progress:** PROGRESS.md

## BUILD PROTOCOL (NO SKIPPING)

```
1. READ      → {{SPEC_FILE}} relevant section + PROGRESS.md (mandatory first step)
2. EXPLORE   → run /plan or ub-planner agent before touching any file
3. BUILD     → no TODOs, no placeholders, no stubs — production code only
4. VERIFY    → .claude/verify.sh must exit 0
5. TYPECHECK → {{TYPECHECK_COMMAND}}
6. TEST      → {{TEST_COMMAND}}
7. UI CHECK  → open browser, click through the actual feature (UI changes only)
8. LOG       → update PROGRESS.md with completed checkbox
9. COMMIT    → only after steps 4 + 5 + 6 are green
```

If any step fails → fix root cause. Never skip forward. One feature per session.

## PRODUCTION-ONLY IRON RULE

NEVER write: `for now`, `in production this would`, `will integrate later`, `stub`,
`placeholder`, `TODO`, `FIXME`, `not yet implemented`, `defaulting to`, `// @ts-ignore`.

If a feature isn't done — don't write it.
If it needs an API that doesn't exist — build the API.
If it needs a DB column that doesn't exist — add the column.

## STACK

{{STACK_BLOCK}}

## MANDATORY AGENTS (run in order, never skip)

@.claude/agents/explore.md        ← before any code change
@.claude/agents/code-reviewer.md  ← after any non-trivial diff
@.claude/agents/test-writer.md    ← before commit on shippable code

## RULES

@.claude/rules/typescript.md
@.claude/rules/ui-ux.md
@.claude/rules/api-conventions.md
@.claude/rules/testing.md
@.claude/rules/workflow.md
@.claude/rules/source-accuracy.md
