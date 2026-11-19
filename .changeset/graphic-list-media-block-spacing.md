---
'@pathableai/styles': patch
---

`pathable-media-block` children of `pathable-graphic-list` now get the list's spacing: 2rem below each direct child block (4rem from 40em, none on the last), a 1.5rem gap after the image, and no top margin on the body's first child. Before, only the framework's `usa-media-block` classes got it. If you added spacing between the blocks yourself (for example with `pathable-stack`) or set the image gap, remove it, or it adds to the new spacing. Blocks inside a `pathable-grid` keep the grid's gap only.
