---
'@pathableai/styles': patch
---

Fields in a `.pathable-form-stack` are now spaced by the stack gap alone. Direct `.pathable-form-group` children of a form stack no longer add their 24 px top margin, and the first `.pathable-label` in any `.pathable-form-group` no longer adds its own top margin, matching the USWDS reset for `.usa-label`. Forms that relied on the extra space can choose a larger gap with a `.pathable-stack--gap-*` modifier.
