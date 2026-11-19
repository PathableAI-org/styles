---
'@pathableai/styles': patch
---

Fix button spacing in `pathable-wizard__actions`, `pathable-workflow-panel__actions` and `pathable-activity-row__actions`. Buttons in these regions no longer keep `usa-button`'s 0.5rem right margin, so the region's gap alone separates them. Below 480 px the wizard's Back and Continue buttons no longer touch,.
