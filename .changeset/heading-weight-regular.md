---
'@pathableai/styles': patch
---

Headings set in the heading typeface (Fredoka) now render at Fredoka Regular (weight 400), as the brand rules specify, instead of a browser-synthesised bold: the package ships only Fredoka Regular. This changes `pathable-card`, `pathable-modal`, `pathable-hero`, `pathable-graphic-list`, `pathable-display` and `pathable-prose` headings, and the headings and values in `pathable-page-error`, `pathable-empty-state`, `pathable-resource-card`, `pathable-schedule-item` (day), `pathable-dashboard-header`, `pathable-record-header`, `pathable-kpi-grid`, `pathable-wayfinder` and `pathable-activity-list`. The React components inherit the change. Headings in Poppins, such as `pathable-heading` levels 2 to 4, keep their weights.
