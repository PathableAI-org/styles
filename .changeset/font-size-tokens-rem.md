---
'@pathableai/styles': minor
---

**Breaking change**: express the font-size tokens in `rem` so text follows the browser's default
font size. `--pathable-font-size-*` and `--usa-font-size-*` (and the
`--ui-*` aliases) keep their current sizes at a 16px root: display-lg 2rem,
heading-lg 1.5rem, heading-md 1.25rem, heading-sm and body-lg 1.125rem,
body-md 1rem, body-sm and label-md 0.875rem, label-sm and caption-md 0.75rem.

**Migration:** at a root font size other than 16px, text sized with these
tokens now scales with it (at a 200% root, every size doubles). Consumers that
read the tokens as pixel values, for example in `calc()` with px lengths or
JavaScript that parses them, must handle `rem`.

The Sass variables `$ui-display-lg` to `$ui-caption-md` and the font sizes and
line heights in `$typography-scale` are `rem` too, so Sass that adds or
subtracts them with px lengths now fails with an incompatible-units error.
