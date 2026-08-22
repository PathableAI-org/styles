# Feature Specification: Heading Primitive

**Feature Branch**: `052-heading-primitive`

**Created**: 2026-08-21

**Status**: Draft

**Input**: User description: "Implement `Heading`, a semantic heading primitive with deliberate separation of HTML document-outline level and visual style. Unlike a generic `Text` with a large font, `Heading` ensures the rendered heading element and its visual treatment are intentionally chosen and constrained."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render a Semantic Heading Level (Priority: P1)

A developer building a page needs to render a heading that communicates both the correct document-outline level and the appropriate visual style. They use `<Heading level={2}>` and receive an `<h2>` element styled with the heading-2 typography from the design system.

**Why this priority**: This is the core purpose of the Heading primitive — providing a single prop that controls both semantic level and visual style. Without this, the component has no value.

**Independent Test**: Render `<Heading level={3}>Section</Heading>` and verify the DOM contains an `<h3>` element with the correct heading class applied. Can be tested with a unit test and visually in Storybook.

**Acceptance Scenarios**:

1. **Given** a page with no heading structure, **When** a developer renders `<Heading level={1}>Welcome</Heading>`, **Then** the output is an `<h1>` element with the heading-1 style class applied.
2. **Given** a page with no heading structure, **When** a developer renders `<Heading level={4}>Details</Heading>`, **Then** the output is an `<h4>` element with the heading-4 style class applied.
3. **Given** any Heading instance, **When** a developer inspects the DOM, **Then** there are no wrapper elements — all classes are on the single heading element.
4. **Given** any Heading instance rendered server-side and client-side, **When** output is compared, **Then** the server and client output are identical.

---

### User Story 2 - All Six Heading Levels Are Available (Priority: P1)

A developer needs access to all six HTML heading levels (`h1` through `h6`) through the `level` prop. Each level renders the corresponding element and applies the matching design-system heading style class.

**Why this priority**: All six levels are required by the HTML specification for proper document structure. Missing levels would make the component incomplete.

**Independent Test**: Render each level 1–6 and verify the correct element name and class name for every value. Can be tested with a unit test loop.

**Acceptance Scenarios**:

1. **Given** the Heading component, **When** `level` is set to each value from 1 through 6, **Then** the corresponding `h1` through `h6` element is rendered with the matching heading style class.
2. **Given** the Heading component, **When** `level` is omitted, **Then** it is a compile-time error — `level` is required with no default value.

---

### User Story 3 - Visual Level Diverges from Document Level (Priority: P2)

A developer encounters a design where the visual hierarchy of headings does not match the document outline — for example, a visually prominent heading in a sidebar that should be an `h3` in the document outline but look like an `h2`. They pass `level={3}` with `visualLevel={2}` to get the correct semantics with the larger visual treatment.

**Why this priority**: This addresses a real-world design-system need where visual hierarchy and document semantics sometimes diverge. However, it is secondary to the basic level-to-style mapping.

**Independent Test**: Render `<Heading level={3} visualLevel={2}>Sidebar Title</Heading>` and verify the DOM contains an `<h3>` element with the heading-2 style class. Can be tested with a unit test.

**Acceptance Scenarios**:

1. **Given** a Heading with `level={3}` and `visualLevel={2}`, **When** the component renders, **Then** the output is an `<h3>` element with the heading-2 visual style class.
2. **Given** a Heading with `level` only (no `visualLevel`), **When** the component renders, **Then** the visual style defaults to matching the document `level`.
3. **Given** the Heading component's TypeScript types, **When** `visualLevel` is set to a value outside the range 1–6, **Then** it is a compile-time error — the `HeadingLevel` literal union type (`1 | 2 | 3 | 4 | 5 | 6`) prevents invalid values.

---

### User Story 4 - Heading Is Always a Heading Element (Priority: P1)

A developer reviewing the Heading API expects that a Heading component always renders an actual HTML heading element. Unlike the `Text` primitive which supports `as` to change element type, the Heading primitive cannot be rendered as a `div`, `span`, or any non-heading element.

**Why this priority**: The semantic integrity of the document outline depends on headings being real heading elements. Allowing arbitrary element overrides would undermine the component's purpose.

**Independent Test**: Verify that the Heading component's TypeScript types do not accept an `as` prop, or if they do, that it is constrained to heading elements only. Verify that passing a non-heading element is caught at compile time.

**Acceptance Scenarios**:

1. **Given** the Heading component API, **When** a developer attempts to pass `as="div"`, **Then** it is a compile-time error.
2. **Given** the Heading component, **When** the component renders, **Then** the output is always an `h1` through `h6` element, never a `p`, `div`, `span`, or other non-heading element.

