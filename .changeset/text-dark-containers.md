---
'@pathableai/styles': patch
---

`pathable-text` on a `<div>`, `<li>` or other element inside `pathable-section--dark` or `pathable-dark-background` (and on a `<span>` inside `pathable-section--dark`) now takes the container's light text colour instead of the theme text colour, so it is readable on the dark background. It was 1.36:1 in `pathable-section--dark` and 1:1 in `pathable-dark-background`; it now matches a `<p>` there. Tone modifiers do not change the colour on a dark container, as before on a `<p>`.
