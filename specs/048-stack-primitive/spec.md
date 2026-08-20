# Feature Specification: Stack Layout Primitive

**Feature Branch**: `048-stack-primitive`

**Created**: 2026-08-20

**Status**: Draft

**Input**: "Implement `Stack`, a layout primitive that defines a vertical stacking relationship among its immediate children. `Stack` replaces ad-hoc `flex-direction: column` utility strings with a semantic abstraction."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Stack Children Vertically with a Gap (Priority: P1)

An application developer needs to lay out a sequence of content blocks — such as a page header, body section, and footer — in a vertical stack with consistent spacing between each block. Instead of manually adding margin to each child or writing ad-hoc flex utilities, they wrap the children in `<Stack gap="sm">` and receive a vertically-stacked flex container with the correct token-based spacing.

**Why this priority**: Vertical stacking with consistent gaps is the fundamental purpose of the Stack primitive. Without this, the component delivers no meaningful value. The gap prop is the most important differentiator from a generic `div`.

**Independent Test**: Render `<Stack gap="sm"><span>A</span><span>B</span></Stack>`, inspect the DOM, and verify it renders a single root element with the `.pathable-stack` and `.pathable-stack--gap-sm` classes, containing the child elements with no intermediate wrappers.

**Acceptance Scenarios**:

1. **Given** the `Stack` component is imported from `@pathable/react`, **When** a developer renders `<Stack gap="sm"><span>A</span><span>B</span></Stack>`, **Then** the rendered output is a single `<div>` element with classes `pathable-stack pathable-stack--gap-sm`, flex-direction column behavior, a token-based gap between children, and no wrapper element separating the Stack from its children.
2. **Given** the `Stack` component, **When** a developer renders `<Stack gap="lg"><span>A</span><span>B</span><span>C</span></Stack>`, **Then** the root element has classes `pathable-stack pathable-stack--gap-lg`.
3. **Given** the `Stack` component, **When** a developer renders `<Stack>` with no `gap` prop, **Then** the root element has only the base `.pathable-stack` class (gap defaults to `--space-16` via the existing CSS custom property default).
4. **Given** the `Stack` component, **When** a developer renders `<Stack gap="sm">` during server-side rendering, **Then** the output is identical to client-side rendering with the same classes and structure.

---

### User Story 2 - Align Children Horizontally Within a Stack (Priority: P2)

An application developer creates a vertical stack but wants the children to be center-aligned horizontally within the stack's cross-axis, or left-aligned for a different section. They pass an `align` prop with a semantic value such as `"center"` or `"start"`, and the component applies the corresponding verified alignment utility class to the root element.

**Why this priority**: Cross-axis alignment is a common layout need, second only to the gap relationship. Without it, developers would need to apply alignment classes separately, breaking the semantic abstraction.

**Independent Test**: Render `<Stack gap="sm" align="center"><span>A</span></Stack>`, inspect the DOM, and verify the root element carries both the stack classes and the `.pathable-flex-align-center` utility class.

**Acceptance Scenarios**:

1. **Given** the `Stack` component, **When** a developer renders `<Stack align="center"><span>A</span><span>B</span></Stack>`, **Then** the root element includes the class `pathable-flex-align-center` alongside `pathable-stack`.
2. **Given** the `Stack` component, **When** a developer renders `<Stack align="start"><span>A</span></Stack>`, **Then** the root element includes the class `pathable-flex-align-start`.
3. **Given** the `Stack` component, **When** a developer renders `<Stack gap="md">` with no `align` prop, **Then** no alignment utility class is applied (children use default stretch behavior from CSS).
4. **Given** the `Stack` component, **When** a developer passes an unrecognized `align` value, **Then** the TypeScript compiler rejects it at build time.

---

### User Story 3 - Sizing and External Spacing on the Stack Root (Priority: P2)

An application developer needs a full-width Stack with horizontal page gutters and automatic horizontal centering. They pass `width="full"`, `maxWidth="desktop"`, and `marginX="auto"` props, and the component applies the corresponding verified sizing and spacing utility classes to its root element.

**Why this priority**: Layout primitives must participate in their parent layout. Sizing and external spacing props from the shared capability system allow `Stack` to fit into real page compositions without an extra wrapper.

