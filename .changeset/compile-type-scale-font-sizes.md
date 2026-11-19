---
'@pathableai/styles': patch
---

Fix font sizes in Wizard, WorkflowPanel, BentoGrid, ChipRail, ScreenshotFrame, Alert and SaveStatus. Twenty-one declarations held an uncompiled Sass `type-scale(...)` call, which browsers dropped as invalid, so these regions inherited their size. They now compile to the theme type size (small 1rem, medium 1.125rem, large 1.5rem, and the other steps), so text in these components changes size.
