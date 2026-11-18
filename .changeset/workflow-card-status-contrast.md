---
'@pathableai/styles': patch
---

Workflow card status text (`.pathable-card__status` inside
`.pathable-card--workflow`) now uses `--pathable-color-text-success`, the
text-safe deep jade `#0d7a63` (5.3:1 on the white card surface), instead of
`--pathable-color-accent`, Intelligent Jade `#1cae96` (2.8:1), which failed
WCAG text contrast. The status text is visibly darker.

No token or class is added, renamed or removed.
