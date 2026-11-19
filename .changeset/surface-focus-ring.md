---
'@pathableai/styles': minor
---

The shared focus outline on `.pathable-button`, `.pathable-input`, `.pathable-select`, `.pathable-textarea` and `.pathable-icon-button` now follows the surface it sits on, so it stays visible there. Each `.pathable-surface` variant with its own background sets the new `--pathable-surface-focus-ring` custom property:

- `--brand` and `--tone-primary` use `--pathable-color-on-accent`. Bright Blue Brooks is only 1.1:1 on Intelligent Jade.
- `--inset` and `--tone-subtle` use `--pathable-color-text`. Bright Blue Brooks is only 2.3:1 on Shilling Silver.
- `--raised`, `--interactive`, `--inverse` and `--tone-default` reset it, so the nearest surface wins when surfaces nest. Controls there keep `--pathable-color-focus-ring`, including a value from a scoped `ThemeProvider`.

The package's dark containers reset it too: the `pathable-bg-primary` and `pathable-bg-link` utilities (with their `hover:` variants), `.pathable-section--dark`, `.pathable-dark-background`, `.pathable-hero__callout` and `.pathable-identifier`. So a dark container inside a Jade or Silver surface keeps the Bright Blue Brooks ring. Outside a surface, and on `--base`, nothing changes. To give a container of your own a ring, set `--pathable-surface-focus-ring` on it. The icon button now follows the same property, and no longer sets `--pathable-icon-button-focus-ring` on the brand and inverse surfaces. Setting that property yourself still overrides the icon button's ring. On the brand surface, the icon button's ring changes from PathAble Blue to the on-accent dark blue. The React `Surface` (`subtle` and `primary`), `Button`, `Input`, `Select`, `Textarea` and `IconButton` inherit the change.
