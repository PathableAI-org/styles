# Feature Specification: Container Layout Primitive

**Feature Branch**: `047-container-primitive`

**Created**: 2026-08-20

**Status**: Draft

**Input**: "Implement `Container`, a layout primitive that establishes a constrained page-width region. `Container` standardizes the common 'centered content with a max-width and horizontal page-gutter padding' pattern into a single semantic component."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Center Page Content with a Standard Container (Priority: P1)

An application developer building a content page needs to wrap the page body in a centered, width-constrained region with consistent horizontal gutters. Instead of manually repeating a `div` with centering, max-width, and padding classes, they use `<Container size="standard">` and receive the standard content-width behavior in a single component.

**Why this priority**: This is the canonical use case for `Container`. Without a centered, width-constrained content region, the component delivers no meaningful value. Standard content pages are the most common layout in the system.

**Independent Test**: Render `<Container size="standard">Content</Container>`, inspect the DOM, and verify it renders a single `<div>` element with the `.pathable-container` and `.pathable-container--standard` classes, containing the child content with no extra wrapper elements.

**Acceptance Scenarios**:

1. **Given** the `Container` component is imported from `@pathable/react`, **When** a developer renders `<Container size="standard">Page content</Container>`, **Then** the rendered output is a single `<div>` element with classes `pathable-container pathable-container--standard`, centered via `margin-inline: auto`, with horizontal gutter padding, and the child content rendered inside with no intermediate wrapper.
2. **Given** the `Container` component, **When** a developer renders `<Container size="standard" />` with no children, **Then** the component renders a centered, width-constrained `<div>` with no child DOM nodes.
3. **Given** the `Container` component, **When** a developer renders `<Container size="standard">` during server-side rendering, **Then** the output is identical to client-side rendering with the same classes and structure.

---

### User Story 2 - Render Container at Different Widths (Priority: P1)

An application developer needs a wider container for a dashboard page and a full-bleed container for a hero section. They switch the `size` prop to `"wide"` or `"full"` and the component applies the corresponding max-width constraint.

**Why this priority**: Multiple size options are essential for real-world page composition. Without them, developers would fall back to ad-hoc utility classes, defeating the purpose of the semantic component.

**Independent Test**: Render `<Container size="wide">` and verify the `.pathable-container--wide` modifier class is present. Render `<Container size="full">` and verify the `.pathable-container--full` modifier class is present.

**Acceptance Scenarios**:

1. **Given** the `Container` component, **When** a developer renders `<Container size="wide">Dashboard content</Container>`, **Then** the root element includes the class `pathable-container--wide` which applies a wider max-width (1280px).
2. **Given** the `Container` component, **When** a developer renders `<Container size="full">Hero section</Container>`, **Then** the root element includes the class `pathable-container--full` which applies 100% max-width for full-bleed content.
3. **Given** the `Container` component, **When** a developer does not pass a `size` prop, **Then** the root element still receives the base `pathable-container` class (which defaults to the standard 1024px max-width).

---

### User Story 3 - Consumer className and Native Props Compose Correctly (Priority: P2)

An application developer uses `Container` with both a `size` prop and a custom `className` or native HTML attributes. They expect all classes and attributes to appear on the root element, with the consumer's class appended after the container classes so intentional overrides take effect.

**Why this priority**: Class and attribute composition is essential for real-world use. Without it, developers would be forced to choose between the semantic component and custom styling, defeating its purpose.

**Independent Test**: Render `<Container size="standard" className="page-wrapper" id="main-content">` and verify the root element's class string contains both `pathable-container pathable-container--standard` and `page-wrapper`, with the consumer class listed last, and the `id` attribute is present.

**Acceptance Scenarios**:

1. **Given** the `Container` component, **When** a developer renders `<Container size="standard" className="page-wrapper" />`, **Then** the root element's `class` attribute contains `pathable-container`, `pathable-container--standard`, and `page-wrapper`, in that relative order.
2. **Given** the `Container` component, **When** a developer renders `<Container size="wide" id="dashboard" data-test="main" />`, **Then** the root element has both the container classes and the `id="dashboard"` and `data-test="main"` attributes.
3. **Given** the `Container` component, **When** a developer renders `<Container size="full" onClick={handler} />`, **Then** the event handler is attached to the root element and fires correctly.

---

### User Story 4 - Override the Rendered Element (Priority: P2)

An application developer wants to use `Container` semantics on a semantic HTML landmark element. They pass `as="main"` and the component renders a `<main>` element with all the container classes and behavior, while also passing through only the props valid for that element.

**Why this priority**: Semantic HTML landmarks improve accessibility and SEO. Supporting an `as` prop follows the established polymorphic pattern from `Box` and allows Container to serve as both a generic wrapper and a meaningful landmark.

**Independent Test**: Render `<Container as="main" size="standard">Page</Container>` and verify the output is a `<main>` element with the container classes.

**Acceptance Scenarios**:

