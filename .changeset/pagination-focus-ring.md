---
'@pathableai/styles': patch
---

`pathable-pagination` page buttons, arrow links and the current page button now
show the PathAble focus ring (Bright Blue Brooks) instead of the browser
default.

- To keep the ring on its white background, the pagination has 4px of padding
  above and below (8px below at 640px and narrower, or on a coarse pointer),
  with its margin reduced by the same amount.
- On a coloured surface its white box is therefore taller, and an element whose
  margin collapses with the pagination's sits up to 4px (8px) lower.
