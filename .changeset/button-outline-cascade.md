---
'@pathableai/styles': patch
---

`pathable-button pathable-button--outline` renders as an outline button again: a
transparent background, with a 2px inset border and text in the text colour
(`--pathable-color-text`), instead of a filled primary button.

- The inverse outline (`pathable-button--outline pathable-button--inverse`) is
  now transparent at rest, as USWDS intends, instead of the primary fill.
