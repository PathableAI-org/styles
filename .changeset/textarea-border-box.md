---
'@pathableai/styles': patch
---

`pathable-textarea` is no longer 18px wider than its container: it now sizes
with `box-sizing: border-box`, like `pathable-input` and like a textarea inside
`pathable-form` from 1024px.

- Before, its padding and border sat outside `width: 100%`, so it stuck out
  beside an input and caused horizontal scrolling at 375px.
- A standalone textarea that did not overflow is 18px smaller in each direction:
  its 30rem maximum width and USWDS's `height: 10rem` now include its padding
  and border, so it is 480px wide and 160px tall instead of 498px and 178px.
