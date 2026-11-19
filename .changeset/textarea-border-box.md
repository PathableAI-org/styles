---
'@pathableai/styles': patch
---

`pathable-textarea` now sizes with `box-sizing: border-box`, like `pathable-input`, and like a textarea inside `pathable-form`, `pathable-form-stack` or a form row from 1024px. It was 18px wider than its container (its padding and border sat outside `width: 100%`), which stuck out beside an input and caused horizontal scrolling at 375px. A standalone textarea is also 18px shorter, 160px instead of 178px, because USWDS's `height: 10rem` now includes its padding and border. The React `Textarea` inherits the fix.
