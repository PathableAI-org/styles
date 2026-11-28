---
'@pathableai/styles': minor
---

**Breaking change**: Changes the Sass variables `$ui-display-lg` to `$ui-caption-md`, and the font sizes and line heights in `$typography-scale`, from `px` to `rem`, so text sized with them follows the browser's default font size. At a 16px root the sizes are unchanged: display-lg 2rem, heading-lg 1.5rem, heading-md 1.25rem, heading-sm and body-lg 1.125rem, body-md 1rem, body-sm and label-md 0.875rem, label-sm and caption-md 0.75rem.

**Migration**: at a root font size other than 16px, text sized with these variables now scales with it (at a 200% root, every size doubles). Sass that adds or subtracts the variables with `px` lengths now fails with an incompatible-units error: convert the `px` length to `rem`.
