---
'@pathableai/styles': patch
---

USWDS components now get `box-sizing: border-box` from USWDS's own component mixins, through the `$theme-global-border-box-sizing: false` theme setting, instead of from local patches. This fixes content-box layout such as a one-line alert body growing taller than its icon needs. The package still does not emit USWDS's global sizing reset, and content placed inside a card keeps the sizes it has outside one.
