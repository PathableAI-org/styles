---
'@pathableai/styles': patch
---

`pathable-sr-only` no longer adds about 999em of horizontal scroll to a right-to-left page. It is now offset 999em from the inline-start edge instead of the left edge, so hidden text stays off screen, and in the accessibility tree, without extending the scrollable area in either writing direction.