**Independent Test**: Render `<Stack width="full" maxWidth="desktop" marginX="auto"><span>A</span></Stack>`, inspect the DOM, and verify the root element carries the sizing and spacing utility classes in addition to the stack classes.

**Acceptance Scenarios**:

1. **Given** the `Stack` component, **When** a developer renders `<Stack gap="sm" width="full" maxWidth="desktop" marginX="auto"><span>A</span></Stack>`, **Then** the root element includes `pathable-stack pathable-stack--gap-sm pathable-width-full pathable-maxw-desktop pathable-margin-x-auto`, all on the single root element.
2. **Given** the `Stack` component, **When** a developer renders `<Stack gap="md">` without sizing or spacing props, **Then** only the stack-related classes appear — no sizing or spacing classes are emitted.
3. **Given** the `Stack` component, **When** a developer passes sizing or spacing props, **Then** the values are type-checked against the shared `SizingProps` and `SpacingProps` value unions from the semantic prop foundation.

---

### User Story 4 - Override the Rendered Element (Priority: P3)

An application developer wants the Stack to render as a semantic HTML landmark element. They pass `as="section"` and the component renders a `<section>` element with all the stack classes and behavior, accepting only native props valid for that element.

**Why this priority**: Semantic HTML landmarks improve accessibility and SEO. Supporting an `as` prop follows the established polymorphic pattern from `Box` and `Container` and allows Stack to serve as both a generic wrapper and a meaningful landmark.

**Independent Test**: Render `<Stack as="section" gap="sm"><span>A</span></Stack>` and verify the output is a `<section>` element with the stack classes.

**Acceptance Scenarios**:

1. **Given** the `Stack` component, **When** a developer renders `<Stack as="section" gap="sm"><span>A</span></Stack>`, **Then** the output is a `<section>` element (not `<div>`) with stack classes and child content.
2. **Given** the `Stack` component, **When** a developer renders `<Stack as="nav" gap="md"><a>Link</a></Stack>`, **Then** the output is a `<nav>` element with stack classes.
3. **Given** the `Stack` component with no `as` prop, **When** rendered, **Then** it renders as a `<div>` element by default.

---

### User Story 5 - Consumer className Composes Correctly (Priority: P3)

An application developer uses `Stack` with both a `gap` prop and a custom `className`. They expect all classes to appear on the root element, with the consumer's class appended after the component's own classes so intentional overrides take effect.

**Why this priority**: Class composition is essential for real-world use, but is a lower priority than the core rendering contract established in Stories 1–2.

**Independent Test**: Render `<Stack gap="sm" className="my-stack">` and verify the root element's class string contains both `pathable-stack pathable-stack--gap-sm` and `my-stack`, in that relative order.

**Acceptance Scenarios**:

1. **Given** the `Stack` component, **When** a developer renders `<Stack gap="sm" className="my-stack" />`, **Then** the root element's `class` attribute contains `pathable-stack`, `pathable-stack--gap-sm`, and `my-stack`, in that relative order.
2. **Given** the `Stack` component, **When** a developer renders `<Stack id="main-stack" data-test="stack" />`, **Then** the root element has the stack class plus the `id` and `data-test` attributes.

---

### User Story 6 - Ref Forwarding (Priority: P3)

An application developer needs a reference to the rendered DOM node for measurement or third-party integration. They pass a `ref` to `Stack` and the ref points directly to the root DOM element.

**Why this priority**: Ref forwarding is a standard React contract expectation. Its absence would block integrations, but it is lower priority than the core rendering, gap, and alignment behavior.

**Independent Test**: Pass a `React.createRef()` to `<Stack gap="sm">` and verify `ref.current` points to the root DOM element carrying the stack classes.

**Acceptance Scenarios**:

1. **Given** the `Stack` component, **When** a developer attaches a ref via `ref={myRef}`, **Then** `myRef.current` references the root DOM element.
2. **Given** the `Stack` component rendered with `as="section"`, **When** a ref is attached, **Then** `myRef.current` references the `<section>` element.

---

### User Story 7 - Storybook Documentation (Priority: P3)

A developer exploring the component library in Storybook finds a `Stack` component with stories for each supported `gap` value and alignment combination, plus nested layout examples demonstrating real-world composition patterns.

**Why this priority**: Documentation supports discoverability and correct usage, but it can be deferred until the component itself is implemented and tested.

