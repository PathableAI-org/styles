---
'@pathableai/styles': patch
---

Give Modal content padding on every side. `.pathable-modal__content` now has `2rem` padding on all sides, not only the top, so the heading, body text and footer buttons no longer touch the dialog's left and bottom edges. The content box uses `box-sizing: border-box` so the padding stays inside the dialog's width. As a result, the close button sits `2rem` in from the dialog's right edge instead of flush against it. No class is renamed or removed.
