---
'@pathableai/styles': patch
---

`pathable-link` now takes its colour from `--pathable-color-link` and its focus
outline colour from `--pathable-color-focus-ring`, so a theme override of `link`
or `focusRing` reaches it. The hover and active colours stay fixed brand values.
