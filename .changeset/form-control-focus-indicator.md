---
'@pathableai/styles': patch
---

`.pathable-input`, `.pathable-select` and `.pathable-textarea` now show the brand focus outline (`--pathable-color-focus-ring`, Bright Blue Brooks) on focus, instead of the browser's default focus ring. On these fields the outline also shows on pointer focus, as the USWDS focus rule they were designed for does. Under `forced-colors: active` the outline uses the system `Highlight` colour. No classes were added, renamed or removed.
