# Component API Contract: React Dashboard Header Wrapper

**Feature**: 037-react-dashboard-header
**Date**: 2026-08-14

## DashboardHeader

### Interface

```typescript
import { HTMLAttributes, ReactNode } from 'react'

interface DashboardHeaderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The page title, rendered as the primary heading (required). */
  title: string

  /** Optional navigational breadcrumb content (links/spans). */
  breadcrumb?: ReactNode

  /** Optional status/context indicator shown beside the title. */
  context?: ReactNode

  /** Optional supporting description shown below the title row. */
  description?: ReactNode

  /** Optional action controls (e.g., Button components). */
  actions?: ReactNode

  /** Reduced padding and spacing variant. Default: false. */
  compact?: boolean

  /** Force actions to stack below the title. Default: false. */
  stacked?: boolean
}
```

### Props Detail

| Prop | Type | Required | Default | Maps to |
|---|---|---|---|---|
| `title` | `string` | **Yes** | — | `<h1 class="pathable-dashboard-header__title">` |
| `breadcrumb` | `ReactNode` | No | — | `<div class="pathable-dashboard-header__breadcrumb">` (omitted if empty) |
| `context` | `ReactNode` | No | — | `<span class="pathable-dashboard-header__context">` (omitted if empty) |
| `description` | `ReactNode` | No | — | `<p class="pathable-dashboard-header__description">` (omitted if empty) |
| `actions` | `ReactNode` | No | — | `<div class="pathable-dashboard-header__actions">` (omitted if empty) |
| `compact` | `boolean` | No | `false` | Adds `pathable-dashboard-header--compact` |
| `stacked` | `boolean` | No | `false` | Adds `pathable-dashboard-header--stacked` |
| `className` | `string` | No | `''` | Merged onto the root `<div class="pathable-dashboard-header">` |
| `...rest` | `Omit<HTMLAttributes<HTMLDivElement>, 'title'>` | No | — | Spread onto the root div; the native `title` attribute is omitted because `title` names the required page-heading prop |

### Expected DOM Output

```html
<!-- Full header (breadcrumb + context + description + actions) -->
<div class="pathable-dashboard-header">
  <div class="pathable-dashboard-header__breadcrumb">
    <a href="#">Home</a><span>Programs</span>
  </div>
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title">Employment Pathways</h1>
    <span class="pathable-dashboard-header__context">Active &middot; Q4 2026</span>
    <div class="pathable-dashboard-header__actions">
      <button class="pathable-button pathable-button--outline">Export</button>
      <button class="pathable-button">Add Program</button>
    </div>
  </div>
  <p class="pathable-dashboard-header__description">
    Track and manage employment pathway programs across all regions.
  </p>
</div>

<!-- Title only -->
<div class="pathable-dashboard-header">
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title">My Dashboard</h1>
  </div>
</div>

<!-- Compact variant -->
<div class="pathable-dashboard-header pathable-dashboard-header--compact">
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title">Program Summary</h1>
  </div>
</div>

<!-- Stacked variant -->
<div class="pathable-dashboard-header pathable-dashboard-header--stacked">
  <div class="pathable-dashboard-header__row">
    <h1 class="pathable-dashboard-header__title">Program Summary</h1>
    <div class="pathable-dashboard-header__actions">...</div>
  </div>
</div>
```

### Empty State Behavior

| Prop | When empty/undefined | Result |
|---|---|---|
| `breadcrumb` | No `pathable-dashboard-header__breadcrumb` element rendered |
| `context` | No `pathable-dashboard-header__context` element rendered |
| `description` | No `pathable-dashboard-header__description` element rendered |
| `actions` | No `pathable-dashboard-header__actions` element rendered |
| `title` | Always rendered — required prop |
