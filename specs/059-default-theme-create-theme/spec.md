# Feature Specification: Default Theme and createTheme

**Feature Branch**: `059-default-theme-create-theme`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Provide the theme data layer: an exported `defaultTheme` constant containing the complete default color token set, and a `createTheme` factory that deep-merges a partial theme with those defaults and returns a fully resolved, validated theme configuration. Pure data and pure functions only — no components and no DOM."

## User Scenarios & Testing

### User Story 1 — Complete Default Theme (Priority: P1)

A downstream application developer wants a reliable, complete baseline theme so they never have to assemble 25 color values by hand. They import the `defaultTheme` constant and receive the full set of semantic color tokens, each matching the canonical values published by the styles package (for example, `accent` is `#1cae96`, `bg` is `#dde2e8`, and `text` is `#00365c`). They can trust that every token defined in the styles source is present with the correct value.

**Why this priority**: The default theme is the foundation the entire theming layer is built on. Without an authoritative, complete set of default values, every downstream theme would have to re-declare the palette, which is the exact status-quo pain point this feature removes.

**Independent Test**: Can be fully tested by inspecting the exported `defaultTheme` and asserting that it contains exactly 25 color tokens whose values byte-for-byte match the authoritative semantic color source (`_semantic.scss`). No components, browser, or DOM required.

**Acceptance Scenarios**:

1. **Given** a consumer importing `defaultTheme`, **When** they inspect its color tokens, **Then** exactly 25 tokens are present, matching the complete set of semantic color tokens published by the styles package.
2. **Given** the authoritative `_semantic.scss` default values, **When** `defaultTheme` is compared token-by-token, **Then** every value matches exactly (for example, `accent` equals `#1cae96`, `bg` equals `#dde2e8`, `text` equals `#00365c`).
3. **Given** a consumer using `defaultTheme` without any overrides, **When** they read any individual token, **Then** they receive the canonical default value with no surprises or omissions.

---

### User Story 2 — Partial Overrides via createTheme (Priority: P1)

A downstream application developer wants to rebrand their app by overriding only a few tokens while keeping the rest of the palette intact. They call `createTheme` with a partial theme that specifies only the tokens they care about (for example, `accent` only). The returned theme contains their override for `accent` and the default value for all other tokens.

**Why this priority**: Partial overriding is the primary consumer workflow — "change my accent, keep everything else". It is the core value proposition of the factory and the most common integration path.

**Independent Test**: Can be fully tested by calling `createTheme` with a single-token override and asserting that the result has the override applied and all 24 remaining tokens unchanged at their defaults. No components, browser, or DOM required.

**Acceptance Scenarios**:

1. **Given** a partial theme overriding a single token, **When** `createTheme` is called with it, **Then** the returned theme has the overridden token at the new value and every other token at its default value.
2. **Given** a partial theme that overrides multiple tokens across the palette, **When** `createTheme` is called, **Then** all overrides are applied and all non-overridden tokens fall through to defaults (deep merge, not whole-object replacement).
3. **Given** a complete theme where every token is specified, **When** `createTheme` is called, **Then** the returned theme matches the provided configuration exactly (full-configuration passthrough).

---

### User Story 3 — Validation with Descriptive, Call-Time Errors (Priority: P2)

A downstream application developer makes a mistake — they misspell a token or pass a non-color value. They want the mistake caught immediately when they build the theme, with an error message that names the offending token and describes what is wrong, rather than a silent failure or a confusing error that surfaces later when the theme is rendered.

**Why this priority**: Early, descriptive validation turns a subtle, hard-to-debug styling bug into an immediate, actionable error. It is secondary to the happy path but essential for a trustworthy developer experience.

**Independent Test**: Can be fully tested by calling `createTheme` with missing tokens and invalid values and asserting that a descriptive error is thrown at call time identifying the offending token. No components, browser, or DOM required.

**Acceptance Scenarios**:

