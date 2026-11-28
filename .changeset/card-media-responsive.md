---
'@pathableai/styles': patch
---

`pathable-card__media` images and SVGs now scale to the card's width instead of
keeping their intrinsic width, so a 600px-wide image no longer overflows a card
or scrolls the page horizontally on narrow viewports.

- Flag cards are sized the same way below the tablet breakpoint. Above it they
  keep the USWDS cropped media column.
- Direct `img`, `svg`, `picture` and `video` children of `pathable-card__media`
  are now block-level, so the gap under an inline image is gone and the content
  below moves up about 4px.
- In a card with media, `pathable-card__media` now clips its top corners to the
  card's inner radius, so anything positioned to stick out of the media is
  clipped.
