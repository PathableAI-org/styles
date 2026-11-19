---
'@pathableai/styles': patch
---

Focus on `pathable-button` and its filled modifiers now shows the brand focus outline, 2px of `--pathable-color-focus-ring` (Bright Blue Brooks), instead of the browser's default ring. It is the shared outline the form controls and icon button use: it also shows after a pointer click, like theirs, and uses the system `Highlight` colour under forced colors. `pathable-button--unstyled` keeps its USWDS 4px Bright Blue Brooks ring. The React `Button` inherits the fix.
