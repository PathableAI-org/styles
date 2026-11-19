---
'@pathableai/styles': patch
---

`pathable-sr-only` no longer adds about 999em of horizontal scroll to a right-to-left page, and no longer does in any scrolling container either. It is now fixed-position, still 999em to the left of the viewport, so the hidden text stays off screen and in the accessibility tree while adding no scrollable area in either page direction. The class is no longer positioned against its nearest positioned ancestor (an ancestor with `transform`, `filter` or `contain` still contains it, as before).
