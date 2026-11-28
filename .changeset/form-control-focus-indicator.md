---
'@pathableai/styles': patch
---

`pathable-input`, `pathable-select` and `pathable-textarea` now show the brand
focus outline (`--pathable-color-focus-ring`, Bright Blue Brooks) on focus,
instead of the browser's default focus ring.

- The outline also shows on pointer focus, as the USWDS focus rule these fields
  were designed for does.
- Under `forced-colors: active` the outline uses the system `Highlight` colour.
