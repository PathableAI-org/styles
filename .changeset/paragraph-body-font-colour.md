---
'@pathableai/styles': patch
---

`pathable-paragraph` now uses the body font and the theme text colour outside
`pathable-prose`, instead of the browser's default serif font in black. Inside
alerts, site alerts, dark backgrounds, cards, summary boxes, footer sections and
the `text-<colour>` utilities it keeps the container's text colour.
