---
'@pathableai/styles': patch
---

Fix a long single word in a card heading (`pathable-card__heading`) overflowing
the card at increased text size on a narrow viewport. The word now breaks
(`overflow-wrap: break-word`) so it stays inside the card. Headings whose word
is wider than the heading's content box, even if it fit in the card's padding,
now break too. A title rendered in `pathable-card__header` is unchanged.
