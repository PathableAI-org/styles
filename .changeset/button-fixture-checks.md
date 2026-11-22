---
'@pathableai/styles': minor
---

Add the `pathable-button-group__item` and `pathable-button-group--segmented`
classes, the wrappers for USWDS's `usa-button-group__item` and
`usa-button-group--segmented`. A segmented group is one row that never wraps,
with joined buttons and rounded outer corners only.

Buttons inside a `pathable-button-group` now get the group's rules for a
`usa-button`: square inner corners in a segmented group, and the hover and
focus layering. An outline button in a segmented group no longer draws a
separator line on its right edge. The separator of a disabled button in a
segmented group is drawn in the surface colour (white by default), as USWDS
does. Below 480px the divider between two outline segments is 2px wide, the
same as the outer border, and in forced colours every divider is a single line.
A width class (`width-auto`, `pathable-width-auto` or another `width-*`) now
wins on a button in a segmented group at every viewport width, and below 480px
the button's item takes the button's width, so the strip stays joined.
`width-full` keeps a segmented button at its share of the strip.

A `pathable-icon` inside a `pathable-button` no longer shrinks when the label is
long.

`dist/img/sprite.svg`, the USWDS icon sprite that `<use href>` icons point at,
is now copied into the package's `dist/img` folder by the build.
