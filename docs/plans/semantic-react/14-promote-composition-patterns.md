# 14 — Promote Repeated Patterns into Higher-Level Primitives

Status: NOT STARTED → change to DONE when complete

## Parent Plan

[docs/plans/REACT_SEMANTIC_PRIMITIVES_PLAN.md](../REACT_SEMANTIC_PRIMITIVES_PLAN.md) — Phase 5 and Suggested Slice 14

## Scope

Promote repeated, proven composition patterns identified in the [audit](./13-audit-application-layouts.md) into higher-level Pathable-specific primitives. Each candidate is promoted only if it has stable semantics, demonstrated value across multiple features or applications, and clear ownership of child constraints and accessibility requirements.

## Includes

- From the audit document in [13](./13-audit-application-layouts.md), select candidates ranked as reusable composition patterns.
- For each promoted candidate, specify and implement a component. Likely candidates (to be confirmed by audit) include:
  - `Page` — a full-page shell: `Container` + consistent structure.
  - `PageHeader` — a page-top region with title, description, and action slots.
  - `PageContent` — the main content region within a page.
  - `SidebarLayout` — a two-column layout with a sidebar and main content area.
  - `Section` — a semantic page section with consistent spacing and optional heading integration.
  - `FormStack` — a vertical form layout with consistent field spacing.
  - `ActionGroup` — a horizontal cluster of actions/buttons with consistent spacing and alignment.
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