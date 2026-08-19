# Feature Specification: Card Sizing and Spacing Props

**Feature Branch**: `045-card-sizing-spacing`

**Created**: 2026-08-19

**Status**: Draft

**Input**: Use the shared type system and resolvers from the semantic-prop foundation (slice 01) to add selected sizing and external-spacing props to the `Card` component in `@pathable/react`. This is the architectural proof point for the semantic-prop approach.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Apply Width and Max-Width Constraints to a Card (Priority: P1)

An application developer needs to constrain a Card's width using design-system tokens. They want to make a card full-width or limit its maximum width to a breakpoint value such as `tablet`, without memorizing CSS class names or adding wrapper elements.

**Why this priority**: Width and max-width are the most fundamental layout controls for a container component. If Card cannot accept these props, the core semantic-prop approach is not proven.

**Independent Test**: Render `<Card width="full" maxWidth="tablet" />` and verify the root element carries `pathable-width-full` and `pathable-maxw-tablet` classes with no extra wrapper DOM elements. This delivers the ability to constrain card width via typed props.

**Acceptance Scenarios**:

1. **Given** the Card component is imported from `@pathable/react`, **When** a developer renders `<Card width="full" />`, **Then** the rendered root `<div>` element includes the class `pathable-width-full` and no additional wrapper element is present.
2. **Given** the Card component, **When** a developer renders `<Card maxWidth="tablet" />`, **Then** the root element includes the class `pathable-maxw-tablet` and the component's existing structural classes and behavior are preserved.
3. **Given** the Card component, **When** a developer passes no sizing props, **Then** the Card renders identically to its current behavior with no unexpected classes or DOM changes.

---

### User Story 2 - Apply External Spacing to a Card (Priority: P2)

An application developer needs to add margin around a Card to control its participation in surrounding layout — for example, centering with horizontal auto margins or adding spacing above or below.

**Why this priority**: External margin is the second most common layout concern after sizing. Combined with width constraints, it enables common patterns like a centered, constrained card without wrapper components.

**Independent Test**: Render `<Card marginX="auto" marginBottom="4" />` and verify the root element carries `pathable-margin-x-auto` and `pathable-margin-bottom-4` classes.

**Acceptance Scenarios**:

1. **Given** the Card component, **When** a developer renders `<Card marginX="auto" />`, **Then** the root element includes the class that maps marginX auto to a CSS class and the Card is horizontally centered when inside a containing layout.
2. **Given** the Card component, **When** a developer renders `<Card marginY="4" />`, **Then** the root element includes the class that applies vertical spacing above and below the Card.
3. **Given** the Card component, **When** a developer renders `<Card marginTop="2" marginBottom="6" />`, **Then** the root element includes classes for both top and bottom margin with the specified scale values.
4. **Given** the Card component, **When** a developer passes no spacing props, **Then** the Card renders with its default margin behavior (no additional margin classes).

---

### User Story 3 - Consumer className Composes Correctly with Semantic Props (Priority: P3)

An application developer uses both semantic props and a custom `className` on the same Card. They expect both sets of classes to appear on the root element, with the consumer's class appended after the semantic classes so their overrides take effect.

**Why this priority**: Class composition is essential for real-world use where developers mix semantic props with application-specific styles. This is a key contract for the semantic-prop system.

**Independent Test**: Render `<Card width="full" className="my-custom" />` and verify the root element's class string contains both `pathable-width-full` and `my-custom`, with the consumer class listed last.

**Acceptance Scenarios**:

1. **Given** the Card component, **When** a developer renders `<Card width="full" className="my-custom" />`, **Then** the root element's `class` attribute contains both `pathable-card`, `pathable-width-full`, and `my-custom`, in that relative order.
2. **Given** the Card component, **When** a developer renders `<Card maxWidth="desktop" className="my-app-card" />`, **Then** the root element's `class` attribute contains both `pathable-maxw-desktop` and `my-app-card`.
3. **Given** the Card component, **When** a developer passes only `className` without semantic props, **Then** the Card renders with its default classes plus the consumer class, identical to the current behavior.

---

### Edge Cases

