---
'@pathableai/styles': patch
---

A `pathable-button` placed directly in a `.pathable-form-stack` now ends flush with the fields' right edge at every viewport width. Previously the USWDS button's `margin-right` (8 px) stayed once the button turned `width: auto` at the mobile-lg breakpoint, so the stack's stretched column ended the button 8 px short of the fields at tablet and desktop widths. Buttons outside a form stack, and buttons nested deeper inside one (for example in a button group), keep their margin, and a `pathable-margin-*` utility on the button still overrides the reset. No class or token changed; React `FormStack` inherits the fix.
