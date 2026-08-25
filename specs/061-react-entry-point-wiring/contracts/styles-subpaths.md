# Interface Contract: `@pathableai/styles` Subpath Exports

Module: `@pathableai/styles` → `packages/styles/package.json` `exports` map. Owned by
`packages/styles` (feature 057); this feature consumes it without modifying it.

## Exports map (consumed, not changed)

```jsonc
"exports": {
  ".":            "./dist/styles.css",
  "./js":         "./dist/pathable.js",
  "./js/init":    "./dist/pathable-init.js",
  "./components": "./dist/components.css",
  "./utilities":  "./dist/utilities.css",
  "./theme":      "./dist/theme-default.css",
  "./dist/*":     "./dist/*",
  "./src/*":      "./src/*"
}
```

## Subpaths relied upon by this feature

| Subpath       | Resolves to            | SCSS entry                  | Contents                                                              |
| ------------- | ---------------------- | --------------------------- | --------------------------------------------------------------------- |
| `./components`| `dist/components.css`  | `src/components.scss`       | Fonts + `.pathable-*` component wrappers + USWDS layout grid (no `:root` tokens) |
| `./utilities` | `dist/utilities.css`   | `src/utilities.scss`        | `.pathable-*` utility classes (no `:root` tokens)                     |

## Subpaths that must remain unchanged (FR-007)

| Subpath | Resolves to              | Meaning                                             |
| ------- | ------------------------ | --------------------------------------------------- |
| `.`     | `dist/styles.css`        | Full default stylesheet, including default theme tokens |
| `./theme` | `dist/theme-default.css` | Default `:root` token declarations                  |

## Preconditions / postconditions

- The `build` script emits all four `dist/*.css` files.
- The `files` array in `package.json` includes `dist`, so all four CSS files ship in the tarball.
- Consumers who import `@pathableai/styles/components` and `@pathableai/styles/utilities` receive
  structural styles without default tokens; adding `@pathableai/styles` (or `./theme`) restores the
  default token layer.

## Relationship to other contracts

- The React package's entry point that consumes these subpaths:
  [`react-entry-point.md`](./react-entry-point.md).
- The canonical consumer-facing mapping documentation: `packages/styles/README.md`.
