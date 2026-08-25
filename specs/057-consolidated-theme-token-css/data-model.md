# Data Model: Consolidated Theme Token CSS and Granular Exports

This feature has no runtime data model; its "entities" are the compiled artifacts and
the source partials that produce them.

## Compiled Artifacts (the public contract)

| Artifact | Role | Produced by |
| -------- | ---- | ----------- |
| `dist/styles.css` | Combined stylesheet; default entry point `.`. Unchanged in behavior. | `src/index.scss` |
| `dist/components.css` | Component styles referencing `var(--pathable-*)`; no default theme `:root` tokens. | `src/components.scss` |
| `dist/utilities.css` | Utility classes (`.pathable-{module}-{value}` plus responsive/state variants). | `src/utilities.scss` |
| `dist/theme-default.css` | The default token declarations: brand + semantic color and all non-color token blocks. | `src/theme-default.scss` |

Invariant: `components.css` ∪ `utilities.css` ∪ `theme-default.css` ≡ `styles.css`
(identical rendered behavior).

## Source Partials

| Partial | Token category emitted |
| ------- | ---------------------- |
| `_colors.scss` | `--pathable-brand-*` |
| `_semantic.scss` | `--pathable-color-*` (the single consolidated block) |
| `_typography.scss` | `--pathable-font-*`, `--usa-font-*`, `--ui-*` |
| `_spacing.scss` | `--space-*`, `--pathable-space-*` |
| `_elevation.scss` | `--elevation-*` |
| `_radius.scss` | `--radius-*` |
| `_utilities-config.scss` (new) | none (map definitions only) |
| `_utilities-tokens.scss` (new) | `--pathable-{module}-{value}` / `--usa-{module}-{value}` |
| `_utilities.scss` | utility class rules only |
| `_components-custom-properties.scss` | `--pathable-{component}-*` / `--usa-{component}-*` |
| `pathable-component-wrappers/*` | component class rules |
| `_fonts.scss` | `@font-face` rules |

## Package `exports` (the import contract)

```json
{
  ".": "./dist/styles.css",
  "./components": "./dist/components.css",
  "./utilities": "./dist/utilities.css",
  "./theme": "./dist/theme-default.css"
}
```
