---
'@pathableai/styles': patch
---

`pathable-pagination` now wraps onto further centred rows, 8px apart, when it
does not fit, instead of running past the viewport.

- The 44px touch target now applies to page buttons as well as arrow links, up
  to and including a 640px viewport.
- The overflow item is now 40px tall like the other items, instead of 56px.
- A `pathable-icon` in a pagination is exactly 18px.
