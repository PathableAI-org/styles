---
'@pathableai/styles': patch
---

Fix `.pathable-button--outline` so that `pathable-button pathable-button--outline` renders as an outline button again: a transparent background, with a 2px inset border and text in the text color (`--pathable-color-text`). Before this fix the `.pathable-button` brand rule overrode the outline at equal specificity, so the outline modifier rendered as a filled primary button. The inverse outline (`pathable-button--outline pathable-button--inverse`) had the same primary fill at rest and is now transparent, as USWDS intends. Hover, active and disabled outline states are unchanged. No class is renamed or removed, and the React `Button` `outline` variant picks up the fix through the CSS.