**Independent Test**: Open Stack's Storybook stories and verify each supported `gap` value and common alignment combination has a story that renders correctly and passes automated contract or accessibility checks.

**Acceptance Scenarios**:

1. **Given** Storybook, **When** a developer navigates to the `Stack` component, **Then** there are stories for each `gap` value (`sm`, `md`, `lg`, `xl`) and common alignment combinations that render correctly.
2. **Given** Storybook, **When** a developer views a `Stack` story, **Then** the visual output shows vertical stacking with the expected gap and alignment behavior.
3. **Given** Storybook, **When** a developer views the `Stack` component, **Then** a nested layout story demonstrates Stack combined with other primitives (e.g., Stack inside Container, or Stack containing Inline children).

---

### Edge Cases

- What happens when `Stack` is empty (no children)? The root element with the stack classes renders correctly; no child-related layout errors occur.
- What happens when a wrapper element is placed between `Stack` and its intended children (e.g., `<Stack><div><span>A</span><span>B</span></div></Stack>`)? The gap relationship applies only between the immediate children of the Stack element — the intermediate wrapper becomes the sole flex child. This is correct CSS behavior, but component tests should verify that developers understand this constraint.
- What happens when an invalid `gap` value is passed? The TypeScript compiler rejects it at build time. At runtime, unrecognized values are silently omitted (no crash, no unexpected class).
- What happens during server-side rendering? The resolved classes must be identical to client-rendered output; no browser-only resolution may occur.
- What happens when `as` is set to a void element (e.g., `"input"`, `"img"`)? The polymorphic type system must prevent this — `as` must be restricted to elements that can contain children.
- What happens when `align` is combined with `justify`? Both utility classes apply to the root element. The combination is valid CSS and the design system alignment utilities can coexist on the same element.
- What happens when sizing props conflict with the default flex behavior? Sizing props (width, maxWidth) apply to the root element as expected. `flex-direction: column` and sizing are independent properties and do not conflict.
- What happens when `Stack` renders with `as="ol"` or `as="ul"` and contains `<li>` children? The component renders the list element with stack classes, and the `<li>` children participate in the flex layout normally — this is a valid and useful composition.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `Stack` component MUST be exported from `@pathable/react` as a public API surface.
- **FR-002**: The default rendered element for `Stack` MUST be a `<div>`; an `as` prop MUST allow overriding to semantic HTML elements (e.g., `"main"`, `"section"`, `"article"`, `"nav"`, `"ol"`, `"ul"`).
- **FR-003**: The `as` prop MUST be polymorphically typed using the established codebase pattern (`ElementType` + `HTMLAttributes<HTMLElement>` + `forwardRef<HTMLElement>`), matching the `Container` component's approach. Void-element prevention is not enforced at the type level; this limitation matches the existing codebase pattern and may be revisited when a shared polymorphic helper is available.
- **FR-004**: `Stack` MUST apply the `.pathable-stack` base class to its root element, which provides `display: flex; flex-direction: column;` and a default gap via `var(--pathable-stack-gap, var(--space-16))` from the existing SCSS contract in `pathable-stack.scss`.
- **FR-005**: `Stack` MUST expose a `gap` prop whose values map directly to verified `.pathable-stack--gap-{modifier}` modifier classes from the existing `@pathable/styles` SCSS contract. The supported values MUST be `"sm"` (8px), `"md"` (16px, default), `"lg"` (24px), and `"xl"` (32px).
- **FR-006**: When `gap` is omitted or undefined, `Stack` MUST apply only the base `.pathable-stack` class without a gap modifier class. The default gap of `--space-16` (16px) is provided by the CSS custom property default in the existing SCSS.
- **FR-007**: `Stack` MUST expose an `align` prop whose values map to verified `.pathable-flex-align-{value}` utility classes from the `@pathable/styles` utilities. The supported values MUST be `"start"`, `"center"`, `"end"`, `"stretch"`, and `"baseline"`.
- **FR-008**: When `align` is omitted or undefined, no alignment utility class MUST be applied (children use the default `align-items: stretch` behavior from CSS).
- **FR-009**: `Stack` MUST accept sizing props (`width`, `maxWidth`) and external spacing props (`margin`, `marginX`, `marginY`, directional margins) from the shared `SizingProps` and `SpacingProps` capability interfaces established by the semantic-prop foundation (slice 01). Each prop value MUST map to its corresponding verified utility class from `@pathable/styles`.
- **FR-010**: When sizing or spacing props are omitted, no sizing or spacing utility classes MUST be emitted on the root element.
- **FR-011**: `Stack` MUST merge classes in the documented order: required component classes (`.pathable-stack`), resolved gap modifier class (`.pathable-stack--gap-{size}`), resolved alignment utility class, resolved sizing/spacing utility classes, followed by the consumer-provided `className`.
- **FR-012**: `Stack` MUST NOT introduce any wrapper DOM element. All classes and props MUST apply to the single root element. Children MUST render as direct children of the root element with no intermediate wrappers.
- **FR-013**: `Stack` MUST NOT re-order, wrap, or otherwise modify its children. Children are rendered in document order as provided by the consumer.
- **FR-014**: `Stack` MUST forward refs correctly to the rendered root element regardless of the `as` prop value.
- **FR-015**: `Stack` MUST pass through all native HTML attributes (id, data-*, aria-*, event handlers, etc.) to the root element, constrained by the polymorphic typing.
- **FR-016**: `Stack` MUST produce identical DOM output (classes and structure) during server-side rendering and client-side rendering for all supported prop combinations.
- **FR-017**: `Stack` MUST NOT accept typography, color, tone, display, visibility, or child-wrapping props. Stack is a vertical-layout primitive, not a text, surface, or wrapping component.
- **FR-018**: `Stack` MUST NOT accept layout-relationship props that belong to other primitives: no wrapping (Inline/Cluster), no grid columns (Grid), no recursive nesting controls.
- **FR-019**: Unit tests MUST verify that each supported `gap` value maps to the correct `.pathable-stack--gap-{modifier}` class on the root element.
- **FR-020**: Unit tests MUST verify that each supported `align` value maps to the correct `.pathable-flex-align-{value}` utility class on the root element.
- **FR-021**: Unit tests MUST verify that no wrapper element exists (a single root element contains the stack classes and child content).
- **FR-022**: Unit tests MUST verify ref forwarding, `as` element selection, missing `gap` and `align` behavior, class merging with `className`, native prop passthrough, and sizing/spacing prop mappings.
- **FR-023**: A component test MUST verify immediate-child layout behavior: a wrapper element between `Stack` and its intended children breaks the gap and alignment relationship — the wrapper becomes the sole flex child.
- **FR-024**: Storybook stories MUST exist for `Stack` demonstrating each supported `gap` value (`sm`, `md`, `lg`, `xl`), common alignment combinations (`align="center"`, `align="start"`), and a nested layout example (Stack inside Container, Stack with Inline children). Stories MUST be deterministic with no uncontrolled randomness, dates, or live network dependencies.
- **FR-025**: No new SCSS or `packages/styles` CSS output changes are permitted for the Stack classes. `Stack` MUST consume the existing `.pathable-stack` and `.pathable-stack--gap-{modifier}` SCSS contract as-is, and the existing `.pathable-flex-align-{value}` utility classes as-is.
- **FR-026**: The component implementation MUST follow the established reactor pattern from the semantic-prop foundation (slice 01) and the polymorphic pattern from the Box primitive (slice 04).

