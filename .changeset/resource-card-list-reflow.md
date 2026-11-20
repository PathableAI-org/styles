---
'@pathableai/styles': patch
---

`pathable-resource-card--list` now stacks its media above the body at viewport widths of 480px and narrower, instead of keeping a fixed 160px media column. At a 320px viewport the text column was 30px wide and the card and page scrolled horizontally; the text now uses the card's full width and the page no longer scrolls sideways.
