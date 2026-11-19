---
'@pathableai/styles': patch
---

Fix a long single word in a card heading (`pathable-card__heading`) or header
(`pathable-card__header`) overflowing the card at increased text size on a
narrow viewport. The word now breaks (`overflow-wrap: break-word`) so it stays
inside the card.
