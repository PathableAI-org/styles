---
'@pathableai/styles': patch
---

The checked fill of radio buttons and checkboxes in `pathable-wayfinder__question-controls` now uses `--pathable-color-action-primary-bg` instead of `--pathable-color-accent`, so a checked choice has at least 3:1 contrast against the panel (WCAG 1.4.11). The brand accent was 2.78:1 on the white panel. The React `Wayfinder` inherits the fix.
