# 01 — Consolidated Theme Token CSS and Granular Exports

Status: NOT STARTED

## Parent Plan

[../react-theming.md](../react-theming.md) — Target state § "Consolidated `:root` Token Block" and "Granular CSS Subpath Exports"; Transition Plan Phase 0

## Scope

Harden the `@pathableai/styles` output contract before the React theming API sits on top of it. Consolidate every `--pathable-color-*` declaration into a single `:root` block, split the compiled stylesheet into three separable layers (components, utilities, theme tokens), and expose granular subpath exports so a consumer can import component styles without also importing the default theme tokens. This feature is entirely within the styles package; it ships no React changes and no token value changes.

## Includes

- Audit the current `:root` blocks across the SCSS partials (`_semantic.scss`, `_colors.scss`, `_components-custom-properties.scss`, `_utilities.scss`, and any component-wrapper partials) and record where each `--pathable-color-*` custom property is currently declared.
- Consolidate all `--pathable-color-*` declarations into exactly one `:root` block in `_semantic.scss` (the source of truth for semantic color tokens).
- Split the compiled output into three files:
  - `components.css` — component styles that reference tokens via `var(--pathable-*)`
  - `utilities.css` — utility classes
  - `theme-default.css` — the single consolidated `:root` token block (including brand and semantic color tokens)
- Update the `sass` build script so the three files are emitted alongside the existing combined `dist/styles.css`.
- Add `exports` subpaths to `packages/styles/package.json`: `./components`, `./utilities`, and `./theme`, keeping `.` → `dist/styles.css` unchanged.
- Verify the three split files, when loaded together, produce behavior identical to today's `dist/styles.css`.
- Unit-verify (via the existing `lint:tokens` script or a new check) that there is exactly one `:root` block declaring `--pathable-color-*` tokens.

## Excludes

- Changing any token *value* (hex, font, spacing, etc.).
- Adding, removing, or renaming tokens.
- Any React package changes.
- Removing the default `import '@pathableai/styles'` path or changing what `.` resolves to.
- Non-color token consolidation (typography, spacing, component custom properties may remain in their own blocks unless they are `--pathable-color-*`).

## Dependencies

- None (foundation for the rest of the theming work).

## DONE Means

- `dist/styles.css` contains exactly one `:root` block that declares the complete `--pathable-color-*` token set.
- `dist/components.css`, `dist/utilities.css`, and `dist/theme-default.css` are emitted by the build.
- `packages/styles/package.json` `exports` includes `./components`, `./utilities`, and `./theme`.
- Loading `components.css` + `utilities.css` + `theme-default.css` renders identically to loading `dist/styles.css`.
- `import '@pathableai/styles'` (the default path) renders identically to today.
- CI passes (styles lint, token lint, and build).
