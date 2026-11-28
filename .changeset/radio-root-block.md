---
'@pathableai/styles': patch
---

A `pathable-radio` root that wraps the input and its label, such as `<label
class="pathable-radio">`, is now block-level, so each radio starts on its own
line instead of continuing the line of an inline sibling such as a
`pathable-hint` or the previous radio.

- The label's click target now spans the row.
- A bare `<input class="pathable-radio">` keeps its inline layout.
