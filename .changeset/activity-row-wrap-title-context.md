---
'@pathableai/styles': minor
---

**Breaking change**: the activity row title and context now wrap instead of
ending in an ellipsis, so no text is lost when the root font size is large. The
status text, date and owner text still stay on one line and truncate. The row
now wraps its other parts onto a new line before the title and context column
is narrower than 12rem. `activity-list.md` splits the `single-line-truncation`
guarantee and adds `title-context-wrap` and `body-min-width`.

**Migration:** rows are taller when a title or context is long. A fixed-height
or virtualised activity list that relied on one-line rows must measure its rows
or allow them to grow.
At narrow widths, rows with short titles can be a line taller than before and
rows in one list can break their lines differently, because the title column
now keeps a 12rem minimum before the other parts move to a new line.
