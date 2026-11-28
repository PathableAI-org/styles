---
'@pathableai/styles': patch
---

A `pathable-button` inside a `pathable-form` now has a top margin of 8 px, and 24 px from a viewport 480 px wide upward, as `usa-button` does inside `usa-form`. A button in a `pathable-button-group` inside the form gets no top margin from the form, so the group's 8 px spacing and the buttons' 40 px height hold there too. Previously the margin applied to the USWDS class only, so a submit button touched the last field above it and that field's focus ring was drawn over the button. No class or token changed.
