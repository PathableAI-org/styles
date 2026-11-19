---
'@pathableai/styles': patch
---

`pathable-modal` no longer lets its content run past the dialog at 200 % text size on a narrow viewport. A long word in `pathable-modal__heading` now breaks inside the dialog, and a row of buttons inside `pathable-modal__footer` wraps instead of overflowing off the left edge of the viewport. The React `Modal` inherits the fix.
