---
'@pathableai/styles': patch
---

Render body text in the dashboard and discovery components in Nunito, the brand body typeface, without a page-level font. `pathable-dashboard-header`, `pathable-kpi-grid`, `pathable-kpi-card`, `pathable-record-header`, `pathable-activity-list`, `pathable-activity-row`, `pathable-schedule-item`, `pathable-schedule-list`, `pathable-resource-card`, `pathable-filter-bar`, `pathable-filter-pill` and `pathable-wayfinder` now set `font-family: var(--pathable-font-body)` on their root, and the filter bar's clear and drawer-trigger buttons and the filter pill's dismiss button inherit it. Before, text these components left to inherit fell back to the browser's default serif font when the page set none. Headings and subheadings keep their own typefaces.
