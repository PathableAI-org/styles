---
'@pathableai/styles': patch
---

Fix `.pathable-button--unstyled` so that `pathable-button pathable-button--unstyled` renders as an unstyled button again: a transparent background with underlined link text in the link color (`--pathable-color-link`). Before this fix the `.pathable-button` brand rule overrode the unstyled modifier at equal specificity, so it rendered as a filled primary button with no padding. Hover, active, disabled and inverse unstyled states are unchanged and still follow USWDS. No class is renamed or removed, and the React `Button` `unstyled` variant picks up the fix through the CSS.
