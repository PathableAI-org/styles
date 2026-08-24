# Feature Specification: Theme Token Types and Vocabulary

**Feature Branch**: `058-theme-token-types`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Establish the typed theme vocabulary in `@pathableai/react`: the `ThemeColors` and `ThemeConfig` interfaces, the camelCase-to-kebab-case mapping between TypeScript keys and `--pathable-color-*` custom properties, and the public re-export of the semantic tone types."

## User Scenarios & Testing

### User Story 1 — Type-Safe Theme Color Override (Priority: P1)

A downstream application developer wants to customize brand colors in their app. They import `ThemeColors` and `ThemeConfig` from `@pathableai/react` and write a partial color override object. Their TypeScript editor autocompletes the valid color token keys, and an invalid key produces a compile-time error. They know with certainty which tokens exist and what each is named, without consulting CSS output or SCSS source.

**Why this priority**: This is the primary value proposition — typed discoverability of the theme surface. Without it, consumers must hand-write CSS property names as untyped strings, which is the status-quo pain point.

**Independent Test**: Can be fully tested by exporting the types from the package and verifying that TypeScript rejects invalid `ThemeColors` keys and accepts all 25 valid ones.

**Acceptance Scenarios**:

1. **Given** a TypeScript consumer importing `ThemeColors`, **When** they write `const overrides: Partial<ThemeColors> = { accent: "#7c3aed" }`, **Then** TypeScript accepts the assignment with autocomplete for `accent`.
2. **Given** a TypeScript consumer importing `ThemeColors`, **When** they write `const overrides: Partial<ThemeColors> = { accentColour: "#7c3aed" }`, **Then** TypeScript emits a compile error for the invalid key `accentColour`.
3. **Given** a TypeScript consumer inspecting `ThemeColors`, **When** they count the available keys, **Then** exactly 25 color token keys are present, matching the set of `--pathable-color-*` tokens defined by the styles package.

---

### User Story 2 — CamelCase-to-Kebab-Case Mapping (Priority: P2)

A downstream developer or a library internal (such as `ThemeProvider`) needs to convert a `ThemeColors` key to its corresponding `--pathable-color-*` CSS custom property name. They call a pure mapping function that accepts a camelCase key and returns the kebab-case property name. The mapping is deterministic and fully documented.

**Why this priority**: The mapping function is the bridge between the typed TS interface and the CSS runtime contract. Without it, providers that emit CSS custom properties would need to re-encode the conversion rules.

**Independent Test**: Can be fully tested by calling the mapping function with each valid `ThemeColors` key and verifying the output matches the documented CSS custom property name. No browser, no React tree, no stylesheets required.

**Acceptance Scenarios**:

1. **Given** a `ThemeColors` key `"actionPrimaryBg"`, **When** the mapping function is called with it, **Then** it returns `"--pathable-color-action-primary-bg"`.
2. **Given** a `ThemeColors` key `"textSuccess"`, **When** the mapping function is called with it, **Then** it returns `"--pathable-color-text-success"`.
3. **Given** a `ThemeColors` key `"onAccent"`, **When** the mapping function is called with it, **Then** it returns `"--pathable-color-on-accent"`.
4. **Given** all 25 valid `ThemeColors` keys, **When** the mapping function is called with each, **Then** every output is a valid `--pathable-color-*` CSS custom property name and each key maps to exactly one property name.

---

### User Story 3 — Public Tone and Elevation Type Exports (Priority: P3)

A downstream developer writing a component that accepts tone or elevation props wants to import the shared type vocabulary from `@pathableai/react`. They import `TextTone`, `SurfaceTone`, `BorderTone`, and `SurfaceElevation` from the package's public entry point and use them in their own prop type definitions. The types are already defined internally; this story makes them publicly discoverable.

**Why this priority**: Re-exporting existing internal types is a low-effort, high-value change that aligns component prop vocabularies with theme configuration. It does not require new type definitions or runtime behavior.

**Independent Test**: Can be fully tested by importing each type from `@pathableai/react` in a TypeScript file and verifying the TypeScript compiler accepts the import and understands the union values. No runtime execution needed.

**Acceptance Scenarios**:

