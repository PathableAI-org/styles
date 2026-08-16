# Story Contract: Dashboard Overview (React Storybook)

**Feature**: 040-react-dashboard-overview
**Date**: 2026-08-16

## Contract type

This is a **pattern/composition story contract**, not a public production API.
No new component, prop, or export is introduced. The contract describes the
story file, its exported names, and the DOM it must render so that the React
Storybook matches the styles `Dashboard Overview` catalog.

## Story metadata

| Field      | Value                                                          |
| ---------- | -------------------------------------------------------------- |
| file       | `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx` |
| title      | `Dashboard/Dashboard Overview`                                 |
| tags       | `['autodocs']`                                                 |
| meta       | Prose `meta` object (`satisfies Meta<{}>`) — no single component |

## Exported story names (fixed, deterministic)

| Story            | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `Playground`     | Optional exploratory Controls (not regression coverage)  |
| `Populated`      | Header + KPI summary + grouped activity list             |
| `Loading`        | Header with "Loading dashboard data..." + loading KPI    |
| `Empty`          | Header with "no data" + unavailable KPI + empty table    |
| `Mobile`         | Narrow viewport — verify wrap/stacking behavior          |

## DOM output (Populated)

```html
<div style="display:flex;flex-direction:column;gap:2rem;">
  <!-- DashboardHeader (React) -->
  <div class="pathable-dashboard-header">
    <div class="pathable-dashboard-header__breadcrumb">...</div>
    <div class="pathable-dashboard-header__row">
      <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
      <span class="pathable-dashboard-header__context">Active · Q4 2026</span>
      <div class="pathable-dashboard-header__actions">
        <button class="pathable-button pathable-button--outline">Export</button>
        <button class="pathable-button">Add Program</button>
      </div>
    </div>
    <p class="pathable-dashboard-header__description">...</p>
  </div>

  <!-- KPI region (styles-contract classes; no React wrapper) -->
  <div class="pathable-kpi-grid">
    <div class="pathable-kpi-card">
      <p class="pathable-kpi-card__value">1,247</p>
      <p class="pathable-kpi-card__label">Active Participants</p>
      <div class="pathable-kpi-card__trend" data-trend="up">
        <span class="pathable-kpi-card__trend-label">+12% from last month</span>
      </div>
    </div>
    <!-- ... more cards ... -->
  </div>

  <!-- ActivityList (React) -->
  <div class="pathable-activity-list" role="list"><!-- rows --></div>
</div>
```

## State variants

### Loading

```html
<div class="pathable-dashboard-header">
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
  </div>
  <p class="pathable-dashboard-header__description">Loading dashboard data...</p>
</div>
<div class="pathable-kpi-grid">
  <div class="pathable-kpi-card pathable-kpi-card--loading" aria-hidden="true">
    <div class="pathable-kpi-card__value"></div>
    <div class="pathable-kpi-card__label"></div>
  </div>
  <!-- 2 more loading cards -->
</div>
```

### Empty

```html
<div class="pathable-dashboard-header">
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
  </div>
  <p class="pathable-dashboard-header__description">No program data available yet. Add a program to get started.</p>
  <div class="pathable-dashboard-header__actions">
    <button class="pathable-button">Add Program</button>
  </div>
</div>
<div class="pathable-kpi-grid">
  <div class="pathable-kpi-card pathable-kpi-card--unavailable">...</div>
</div>
<table class="pathable-table pathable-table--empty pathable-table--borderless">
  <thead><tr><th>Activity</th><th>Date</th></tr></thead>
  <tbody><tr><td colspan="2"><span class="pathable-table__empty-message">No recent activity.</span></td></tr></tbody>
</table>
```

## Behavior contract

- **Keyboard**: Each header action button receives visible keyboard focus and
  activates on Enter/Space (`Button` onClick).
- **Semantics**: Exactly one `h1` (header title); activity rows are
  `role="listitem"`; KPI trends include visible text (`data-trend-label`).
- **A11y**: `aria-hidden="true"` on loading placeholder cards; accessible names
  for all buttons.
- **Responsive**: At ≤640px the header stacks; KPI grid collapses to one column
  ≤480px; activity list wraps. Verify with the `Mobile` story.
- **Determinism**: All content is fixed fixture text; no dates/random/network.

## Dependencies

- `DashboardHeader`, `ActivityList`, `Button`, `Table` from the React public
  entrypoint.
- `@pathableai/styles` compiled CSS (transitive import through the React package
  entrypoint) provides `.pathable-kpi-*`, `.pathable-table--empty`,
  `.pathable-activity-list`, `.pathable-dashboard-header` styling.