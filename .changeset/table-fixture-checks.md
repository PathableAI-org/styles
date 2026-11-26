---
'@pathableai/styles': minor
---

Adds the `pathable-table--stacked`, `pathable-table--stacked-header`,
`pathable-table--sticky-header` and `pathable-table-container--scrollable`
classes, wrapping the matching USWDS `usa-table` classes. They stack table rows
as blocks below 480 px, with border-box cells so the row separators span the
row, keep the header row in view while the table scrolls, and scroll a wide
table horizontally in a container that shows the PathAble focus ring when
focused (the consumer adds `tabindex="0"`). No class is renamed or removed.
