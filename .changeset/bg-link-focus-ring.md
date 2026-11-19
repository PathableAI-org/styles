---
'@pathableai/styles': patch
---

Fix the shared focus ring on the `pathable-bg-link` utility. Controls that use the shared focus ring (`pathable-button`, `pathable-input`, `pathable-select`, `pathable-textarea`, `pathable-icon-button`) inside `pathable-bg-link` now draw it in white (7.7:1) instead of Bright Blue Brooks (2.6:1). Light containers nested in the teal one reset the ring to Bright Blue Brooks: the `pathable-bg-surface` utility, `pathable-bg-base` and `pathable-bg-accent` inside `pathable-bg-link`, and the card container, toast, filter bar, app shell sidebar and top bar, activity row, bento tile, KPI card, optional form section, page error, record header, resource card, schedule item, wayfinder and filterable option list panels. A custom light container nested in `pathable-bg-link` should set `--pathable-surface-focus-ring: initial`.
