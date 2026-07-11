# Data Model: Page Composition Archetypes

**Phase**: 1 — Design & Contracts
**Date**: 2026-07-11

## Overview

This feature produces presentation-layer HTML/CSS compositions only. No runtime data entities, state machines, or persistence models are involved. This document defines the **composition structure model** — the sections, regions, and states each archetype must contain.

## Composition Structure Model

### Archetype 1: Marketing Landing Page

```
LandingPage
├── site-header (pathable-header)
├── hero-section
│   ├── eyebrow text
│   ├── headline
│   ├── supporting copy
│   ├── primary CTA
│   └── secondary CTA
├── audience-or-principles-row (cluster/stack layout)
├── alternating-feature-sections (×2-3)
│   ├── feature image (screenshot-frame)
│   ├── feature heading
│   ├── feature copy
│   └── feature CTA
├── statistics-band
│   └── statistic-cards (×3-4)
├── cta-band
│   ├── headline
│   ├── supporting copy
│   └── primary CTA
└── site-footer (pathable-footer)
```

**Decorations**: Decorative background applied behind hero and/or CTA band. Text highlights on eyebrow and headline text.

**States**: Single rendered state only (all sections visible).

---

### Archetype 2: Resource Directory

```
ResourceDirectory
├── search-led-hero
│   ├── headline
│   ├── search input (pathable-search)
│   └── guided wayfinder (pathable-wayfinder)
├── filter-bar
│   ├── filter controls (pathable-filter-bar)
│   └── active-filter pills (pathable-filter-pill, ×2-3)
├── results-header
│   ├── result count
│   └── sort controls
├── results-grid
│   ├── populated-state: resource-cards (pathable-resource-card, ×6-9)
│   └── empty-state: empty-state fallback (pathable-empty-state)
└── pagination (pathable-pagination)
```

**States**: Two variants — populated results, empty results.

---

### Archetype 3: Operational Dashboard

```
OperationalDashboard
├── app-shell (pathable-app-shell)
│   ├── sidebar navigation (pathable-sidenav) [desktop]
│   ├── bottom navigation (pathable-app-shell mobile variant) [mobile]
│   └── main content area
│       ├── dashboard-header (pathable-dashboard-header)
│       ├── kpi-cards (pathable-kpi-grid, ×4)
│       ├── activity-list (pathable-activity-list)
│       ├── schedule-section (pathable-schedule-item, ×3)
│       ├── responsive-table (pathable-table + modifications)
│       ├── toast (pathable-toast, positioned)
│       ├── loading-state: skeleton placeholders (pathable-skeleton)
│       └── empty-state: empty-state (pathable-empty-state)
└── [no site-level footer — dashboard convention]
```

**States**: Three variants — loading, populated, empty.

---

### Archetype 4: Structured Workflow

```
StructuredWorkflow
├── participant-context
│   └── record-header (pathable-record-header)
├── step-indicator (pathable-step-indicator)
├── workflow-panel (pathable-workflow-panel)
│   ├── objective / structured prompt
│   ├── form-entry-area (pathable-form-controls)
│   ├── save-status indicator
│   ├── validation-summary (pathable-summary-box)
│   └── navigation-actions (previous / next / complete buttons)
└── completed-state
    ├── success confirmation
    └── optional next actions
```

**States**: Two variants — in-progress (with form), completed.

---

## Validation Rules

| Rule | Description | Applicable To |
|------|-------------|---------------|
| VR-001 | Every composition section must use at least one public CSS class | All archetypes |
| VR-002 | No raw hex color, arbitrary spacing, or one-off inline CSS values | All archetypes |
| VR-003 | Focus order must match visual reading order | All archetypes |
| VR-004 | Fixed regions must not obscure focused content | All archetypes |
| VR-005 | Placeholder content must be synthetic (no real PII) | All archetypes |

## CSS Class Contract Overview

Each archetype composes from the following public bundles (all available via `packages/styles`):

| Bundle | Archetypes Using It |
|--------|-------------------|
| `pathable-marketing-patterns` | Landing, Directory, Workflow |
| `pathable-layout-composition` | All four |
| `pathable-navigation` | Landing, Directory |
| `pathable-discovery` | Directory |
| `pathable-dashboard` | Dashboard |
| `pathable-communication` | Dashboard (toast), Workflow (summary-box) |
| `pathable-structured-workflow` | Workflow |
| `pathable-form-controls` | Workflow |
| `pathable-empty-state` | Directory, Dashboard |
| `pathable-button` | All four |
| `pathable-typography` | All four |