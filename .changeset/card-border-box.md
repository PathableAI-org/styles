---
'@pathableai/styles': patch
---

`pathable-card__container` and the card's own parts (`pathable-card__header`,
`__body`, `__footer`, `__media` and `__img`) now use `box-sizing: border-box`,
so a card in a group no longer reaches 4px past its box and an inset media
column in a flag card is 15rem wide. Content placed in a card is not affected.
