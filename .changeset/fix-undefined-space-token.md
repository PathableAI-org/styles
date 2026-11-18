---
'@pathableai/styles': patch
---

Fix five declarations that referenced undefined tokens, which the browser dropped.

- The gap between a SegmentedControl option's icon and label, the gap between
  app shell navigation items, and the gap between a bottom navigation item's
  icon and label referenced `--space-2` and rendered as 0. They now use `--space-4` (4px).
- Workflow card status and meta text (`.pathable-card__status` and
  `.pathable-card__meta` inside `.pathable-card--workflow`) referenced
  `--usa-font-size-sm` and inherited the card's font size. They now use
  `--pathable-font-size-body-sm` (14px), so this text is visibly smaller.

No token or class is added, renamed or removed.
