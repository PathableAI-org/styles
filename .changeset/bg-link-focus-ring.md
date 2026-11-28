---
'@pathableai/styles': patch
---

Controls inside `pathable-bg-link` now draw the shared focus ring in white
(7.7:1), instead of Bright Blue Brooks (2.6:1). The controls are
`pathable-button`, `pathable-input`, `pathable-select` and `pathable-textarea`.

- Light containers nested in `pathable-bg-link` reset the ring to Bright Blue
  Brooks, so a white ring does not inherit into them: the `pathable-bg-surface`
  utility, the card container and the table.
- The info and plain alerts inside `pathable-bg-link` use the on-accent dark
  blue.
- A custom light container nested in `pathable-bg-link` should set
  `--pathable-surface-focus-ring: initial`.
