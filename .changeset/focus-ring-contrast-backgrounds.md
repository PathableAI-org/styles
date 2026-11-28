---
'@pathableai/styles': patch
---

Focus outlines that components draw outside themselves now take their colour
from the background behind them (`--pathable-surface-focus-ring`), so they keep
3:1 contrast on Intelligent Jade, Shilling Silver and danger red. This covers
`pathable-link`, `pathable-button--unstyled` and the card outline.

- The `bg-secondary`, `bg-success`, `bg-base` and `bg-error` utilities and the `pathable-alert--success`, `--warning`,
  `--error` and `--emergency` alerts now set the ring for the controls on them:
  on-accent blue, PathAble Blue, and white on the emergency alert.
- On those backgrounds the ring no longer uses `--pathable-color-focus-ring`, so
  a theme's `focusRing` override does not reach controls there.
- The `hover:` variants of those utilities and of `bg-primary-vivid` set the
  ring only while the container is hovered.
- Other background classes, including `bg-secondary-vivid`, `bg-ink` and
  `bg-accent-cool-dark`, leave the ring as it is.
- The outline is unchanged outside those backgrounds.
