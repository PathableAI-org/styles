---
'@pathableai/styles': minor
---

Adds the `pathable-step-indicator--counters`, `--counters-sm`, `--center` and
`--no-labels` modifier classes and the `pathable-step-indicator__heading-counter`
and `__heading-text` element classes. The step indicator's bars and counter
circles are now laid out in a one-cell grid instead of absolute positioning. At the
default text size they render where USWDS draws them. A long label no longer
widens its segment, so segments stay equal under enlarged text instead of
overflowing the row.
