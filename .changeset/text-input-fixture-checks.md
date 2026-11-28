---
'@pathableai/styles': minor
---

Adds the `pathable-input--success` state modifier and the `pathable-input--2xs`,
`--xs`, `--sm`, `--small`, `--md`, `--medium`, `--lg`, `--xl` and `--2xl` width
modifiers.

- The width modifiers cap the input at the USWDS input widths (5ex to 50ex) and
  win over the form's own width rule, including inside a `pathable-form`.
- The success border is the theme's dark green (`#0d7a63`, 5.3:1 on white)
  rather than its success colour (2.8:1), so the state border meets the 3:1
  non-text contrast minimum.
