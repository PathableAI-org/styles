---
'@pathableai/styles': patch
---

A `.pathable-radio` root that wraps the input and its label, such as the `<label>` rendered by the React `Radio`, is now block-level, so each radio starts on its own line instead of continuing the line of an inline sibling such as a `.pathable-hint` or the previous radio. Its label's click target now spans the row. The class is unchanged, and a bare `<input class="pathable-radio">` keeps its inline layout.