### Key Entities

- **Stack**: A new React component exported from `@pathable/react`. It renders a single, vertically-stacked flex container (default `<div>`, overridable via `as`) that controls the vertical spacing and cross-axis alignment of its immediate children. It consumes the existing `.pathable-stack` SCSS contract and `.pathable-flex-align-*` utility classes from `@pathable/styles`. It accepts a `gap` prop (`"sm"`, `"md"`, `"lg"`, `"xl"`) that maps to gap modifier classes, an `align` prop (`"start"`, `"center"`, `"end"`, `"stretch"`, `"baseline"`) that maps to alignment utility classes, sizing and external spacing props from the shared capability system, plus native HTML attributes, consumer `className`, and ref forwarding.
- **`.pathable-stack` SCSS contract**: An existing SCSS component wrapper in `packages/styles/src/pathable-component-wrappers/pathable-stack.scss` that defines the base stack behavior (`display: flex; flex-direction: column;`) with a configurable gap via `var(--pathable-stack-gap, var(--space-16))` and four gap modifier classes (`--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`). Stack consumes this contract without modification.
- **`.pathable-flex-align-{value}` utility classes**: Existing alignment utilities in `packages/styles/src/_utilities.scss` that apply `align-items` values (`center`, `start`, `end`, `stretch`, `baseline`). Stack applies these as additional utility classes on the root element without modifying the utility source.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can wrap a sequence of content blocks in `<Stack gap="sm">` and receive a vertically-stacked flex container with token-based spacing between children using a single typed component — no CSS class knowledge or manual margin required.
- **SC-002**: Changing the `gap` prop to `"md"`, `"lg"`, or `"xl"` produces the correct spacing with no code changes beyond the prop value.
- **SC-003**: Setting `<Stack align="center">` center-aligns all immediate children horizontally within the stack using the verified design-system alignment utility.
- **SC-004**: Setting `<Stack width="full" maxWidth="desktop" marginX="auto">` applies sizing and external spacing to the stack's root element using verified utility classes, with no extra wrapper element.
- **SC-005**: Unit tests confirm that each `gap` value produces exactly one root element with the correct `.pathable-stack` and `.pathable-stack--gap-{size}` classes, no wrapper elements, and preserved child content in document order.
- **SC-006**: Unit tests confirm that each `align` value adds the correct `.pathable-flex-align-{value}` utility class alongside the stack classes on the single root element.
- **SC-007**: Unit tests confirm that sizing and spacing props from the shared capability system produce the correct verified utility classes on the root element.
- **SC-008**: Server-rendered Stack output matches client-rendered output for all supported prop combinations.
- **SC-009**: CI passes — all lint, type-check, unit test, and Storybook test gates succeed without new suppressions.
- **SC-010**: Storybook stories for each `gap` value and alignment combination render correctly and pass any automated contract or accessibility checks.
- **SC-011**: Ref forwarding works correctly, pointing to the rendered DOM element for all `as` values.

