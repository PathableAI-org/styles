---
'@pathableai/styles': patch
---

`pathable-button` with `pathable-width-full` now fills its container at every
viewport width, instead of stopping at its content width from 30em up.

- The width utilities now win on a button at every breakpoint, including the
  `mobile-lg:`, `tablet:` and `desktop:` variants, so `pathable-width-auto` also
  shrinks a button to its content width below 30em, where USWDS used to keep it
  full width.
