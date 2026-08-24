# 14 — Promote Repeated Patterns into Higher-Level Primitives

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 5 and Suggested Slice 14

## Scope

Promote repeated, proven composition patterns identified in the [audit](./13-audit-application-layouts.md) into higher-level Pathable-specific primitives. Each candidate is promoted only if it has stable semantics, demonstrated value across multiple features or applications, and clear ownership of child constraints and accessibility requirements.

## Includes

- From the audit document in [13](./13-audit-application-layouts.md) (findings at [audit-findings.md](./audit-findings.md)), select candidates ranked as reusable composition patterns. The audit confirmed the following prioritized candidates:
  1. `CardGrid` / `SurfaceGroup` — responsive card/tile grid (Cluster → Surface composition). Most frequent reusable pattern (10 files). SCSS contract exists (`pathable-cluster`, `pathable-surface`).
  2. `SidebarLayout` — two-column sidebar + main content layout (6 files). SCSS contract exists (`pathable-sidebar-layout`).
  3. `Page` — full-page shell: `Container` + `Stack` wrapper (12 files). SCSS contract exists (pure composition, no new CSS needed).
  4. `SplitLayout` — two-column side-by-side layout (5 files). SCSS contract exists (`pathable-split`).
  5. `FormStack` — vertical form layout with consistent field spacing (8 files). SCSS contract exists (pure composition).
  6. `CardGrid` (auto-fit CSS Grid variant) — auto-fitting card grid (4 files). SCSS contract exists (`pathable-card-grid`).
- The following candidates from the original speculative list were **downgraded by audit findings**:
  - `PageHeader` / `PageContent` — not identified as a distinct repeated pattern; served by `Stack` composition.
  - `Section` — the "nested Surface" pattern was found but is better positioned as a recipe documented in Storybook, not a new primitive.
  - `ActionGroup` — already exists as `ButtonGroup` in React. Audit confirmed it is used (6 files). No new component needed.
- **Preconditions for implementation**: `Box` and `Grid` primitives (slices 4 and 8) should be implemented first. Many patterns currently rely on raw `<div>` elements with `pathable-*` CSS classes. Implementing `Box` gives these patterns a typed target for composition.
- Each new primitive must:
  - Be built from existing lower-level primitives (`Container`, `Stack`, `Inline`, `Grid`, `Box`) and system props, not raw utility strings.
  - Specify ownership of responsive behavior, landmarks (ARIA roles), heading integration, focus order, and child constraints.
  - Preserve the ability to override via `className` and (where safe) `as`.
  - Be unit-tested and Storybook-tested.
- For each promoted pattern, produce a brief migration guide showing the before (ad-hoc combination) and after (new primitive).
- Deprecate superseded utility combinations only after adoption evidence and a migration path exist.

## Excludes

- Domain-specific or application-specific patterns — these stay in applications.
- Speculative components without audit evidence.
- Removing or breaking existing lower-level primitives.

## Dependencies

- [13 — Audit of Real Application Layouts](./13-audit-application-layouts.md) (must be complete; candidate list comes from its findings).
- All prior primitive features should be substantially complete.

## DONE Means

For each promoted primitive:

- The component is exported from `@pathable/react`.
- Unit tests confirm the component renders the expected structure, classes, and slot/content behavior.
- Storybook stories demonstrate the primitive in isolation and in representative compositions.
- A migration guide (inline in the feature branch or in component documentation) shows before/after usage.
- Accessibility (landmarks, headings, focus order) is reviewed and documented.
- Server/client output is identical.
- CI passes.

If the audit finds no candidates meeting the promotion bar, this feature is **CANCELLED** and the status is updated with a brief rationale.
