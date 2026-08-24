# Contract: Package Exports and Split CSS Files

The public interface of this feature is the `@pathableai/styles` package `exports` map
and the three new compiled CSS files it exposes. These are the consumer-facing contract;
they are validated against the package contents before release.

## `exports` map (authoritative, in `packages/styles/package.json`)

```json
"exports": {
  ".": "./dist/styles.css",
  "./js": "./dist/pathable.js",
  "./js/init": "./dist/pathable-init.js",
  "./components": "./dist/components.css",
  "./utilities": "./dist/utilities.css",
  "./theme": "./dist/theme-default.css",
  "./dist/*": "./dist/*",
  "./src/*": "./src/*"
}
```

Notes:

- The pre-existing `./js`, `./js/init`, `./dist/*`, and `./src/*` subpaths are unchanged.
- `.` continues to resolve to `dist/styles.css` (the combined stylesheet).
- New subpaths are added only; nothing is removed or renamed.

## File contracts

| Import | Resolves to | Guarantees |
| ------ | ----------- | ---------- |
| `@pathableai/styles` | `dist/styles.css` | Identical to today's behavior. |
| `@pathableai/styles/components` | `dist/components.css` | Component classes referencing `var(--pathable-*)`; no default `:root` theme tokens. |
| `@pathableai/styles/utilities` | `dist/utilities.css` | Utility classes; no default `:root` theme tokens. |
| `@pathableai/styles/theme` | `dist/theme-default.css` | The default `:root` token declarations (brand + semantic color, plus non-color tokens). |

## Invariants

1. `components.css` + `utilities.css` + `theme-default.css` together produce the same
   rendered output as `styles.css`.
2. Exactly one `:root` block declares the complete `--pathable-color-*` set (enforced by
   `lint:tokens`).
3. No token value, name, or count changes between the split files and the prior
   `styles.css`.
