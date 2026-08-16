# Quickstart: React Dashboard Overview Validation Guide

**Feature**: `Dashboard/Dashboard Overview` React Storybook pattern story
**Created**: 2026-08-16

This is a validation/run guide. Implementation detail belongs in `tasks.md`.

## Prerequisites

- pnpm installed, workspace already bootstrapped (`pnpm install` run).
- `@pathableai/styles` and `@pathableai/react` packages present.

## Setup

```bash
# Ensure the styles contract is built (fonts, tokens, compiled CSS)
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/react build
```

## Running the React Storybook

```bash
pnpm docs:react
```

Open http://localhost:6007 and navigate to **Dashboard → Dashboard Overview**.
Confirm the composed page renders identically to the styles catalog
(`pnpm docs` → `Dashboard/Dashboard Overview`).

## Validation scenarios

### Scenario 1 — Populated overview renders (P1)

```bash
pnpm docs:react
```

- **Given** the React Storybook, **When** I open `Dashboard/Dashboard Overview > Populated`,
  **Then** I see the dashboard header (breadcrumb, `h1` title "Employment
  Pathways", "Active · Q4 2026" context, Export + Add Program actions, description),
  a KPI grid (4 cards: Active Participants, Placement Rate, New Enrollments,
  Partner Organizations), and a grouped activity list.
- The layout/typography/spacing matches the styles `Dashboard Overview`.

### Scenario | Keyboard interaction works (P1)

- **When** I tab through the populated overview, **Then** the `Export` and
  `Add Program` buttons receive visible focus, and pressing Enter/Space on
  `Add Program` activates its `onClick`.
- This is covered by a `play` test on the story.

### Scenario | Loading state (P2)

- **Given** the `Loading` story, **When** it renders, **Then** header shows
  "Loading dashboard data..." and the KPI region shows 3 placeholder
  `pathable-kpi-card--loading` cards with no text values.

### Scenario | Empty state (P3)

- **Given** the `Empty` story, **When** it renders, **Then** the header shows a
  "No program data available yet." description with an `Add Program` action,
  the KPI region shows `N/A` unavailable cards, and the empty table shows
  "No recent activity."

### Scenario | Mobile / narrow (responsive)

- **Given** the `Mobile` story, **When** it renders at the mobile viewport,
  **Then** the header stacks its actions below the title (styles contract
  ≤640px) and the KPI grid collapses to a single column (≤480px) without
  horizontal overflow.

## Quality gates (implementation passes these)

```bash
pnpm --filter @pathableai/react lint          # eslint --max-warnings=0
pnpm --filter @pathableai/react typecheck     # tsc --noEmit
pnpm --filter @pathableai/react build
pnpm test:storybook-react                     # build styles+react, run Storybook test-runner
```

The test-runner executes the story `play` functions and a11y checks; both must
pass with zero violations.

## Expected outcomes

- All scenarios above pass.
- No `packages/styles` changes, no new React component/export, no new deps.
- Story is deterministic across runs (fixed fixtures only).

## References

- Story contract: [`contracts/story.md`](./contracts/story.md)
- Composed entities: [`data-model.md`](./data-model.md)