<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/057-consolidated-theme-token-css/plan.md

## Promote Repeated Composition Patterns into Higher-Level Primitives

This feature (slice 14 of the React Semantic Primitives plan) promotes five
repeated composition patterns from the audit (slice 13) into new
`@pathable/react` primitives: `CardGrid`, `Page`, `SidebarLayout`,
`FormStack`, and `SplitLayout`. Each is built from existing lower-level
primitives (`Container`, `Stack`, `Inline`, `Cluster`, `Surface`) and maps
to existing `packages/styles` SCSS contracts. No new SCSS is introduced.

### Deliverables

- 5 new React components in `packages/react/src/components/`
- 5 unit test suites (Vitest + RTL) with SSR parity checks
- 5 Storybook story files with isolation, composition, and responsive stories
- Migration guides (before/after) embedded in Storybook docs

### Key constraints

- No new SCSS contracts — every primitive uses existing `packages/styles` classes
- `Box` and `Grid` are not yet available; composition primitives are built
  from existing layout primitives (`Container`, `Stack`, `Inline`, `Cluster`,
  `Surface`) with direct SCSS class application where needed
- Gap scales are NOT uniform across primitives — each primitive maps to its
  specific SCSS contract's gap scale

### Component priorities

| P1 | `CardGrid` | Cluster mode (Cluster → Surface) + auto-fit mode (CSS Grid) |
| P2 | `Page` | Container → Stack page scaffold |
| P3 | `SidebarLayout` | `<main>` + `<aside>` grid layout with ratio control |
| P4 | `FormStack` | `<form>` + Stack with max-width constraint |
| P5 | `SplitLayout` | Two-column split with ratio and alignment |

### Running validation

```bash
pnpm --filter @pathable/react test:unit     # Unit tests
pnpm --filter @pathable/react storybook      # Storybook dev server
pnpm lint && pnpm format --check              # Lint and format
```

<!-- SPECKIT END -->
