# Feature Specification: Semantic Utility Type System and Class Resolvers

**Feature Branch**: `044-semantic-prop-foundation`

**Created**: 2026-08-19

**Status**: Draft

**Input**: User description: "Semantic Utility Type System and Class Resolvers — Establish the internal type system and pure resolver layer that maps typed semantic React prop values to verified @pathable/styles CSS classes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capability Inventory and Gap Analysis (Priority: P1)

As a React package maintainer, I need a verified inventory of the utility CSS classes emitted by `@pathable/styles` so that I know exactly which class names can be mapped to semantic props and where gaps exist that would block downstream component features.

**Why this priority**: Before any resolver or type can be written, we must know which CSS classes actually exist. An inventory built on assumption rather than inspection risks mapping to classes that don't exist or missing classes that do.

**Independent Test**: Run the inventory against the built `@pathable/styles` output and confirm the document lists every utility family (sizing, spacing, display, alignment, visibility, flex/grid, typography, color/tone) with its verified class patterns. Confirm gaps are recorded where a desired semantic role lacks an authoritative SCSS source contract.

**Acceptance Scenarios**:

1. **Given** the `@pathable/styles` package is built, **When** the inventory process runs, **Then** all public utility class families are documented with their emitted class name patterns and the owning SCSS source file.
2. **Given** a semantic capability (e.g., "max-width") that has no matching utility class in the built output, **When** the inventory is compiled, **Then** the gap is recorded with the desired semantic role and rationale.
3. **Given** an incomplete or outdated build, **When** the inventory attempts to verify classes, **Then** the failure is reported clearly rather than producing an incorrect inventory.

---

### User Story 2 - Typed Semantic Props and Resolvers (Priority: P1)

As a React package developer, I need shared TypeScript value types (e.g., `Width`, `SpacingScale`) and capability interfaces (e.g., `SizingProps`, `SpacingProps`, `DisplayProps`) backed by pure resolver functions so that I can add semantic props to components with confidence that every valid value maps to a real CSS class.

**Why this priority**: The type system and resolvers are the foundation every downstream component feature consumes. Without them, no component can adopt semantic props.

**Independent Test**: Import a resolver from the internal directory, call it with a valid value, and assert the returned class name matches the expected `@pathable/styles` utility class. Call the same resolver with `undefined`, `null`, and an invalid value, and assert it returns `undefined` or handles the case cleanly. Verify all resolvers are pure and reference no browser globals.

**Acceptance Scenarios**:

1. **Given** a semantic sizing value of `"full"`, **When** the `widthClass` resolver is called, **Then** it returns the class string `"pathable-width-full"`.
2. **Given** a semantic spacing value of `"4"`, **When** the `marginTopClass` resolver is called, **Then** it returns the verified spacing utility class for that scale value.
3. **Given** an unrecognized string value, **When** a resolver is called, **Then** it returns `undefined` rather than producing an invalid or guessed class name.
4. **Given** `undefined` or `null` is passed, **When** a resolver is called, **Then** it returns `undefined` without throwing.
5. **Given** any resolver function, **When** it executes, **Then** it does not reference `window`, `document`, or any DOM API.

---

### User Story 3 - Class-Merging Order and Conflict Policy (Priority: P2)

As a React package developer, I need a defined class-merging order and conflict policy so that when multiple semantic props target the same class space, the outcome is predictable and documented.

**Why this priority**: Component authors need to know the resolution order before they adopt semantic props. Without a documented policy, bugs from conflicting props (e.g., both `margin` and `marginY` specified) would be unavoidable.

**Independent Test**: Call the class-merging function with component classes, semantic-resolved classes, and a consumer `className`, and assert the output follows the defined order. Call it with conflicting semantic props and assert the conflict policy is applied.

**Acceptance Scenarios**:

1. **Given** component base classes, resolved semantic classes, and a consumer-provided `className`, **When** the merge function runs, **Then** the output class string follows the order: required component classes → resolved semantic classes → consumer `className`.
2. **Given** two semantic props that resolve to classes in the same space (e.g., `margin` and `marginY`), **When** both are specified, **Then** the conflict policy is applied and the behavior is deterministic.
3. **Given** a consumer `className` that duplicates a semantic class, **When** the merge happens, **Then** the semantic class precedes the consumer class in the output, giving the consumer the final say.

---

### User Story 4 - Unit Test Coverage for Every Mapping (Priority: P2)

As a quality engineer or future contributor, I need comprehensive unit tests for every resolver so that I can refactor or extend the resolver layer without introducing regressions.

**Why this priority**: The resolver layer is a pure data transformation with no visual output. Unit tests are the only practical way to validate correctness without spinning up a browser. Without them, every downstream change carries regression risk.

**Independent Test**: Run the test suite and verify every resolver has test cases for valid values, invalid values, `undefined`/`null`, and edge cases. Assert 100% resolver-function coverage.

**Acceptance Scenarios**:

1. **Given** a resolver for a value type with N supported values, **When** tests run, **Then** each supported value has a test case asserting the exact expected class string.
2. **Given** a resolver, **When** tests run, **Then** there is at least one test case for each of: a valid value, `undefined`, `null`, and an invalid/unrecognized value.
3. **Given** the test suite, **When** it runs in CI, **Then** any failing test blocks merge.

---

### Edge Cases

