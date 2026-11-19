---
'@pathableai/styles': patch
---

`pathable-text` on a `<div>`, `<li>` or other element inside `pathable-section--dark` or `pathable-dark-background` (and on a `<span>` inside `pathable-section--dark`) now takes the container's white text colour instead of the theme text colour, so it is readable on the dark background. It was 1.36:1 in `pathable-section--dark` and 1:1 in `pathable-dark-background`. A tone modifier or `--pathable-text-color` still sets the colour. `pathable-dark-background` now sets `color: white` on itself, and `pathable-surface--raised`, `--inset` and `--interactive` set the theme text colour, so `pathable-text` on a `<div>` or `<li>` inside one keeps a readable colour in a dark container. A `<p>`, heading or link inside a light surface in a dark container is still recoloured by the container, as before.
