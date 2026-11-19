---
'@pathableai/styles': patch
---

`.pathable-link` now takes its colour from `--pathable-color-link` and its
focus outline colour from `--pathable-color-focus-ring` (or
`--pathable-surface-focus-ring` on a surface that sets it), so a theme override
of `link` or `focusRing` reaches it. Default rendering is unchanged. The hover
and active colours stay fixed brand values.
