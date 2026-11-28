---
'@pathableai/styles': patch
---

Controls inside `bg-primary-vivid` now draw the shared focus ring in white
(7.7:1), instead of Bright Blue Brooks (2.6:1). The controls are
`pathable-button`, `pathable-input`, `pathable-select` and `pathable-textarea`.

- Light containers nested in `bg-primary-vivid` reset the ring to Bright Blue
  Brooks, so a white ring does not inherit into them: the `bg-white`
  utility, the card container and the table.
- The info alerts inside `bg-primary-vivid` use the on-accent dark
  blue.
- A custom light container nested in `bg-primary-vivid` should set
  `--pathable-surface-focus-ring: initial`.