1. **Given** a partial theme that leaves a required token absent after merging, **When** `createTheme` is called, **Then** it throws a descriptive error identifying the missing token.
2. **Given** a partial theme where a token value is not a valid color string, **When** `createTheme` is called, **Then** it throws a descriptive error identifying the offending token.
3. **Given** invalid input (for example, a non-object or a value of the wrong type), **When** `createTheme` is called, **Then** it throws a descriptive error immediately at call time rather than deferring failure to render time.

---

### User Story 4 — Pure, Deterministic, and Non-Mutating Behavior (Priority: P2)

A downstream application developer calls `createTheme` multiple times, or shares the `defaultTheme` across modules, and expects that doing so has no surprising side effects. The input they pass in is not modified, the shared default theme is not modified, and repeated calls with the same input always produce an identical, self-contained result that can be serialized for storage or transport.

**Why this priority**: Purity, determinism, and non-mutation are correctness and safety guarantees that protect consumers from subtle bugs (accidentally corrupting the shared default or leaking state). They are non-negotiable for a shared data layer but represent a quality bar rather than a primary workflow.

**Independent Test**: Can be fully tested by asserting that `createTheme` does not mutate its input or `defaultTheme` (deep equality before/after), that repeated calls with the same input return deep-equal results, and that the result survives a serialization round trip unchanged. No components, browser, or DOM required.

**Acceptance Scenarios**:

1. **Given** a `defaultTheme` and a partial input, **When** `createTheme` is called, **Then** both `defaultTheme` and the input remain deeply unchanged after the call (no mutation).
2. **Given** the same partial input, **When** `createTheme` is called twice, **Then** both results are deeply equal (deterministic).
3. **Given** the returned theme, **When** it is serialized and then deserialized, **Then** the round-tripped result is deeply equal to the original (fully serializable, no functions or runtime references).

---

### Edge Cases

- What happens when `createTheme` receives an empty partial (no overrides)? It must return a theme deeply equal to `defaultTheme` (all 25 tokens at their defaults).
- What happens when `createTheme` receives input that is not an object (for example, `null`, a string, or a number)? It must throw a descriptive error rather than returning a partial or malformed theme.
- What happens when a partial explicitly sets a token to a nullish or empty value? It must be treated as an invalid/missing value and rejected with a descriptive error.
- What happens when a token value is of the wrong type (for example, a number or boolean instead of a color string)? It must be rejected as an invalid color.
- What happens when a partial overrides a token with a value that is a syntactically invalid color? It must be rejected with a descriptive error naming the token.
- What happens when the returned theme is inspected for hidden runtime references (functions, globals)? It must contain only plain serializable values.

## Requirements

### Functional Requirements

- **FR-001**: The library must provide a `defaultTheme` constant representing the complete default theme, containing the full set of 25 semantic color tokens.
- **FR-002**: Every value in `defaultTheme` must exactly match the authoritative default color value defined in the styles package's semantic source (`_semantic.scss`), including `bg` (`#dde2e8`), `surface` (`#ffffff`), `text` (`#00365c`), and `accent` (`#1cae96`).
- **FR-003**: The library must provide a `createTheme` function that accepts a partial theme (a subset of color token overrides).
- **FR-004**: `createTheme` must deep-merge the provided overrides over `defaultTheme` so that every token not explicitly overridden retains its default value, and no token is lost by whole-object replacement.
- **FR-005**: After merging, `createTheme` must validate that every required token is present; if any required token is missing, it must throw a descriptive error identifying the missing token.
- **FR-006**: `createTheme` must validate that every value is a valid CSS color string; if a value is not a valid color, it must throw a descriptive error identifying the offending token.
- **FR-007**: Validation must occur at the time `createTheme` is called, not later when the theme is consumed or rendered; invalid input must fail immediately with a descriptive error.
- **FR-008**: `createTheme` must return a complete, fully-resolved theme configuration in which every token has a value and no token is unspecified.
- **FR-009**: The returned theme must be serializable — it must survive a serialization round trip without losing or altering any value, containing only plain data values and no functions or runtime references.
- **FR-010**: `createTheme` and `defaultTheme` must be pure and deterministic: the same input must always produce the same output, and no browser or runtime globals may be read or written.
- **FR-011**: `createTheme` must not mutate its input or the shared `defaultTheme`; both must remain deeply unchanged after a call.
- **FR-012**: Automated tests must cover partial overrides, deep-merge behavior, full-configuration passthrough, missing values, invalid values, non-mutation of `defaultTheme`, and serializability of the result.

