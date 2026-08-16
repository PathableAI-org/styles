# Data Model: React Dashboard Overview Composition Page

**Feature**: `Dashboard/Dashboard Overview` React Storybook pattern story
**Created**: 2026-08-16

## Purpose

This feature is a **composition pattern**, not a new production entity. It has
no persistent state. This model documents the *shapes the composition renders*
by composing existing public React primitives and the documented
`pathable-kpi-*` styles-contract classes.

## Entities

### Dashboard Overview Page

The composed page grouping header, KPI summary, and activity list. It is
presentational and deterministic (fixture data only).

| Field       | Type               | Notes                                                        |
| ----------- | ------------------ | ------------------------------------------------------------ |
| header      | DashboardHeader    | title, breadcrumb, context, description, actions             |
| kpiRegion   | KPI region         | rendered via `pathable-kpi-*` classes                        |
| activity    | ActivityList       | grouped or ungrouped activity items                          |
| emptyState  | Table/empty state  | used only in the `Empty` story (empty table + message)      |

### Dashboard Header (existing React `DashboardHeader`)

Primitive with props: `title` (required `h1`), `breadcrumb`, `context`,
`description`, `actions`, `compact`, `stacked`. Maps to
`pathable-dashboard-header*` classes.

### KPI Region (styles-contract classes, no React wrapper yet)

Rendered via the documented `pathable-kpi-*` classes. Each card:
value, label, optional trend (`data-trend="up|down|neutral"` + visible text),
optional icon. Supported modifier/states: `.pathable-kpi-card--loading`,
`.pathable-kpi-card--unavailable`.

### Activity List (existing React component)

Props: `items` or `groups`, `density`, `emptyContent`, `groupHeadingLevel`.
Items: `id`, `title`, `context`, `date`, `owner`, `status`, `statusLabel`,
optional `actions`. Rows render `role="listitem"`.

## Relations

- Dashboard Overview **composes** a `DashboardHeader`, a KPI region, and an
  `ActivityList`.
- The KPI region **reuses** the styles `pathable-kpi-*` contract (defined in
  `packages/styles/src/pathable-component-wrappers/pathable-kpi-grid.scss`).
- The Empty state additionally composes a `Table` with an empty message.

## State transitions

None — the three fixed named stories (`Populated`, `Loading`, `Empty`) are
independent deterministic fixtures, not a running state machine.

## Validation rules (derived from spec)

- Exactly one `h1` (the header title) per composed page.
- KPI trend text is present (color is supplementary, never sole indicator).
- Activity rows include a visible `statusLabel` and accessible actions.
- Content is deterministic — no current dates, randomness, or network calls.