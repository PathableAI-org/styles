---
'@pathableai/styles': patch
---

`.pathable-link` now takes its colour from `--pathable-color-link` and its
focus outline colour from `--pathable-color-focus-ring` (or
`--pathable-surface-focus-ring` on a surface that sets it), so a theme override
of `link` or `focusRing` reaches it. On a `pathable-surface` variant that sets `--pathable-surface-focus-ring`, the link's focus outline now uses that colour, as other controls do. Otherwise default rendering is unchanged. The hover
and active colours stay fixed brand values.
