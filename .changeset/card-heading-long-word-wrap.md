---
'@pathableai/styles': patch
---

Fix a long single word in a `pathable-card__heading` overflowing the card at
increased text size on a narrow viewport. The heading now breaks the word
(`overflow-wrap: break-word`) so it stays inside the card.