- What happens when a developer passes an invalid sizing or spacing value? The TypeScript compiler should reject it at build time; runtime should gracefully omit the unrecognized value without crashing.
- What happens when both `margin` and `marginY` are passed simultaneously? The conflict policy from the semantic-prop foundation should define which takes precedence, and the behavior should be consistent and documented.
- What happens during server-side rendering with sizing/spacing props? The resolved classes must be identical to client-rendered output — no browser-only resolution.
- What happens when Card receives ref forwarding alongside sizing/spacing props? The forwarded ref must still point to the root `<div>` element; semantic props must not interfere with ref behavior.
- What happens when native HTML attributes (such as `id`, `data-*`, `aria-*`) are passed alongside semantic props? All native attributes must pass through to the root element unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `Card` component's TypeScript interface MUST extend the `SizingProps` interface from the shared semantic-prop foundation.
- **FR-002**: The `Card` component's TypeScript interface MUST extend the `SpacingProps` interface from the shared semantic-prop foundation.
- **FR-003**: The `Card` component MUST resolve `width` and `maxWidth` values to their corresponding `@pathable/styles` CSS classes using the pure internal resolvers defined in the semantic-prop foundation.
- **FR-004**: The `Card` component MUST resolve `margin`, `marginX`, `marginY`, `marginTop`, and `marginBottom` values to their corresponding `@pathable/styles` CSS classes using the pure internal resolvers defined in the semantic-prop foundation.
- **FR-005**: The `Card` component MUST apply all resolved semantic classes to the same root `<div>` element it already owns — no additional wrapper element may be introduced.
- **FR-006**: The `Card` component MUST merge classes in the documented order: required component classes (e.g., `pathable-card`), followed by resolved semantic classes, followed by the consumer-provided `className`.
- **FR-007**: The `Card` component MUST preserve its existing ref forwarding behavior, allowing consumers to obtain a reference to the root DOM element.
- **FR-008**: The `Card` component MUST preserve its existing native element prop passthrough (`id`, `data-*`, `aria-*`, event handlers, etc.) on the root element.
- **FR-009**: The `Card` component MUST produce identical DOM output (classes and structure) during server-side rendering and client-side rendering for all supported prop combinations.
- **FR-010**: The `Card` component MUST preserve its existing semantic HTML structure, accessibility behavior, and ARIA roles.

### Key Entities

- **Card**: An existing `@pathable/react` component that renders a container element with the `pathable-card` class. It accepts children, ref forwarding, native HTML attributes, and a consumer `className`. With this feature, it also accepts sizing and external-spacing semantic props.
- **SizingProps**: A shared TypeScript interface (from the semantic-prop foundation) defining optional `width` and `maxWidth` props with typed value unions.
- **SpacingProps**: A shared TypeScript interface (from the semantic-prop foundation) defining optional `margin`, `marginX`, `marginY`, `marginTop`, and `marginBottom` props with typed `SpacingScale` values.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can apply width and max-width constraints to a Card using only typed props, with no need to know CSS class spellings.
- **SC-002**: A component test confirms that `<Card maxWidth="tablet" marginX="auto" />` renders exactly one root element with the expected CSS classes and no child wrapper.
- **SC-003**: Storybook stories showcasing the new props render correctly and pass any automated contract checks.
- **SC-004**: Server-rendered output matches client-rendered output for all new prop combinations.
- **SC-005**: All existing Card behavior (children rendering, ref forwarding, native props, accessibility) remains intact — the feature is purely additive.
- **SC-006**: CI passes — all lint, type-check, unit test, and Storybook test gates succeed without new suppressions.

## Assumptions

- The semantic-prop foundation (slice 01) is complete and provides working `SizingProps`, `SpacingProps`, and resolver functions in `packages/react/src/internal/resolvers/`.
- The `@pathable/styles` package already emits the required utility classes: `pathable-width-full`, `pathable-width-auto`, `pathable-maxw-{mobile,mobile-lg,tablet,desktop}`, and `pathable-margin-{n}`, `pathable-margin-x-{n}`, `pathable-margin-y-{n}`, `pathable-margin-top-{n}`, `pathable-margin-bottom-{n}` for scale values 0–15.
- Padding props are intentionally excluded from Card's initial adoption — they may be added later if a clear use case emerges.
- The `marginX="auto"` value for horizontal centering resolves to `pathable-margin-x-auto` following the spacing resolver's auto-value contract.
- Typography, color, display, visibility, and layout-participation props remain excluded from Card's public API per the documented capability matrix.
- Storybook stories should use deterministic, fixed fixtures with accessible queries where applicable.
- The conflict policy for overlapping spacing props (e.g., `margin` plus `marginY`) is defined by the foundation slice and inherited here as-is.