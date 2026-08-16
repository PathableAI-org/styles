# Research: React Dashboard Overview Composition Page

**Feature**: Add `Dashboard/Dashboard Overview` pattern story to the React Storybook
**Created**: 2026-08-16

All unknowns resolved from repository-internal context (no external research required).

## R1: Is this a new component or a composition story?

**Decision**: A **pattern/composition story**, not a new component. Create
`packages/react/src/stories/dashboard/DashboardOverview.stories.tsx` with story
title `Dashboard/Dashboard Overview` (top-level `Dashboard` section).

**Rationale**:
- The styles catalog's `Dashboard Overview`
  (`packages/styles/src/stories/dashboard/DashboardOverview.stories.ts`) is a
  CSS-only composition page that assembles `DashboardHeader` + KPI grid +
  activity list (+ empty table). It declares no new styles contract.
- Constitution Principle XIV requires pattern/recipe stories to demonstrate
  realistic compositions "without silently creating new production APIs."
- `DashboardHeader` and `ActivityList` already exist as React components and are
  exported from `packages/react/src/index.ts` (the public entrypoint). A
  pattern story composes those primitives.

**Alternatives considered:**
- Building a new `DashboardOverview` React component: rejected — no new
  production API is warranted; the styles catalog models this as a composition.
- Adding a top-level `PageCompositions` section: rejected — the styles catalog
  groups it as `Dashboard/Dashboard Overview`, and the goal is parity.

## R2: How should the KPI region be rendered?

**Decision:** Render the KPI region in the composition using the documented
`pathable-kpi-*` styles-contract classes (`.pathable-kpi-grid`,
`.pathable-kpi-card`, `.pathable-kpi-card__value`,
`.pathable-kpi-card__label`, `.pathable-kpi-card__trend`,
`.pathable-kpi-card--loading`, `.pathable-kpi-card--unavailable`), exactly as
the styles `Dashboard Overview` and `KPI Grid` stories do.

**Rationale:**
- No React `KpiGrid`/`KpiCard` wrapper exists yet (verified: no `KpiGrid`
  component or story in `packages/react/src`). A dedicated wrapper is tracked
  separately and is out of scope.
- The `pathable-kpi-grid.scss` contract (with `data-trend` semantics, loading
  and unavailable states) is already part of `@pathable/styles`, which the React
  package imports transitively at its entrypoint.
- The pattern story declares realistic composition without inventing new
  production APIs.

**Alternatives considered:** Creating `packages/react/src/components/KpiGrid/`
now — rejected as out of scope and predated by the follow-up feature.

## R3: What states / named stories must the story expose?

**Decision:** Mirror the styles `Dashboard Overview` entry:
- `Playground` (optional exploratory Controls — not regression coverage)
- `Populated` — header + KPI summary + grouped activity list
- `Loading` — header with loading description + loading KPI cards
- `Empty` — header with "no data" description + unavailable KPI + empty table
  (styles `Empty` state uses a `pathable-table--empty`)
- `Mobile` (narrow viewport) — wrap/stack behavior per the styles contract

**Rationale:** Constitution XIV requires deterministic, named stories for every
supported externally meaningful state. The styles catalog defines exactly these
three states, so parity demands each has a fixed named React story. Deterministic
content (no live dates/random values/network) satisfies the Storybook standard.

## R4: How are interaction tests structured for this composition?

**Decision:** One `play`-based interaction test on the populated composition
(and/or a dedicated keyboard test) verifying:
- header action buttons (e.g., "Add Program") receive visible keyboard focus
- activation on Enter and Space via `Button` `onClick`
- activity-list action remains keyboard-operable

Use accessible queries only (`getByRole`, `getByText`); no `data-testid` or CSS
selectors for behavior assertions. Use `fn()` from `storybook/test` for the
action handler.

**Rationale:** Constitution X/`principles XIV requires browser-executed
interaction coverage for keyboard activation/focus. The activity-list rows
already carry `role="listitem"` and optional consumer actions; header actions
are native Buttons.

## R5: Known implementation details for the pattern story

- Story auto-discovery is `../../packages/react/src/stories/**/*.stories.tsx`
  (see `apps/storybook-react/.storybook/main.js`); no config change needed.
- Public components importable from `@pathableai/react`: `DashboardHeader`,
  `ActivityList`, `Button`, `Table`, plus KPI classes via the transitive styles
  import.
- The existing `DashboardHeader` React story already lives at
  `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx`, and
  `ActivityList` at `packages/react/src/stories/dashboard/ActivityList.stories.tsx`,
  both under the `Dashboard` section — the new overview story joins them in the
  same `Dashboard` section.
- TypeScript 5.7+, React 18/19; story meta must `satisfies Meta<typeof ...>`
  per Storybook standard. For a pattern story with no single component, prose
  `meta` with `title` + `tags: ['autodocs']` is used (as the styles and the
  `CommunicationPatterns` story do).