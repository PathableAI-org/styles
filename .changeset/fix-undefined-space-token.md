---
'@pathableai/styles': patch
---

Fix declarations that referenced undefined tokens, which the browser dropped.

- The SegmentedControl option gap (icon to label), the app shell navigation
  list gap (between items) and the bottom navigation item gap (icon to label)
  referenced `--space-2` and rendered as 0. They now use `--space-4` (4px).
- Workflow card status and meta text (`.pathable-card__status` and
  `.pathable-card__meta` inside `.pathable-card--workflow`) referenced
  `--usa-font-size-sm` and inherited the card's font size. They now use
  `--usa-font-size-body-sm` (14px), so this text is visibly smaller.

No token or class is added, renamed or removed.
