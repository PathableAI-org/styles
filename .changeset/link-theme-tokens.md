---
'@pathableai/styles': patch
---

`.pathable-link` now takes its colour from `--pathable-color-link` and its
focus outline colour from `--pathable-color-focus-ring`, so a theme override of
`link` or `focusRing` reaches it. Default colours are unchanged; the hover and
active colours are now derived by darkening the link colour, so they can differ
slightly from the previous fixed values.
