---
'@pathableai/styles': patch
---

A `pathable-button` inside a `pathable-form` now has a top margin of 8px, and
24px from a viewport 480px wide upward, as `usa-button` does inside `usa-form`.
Before, the margin applied to the USWDS class only, so a submit button touched
the last field above it and that field's focus ring was drawn over the button.

- A button in a `pathable-button-group` inside the form gets no top margin from
  the form, so the group's 8px spacing and the buttons' own height hold there
  too.