---

### User Story 5 - Ref Forwarding and Class Composition (Priority: P2)

A developer needs to attach a ref to the rendered heading element for programmatic access (scrolling, focus management, measurement) and pass a custom `className` for application-specific overrides without breaking the design-system classes.

**Why this priority**: Ref forwarding and className are standard React component contracts. Without them, the component is not fully interoperable with common React patterns.

**Independent Test**: Attach a ref to a Heading and verify the ref.current is the rendered heading DOM element. Pass a custom className and verify it appears alongside the design-system classes. Can be tested with unit tests.

**Acceptance Scenarios**:

1. **Given** a Heading with a forwarded ref, **When** the component mounts, **Then** `ref.current` is the rendered heading DOM element.
2. **Given** a Heading with `className="my-custom"`, **When** the component renders, **Then** the element's class list includes both the design-system heading classes and `my-custom`, with the design-system classes appearing first.

---

### User Story 6 - Accessibility Compliance (Priority: P1)

An accessibility auditor verifies that all Heading instances expose correct heading levels to assistive technology and that visual treatments do not break document-outline expectations. Headings must have sufficient contrast against the default surface and work correctly in forced-colors mode.

**Why this priority**: Accessibility is a release requirement per the project constitution. Headings are critical for screen-reader navigation and document structure.

**Independent Test**: Inspect rendered headings with an accessibility checker for role, level, contrast, and forced-colors behavior. Verify keyboard focus is visible when headings are programmatically focused.

**Acceptance Scenarios**:

1. **Given** any Heading level, **When** inspected with an accessibility checker, **Then** the correct heading role and ARIA level are exposed to assistive technology.
2. **Given** any Heading level, **When** tested for contrast against the default surface background, **Then** all levels meet WCAG AA contrast requirements for normal text.
3. **Given** any Heading level, **When** rendered in forced-colors mode, **Then** the heading is visually distinguishable and its semantic role is preserved.
4. **Given** a Heading rendered in a page with increased text size (200% zoom), **When** the page is viewed, **Then** heading text scales appropriately and remains readable without clipping or overflow.

---

### Edge Cases

- What happens when `level` is 0, negative, or greater than 6? The component should either fall back to a safe default or produce a clear development-time error.
- What happens when `level` is not a number (e.g., a string like `"2"`)? The TypeScript types should prevent this at compile time.
- What happens when both `level` and `visualLevel` are the same value? The component should produce the same output as passing only `level`.
- What happens when a Heading contains long text that wraps? The heading typography should handle multi-line content gracefully without breaking layout.
- What happens when a Heading is placed inside a constrained container (narrow sidebar, card)? The heading text should wrap and the font size should not cause overflow.
- What happens when a Heading is rendered inside a non-default surface (colored background)? Contrast should remain sufficient; the heading uses the default foreground color which should have been designed for the surface.
- What happens when `level` is omitted entirely? The component must have a defined default or raise a clear compile-time error.
- What happens when `visualLevel` is set but `level` is not? The visual style should be ignored or cause a compile-time error since there is no base level to determine the element.
- What happens when CSS is not loaded? The heading element should still be semantically correct (proper `h1`-`h6` element) even if unstyled.

## Requirements *(mandatory)*

### Functional Requirements

**Source-layer design contracts**:

- **FR-001**: The `@pathableai/styles` package MUST provide a SCSS contract (`pathable-heading.scss`) with a `.pathable-heading` base class and level modifiers (e.g., `.pathable-heading--level-1` through `.pathable-heading--level-6`) that apply typography, spacing, and font-weight as appropriate for each heading level.
- **FR-002**: Heading SCSS modifiers MUST resolve exclusively to `--pathable-*` CSS custom property tokens (no literal pixel, rem, or hex values in the modifier classes themselves).
- **FR-003**: The heading SCSS contract MUST be `@forward`ed from the existing typography module so consumers receive it through the standard typography import path.
- **FR-004**: Before exposing a React Heading API, the existing SCSS heading styles MUST be audited and any missing level-to-style mappings MUST be formalized in the styles package.

**React wrapper component**:

