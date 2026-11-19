---
'@pathableai/styles': patch
---

`pathable-textarea` now sizes with `box-sizing: border-box`, like `pathable-input` and `pathable-select`. It was 18px wider than its container (its padding and border sat outside its `width: 100%`), which stuck out beside an input and caused horizontal scrolling at 375px. The React `Textarea` inherits the fix.
