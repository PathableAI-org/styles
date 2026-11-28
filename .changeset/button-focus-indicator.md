---
'@pathableai/styles': patch
---

Focus on `pathable-button` and its filled modifiers now shows the brand focus
outline, 2px of `--pathable-color-focus-ring` (Bright Blue Brooks), instead of
the browser's default ring.

- The outline is the one the form controls use: it also shows after a pointer
  click, and uses the system `Highlight` colour in forced-colors mode.
- `pathable-button--unstyled` keeps its USWDS 4px Bright Blue Brooks ring.
