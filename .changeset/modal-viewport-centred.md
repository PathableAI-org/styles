---
'@pathableai/styles': patch
---

Keep the open Modal inside the viewport and centred. `.pathable-modal-overlay` now uses border-box sizing, so it matches the viewport instead of overflowing it by its padding, and collapses the whitespace beside its centring `::before`, so a full-width dialog no longer wraps below the viewport on 320 px and 375 px screens and is centred within the overlay on desktop. The overlay also stops smooth-scrolling to focused controls. Place only the dialog inside the overlay: the overlay sets `font-size: 0` and the dialog sets its own font size. No classes were renamed or removed.
