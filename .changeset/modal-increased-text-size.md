---
'@pathableai/styles': patch
---

`pathable-modal` no longer lets its heading or footer buttons run past the dialog at 200 % text size on a narrow viewport. A long word in `pathable-modal__heading` breaks inside the dialog, and a footer button label wider than the dialog breaks inside its button. The dialog and overlay padding stay at their 100 % size instead of growing with the text. A row of buttons inside `pathable-modal__footer` wraps instead of overflowing off the left edge of the viewport. Below 30em the buttons in such a row are sized from their labels, so at the default text size they sit side by side only when every label fits on one line, and otherwise stack. A `pathable-button-group` in the footer is unchanged. The React `Modal` inherits the fix.
