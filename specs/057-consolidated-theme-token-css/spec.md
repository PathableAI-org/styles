# Feature Specification: Consolidated Theme Token CSS and Granular Exports

**Feature Branch**: `057-consolidated-theme-token-css`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Harden the `@pathableai/styles` output contract before the React theming API sits on top of it. Consolidate every `--pathable-color-*` declaration into a single `:root` block, split the compiled stylesheet into three separable layers (components, utilities, theme tokens), and expose granular subpath exports so a consumer can import component styles without also importing the default theme tokens."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Single Consolidated Color Token Block (Priority: P1)

A developer consuming the compiled `@pathableai/styles` stylesheet wants to read and
reason about the complete color token set in one place. Today the `--pathable-color-*`
custom properties are scattered across several `:root` blocks emitted by different SCSS
partials, which makes the effective theme hard to audit and risks a later block silently
shadowing an earlier one. Consolidating them into a single `:root` block gives consumers
one unambiguous source of truth for the color-theming surface.

**Why this priority**: It is the source-of-truth change that the granular exports and the
future React theming API both depend on. Without a single canonical color block, the
theme token layer cannot be cleanly separated into its own file.

**Independent Test**: Run the styles build and inspect `dist/styles.css`; verify that every
`--pathable-color-*` declaration appears in exactly one `:root` block and no other `:root`
block declares a `--pathable-color-*` property. An automated check (token lint) confirms
the single-block invariant.

**Acceptance Scenarios**:

1. **Given** the SCSS partials that currently declare `--pathable-color-*` tokens, **When**
   the styles package is built, **Then** `dist/styles.css` contains exactly one `:root`
   block declaring the complete `--pathable-color-*` token set.
2. **Given** a developer searching for a specific color token, **When** they read the
   compiled stylesheet, **Then** that token is declared in one, and only one, `:root` block.
3. **Given** the token lint check runs, **When** any `--pathable-color-*` token is declared
   outside the single canonical block, **Then** the check fails with a descriptive error.

---

### User Story 2 - Granular Component, Utility, and Theme Subpath Exports (Priority: P2)

A developer using a custom theme provider (for example, the future `ThemeProvider`) wants
to import component styles and utility classes without also importing the default theme
tokens, so their provider's scoped tokens win the cascade instead of fighting the package's
default `:root` declarations. They can import exactly the layers they need via new subpath
exports.

**Why this priority**: It is the concrete consumer-facing payoff of the consolidation —
enabling theme tokens to be supplied by the consumer rather than the package. It builds on
the single consolidated block from User Story 1.

**Independent Test**: Import `@pathableai/styles/components` and
`@pathableai/styles/utilities` (and `@pathableai/styles/theme` when defaults are wanted),
then verify the rendered output matches the default import when the theme layer is also
loaded, and that the component/utility layers load without the default theme tokens.

**Acceptance Scenarios**:

1. **Given** a consumer imports `@pathableai/styles/components`, **When** the package is
   built and published, **Then** the import resolves to `dist/components.css` containing
   component styles that reference tokens via `var(--pathable-*)`.
2. **Given** a consumer imports `@pathableai/styles/utilities`, **When** the package is
   built and published, **Then** the import resolves to `dist/utilities.css` containing
   utility classes.
3. **Given** a consumer imports `@pathableai/styles/theme`, **When** the package is built
   and published, **Then** the import resolves to `dist/theme-default.css` containing the
   single consolidated `:root` token block (brand and semantic color tokens).
4. **Given** a consumer imports only `components` and `utilities`, **When** they inspect the
   loaded styles, **Then** no default `--pathable-color-*` `:root` tokens are loaded.

---

### User Story 3 - Backward-Compatible Default Import (Priority: P3)

A developer who already uses `import '@pathableai/styles'` must see no change in rendered
output. The default entry point continues to resolve to the combined `dist/styles.css`, and
the three split files, when loaded together, must produce behavior identical to today's
combined stylesheet.

**Why this priority**: It preserves the existing contract and prevents regressions for all
current consumers while the new granular exports are introduced. It is lower priority only
because it is a guarantee rather than new capability.

**Independent Test**: Compare the rendered output of loading `dist/styles.css` against
loading `components.css` + `utilities.css` + `theme-default.css` together; the two must be
visually and behaviorally identical, and the default import path must remain unchanged.

**Acceptance Scenarios**:

