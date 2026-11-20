---
'@pathableai/styles': patch
---

Fix font sizes in Wizard, WorkflowPanel, BentoGrid, ChipRail, ScreenshotFrame and SaveStatus. ChipRail's declaration now applies but renders the same. Twenty-one declarations held an uncompiled Sass `type-scale(...)` call, which browsers dropped as invalid, so these regions inherited their size. They now compile to the theme type size (small 1rem, medium 1.125rem, large 1.5rem, and the other steps), so text in these components changes size. No story renders SaveStatus, so its change is in the custom property default only. `--pathable-alert-font-size` and `--usa-alert-font-size` now hold `1rem` instead of an invalid value; no Alert rule reads them, so Alert renders the same.
