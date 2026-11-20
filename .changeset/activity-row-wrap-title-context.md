---
'@pathableai/styles': patch
---

Let the activity row title and context wrap instead of ending in an ellipsis,
so no text is lost when the root font size is large. The status text, date and
owner text still stay on one line and truncate. The row now wraps its other
parts onto a new line before the title and context column is narrower than
12rem. `activity-list.md` splits the
`single-line-truncation` guarantee and adds `title-context-wrap` and
`body-min-width`.
