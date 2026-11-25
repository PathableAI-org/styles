---
'@pathableai/styles': minor
---

Adds `pathable-pagination__button`, `__page-no`, `__previous-page`, `__next-page` and `__link-text`, wrapping the USWDS pagination classes. `pathable-current` on a page button now gets the USWDS current-page look and `pathable-icon` in a pagination gets the 18 px arrow size. The 44 px touch target now applies to page buttons as well as arrow links. A `pathable-pagination__link` inside a numbered item no longer gets button styling; use `pathable-pagination__button`, as documented. The pagination list now wraps onto further centred rows, 8 px apart, when it does not fit, instead of running past the viewport (a deviation from USWDS's one-row list).
