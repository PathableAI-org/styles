---
'@pathableai/styles': patch
---

`pathable-modal` no longer lets its heading or footer buttons run past the dialog at 200 % text size on a narrow viewport. A long word in `pathable-modal__heading` now breaks inside the dialog. The dialog and overlay padding stay at their 100 % size instead of growing with the text. A row of buttons inside `pathable-modal__footer` wraps instead of overflowing off the left edge of the viewport, and a button label wider than the dialog breaks. Below 30em, buttons in such a row share a line when they fit, rather than each filling its own. The React `Modal` inherits the fix.
