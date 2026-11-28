---
'@pathableai/styles': patch
---

`pathable-button pathable-button--unstyled` renders as an unstyled button again:
a transparent background with underlined link text in the link colour
(`--pathable-color-link`), instead of a filled primary button with no padding.

- A disabled unstyled button (native `disabled` or `aria-disabled="true"`) now
  stays transparent with the disabled text colour on hover, on press and, with
  `aria-disabled`, on focus, as in USWDS. It showed the filled disabled-button
  background.
