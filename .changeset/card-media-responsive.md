---
'@pathableai/styles': patch
---

Fix `.pathable-card__media` images and SVGs keeping their intrinsic width: media now scales to the card's width, so a 600px-wide image no longer overflows a card or scrolls the page horizontally on narrow viewports. Flag cards are sized the same way below the tablet breakpoint; above it they keep the USWDS cropped media column.

Two visible side effects: direct `img`, `svg`, `picture` and `video` children of `.pathable-card__media` are now block-level, so the gap under an inline image is gone and the content below moves up about 4px; and in a plain media card, `.pathable-card__media` now has `overflow: hidden` and clips its top corners to the card's inner radius, so anything positioned to stick out of the media is clipped.
