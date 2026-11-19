---
'@pathableai/styles': patch
---

`pathable-sr-only` no longer adds about 999em of horizontal scroll to a right-to-left page. It is now offset 999em above its containing block instead of 999em to its left, so hidden text stays off screen, and in the accessibility tree, without extending the scrollable area in either page direction or in mixed-direction content.