1. **Given** a TypeScript consumer, **When** they write `import type { TextTone } from "@pathableai/react"`, **Then** the import resolves and `TextTone` has the same union values as the internal definition (`"default" | "muted" | "danger" | "success"`).
2. **Given** a TypeScript consumer, **When** they write `import type { SurfaceTone, BorderTone } from "@pathableai/react"`, **Then** both types resolve to their defined union values.
3. **Given** a TypeScript consumer, **When** they write `import type { SurfaceElevation } from "@pathableai/react"`, **Then** the type resolves to `"sm" | "md" | "lg" | "xl"`.

---

### User Story 4 — Build-Time Token Synchronization Check (Priority: P2)

A library maintainer adds a new `--pathable-color-*` token to `_semantic.scss` and attempts to build the project. The build or lint step fails because the new token has no corresponding key in `ThemeColors`. The failure message identifies which token is missing, preventing silent drift between the SCSS source of truth and the TypeScript interface.

**Why this priority**: Without an automated sync check, token drift between SCSS and TS is inevitable. Human reviewers cannot reliably spot a missing key in a 25-key interface. The check enforces the constitution principle that SCSS is the source of truth.

**Independent Test**: Can be tested by adding a new token to `_semantic.scss` without adding a corresponding `ThemeColors` key, then running the build or lint command and confirming it exits non-zero with a descriptive message.

**Acceptance Scenarios**:

1. **Given** all 25 semantic color tokens in `_semantic.scss` have corresponding keys in `ThemeColors`, **When** the build or lint sync check runs, **Then** it passes with exit code 0.
2. **Given** a new `--pathable-color-*` token is added to `_semantic.scss` without a matching `ThemeColors` key, **When** the build or lint sync check runs, **Then** it fails with exit code non-zero and a message identifying the missing mapping.
3. **Given** a key exists in `ThemeColors` that has no corresponding `--pathable-color-*` token in `_semantic.scss`, **When** the build or lint sync check runs, **Then** it fails with exit code non-zero and a message identifying the extraneous key.

---

### Edge Cases

- What happens when the mapping function receives a key that is not a valid `ThemeColors` key? It must return `undefined` and must not throw or produce a malformed CSS property name.
- What happens when an empty or nullish value is passed to the mapping function? It must return `undefined` without throwing.
- What happens when a `--pathable-color-*` token is renamed in SCSS? The sync check must fail, and the maintainer must update both the `ThemeColors` key and the mapping function before the build passes.

## Requirements

### Functional Requirements

- **FR-001**: The package must expose a `ThemeColors` TypeScript interface whose keys correspond 1:1 with the `--pathable-color-*` tokens defined in the styles package's `_semantic.scss` file. Each key must use camelCase naming (e.g., `actionPrimaryBg` maps to `--pathable-color-action-primary-bg`).
- **FR-002**: The package must expose a `ThemeConfig` TypeScript interface with a single `colors` field of type `ThemeColors`, structured to accept future token categories (typography, spacing, etc.) as additional optional fields.
- **FR-003**: The package must provide a pure, deterministic mapping function that accepts a `ThemeColors` key and returns the corresponding `--pathable-color-*` CSS custom property name. The function must have no side effects and must not depend on browser globals or the DOM.
- **FR-004**: The mapping function must return `undefined` when passed a value that is not a valid `ThemeColors` key, including `null`, `undefined`, or an unrecognized string, without throwing an exception.
- **FR-005**: The mapping from `ThemeColors` keys to CSS custom property names must be documented in the package for consumer reference.
- **FR-006**: The package's public entry point must re-export the `TextTone`, `SurfaceTone`, and `BorderTone` types from `packages/react/src/internal/resolvers/tone.ts` and the `SurfaceElevation` type from `packages/react/src/internal/resolvers/surface.ts`, so that consumers can import them from `@pathableai/react`.
- **FR-007**: An automated build or lint check must verify that the set of keys in `ThemeColors` exactly matches the set of `--pathable-color-*` tokens defined in `_semantic.scss`. Any mismatch (missing key or extraneous key) must cause the build or lint step to fail with a non-zero exit code.
- **FR-008**: The sync check failure message must identify which specific token names are missing or extraneous, not just report a count mismatch.
- **FR-009**: The mapping function must be covered by unit tests that exercise every valid `ThemeColors` key (happy path) and edge cases (`null`, `undefined`, and unrecognized string input).