1. **Given** a consumer imports `@pathableai/styles` (the default path), **When** the package
   is built, **Then** the import still resolves to `dist/styles.css`.
2. **Given** the three split files are loaded together, **When** compared to
   `dist/styles.css`, **Then** the rendered output is identical.
3. **Given** the feature is delivered, **When** token values are compared to the prior
   release, **Then** no token value, name, or count has changed.

---

### Edge Cases

- A `--pathable-color-*` declaration that currently lives in a component-wrapper partial
  (not `_semantic.scss`) must be moved into the single consolidated block rather than left
  duplicated.
- Non-color tokens (typography, spacing, component custom properties) are not part of the
  color-theming surface and may remain in their own `:root` blocks; they must not be folded
  into the color block.
- If two partials currently declare the same `--pathable-color-*` name with different values
  (shadowing), consolidation must resolve to a single canonical declaration without changing
  the effective value.
- The three split files must be order-independent in aggregate: loading them together in any
  order must render identically to the combined stylesheet.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The compiled `dist/styles.css` MUST contain exactly one `:root` block that
  declares the complete `--pathable-color-*` custom property set.
- **FR-002**: The single consolidated color `:root` block MUST be authored in
  `packages/styles/src/.../_semantic.scss`, the source of truth for semantic color tokens.
- **FR-003**: The `@pathableai/styles` build MUST emit `dist/components.css`,
  `dist/utilities.css`, and `dist/theme-default.css` alongside the existing combined
  `dist/styles.css`.
- **FR-004**: `dist/components.css` MUST contain component styles that reference tokens via
  `var(--pathable-*)` and MUST NOT contain the default `:root` theme token declarations.
- **FR-005**: `dist/utilities.css` MUST contain utility classes and MUST NOT contain the
  default `:root` theme token declarations.
- **FR-006**: `dist/theme-default.css` MUST contain all default `:root` token
  declarations (brand, semantic color, typography, spacing, elevation, radius,
  utilities, and component custom properties) in a single file.
- **FR-007**: `packages/styles/package.json` MUST add `exports` subpaths `./components`,
  `./utilities`, and `./theme` resolving to the three new files, while keeping `.` resolving
  to `dist/styles.css`.
- **FR-008**: Loading `dist/components.css`, `dist/utilities.css`, and
  `dist/theme-default.css` together MUST produce rendered behavior identical to loading
  `dist/styles.css`.
- **FR-009**: The default `import '@pathableai/styles'` path MUST render identically to
  today's behavior.
- **FR-010**: An automated check (via the existing `lint:tokens` script or a new check) MUST
  verify that exactly one `:root` block declares `--pathable-color-*` tokens and fail
  otherwise.
- **FR-011**: The feature MUST NOT change any token value, add/remove/rename any token, alter
  any React package, or change what the default `.` entry resolves to.

### Key Entities

- **`dist/styles.css`**: The combined compiled stylesheet (default entry point), unchanged in
  behavior.
- **`dist/components.css`**: Compiled component styles referencing `var(--pathable-*)`.
- **`dist/utilities.css`**: Compiled utility classes.
- **`dist/theme-default.css`**: The single consolidated `:root` color token block.
- **`_semantic.scss`**: The SCSS source-of-truth partial owning the consolidated color block.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `dist/styles.css` contains exactly one `:root` block declaring the complete
  `--pathable-color-*` token set (verified by the token lint check).
- **SC-002**: `dist/components.css`, `dist/utilities.css`, and `dist/theme-default.css` are
  emitted by the build.
- **SC-003**: `packages/styles/package.json` `exports` includes `./components`, `./utilities`,
  and `./theme`.
- **SC-004**: Loading `components.css` + `utilities.css` + `theme-default.css` renders
  identically to loading `dist/styles.css` (100% visual parity).
- **SC-005**: The default `import '@pathableai/styles'` renders identically to today.
- **SC-006**: CI passes for styles lint, token lint, and build.

## Assumptions

- The styles package builds with Dart Sass via the `sass` npm package, per the project
  constitution; the build script change only splits the output, not the compiler.
- The existing `lint:tokens` script can be extended (or a new script added) to assert the
  single-`:root`-color-block invariant.
- The feature is entirely within `packages/styles`; no token values, token names, React
  packages, or the default `.` entry point change.
- Non-color tokens (typography, spacing, component custom properties) remain in their own
  blocks and are not consolidated.
