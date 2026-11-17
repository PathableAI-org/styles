---
'@pathableai/styles': minor
'@pathableai/react': patch
---

Render components in the exact PathAble brand palette.

- The USWDS theme color families now use the exact brand hex values instead of the nearest USWDS system colors (for example, PathAble Blue is `#00365c`, not `#162e51`). Lighter and darker shades are derived from the brand colors. Buttons, alerts, form controls, tags and other USWDS-based components change color slightly.
- Default text in USWDS-based components is PathAble Blue instead of near-black gray.
- `--pathable-color-link` and the default link color are now Tech Teal (`#015a76`, 7.7:1 on white). The previous value, Bright Blue Brooks (`#4899e8`), was only 3.0:1 on white and failed WCAG AA for text.
- `--pathable-color-focus-ring` and the USWDS focus outline are now Tech Teal (`#015a76`), which keeps at least 3:1 against both white and Shilling Silver.
- The `.pathable-bg-*` and `.pathable-text-*` color utilities use the exact brand and semantic values.
- USWDS warning and error colors now match the semantic warning (`#f5a623`) and danger (`#dc3545`) tokens.
- `pathable-button--accent-cool` keeps its Bright Blue Brooks background, now set from `--pathable-brand-bright-blue-brooks`.
- `@pathableai/react`: the default theme's `link` and `focusRing` values are now `#015a76`, matching the styles package.
