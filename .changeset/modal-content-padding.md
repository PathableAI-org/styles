---
'@pathableai/styles': patch
---

Give Modal content padding on every side. `.pathable-modal__content` now has `var(--pathable-space-4)` (`2rem`) padding on all sides, not only the top, so the heading, body text and footer buttons no longer touch the dialog's left and bottom edges. The content box uses `box-sizing: border-box` so the padding stays inside the dialog's width. No class is renamed or removed.