- What happens when a semantic prop value maps to a class that exists in the CSS build but has been removed in a newer version? (The resolver returns the class anyway; the gap belongs in the inventory, and CI catches the mismatch.)
- What happens when two resolvable props produce the same class string? (The conflict policy defines precedence; duplicates at the same precedence level are harmless since CSS specificity is identical.)
- What happens when a consumer passes an empty string `className`? (Empty string is treated the same as `undefined`: it does not add a class token.)
- What happens when a value type enum is extended with a new value but the resolver isn't updated? (TypeScript compilation catches this at build time if the enum is exhaustive; runtime tests catch it if the resolver uses a switch without a default.)
- What happens when the resolver directory is accidentally imported by a consumer (tree-shaking, bundle boundaries)? (The internal directory must not be a public export; bundler tests should verify it is not reachable from the public entry point.)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST produce an inventory document checked into the `packages/react` source that lists every verified public utility class family from `@pathable/styles`, organized by semantic capability (sizing, spacing, display, alignment, visibility, flex/grid participation, typography, color/tone), including the owning SCSS source file and the emitted class name pattern.
- **FR-002**: The inventory MUST record gaps where a recognized semantic role (e.g., "max-width") lacks a corresponding utility class in the built `@pathable/styles` output.
- **FR-003**: The system MUST define shared TypeScript value types for each semantic capability (e.g., `Width`, `MaxWidth`, `MinWidth`, `SpacingScale`, `Display`, `Alignment`), using string literal unions that enumerate only verified, existing class-mapped values.
- **FR-004**: The system MUST define shared TypeScript capability interfaces (e.g., `SizingProps`, `SpacingProps`, `DisplayProps`, `AlignmentProps`, `VisibilityProps`, `FlexGridProps`, `TypographyProps`, `ColorToneProps`) that aggregate value types into coherent prop sets.
- **FR-005**: The system MUST implement a pure, deterministic resolver function for each value-type-to-class mapping (e.g., `widthClass('full')` → `'pathable-width-full'`), returning `undefined` for omitted, `null`, or unrecognized values.
- **FR-006**: Every resolver MUST be a pure function with zero reference to `window`, `document`, or any browser-only global, producing identical output on server and client.
- **FR-007**: The system MUST define a class-merging function that composes class strings in the fixed order: required component/primitive classes → resolved semantic classes → consumer `className`.
- **FR-008**: The system MUST document a conflict policy specifying the behavior when multiple semantic props resolve to classes in the same CSS property space (e.g., shorthand vs. directional props).
- **FR-009**: Every resolver MUST have a unit test covering: each valid value (asserting the exact class string), `undefined`, `null`, and at least one invalid/unrecognized value.
- **FR-010**: Unit tests MUST achieve 100% coverage of resolver functions and the class-merging function.
- **FR-011**: The resolver module and all associated types MUST live in an internal directory under `packages/react/src/` and MUST NOT be reachable from the public package entry point.
- **FR-012**: The package-level documentation MUST include a note explaining that `className` remains the escape hatch when a desired utility lacks a semantic prop mapping.
- **FR-013**: All resolver code, types, and tests MUST live exclusively in `packages/react`; no changes to `packages/styles` SCSS or CSS output are permitted in this feature.
- **FR-014**: No new React components and no changes to existing public component APIs are permitted in this feature.

### Key Entities

- **Semantic Capability**: A named group of related utility properties (e.g., "sizing" covers width, min-width, max-width). Each capability has a set of verified CSS classes in `@pathable/styles`, a TypeScript value type, and a capability interface.
- **Value Type**: A TypeScript string-literal union enumerating the supported values for a single CSS property (e.g., `Width = "auto" | "full" | "1/2" | "1/3" | ...`).
- **Capability Interface**: A TypeScript interface aggregating related value types (e.g., `SizingProps` exposes `width`, `minWidth`, `maxWidth` as optional props).
- **Resolver**: A pure function mapping a single value type (or `undefined`/`null`) to a single CSS class string or `undefined`. Each resolver is deterministic and framework-agnostic.
- **Class-Merge Function**: A utility that composes multiple class-string sources into a single `className` string following the fixed merge order.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Every utility family documented in the inventory is backed by a verified class name pattern observed in the built `@pathable/styles` CSS output.
- **SC-002**: Every resolver function returns the correct class string for every supported value and returns `undefined` for every documented invalid, null, or undefined input.
- **SC-003**: 100% of resolver functions and the class-merging function are covered by unit tests that pass in CI.
- **SC-004**: No resolver code references any browser-only global; this is verified by a CI check (lint rule or test assertion).
- **SC-005**: The internal resolver directory is not reachable from the public `@pathable/react` entry point, verified by a bundler or package-content test.
- **SC-006**: The class-merging order is documented and a unit test asserts the exact order (component → semantic → consumer) for a representative merge.

## Assumptions

- The `@pathable/styles` package build output is stable and available as a dependency for inspection during inventory creation.
- The set of utility classes emitted by `@pathable/styles` is the authoritative source; the inventory reflects what exists, not what we wish existed.
- The value-type enums will be based on the actual class suffixes observed in the CSS output (e.g., `pathable-width-full` → value `"full"`).
- The internal directory structure in `packages/react/src/` follows existing conventions (e.g., a `_internal/` or `resolvers/` directory).
- The capability groups (sizing, spacing, display, alignment, visibility, flex/grid, typography, color/tone) cover all relevant utility families; this grouping will be refined during inventory.
- Unit tests will use a standard test runner already configured in the `packages/react` workspace (e.g., Vitest or Jest).
- The class-merging conflict policy will prefer the more specific directional prop over the shorthand when both are specified (e.g., `marginY` wins over `margin` for vertical margin) — this default will be validated during implementation.
- Storybook-driven testing is out of scope for this feature (the resolver layer is a pure-TypeScript concern).
- No design token changes, SCSS modifications, or CSS output changes are included.