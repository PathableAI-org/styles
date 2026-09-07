# Feature Specification: React Entry Point Wiring

**Feature Branch**: `061-react-entry-point-wiring`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Make `@pathableai/react` structurally independent of the default theme token layer so consumers who supply their own tokens via `ThemeProvider` do not have to fight a cascade-order battle against the package's own stylesheet. This is a small but high-stakes change to the package's side-effect import, gated on backward compatibility."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - ThemeProvider-driven consumer renders with custom tokens (Priority: P1)

A developer installs `@pathableai/react`, wraps their application in `ThemeProvider` with their own token values, and expects components to render using those tokens — without writing any CSS overrides to "win" a cascade-order fight against the package's built-in default theme.

**Why this priority**: This is the feature's primary purpose. Without it, ThemeProvider consumers are forced to hand-write overrides or re-order imports to make their tokens take effect, which defeats the purpose of a provider-driven theming model.

**Independent Test**: Can be fully tested by rendering a themed application that supplies tokens exclusively through `ThemeProvider` (importing no default theme stylesheet) and confirming the rendered output uses only the provider-supplied tokens.

**Acceptance Scenarios**:

1. **Given** an application using `@pathableai/react` with `ThemeProvider` and no default theme stylesheet import, **When** a component renders, **Then** it displays the provider-supplied token values with no manual CSS overrides.
2. **Given** an application using `@pathableai/react` with `ThemeProvider` and custom tokens, **When** a component renders, **Then** no package-provided default token values override or interleave with the provider tokens (no cascade-order conflict).

---

### User Story 2 - Default consumer path renders identically (Priority: P1)

A developer who uses `@pathableai/react` together with `import '@pathableai/styles'` (the full default path) continues to get the exact same rendering they have today.

**Why this priority**: This is the mainstream existing consumer path. Breaking it would break every current consumer, so backward compatibility is a release gate on equal footing with the new capability.

**Independent Test**: Can be fully tested by comparing the rendered output (visual and structural) of the default-path consumer before and after the change and confirming there is no difference.

**Acceptance Scenarios**:

1. **Given** an application using `@pathableai/react` + `import '@pathableai/styles'`, **When** components render, **Then** the output is identical to the pre-change rendering (same default tokens, same structure).
2. **Given** the default-path application, **When** the react package is imported, **Then** the full default token layer is still applied (no missing styles or unstyled content).

---

### User Story 3 - Theme-subpath consumer path renders default tokens (Priority: P2)

A developer who uses `@pathableai/react` together with `import '@pathableai/styles/theme'` continues to render with the default tokens.

**Why this priority**: This is a less-common but supported existing path. It must remain intact, but it is secondary to the mainstream default path.

**Independent Test**: Can be fully tested by comparing the rendered output of the theme-subpath consumer before and after the change and confirming there is no difference.

**Acceptance Scenarios**:

1. **Given** an application using `@pathableai/react` + `import '@pathableai/styles/theme'`, **When** components render, **Then** the default token layer is applied identically to today.

---

### User Story 4 - Clear documentation of required setup and the breaking change (Priority: P2)

A developer reading the package documentation can determine, for each supported path (default, theme-subpath, ThemeProvider-driven), exactly which stylesheet import (if any) they must add, and is explicitly warned about the breaking change for consumers who previously relied on `@pathableai/react`'s implicit side-effect import.

**Why this priority**: The change introduces a breaking change for a subset of consumers; without clear guidance they cannot migrate safely. Documentation is a first-class package concern in this project.

**Independent Test**: Can be fully tested by reading the documentation and confirming it states the required import for each path and the explicit breaking-change warning.

**Acceptance Scenarios**:

1. **Given** a consumer who relied on `@pathableai/react`'s implicit stylesheet import, **When** they read the documentation, **Then** they find an explicit breaking-change note telling them to add `import '@pathableai/styles'` (or `@pathableai/styles/theme`) to retain the default token layer.
2. **Given** a consumer using `ThemeProvider`, **When** they read the documentation, **Then** they find instructions for the provider-only path (no default theme import needed).

---

### User Story 5 - Published package resolves new structural subpaths (Priority: P3)

A developer installing the published `@pathableai/react` package can rely on its structural stylesheet imports resolving correctly, with package-content and build validation passing.

