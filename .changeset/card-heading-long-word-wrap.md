---
'@pathableai/styles': patch
---

A long single word in a `pathable-card__heading` now breaks to stay inside the
card, instead of overflowing it at increased text size on a narrow viewport.

- A heading whose word is wider than the heading's content box, even if it fits
  in the card's padding, now breaks too.
