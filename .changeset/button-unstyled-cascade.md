---
'@pathableai/styles': patch
---

Fix `.pathable-button--unstyled` so that `pathable-button pathable-button--unstyled` renders as an unstyled button again: a transparent background with underlined link text in the link color (`--pathable-color-link`). Before this fix the `.pathable-button` brand rule overrode the unstyled modifier at equal specificity, so it rendered as a filled primary button with no padding. A disabled unstyled button (native `disabled` or `aria-disabled="true"`) also showed the filled disabled-button background on hover, on press and, with `aria-disabled`, on focus; it now stays transparent with the disabled text color, as in USWDS. Hover, active and inverse unstyled states are unchanged. No class is renamed or removed, and the React `Button` `unstyled` variant picks up the fix through the CSS.