**Why this priority**: Correct subpath resolution is a correctness prerequisite, but it is internally verifiable and typically invisible to end consumers; it is the final validation gate.

**Independent Test**: Can be fully tested by running package-content/build validation against the packaged output and confirming zero failures for the structural subpath imports.

**Acceptance Scenarios**:

1. **Given** the packaged `@pathableai/react` output, **When** package-content validation runs, **Then** the structural stylesheet subpaths resolve with no unresolved-import or missing-file failures.

---

### Edge Cases

- A consumer imports `@pathableai/react` with no stylesheet import at all (relying on the previous implicit side-effect): after the change they receive structural styles but no default tokens — this must be called out as the explicit breaking change and mitigated by documentation.
- A consumer imports the react package AND the full styles path (`import '@pathableai/styles'`): the default tokens must apply exactly once, with no duplicate or conflicting token declarations.
- A consumer imports both the full styles path and the theme subpath: behavior must not regress from today (tokens come from the default theme layer).
- A `ThemeProvider` consumer also imports the default theme stylesheet (mixed usage): the provider-supplied tokens must still take effect without a cascade fight.
- Package-content validation must cover the structural subpaths (`components`, `utilities`) so an omitted or misnamed export is caught before publish.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `@pathableai/react` package entry point MUST import only the structural stylesheet layers (components and utilities) and MUST NOT import the default theme token layer as a side effect.
- **FR-002**: Consumers MUST be able to supply design tokens exclusively through `ThemeProvider` and render correctly without importing any default theme stylesheet, and without writing CSS overrides to win cascade-order conflicts.
- **FR-003**: The existing consumer path `@pathableai/react` + `import '@pathableai/styles'` MUST render identically to its pre-change behavior (full default token layer applied).
- **FR-004**: The existing consumer path `@pathableai/react` + `import '@pathableai/styles/theme'` MUST render the default token layer identically to its pre-change behavior.
- **FR-005**: Documentation MUST state, for each supported consumer path (default, theme-subpath, ThemeProvider-driven), the exact stylesheet import required, and MUST explicitly call out the breaking change for consumers who relied on the react package's implicit default-theme side-effect import.
- **FR-006**: Package-content and build validation checks MUST pass for the react package with its new structural subpath imports, confirming that the structural subpaths resolve in the published package.
- **FR-007**: The `./theme` subpath and the default `.` → default-stylesheet mapping of `@pathableai/styles` MUST remain available and unchanged.
- **FR-008**: No token values, component behavior, or the `ThemeProvider` component itself MUST be changed by this feature.

### Key Entities

- **React entry point**: The public import surface of the `@pathableai/react` package that a consumer receives when importing from `@pathableai/react`.
- **Stylesheet subpaths**: The named import targets of `@pathableai/styles` — the structural layers (`components`, `utilities`), the default stylesheet (`.`), and the theme layer (`theme`).
- **ThemeProvider**: The component through which consumers supply design tokens at runtime.
- **Consumer paths**: The three supported ways a consumer combines the react package with stylesheet imports (default, theme-subpath, provider-driven).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of tokens supplied via `ThemeProvider` are applied to rendered components with zero hand-written CSS overrides and no cascade-order workarounds.
- **SC-002**: Both existing backward-compatible consumer paths render identically to their pre-change output across 100% of supported component visual states (verified by visual and structural comparison).
- **SC-003**: The published react package passes package-content and build validation with zero failures for the structural subpath imports.
- **SC-004**: 100% of supported consumer paths have documented setup instructions, and the breaking change is explicitly stated in the documentation.

## Assumptions

- The granular stylesheet subpath exports (`components`, `utilities`, `theme`) already exist in `@pathableai/styles` (delivered by the consolidated-theme-token work) and do not need to be added by this feature.
- The `ThemeProvider` component already exists and functions correctly (delivered by the theme-provider work); this feature only wires the react entry point to stop importing the default theme layer.
- Package names are `@pathableai/react` and `@pathableai/styles` (matching the current package manifests).
- "Identical rendering" is measured by visual and structural (snapshot) comparison of before/after output for the backward-compatible paths.
- The default `.` export of `@pathableai/styles` (the full stylesheet including the default theme token layer) remains the authoritative default path.