### Key Entities

- **Default Theme (`defaultTheme`)**: A constant holding the complete set of 25 semantic color tokens with their canonical default values. It is the single source of default values against which all partial overrides are merged.

- **Theme Configuration**: The resolved theme data structure produced by `createTheme`, containing a `colors` collection of 25 named color values. Every value is a valid color string; the structure contains no unspecified values and no runtime references. Its shape was established in feature 058.

- **Theme Creation Function (`createTheme`)**: A pure factory that accepts a partial theme, deep-merges it over the default theme, validates completeness and value format, and returns a complete, serializable theme configuration. It has no side effects and does not mutate its inputs.

- **Semantic Color Token**: One of the 25 named color values (for example, `bg`, `surface`, `text`, `accent`, `actionPrimaryBg`, `onAccent`). Each token maps deterministically to a `--pathable-color-*` CSS custom property, as established in features 057 and 058.

## Success Criteria

### Measurable Outcomes

- **SC-001**: `defaultTheme` contains exactly 25 color tokens, and every value matches the authoritative semantic source byte-for-byte as verified by automated tests.
- **SC-002**: Calling `createTheme` with a single-token override returns a theme where the overridden token has the new value and all 24 remaining tokens retain their default values.
- **SC-003**: 100% of the 25 tokens are covered by automated tests asserting their default values match the authoritative source.
- **SC-004**: `createTheme` throws a descriptive, token-identifying error for 100% of tested invalid cases (missing tokens and invalid color values).
- **SC-005**: `createTheme` does not mutate `defaultTheme` or its input, as verified by deep-equality checks before and after in automated tests.
- **SC-006**: The returned theme survives a serialization round trip unchanged, as verified by automated tests.
- **SC-007**: The feature introduces no breaking change to the theme vocabulary established in feature 058; existing token names and the theme configuration shape continue to resolve.

## Assumptions

- The 25 semantic color tokens in the styles package's `_semantic.scss` are the stable, canonical default set; this feature reads them as defaults and does not modify them.
- Partial overrides are well-formed objects keyed by token name. Input that is not an object, or values of the wrong type, are treated as invalid and rejected with a descriptive error.
- "Valid CSS color string" means any value the CSS color grammar accepts (hex, `rgb()`, `hsl()`, named colors, and so on). The theme stores values as strings and does not interpret, normalize, or transform them.
- Consumers may pass a complete configuration rather than a partial one; a complete configuration is accepted unchanged (passthrough).
- The returned theme is a plain, serializable data object with no functions, no runtime references, and no dependence on browser globals.
- Dark mode is out of scope; a consumer may supply their own complete override set, but `createTheme` does not generate a dark theme automatically.

## Dependencies

- Feature 058 (Theme Token Types and Vocabulary): Defines the theme color vocabulary — the 25 camelCase token names and the theme configuration shape — that this feature populates and validates.
- Feature 057 (Consolidated Theme Token CSS and Granular Exports): Defines the authoritative default color values in `_semantic.scss`, which `defaultTheme` must match exactly.

## Out of Scope

- The `ThemeProvider` component (feature 04).
- Runtime emission of CSS custom properties.
- Dark-mode token generation.
- Token categories beyond `colors` (typography, spacing, radius, elevation).
