---
'@pathableai/styles': patch
---

A `pathable-button` that is a direct child of a card header, body or footer is
now never wider than that part, and its label wraps.

- A word breaks inside the button only when it alone is wider than the button's
  content box.
- A lone button that is a direct child of a card footer loses its right margin,
  and a margin-right utility does not apply to it.
