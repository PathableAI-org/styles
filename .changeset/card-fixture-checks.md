---
'@pathableai/styles': minor
---

Adds the `pathable-card-group`, `pathable-card__img`,
`pathable-card--media-right`, `pathable-card__media--inset` and
`pathable-card__header--exdent`, `pathable-card__body--exdent` and
`pathable-card__footer--exdent` classes.

- Unlike `usa-card-group`, a `pathable-card-group` has no side margins, and a
  card in it fills the group at every width unless it has its own width or
  column class.
- A card group that is a direct child of `pathable-prose` keeps its own list
  reset and card spacing.
- A card group ignores margin-top, margin-bottom and padding-left utilities, and
  a card in it ignores max-width and margin-bottom utilities.
- A button that is a direct child of an exdent part keeps its padding and lines
  up with the text. Utilities for side padding, left margin and max-width do not
  apply to it.
