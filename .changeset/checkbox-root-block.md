---
'@pathableai/styles': patch
---

A `.pathable-checkbox` root that wraps the input and its label, such as the `<label>` rendered by the React `Checkbox`, is now block-level, so the checkbox starts on its own line instead of continuing the line of an inline sibling such as a `.pathable-hint`. Its label's click target now spans the row. The class is unchanged, and a bare `<input class="pathable-checkbox">` keeps its inline layout.
