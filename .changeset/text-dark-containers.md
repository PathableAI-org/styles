---
'@pathableai/styles': patch
---

`pathable-dark-background` now sets `color: white` on itself, so content with no
colour of its own, such as text in a `<div>` or `<li>`, is readable on the dark
background instead of taking the theme text colour.
