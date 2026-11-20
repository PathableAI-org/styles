---
'@pathableai/styles': patch
---

`pathable-bento-grid` now lays its tiles out above the 640px breakpoint. Its desktop `grid-template-areas` named `standard` in two cells that do not touch, so browsers dropped the whole declaration and every tile stacked in one cell. The featured tile now spans two columns and two rows, the standard and metric tiles sit beside it, and the two image tiles take the bottom row's outer cells, leaving the middle cell empty.