1. **Given** the `Container` component, **When** a developer renders `<Container as="main" size="standard">Page</Container>`, **Then** the output is a `<main>` element (not `<div>`) with the container classes and child content.
2. **Given** the `Container` component, **When** a developer renders `<Container as="section" size="wide">Section</Container>`, **Then** the output is a `<section>` element with the container classes.
3. **Given** the `Container` component, **When** a developer renders `<Container as="nav" size="full" />`, **Then** the output is a `<nav>` element with the container classes.

---

### User Story 5 - Ref Forwarding (Priority: P3)

An application developer needs a reference to the rendered DOM node — for example, to measure its dimensions or integrate with a third-party library. They pass a `ref` to `Container` and the ref points directly to the root DOM element.

**Why this priority**: Ref forwarding is a standard React contract expectation. Its absence would block integrations, but it is lower priority than the core rendering behavior and composition.

**Independent Test**: Pass a `React.createRef()` to `<Container size="standard">` and verify the ref.current points to the `<div>` root element carrying the container classes.

**Acceptance Scenarios**:

1. **Given** the `Container` component, **When** a developer attaches a ref via `ref={myRef}`, **Then** `myRef.current` references the root DOM element.
2. **Given** the `Container` component rendered with `as="main"`, **When** a ref is attached, **Then** `myRef.current` references the `<main>` element.

---

### User Story 6 - Storybook Documentation (Priority: P3)

A developer exploring the component library in Storybook finds a `Container` component with stories for each supported size. The stories demonstrate that each size renders centered content with the expected max-width and gutter padding.

**Why this priority**: Documentation supports discoverability and correct usage, but it can be deferred until the component itself is implemented and tested.

**Independent Test**: Open Container's Storybook stories and verify each supported `size` value has a story that renders correctly and passes automated contract or accessibility checks.

**Acceptance Scenarios**:

1. **Given** Storybook, **When** a developer navigates to the `Container` component, **Then** there are stories for each `size` value (`standard`, `wide`, `full`) that render correctly.
2. **Given** Storybook, **When** a developer views a `Container` story, **Then** the visual output shows centered content at the expected width with visible gutter padding.
3. **Given** Storybook, **When** a developer views the `Container` component, **Then** the story metadata explains the intended use and the semantic mapping of each `size` value to its max-width behavior.

---

### Edge Cases

- What happens when `Container` has no `size` prop? The base `pathable-container` class is applied, which defaults to the standard 1024px max-width. The component remains usable without an explicit size.
- What happens when an invalid `size` value is passed? The TypeScript compiler rejects it at build time. At runtime, the resolver returns undefined for unrecognized values and the invalid value is silently omitted (no crash, no unexpected class).
- What happens when `Container` wraps deeply nested or complex children? The component applies its classes to the single root element only; child structure is entirely the consumer's responsibility and passes through unchanged.
- What happens during server-side rendering? The resolved classes must be identical to client-rendered output; no browser-only resolution may occur.
- What happens when `as` is set to a void element (e.g., `"input"`, `"img"`)? The TypeScript compiler should prevent this; the polymorphic type system must restrict `as` to elements that can contain children.
- What happens when `Container` is passed invalid native props for the element type (e.g., `href` on a `<div>`)? The polymorphic typing should constrain allowed props to those valid for the selected element.
- What happens when a consumer needs custom max-width or padding that does not match the named sizes? The consumer should use `Box` with `maxWidth` and `padding` props directly. `Container` is opinionated; `Box` is the escape hatch.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `Container` component MUST be exported from `@pathable/react` as a public API surface.
- **FR-002**: The default rendered element for `Container` MUST be a `<div>`; an `as` prop MUST allow overriding to semantic HTML elements (e.g., `"main"`, `"section"`, `"article"`, `"nav"`).
- **FR-003**: The `as` prop MUST be polymorphically typed so that TypeScript constrains accepted props to those valid for the selected HTML element and prevents void elements (elements that cannot contain children) from being selected.
- **FR-004**: `Container` MUST apply the `.pathable-container` base class to its root element, which provides `width: 100%`, `margin-inline: auto` centering, `padding-inline` gutter padding, and box-sizing via the existing `@pathable/styles` SCSS contract in `pathable-container.scss`.
- **FR-005**: `Container` MUST expose a `size` prop whose values map directly to verified `.pathable-container--{modifier}` modifier classes from the existing `@pathable/styles` SCSS contract. The initial supported values MUST be `"standard"` (1024px max-width), `"wide"` (1280px max-width), and `"full"` (100% max-width), matching the SCSS contract. The exact set of values MUST be confirmed by SCSS contract verification during implementation.
- **FR-006**: When `size` is omitted or undefined, `Container` MUST apply only the base `.pathable-container` class without a modifier class, which defaults to a 1024px max-width.
- **FR-007**: `Container` MUST merge classes in the documented order: required component classes (`.pathable-container`), resolved `size` modifier class (`.pathable-container--{size}`), followed by the consumer-provided `className`.
- **FR-008**: `Container` MUST NOT introduce any wrapper DOM element. The container classes and the `as` element selection MUST apply to the single root element.
- **FR-009**: `Container` MUST forward refs correctly to the rendered root element regardless of the `as` prop value.
- **FR-010**: `Container` MUST pass through all native HTML attributes (id, data-*, aria-*, event handlers, etc.) to the root element, constrained by the polymorphic typing.
- **FR-011**: `Container` MUST render children as direct children of the root element with no intermediate wrappers.
- **FR-012**: `Container` MUST produce identical DOM output (classes and structure) during server-side rendering and client-side rendering for all supported prop combinations.
- **FR-013**: `Container` MUST NOT accept arbitrary `width` or `maxWidth` sizing props from `SizingProps`. The `size` prop is the exclusive width-control mechanism for Container; custom max-width needs are served by `Box`.
- **FR-014**: `Container` MUST NOT accept typography, color, tone, display, visibility, or child-layout relationship props. Container is a layout primitive, not a text, surface, or flex/grid component.
- **FR-015**: Unit tests MUST verify that each supported `size` value maps to the correct `.pathable-container--{modifier}` class on the root element.
- **FR-016**: Unit tests MUST verify that no wrapper element exists (a single root element contains the container classes and child content).
- **FR-017**: Unit tests MUST verify ref forwarding, `as` element selection, missing `size` behavior, class merging with `className`, and native prop passthrough.
- **FR-018**: Storybook stories MUST exist for `Container` demonstrating each supported `size` value (`standard`, `wide`, `full`), rendering centered, width-constrained content with gutter padding. Stories MUST be deterministic with no uncontrolled randomness, dates, or live network dependencies.
- **FR-019**: No SCSS or `packages/styles` CSS output changes are permitted. `Container` MUST consume the existing `.pathable-container` and `.pathable-container--{modifier}` SCSS contract as-is.
- **FR-020**: The component implementation MUST follow the established internal resolver pattern from the semantic-prop foundation (slice 01) and the polymorphic pattern from the Box primitive (slice 04).

