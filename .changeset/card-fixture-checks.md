---
'@pathableai/styles': minor
---

Add the `pathable-card-group`, `pathable-card__img`, `pathable-card--media-right`, `pathable-card__media--inset` and `pathable-card__{header,body,footer}--exdent` classes, the wrappers for their USWDS `usa-card` counterparts.

Unlike `usa-card-group`, a `pathable-card-group` has no side margins, and a card in it fills the group at every width unless it has its own width or column class. A button that is a direct child of an exdent part keeps its padding and lines up with the text. A lone button that is a direct child of a card footer loses its right margin. A card group that is a direct child of `pathable-prose` keeps its own list reset and card spacing, and a card in it ignores max-width and margin-bottom utilities. A button that is a direct child of a card header, body or footer is never wider than the part and wraps its label; a word breaks inside only when it alone is wider than the button's content box. Utilities for side padding, left margin and max-width do not apply to a button that is a direct child of an exdent part, just as a margin-right utility does not apply to a lone button in a card footer.
