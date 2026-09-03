# Design References

Screenshots of specific UI elements you want this project to match.

## How to use

1. Screenshot a specific element from a product you admire — not whole pages, specific elements
2. Name it descriptively: `linear-sidebar.png`, `stripe-ledger-row.png`, `notion-empty-state.png`
3. Add it to this folder
4. Map it to your components in CLAUDE.md under `## Design References`

## Naming convention

`[product]-[element].png`

Examples:
- `linear-sidebar.png`
- `stripe-data-table-row.png`
- `notion-empty-state-projects.png`
- `vercel-deployment-card.png`
- `raycast-command-palette.png`
- `cron-dashboard-grid.png`

## Reference mapping (add to CLAUDE.md)

```md
## Design References

| Component | Reference | File |
|-----------|-----------|------|
| [Component name] | [What to match] | design-references/[file].png |
```

When Claude writes a component, point at the reference:
> "Match design-references/stripe-ledger-row.png. Specifically: 1px subtle border-bottom, hover-reveal action menu, secondary text single-line."

When Claude produces something wrong, correct mechanically:
> "This doesn't match [reference]. Specifically: [what's different]. Redo."

## Good reference sources

Linear, Stripe, Vercel, Raycast, Notion, Cron, Linear, Loom, Figma, Retool, Clerk, Resend