- **FR-005**: The `Heading` component MUST be exported from `@pathableai/react`.
- **FR-006**: The `Heading` component MUST accept a required `level` prop constrained to integer values 1 through 6, which determines the rendered HTML heading element (`h1` through `h6`).
- **FR-007**: The `Heading` component MUST accept an optional `visualLevel` prop constrained to integer values 1 through 6. When provided, the rendered heading element is determined by `level` and the visual style class is determined by `visualLevel`. When omitted, the visual style defaults to matching `level`.
- **FR-008**: `Heading` MUST NOT accept an `as` prop that would allow rendering as a non-heading element. The rendered element is always `h1`–`h6`.
- **FR-009**: `Heading` MUST merge classes in this order on the single root element: `.pathable-heading` base class → `.pathable-heading--level-{N}` modifier class → consumer `className`.
- **FR-010**: `Heading` MUST forward a ref to the rendered heading element.
- **FR-011**: `Heading` MUST accept and forward all native HTML attributes appropriate to the heading element type determined by `level`.
- **FR-012**: `Heading` MUST NOT render any wrapper DOM elements — all classes and attributes are applied to the single heading element.
- **FR-013**: `Heading` MUST produce deterministic, identical output when rendered on the server and in the browser.

**Type system and resolvers**:

- **FR-014**: The `HeadingLevel` type MUST be constrained to the integer literal types `1 | 2 | 3 | 4 | 5 | 6`.
- **FR-015**: A heading class resolver MUST map each `HeadingLevel` value to its corresponding `.pathable-heading--level-{N}` class deterministically, with no browser dependencies.

**Accessibility**:

- **FR-016**: Every heading level MUST meet WCAG AA contrast requirements (at least 4.5:1 for normal text) against the default surface background.
- **FR-017**: Heading elements MUST expose their correct heading level and role to assistive technology through standard HTML semantics (the `h1`–`h6` element name is sufficient; no ARIA role override is needed).
- **FR-018**: Headings MUST be visually distinguishable in forced-colors mode without relying solely on color.
- **FR-019**: Heading text MUST scale appropriately and remain readable at 200% browser zoom without clipping or overflow.

**Storybook stories**:

- **FR-020**: Each heading level (1–6) MUST have a deterministic, named Storybook story showing the heading at its default visual style.
- **FR-021**: The `visualLevel` feature MUST have at least one deterministic Storybook story demonstrating a diverging visual level (e.g., `level={3}` with `visualLevel={2}`).

**Visual regression**:

- **FR-022**: Heading Storybook stories MUST serve as visual-regression fixtures covering typography, spacing, and level-specific rendering for each heading level.

### Key Entities

- **Heading component**: A React component in `@pathableai/react` that maps a semantic heading level (1–6) to both an HTML heading element and a design-system heading style class.
- **Heading level**: An integer value 1–6 representing the document-outline depth. Controls the rendered HTML element (`h1`–`h6`).
- **Visual heading level**: An optional integer value 1–6 that overrides the visual style class independently of the document-outline level. When absent, defaults to the same value as `level`.
- **pathable-heading SCSS contract**: The framework-neutral style contract in `@pathableai/styles` providing a `.pathable-heading` base class and `.pathable-heading--level-{1..6}` modifier classes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six heading levels render with their correct HTML element and design-system class, verified by automated tests.
- **SC-002**: Every heading level passes WCAG AA contrast testing (minimum 4.5:1 ratio for normal text against the default surface).
- **SC-003**: The Heading component produces no extra wrapper elements — a single DOM node per instance, verified by DOM inspection tests.
- **SC-004**: All heading levels are visually distinct from each other and from body text, such that users can visually navigate the page hierarchy.
- **SC-005**: Assistive technology correctly identifies the heading level and role for every instance, verified by accessibility inspection.
- **SC-006**: Server-rendered and client-rendered output are byte-identical for the same props, verified by snapshot or output comparison.
- **SC-007**: Storybook renders all heading level stories without errors, providing a visual reference for designers and developers.

## Assumptions

- The existing `@pathableai/styles` typography module already defines heading-level SCSS classes (heading-1 through heading-6). The audit task in this feature will verify completeness and fill gaps if needed before the React component is implemented.
- The `level` prop is required (no default). This matches the intentional-design philosophy of the Heading primitive — developers must explicitly choose a heading level.
- `visualLevel` does not affect accessible name computation or ARIA — the ARIA level is always determined by the rendered heading element (which is controlled by `level`).
- Heading font sizes, line heights, and weights are defined by the design-system tokens and SCSS contract; the React component does not compute or override typography values.
- The `level` prop accepts only integer values 1–6. Non-integer or out-of-range values are prevented by TypeScript types at compile time.
- The Heading component does not render tone/color modifiers (these belong to the Text primitive per the architecture plan). Headings use the default foreground color.
- Heading elements are block-level by default and respect the document flow.
- The `@pathableai/react` package already has the shared class-merging utility and polymorphic type patterns from the semantic prop foundation (slice 01) and Text primitive (slice 09), and the Heading component reuses those patterns.
