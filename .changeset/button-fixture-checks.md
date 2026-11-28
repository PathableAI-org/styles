---
'@pathableai/styles': minor
---

Adds the `pathable-button-group__item` and `pathable-button-group--segmented`
classes. A segmented group is one row that never wraps, with joined buttons and
rounded outer corners only.

- Buttons in a segmented group have square inner corners, and the hover and
  focus layering USWDS gives a segmented button.
- An outline button in a segmented group draws no separator line on its right
  edge. The separator of a disabled button is drawn in the surface colour (white
  by default).
- Below 480px the divider between two outline segments is 2px wide, the same as
  the outer border. In forced colours every divider is a single line.
- A width class (`width-auto` or another `width-*`) wins
  on a button in a segmented group at every viewport width, and below 480px the
  button's item takes the button's width, so the strip stays joined.
  `width-full` keeps a segmented button at its share of the strip.