### Key Entities

- **ThemeColors**: A TypeScript interface representing the complete set of semantic color tokens available for theming. Contains 25 camelCase string-valued keys, each mapping deterministically to one `--pathable-color-*` CSS custom property. This is the public vocabulary of overridable color tokens.

- **ThemeConfig**: A TypeScript interface wrapping a `colors: ThemeColors` field. Structured as an extensible bag so that future token categories (typography, spacing) can be added as siblings to `colors`.

- **CamelCase-to-Kebab-Case Mapping**: A deterministic, documented 1:1 relationship between each `ThemeColors` key (camelCase) and its `--pathable-color-*` CSS custom property name (kebab-case with `--pathable-color-` prefix). The mapping follows standard camelCase-to-kebab-case conversion where each uppercase letter denotes a word boundary prefixed with a hyphen.

- **Tone Types**: Union string literal types (`TextTone`, `SurfaceTone`, `BorderTone`) representing semantic meaning categories for text, surfaces, and borders respectively. Already defined internally; this feature makes them public exports.

- **SurfaceElevation**: A union string literal type (`"sm" | "md" | "lg" | "xl"`) representing the depth axis of surface primitives. Already defined internally; this feature makes it a public export.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A TypeScript consumer can autocomplete all 25 `ThemeColors` keys in their editor without consulting external documentation.
- **SC-002**: An invalid `ThemeColors` key produces a compile-time TypeScript error with a message that references the unrecognized key name.
- **SC-003**: The mapping function produces the correct `--pathable-color-*` property name for all 25 keys as verified by automated tests, with 100% key coverage.
- **SC-004**: The build or lint sync check detects a token added to `_semantic.scss` without a matching `ThemeColors` key within the time of a normal development build (under 5 seconds incremental).
- **SC-005**: All four tone/elevation types (`TextTone`, `SurfaceTone`, `BorderTone`, `SurfaceElevation`) are importable from `@pathableai/react` and the TypeScript compiler rejects any value outside each type's defined union.
- **SC-006**: Adding a new semantic token to SCSS and the corresponding `ThemeColors` key requires changes in exactly two locations (SCSS source and TypeScript interface) plus one test update, as verified by contributor documentation.
- **SC-007**: No existing consumer of `@pathableai/react` experiences a breaking change from the new type exports (all existing imports and types continue to resolve).

## Assumptions

- The 25 `--pathable-color-*` tokens in `_semantic.scss` are the stable, canonical set of semantic color tokens. No tokens are expected to be added or removed in the immediate term, and any changes follow the repository's versioning policy (token additions are minor changes).
- The existing `lint:tokens` script in `packages/styles` provides a reusable foundation for token extraction from SCSS source files. The sync check can be implemented as an extension of or alongside this script.
- The `TextTone`, `SurfaceTone`, `BorderTone`, and `SurfaceElevation` types as currently defined are the correct and complete vocabulary for their respective domains.
- Downstream consumers are using TypeScript, so the primary value of typed interfaces is realized at compile time. JavaScript consumers receive no runtime benefit from the type exports but are not harmed by their presence.
- The mapping function is intended for internal library use (e.g., by `ThemeProvider` to emit CSS custom properties) but may be exported as a public utility for advanced consumers.
- The `ThemeConfig` structure with a single `colors` field is intentional extensibility: future token categories (typography, spacing) can be added as sibling fields without breaking the `colors` contract.

## Dependencies

- Feature 057 (Consolidated Theme Token CSS and Granular Exports): The consolidated `:root` block in `_semantic.scss` is the canonical token list this feature derives `ThemeColors` from.
- `packages/styles/scripts/lint-tokens.mjs`: The existing token lint script provides the SCSS parsing infrastructure that the sync check can leverage or extend.

## Out of Scope

- The `defaultTheme` constant value (belongs to feature 03 — Default Theme and createTheme).
- The `createTheme` factory function (belongs to feature 03).
- The `ThemeProvider` component (belongs to feature 04).
- Runtime emission of CSS custom properties.
- Any changes to token values in `_semantic.scss`.
- Typography, spacing, elevation, or radius token types in `ThemeConfig`.
- Dark mode token variants.