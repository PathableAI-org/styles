---
'@pathableai/styles': patch
---

`pathable-button-group` now keeps 8px between stacked buttons below 480px, so
the focus ring of a focused button shows on all four sides instead of being
covered by the next button.

- From 480px the row wraps onto more lines when its buttons do not fit, so none
  runs past the container.
