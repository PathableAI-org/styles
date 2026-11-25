---
'@pathableai/styles': minor
---

Adds `pathable-pagination__button`, `__previous-page` and `__next-page`, wrapping the USWDS classes of the same names. Adds `pathable-pagination__page-no`, which takes the item style, and `pathable-pagination__link-text`, which keeps the "Previous"/"Next" label on one line (USWDS ships both unstyled). `pathable-current` on a page button now gets the USWDS current-page look, and `pathable-icon` in a pagination is exactly 18 px. The 44 px touch target now applies to page buttons as well as arrow links, up to and including a 640 px viewport. The overflow item is now 40 px tall like the other items, instead of 56 px. The pagination list now wraps onto further centred rows, 8 px apart, when it does not fit, instead of running past the viewport (a deviation from USWDS's one-row list).
