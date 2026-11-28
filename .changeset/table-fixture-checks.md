---
'@pathableai/styles': minor
---

Adds the `pathable-table--stacked`, `pathable-table--stacked-header`,
`pathable-table--sticky-header` and `pathable-table-container--scrollable`
classes.

- `pathable-table--stacked` and `pathable-table--stacked-header` stack table
  rows as blocks below 480px, with border-box cells so the row separators span
  the row.
- `pathable-table--sticky-header` keeps the header row in view while the table
  scrolls.
- `pathable-table-container--scrollable` scrolls a wide table horizontally, and
  shows the PathAble focus ring when focused. Add `tabindex="0"` to it.
