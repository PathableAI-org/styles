---
'@pathableai/styles': patch
---

A `pathable-card--flag` or `pathable-card--media-right` card now stacks like a
card with media when the card is narrower than 30rem, even from a 40em viewport,
so the 15rem media column never squeezes the text at a large text size.

- From a 40em viewport, a flag card whose width comes from its content (for
  example `width-auto` or a shrink-to-fit parent) is 30rem wide, or the viewport
  width if that is less, because its two-column layout depends on its own width.
  As a flex or grid item it shrinks to the space available and stacks below
  30rem.
- Below 40em a flag card is sized like any other card.
- From a 40em viewport, a flag card is an unnamed inline-size query container,
  so container queries and `cqi` or `cqw` units inside it resolve against the
  card.
