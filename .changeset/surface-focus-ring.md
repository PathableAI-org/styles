---
'@pathableai/styles': minor
---

Adds the `--pathable-surface-focus-ring` custom property, which sets the colour
of the shared focus outline on `pathable-button`, `pathable-input`,
`pathable-select` and `pathable-textarea` to suit the background behind them, so
the outline stays visible there. Without it, the outline keeps
`--pathable-color-focus-ring`. `pathable-button--unstyled` keeps its USWDS 4px
ring.

- The `bg-primary` utility (with its `hover:` variant) and
  `pathable-dark-background` reset the property, so a dark container inside a
  Jade or Silver background keeps the Bright Blue Brooks ring.
  `bg-primary-vivid` sets a light ring instead.
- A button or form field that carries one of those utilities itself keeps the
  ring of the background behind it.
- Outside a background that sets the property, nothing changes.
- If you put a dark container of your own inside a Jade or Silver background,
  set `--pathable-surface-focus-ring: initial` on it, or its controls inherit
  the background's dark ring.
- To give a container of your own a different ring, set the property to that
  colour.
