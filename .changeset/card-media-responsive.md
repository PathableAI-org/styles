---
'@pathableai/styles': patch
---

Fix `.pathable-card__media` images and SVGs keeping their intrinsic width: media
now scales to the card's width, so a 600px-wide image no longer overflows a card
or scrolls the page horizontally on narrow viewports.
