---
'@pathableai/styles': patch
---

`.pathable-interaction-states-demo` now sets `color: var(--pathable-color-text)`. Before this, a natively disabled `<button>` with the class took the browser's disabled text colour on top of the disabled opacity, so its label was much fainter than an `aria-disabled` one. Both now show the same text colour at the same reduced opacity. Text in every other state also changes to `--pathable-color-text`: on a `<button>` it was the browser's default button text colour, and on any other element with the class it was inherited from the parent. The interaction-state mixins themselves are unchanged. A control that includes them still sets its own `color`, as `.pathable-icon-button` and `.pathable-segmented-control` already do.
