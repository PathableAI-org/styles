---
'@pathableai/styles': minor
---

Add the `pathable-breadcrumb--truncate` modifier, the wrapper for USWDS's
`usa-breadcrumb--truncate`. From 480px it keeps the breadcrumb trail on one
line and cuts a trail wider than its container off at the end with an
ellipsis, instead of wrapping it.

Below 480px the parent link's list item in `pathable-breadcrumb` is a block
item; the link renders in the same place. The items hidden at that width stay
in the tab order for screen readers, and one whose link has focus is shown
above the parent link while it has focus, so the focus can be seen.

Breadcrumb links draw the PathAble focus outline (`--pathable-color-focus-ring`)
instead of the browser's default focus ring. `pathable-breadcrumb` resets
`--pathable-surface-focus-ring`, as the other light containers do, so the
outline stays visible on its white background inside a `pathable-bg-link`
container.
