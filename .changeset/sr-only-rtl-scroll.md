---
'@pathableai/styles': patch
---

`pathable-sr-only` no longer adds about 999em of horizontal scroll to a right-to-left page. In a page whose `<html>` element has `dir="rtl"`, the hidden text is now offset 999em to the right instead of 999em to the left, the side that page does not scroll to, so it stays off screen and in the accessibility tree. Left-to-right pages are unchanged.
