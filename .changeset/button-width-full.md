---
'@pathableai/styles': patch
---

`pathable-button` with `width-full` now fills its container at every
viewport width, instead of stopping at its content width from 30em up.

- The width utilities now win on a button at every viewport width, so
  `width-auto` also shrinks a button to its content width below 30em, where
  USWDS used to keep it full width.