## Assumptions

- The semantic-prop foundation (slice 01, `specs/044-semantic-prop-foundation`) is complete and provides the shared `SizingProps`, `SpacingProps`, class-merging pattern (`mergeClasses`), and internal resolver infrastructure.
- The Box primitive (slice 04) has established the polymorphic component pattern that `Stack` will follow for `as` prop, ref forwarding, and native prop passthrough.
- The Container primitive (slice 05, `specs/047-container-primitive`) has established the pattern of consuming an existing SCSS component wrapper without modification — `Stack` follows the same discipline.
- The `.pathable-stack` SCSS contract in `packages/styles/src/pathable-component-wrappers/pathable-stack.scss` is the authoritative source for stack behavior. The gap modifier class names (`--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`) are verified and ready for consumption.
- The `.pathable-flex-align-{value}` utility classes in `packages/styles/src/_utilities.scss` are verified and ready for consumption as alignment utilities on the Stack root element.
- The `gap` prop values (`"sm"`, `"md"`, `"lg"`, `"xl"`) directly match the SCSS modifier class suffixes; no transformation or mapping layer is needed between the prop value and the class name.
- The `align` prop values (`"start"`, `"center"`, `"end"`, `"stretch"`, `"baseline"`) directly match the `.pathable-flex-align-{value}` utility class suffixes.
- The `justify` prop is not included in the initial scope. If a need for `justify-content` control arises from real usage, it can be added in a follow-up feature following the same pattern as `align`.
- The `gap` prop uses the named scale values (`"sm"`, `"md"`, `"lg"`, `"xl"`) rather than numeric spacing scale indices. This is consistent with how the `.pathable-stack--gap-*` modifiers are named in the SCSS contract. A `gap="4"` numeric API would require a mapping layer not present in the SCSS class names.
- Internal spacing props (`padding`, `paddingX`, `paddingY`) are not supported on `Stack`. Internal spacing changes the component's internal geometry and may conflict with the stack's visual contract. Developers who need internal padding on a stacked region should wrap the content in a `Box` or apply padding to individual children.
- Storybook stories for Stack must use deterministic, fixed fixtures with no uncontrolled randomness, dates, or live network dependencies.
- The Stack component does not accept `justifyContent` as a prop in this feature. The `.pathable-flex-justify-{value}` utilities exist in the styles package but are not exposed through `Stack` at this time.