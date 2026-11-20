---
'@pathableai/styles': patch
---

`pathable-sr-only` no longer adds about 999em of horizontal scroll to a right-to-left page, or to any scrolling container. It now hides its text in place, as a 1px box clipped to nothing (`position: absolute`, `width` and `height` of 1px, `margin: -1px`, `overflow: hidden`, `clip-path: inset(50%)`, `white-space: nowrap`), instead of moving it 999em to the left. The text stays in the accessibility tree. The element no longer keeps its natural width and height, and it is no longer offset from its containing block.
