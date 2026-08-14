# Data Model: React Dashboard Header Wrapper

**Feature**: 037-react-dashboard-header
**Date**: 2026-08-14

## Entities

### DashboardHeader

A dashboard page header that combines a page title, optional breadcrumb,
context/status indicator, description, and action regions into the
`pathable-dashboard-header` layout.

**React representation**: `<DashboardHeader>` functional component

**Props**:

| Attribute | Type | Required | Default | Description |
|---|---|---|---|---|
| `title` | `string` | Yes | — | The page title, rendered as the primary heading (`h1`) |
| `breadcrumb` | `ReactNode` | No | — | Navigational breadcrumb content (links/spans) |
| `context` | `ReactNode` | No | — | Status/context indicator shown beside the title |
| `description` | `ReactNode` | No | — | Supporting description below the title row |
| `actions` | `ReactNode` | No | — | Action controls (e.g., `Button` components) |
| `compact` | `boolean` | No | `false` | Applies the `pathable-dashboard-header--compact` modifier |
| `stacked` | `boolean` | No | `false` | Applies the `pathable-dashboard-header--stacked` modifier |
| `className` | `string` | No | `''` | Additional CSS classes merged onto the root element |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | No | — | Passthrough attributes spread onto the root div |

**DOM output**: `<div class="pathable-dashboard-header [--compact] [--stacked] [className]">` containing a title row (title + optional context + optional actions) plus optional breadcrumb and description regions.

**State transitions**: None. `DashboardHeader` is a stateless presentational component. All layout behavior (responsive stacking at 640px, compact padding, forced-colors, reduced-motion) is driven by CSS from the styles contract.

**Validation rules**:
- `title` is required and always rendered as an `h1`.
- `breadcrumb` omitted → no `pathable-dashboard-header__breadcrumb` element.
- `context` omitted → no `pathable-dashboard-header__context` element.
- `description` omitted → no `pathable-dashboard-header__description` element.
- `actions` omitted → no `pathable-dashboard-header__actions` element.
- `compact === true` → adds `pathable-dashboard-header--compact`.
- `stacked === true` → adds `pathable-dashboard-header--stacked`.

---

### Breadcrumb (region)

An optional navigational trail rendered above the title row.

**React representation**: Not a standalone component — the `breadcrumb` prop (`ReactNode`).

**DOM output**: `<div class="pathable-dashboard-header__breadcrumb">[breadcrumb]</div>` (only when provided).

**Behaviors**:
- Consumer-supplied links and separators; the styles contract renders `>` separators via CSS (`* + *::before`).
- Truncates with ellipsis on narrow screens (≤640px) per the styles contract.

---

### Context (region)

An optional status/context indicator rendered beside the title.

**React representation**: The `context` prop (`ReactNode`).

**DOM output**: `<span class="pathable-dashboard-header__context">[context]</span>` (only when provided).

**Behaviors**:
- `white-space: nowrap` and `flex-shrink: 0` per the styles contract; sits beside the title on wide screens.

---

### Description (region)

An optional supporting paragraph rendered below the title row.

**React representation**: The `description` prop (`ReactNode`).

**DOM output**: `<p class="pathable-dashboard-header__description">[description]</p>` (only when provided).

**Behaviors**:
- Constrained to `max-width: 40rem` per the styles contract.

---

### Actions (region)

An optional action control region rendered beside (wide) or below (narrow) the title.

**React representation**: The `actions` prop (`ReactNode`, typically `Button` elements).

**DOM output**: `<div class="pathable-dashboard-header__actions">[actions]</div>` (only when provided).

**Behaviors**:
- `flex-wrap: wrap` so many actions wrap onto additional lines.
- Stacks full-width below the title on narrow screens (≤640px) per the styles contract.

## Relationships

```
DashboardHeader (<div class="pathable-dashboard-header">)
├── Breadcrumb (<div class="pathable-dashboard-header__breadcrumb">)   [optional]
├── Row (<div class="pathable-dashboard-header__row">)
│   ├── Title (<h1 class="pathable-dashboard-header__title">)           [required]
│   ├── Context (<span class="pathable-dashboard-header__context">)     [optional]
│   └── Actions (<div class="pathable-dashboard-header__actions">)      [optional]
└── Description (<p class="pathable-dashboard-header__description">)    [optional]
```
