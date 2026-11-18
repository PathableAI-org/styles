---
'@pathableai/styles': patch
---

The `state-loading` interaction-state mixin (and the combined `interaction-states` mixin, used by `.is-loading`) now draws an icon-sized spinner (`1em`) vertically centred at the control's inline end, inside the control's bounds, in the control's `currentColor`. Previously it drew a control-sized ellipse that spilled about 2 px past the right and bottom edges, in a border colour that can match the disabled background. The control's size is unchanged, and IconButton keeps its own centred, icon-sized spinner.
