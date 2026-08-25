# Research: Consolidated Theme Token CSS and Granular Exports

Phase 0 output for `057-consolidated-theme-token-css`. Records the audit of the current
`--pathable-color-*` declarations and the technical decisions for splitting the compiled
output and exposing granular exports.

## Audit: where `--pathable-color-*` is declared today

A grep of `packages/styles/src` for declarations (`--pathable-color-*:` with a value)
shows the complete semantic color set is declared in exactly one place:

- `packages/styles/src/_semantic.scss` — the single `:root { ... }` block (lines 78–108)
  declares all 25 `--pathable-color-*` tokens (`bg`, `surface`, `text`, `text-muted`,
  `border`, `link`, `accent`, `focus-ring`, `danger`, `success`, `text-success`,
  the four action tokens, the six status tokens, the three workflow tokens, and
  `on-accent`).

Every other `:root` block in the compiled output declares a different token category:

- `_colors.scss` → `--pathable-brand-*` (brand primitives, not `--pathable-color-*`).
- `_typography.scss` → `--pathable-font-*` / `--usa-font-*` / `--ui-*`.
- `_spacing.scss` → `--space-*` / `--pathable-space-*`.
- `_elevation.scss` → `--elevation-*`.
- `_radius.scss` → `--radius-*`.
- `_utilities.scss` → `--pathable-{module}-{value}` / `--usa-{module}-{value}`.
- `_components-custom-properties.scss` → `--pathable-{component}-*` /
  `--usa-{component}-*`.

Component wrapper partials only *reference* `var(--pathable-color-*)`; none *declare* a
`--pathable-color-*` property.

### Decision: keep `_semantic.scss` as the single source of truth; enforce via lint

- **Decision**: The consolidation invariant (exactly one `:root` block declaring
  `--pathable-color-*`) already holds. This feature preserves it and adds an automated
  assertion to `lint:tokens` (or an equivalent check) so future drift fails CI.
- **Rationale**: `_semantic.scss` is documented as the source of truth for semantic color
  tokens, and moving the tokens would churn the source for no benefit.
- **Alternatives considered**: Merging the brand `--pathable-brand-*` block from
  `_colors.scss` into the same `:root` block. Rejected — the DONE criteria require one
  block for `--pathable-color-*` specifically, and brand tokens use a distinct prefix;
  they belong together in `theme-default.css` but not in the semantic block.

## Decision: how to produce the three split files

The compiled `dist/styles.css` is assembled by `src/index.scss`, which `@forward`s the
token partials, `_utilities`, the USWDS layout grid, and the component wrappers. USWDS
core (`@use 'uswds-core' with (...)`) emits only settings documentation comments, not
`:root` tokens — verified empirically — so all `:root` blocks are authored by Pathable
partials.

- **Decision**: Compile three new SCSS entry files from the existing partials, and split
  `_utilities.scss` so its `:root` token block is separable from its class generation.
  - `theme-default.scss` → `@forward` `uswds-theme`, `_colors`, `_typography`,
    `_spacing`, `_elevation`, `_radius`, `_semantic`, `_utilities-tokens`,
    `components-custom-properties`.
  - `utilities.scss` → `@forward` `uswds-theme`, `_utilities` (class generation).
  - `components.scss` → `@forward` `fonts`, `uswds-theme`, `pathable-component-wrappers`,
    `usa-layout-grid/src/styles`.
- **Rationale**: Keeps SCSS as the authoring source of truth (constitution principle III)
  and reuses the existing partials. Sass guarantees the union of the three layers equals
  the combined output because they share the same configured `uswds-core` module.
- **Alternatives considered**:
  - *Post-compiling `styles.css` and splitting the text* — rejected because `.pathable-text-*`
    is overloaded (text-color utility, font-weight utility, text-align utility, and the
    `pathable-text` component) which makes rule classification fragile.
  - *Three entry files without splitting `_utilities`* — rejected because `_utilities`
    mixes a `:root` block with class rules, so it cannot be cleanly assigned to either
    `utilities.css` or `theme-default.css` alone.
- **Known artifact**: each of the three split files carries the USWDS settings
  documentation comments emitted by `@use 'uswds-core' with (...)`. This is comment-only
  and does not affect rendering or correctness.

## Decision: utility map extraction

- **Decision**: Move `$pathable-utilities`, `$pathable-utility-breakpoints`, and
  `$-spacing-tokens` into a new `_utilities-config.scss` (no CSS output). Both
  `_utilities-tokens.scss` and `_utilities.scss` `@use` it.
- **Rationale**: The map is required by both the token block and the class generation,
  but `@use`ing `_utilities` from a tokens partial would also emit the utility classes.
  A shared, output-free config partial avoids that coupling.
- **Alternatives considered**: Duplicating the map in two files — rejected (drift risk).
  Moving only the `:root` block while leaving the map in `_utilities.scss` — rejected
  because `_utilities-tokens.scss` would need to `@use` `_utilities` and would inherit
  its class output.

## Decision: `exports` subpaths

- **Decision**: Add `./components` → `./dist/components.css`, `./utilities` →
  `./dist/utilities.css`, and `./theme` → `./dist/theme-default.css`, keeping `.` →
  `./dist/styles.css` unchanged.
- **Rationale**: Matches the parent React-theming plan's documented consumer API and the
  spec's FR-007.
- **Alternatives considered**: Naming the theme subpath `./theme-default` — rejected
  because the parent plan and spec consistently use `./theme`.
