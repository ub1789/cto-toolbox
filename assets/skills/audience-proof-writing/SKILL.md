---
name: audience-proof-writing
description: Apply when drafting or editing any document, message, report, or summary another person will read — PRDs, specs, handoff notes, Slack/email, status updates, release notes, exec summaries, README/docs. Ensures the writing is understandable to BOTH technical and non-technical readers (CxO to junior associate) without prior project context or opening another file. Not for commit messages, code comments, inline code documentation, or machine-consumed output.
---

# Audience-Proof Writing

**When to load this skill:** before writing or editing the deliverable. **Before declaring done:** run the pre-send checklist at the bottom.

Make every document understandable to **both ends of the audience** — a CxO skimming it and a junior associate building from it — **without prior context and without opening another file.**

> **The one-read test:** a first-time reader who hasn't lived in the project should get the point on a single read. If they'd have to open the source doc, ask a teammate, or decode a symbol — rewrite it.

## Rules
1. **No undecoded shorthand.** If a term can't be understood without the source document open, explain it inline in plain words or cut it.
2. **Lead with plain meaning; put precision second.** Say what something *is or does* first; the formal/exact term follows.
3. **Expand every acronym on first use** — write `MLRO (Money Laundering Reporting Officer)` the first time, then use `MLRO` after. No exceptions.
4. **Define-then-use for required jargon.** Specs still need exact terms; introduce them in plain language first so both audiences are served, rather than dropping them cold.
5. **Structure for skimming.** Short paragraphs, a lead sentence per section, bold the takeaway. A reader should be able to skim headings and bold text and still get it.
6. **Match register to channel.** Formal for BRDs/PRDs/specs. Conversational for Slack/email. The clarity standard applies to both — only the tone changes.

## The jargon test — run on every draft
For each term/symbol ask: *"Would someone outside this project understand this without help?"* If no → explain inline or remove.

**Frequent offenders** (the things we understand only because we've stared at them for days):

*Compliance/legal docs:*
- `§X` cross-references · status/tag legends (e.g. `● / ⚠ / ◑ / ○`) · work-package numbers (`WP0–WP6`) · release tags (`[Post-MVP]`)
- internal acronyms (`MLRO`, `DPO`, `EQR`, `DAML`, `CDD`/`EDD`)
- doc-internal labels (`REQ-S0-01`) and status enums (`under_remediation`)

*SaaS/product docs:*
- metric shorthand (`DAU`, `MRR`, `WR`) without expansion
- status tags (`[Post-MVP]`, `[v2]`, `[Blocked]`) without explanation of what they mean for the reader
- feature names or internal codenames the reader hasn't heard before

## When precision and plain language conflict
When a document genuinely requires technical precision that a non-technical reader might not follow, use the two-layer pattern — **do not flatten technical accuracy into prose that's technically wrong.**

The exec reads the top line; the builder reads on.

## Before / after
- ❌ "65 requirements, stage-ordered, each tagged `● Reuse / ⚠ Fix / ◑ Wire / ○ New` against work packages WP0–WP6."
  ✅ "The build spec — what to build, written as plain requirements with the rules and screens for each step."
- ❌ "Doc ① cites `§X` into Doc ②; read them together."
  ✅ "The data dictionary lists the exact fields behind each requirement — keep it open next to the spec."
- ❌ "Q4 needs DPO sign-off."
  ✅ "One data-protection point needs a quick sign-off from the firm's data-protection lead (the DPO, or the Owner/compliance lead if there isn't one)."

## Two layers when both are needed
For a doc that serves builders *and* executives: open each section with a plain-English line anyone can read, then add the precise detail below it.

```
[Plain-English lead — anyone can read this line]
[Technical detail — the builder reads on from here]
```

## Pre-send checklist (run before declaring done)
- [ ] Every acronym expanded on first use?
- [ ] No symbol, code, tag legend, or `§`-ref that needs the source doc to understand?
- [ ] Does the opening line make sense to a non-technical reader?
- [ ] Is there at least one unexplained assumption or internal term still in this draft? (If yes — fix it before sending.)
- [ ] Cut anything we only understand because we've lived in it for days?