### Key Entities *(include if feature involves data)*

- **Container**: A new React component exported from `@pathable/react`. It renders a single, centered, width-constrained HTML element (default `<div>`, overridable via `as`) with horizontal gutter padding, consuming the existing `.pathable-container` SCSS contract from `@pathable/styles`. It accepts a `size` prop with values `"standard"`, `"wide"`, `"full"` that map to modifier classes, plus native HTML attributes, consumer `className`, and ref forwarding. It does not accept arbitrary sizing, spacing, typography, color, or layout-relationship props.
- **`.pathable-container` SCSS contract**: An existing SCSS component wrapper in `packages/styles/src/pathable-component-wrappers/pathable-container.scss` that defines the base container behavior (full width, auto margin centering, gutter padding, border-box) and three modifier classes (`--standard` at 1024px, `--wide` at 1280px, `--full` at 100%). Container consumes this contract without modification.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can wrap page content in `<Container size="standard">` and receive centered, width-constrained output with gutter padding using a single typed component — no CSS class knowledge required.
- **SC-002**: Changing to `<Container size="wide">` or `<Container size="full">` produces the correct max-width behavior with no code changes beyond the `size` prop value.
- **SC-003**: Unit tests confirm that each `size` value produces exactly one root element with the correct `.pathable-container` and `.pathable-container--{size}` classes, no wrapper elements, and preserved child content.
- **SC-004**: Server-rendered Container output matches client-rendered output for all `size` values and `as` element overrides.
- **SC-005**: CI passes — all lint, type-check, unit test, and Storybook test gates succeed without new suppressions.
- **SC-006**: Storybook stories for each `size` value render correctly and pass any automated contract or accessibility checks.
- **SC-007**: Ref forwarding works correctly, pointing to the rendered DOM element for all `as` values.

## Assumptions

- The semantic-prop foundation (slice 01, `specs/044-semantic-prop-foundation`) is complete and provides the class-merging pattern (`mergeClasses`) and internal resolver infrastructure.
- The Box primitive (slice 04) has established the polymorphic component pattern that `Container` will follow for `as` prop, ref forwarding, and native prop passthrough.
- The `.pathable-container` SCSS contract in `packages/styles/src/pathable-component-wrappers/pathable-container.scss` is the authoritative source for container behavior. The modifier class names (`--standard`, `--wide`, `--full`) are verified and ready for consumption.
- The `size` prop values (`"standard"`, `"wide"`, `"full"`) directly match the SCSS modifier class suffixes; no transformation or mapping layer is needed between the prop value and the class name.
- Container does not need responsive `size` prop values; each size is appropriate for all viewports (the SCSS contract uses fixed max-width values, not breakpoint-dependent ones).
- The `Container` component does not extend `SizingProps` or `SpacingProps` from the shared type system — its `size` prop replaces the role of `maxWidth` and the inherent centering/gutter behavior replaces the need for margin/padding props.
- Storybook stories for Container must use deterministic, fixed fixtures with no uncontrolled randomness, dates, or live network dependencies.