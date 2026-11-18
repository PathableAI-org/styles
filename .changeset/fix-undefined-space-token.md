---
'@pathableai/styles': patch
---

Fix spacing that referenced an undefined `--space-2` token, so the browser
dropped the declaration and the gap rendered as 0. The SegmentedControl option
gap (icon to label), the app shell navigation list gap (between items) and the bottom
navigation item gap (icon to label) now use `--space-4` (4px). No token or class
is added, renamed or removed.
