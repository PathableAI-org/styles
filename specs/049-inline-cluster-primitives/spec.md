# Feature Specification: Inline and Cluster Layout Primitives

**Feature Branch**: `049-inline-cluster-primitives`

**Created**: 2026-08-20

**Status**: Draft

**Input**: "Implement `Inline` and `Cluster`, two related layout primitives that arrange children in the horizontal (inline) axis. `Inline` creates a single row of evenly-spaced items. `Cluster` creates a wrapping row where items flow onto new lines when space is constrained."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Arrange Children Horizontally with a Gap (Priority: P1)

An application developer needs to lay out a row of items — such as navigation links, toolbar buttons, or status indicators — in a horizontal row with consistent spacing between each item. They wrap the children in `<Inline gap="sm">` and receive a horizontally-stacked flex container with token-based spacing.

**Why this priority**: Horizontal arrangement with gaps is the fundamental purpose of the Inline primitive. Without this, the component delivers no meaningful value. The gap prop is the most important differentiator from a generic `div`.

**Independent Test**: Render `<Inline gap="sm"><span>A</span><span>B</span></Inline>`, inspect the DOM, and verify it renders a single root element with `flex-direction: row` behavior and the correct gap class, containing the child elements with no intermediate wrappers.

**Acceptance Scenarios**:

1. **Given** the `Inline` component is imported from `@pathable/react`, **When** a developer renders `<Inline gap="sm"><span>A</span><span>B</span></Inline>`, **Then** the rendered output is a single `<div>` element with `flex-direction: row` behavior, a token-based gap between children, and no wrapper element separating Inline from its children.
2. **Given** the `Inline` component, **When** a developer renders `<Inline gap="lg"><span>A</span><span>B</span><span>C</span></Inline>`, **Then** the root element has the correct gap class corresponding to the `"lg"` value.
3. **Given** the `Inline` component, **When** a developer renders `<Inline>` with no `gap` prop, **Then** the root element has the base Inline class with default gap behavior from the CSS custom property.
4. **Given** the `Inline` component, **When** a developer renders `<Inline gap="sm">` during server-side rendering, **Then** the output is identical to client-side rendering with the same classes and structure.

---

### User Story 2 - Wrap Children When Space Is Constrained (Priority: P1)

An application developer needs to display a group of tags or filter chips that should flow onto additional lines when the container is too narrow to fit them all on one row. They wrap the items in `<Cluster gap="sm">` and the items wrap naturally, maintaining consistent spacing between wrapped rows.

**Why this priority**: Wrapping behavior is the defining difference between Cluster and Inline. This is a P1 alongside Inline because the two primitives together provide the complete horizontal layout toolkit.

**Independent Test**: Render `<Cluster gap="sm"><span>A</span><span>B</span><span>C</span></Cluster>` in a constrained container, inspect the DOM, and verify the root element renders with `flex-wrap: wrap` behavior and the correct gap class, with items wrapping to new lines when space is insufficient.

**Acceptance Scenarios**:

1. **Given** the `Cluster` component is imported from `@pathable/react`, **When** a developer renders `<Cluster gap="sm"><span>A</span><span>B</span><span>C</span></Cluster>` in a constrained-width container, **Then** the rendered output is a single root element with `flex-wrap: wrap` behavior, items flow onto new lines as needed, consistent spacing is maintained between all items and rows, and no wrapper element separates Cluster from its children.
2. **Given** the `Cluster` component, **When** a developer renders `<Cluster gap="lg">` with many children in a wide container, **Then** all items fit on one row with the correct gap (no wrapping occurs until space is constrained).
3. **Given** the `Cluster` component, **When** a developer renders `<Cluster>` with no `gap` prop, **Then** the root element has the base Cluster class with default gap and wrapping behavior.
4. **Given** the `Cluster` component, **When** rendered during server-side rendering, **Then** the output is identical to client-side rendering with the same classes and structure.

---

### User Story 3 - Align and Justify Children Within the Row (Priority: P2)

An application developer creates an Inline row but wants items to be centered vertically within the row, and distributed with space between them horizontally. They pass `align="center"` and `justify="between"` props.

They also want a Cluster of wrapped items whose rows are center-aligned vertically and end-aligned horizontally. They pass `align="center"` on the Cluster.

**Why this priority**: Alignment and justification are essential layout controls that differentiate these primitives from generic containers. Without them, developers must apply utility classes separately.

**Independent Test**: Render `<Inline align="center" justify="between"><span>A</span><span>B</span></Inline>` and verify correct alignment and justification classes on the root element.

**Acceptance Scenarios**:

1. **Given** the `Inline` component, **When** a developer renders `<Inline align="center" justify="between"><span>A</span><span>B</span></Inline>`, **Then** the root element includes alignment and justification classes that center items vertically and distribute them with space between horizontally.
2. **Given** the `Inline` component, **When** a developer renders `<Inline justify="center">`, **Then** the root element includes the justification class that centers items along the inline axis.
3. **Given** the `Cluster` component, **When** a developer renders `<Cluster align="start"><span>A</span><span>B</span></Cluster>`, **Then** items in each wrapped row are aligned to the start of the cross-axis.
4. **Given** the `Inline` component, **When** a developer renders `<Inline>` with no `align` or `justify` props, **Then** no alignment or justification classes are applied (using default CSS behavior).
5. **Given** the `Cluster` component, **When** a developer passes an unrecognized `align` value, **Then** the TypeScript compiler rejects it at build time.

---

### User Story 4 - Sizing and External Spacing (Priority: P2)

An application developer needs a full-width Inline with horizontal centering, or a constrained Cluster that has page gutters. They pass sizing and spacing props (`width`, `maxWidth`, `margin` variants) inherited from the shared capability system.

**Why this priority**: Layout primitives must participate in their parent layouts. Sizing and spacing props allow Inline and Cluster to fit into real page compositions without extra wrappers.

**Independent Test**: Render `<Inline width="full" maxWidth="desktop" marginX="auto" gap="sm"><span>A</span></Inline>` and verify the root element carries sizing and spacing utility classes alongside the Inline classes.

**Acceptance Scenarios**:

1. **Given** an `Inline` or `Cluster` component, **When** a developer renders it with `width="full"`, `maxWidth="desktop"`, and `marginX="auto"`, **Then** the root element includes the corresponding verified sizing and spacing utility classes, all on the single root element.
2. **Given** an `Inline` or `Cluster` component, **When** a developer renders it without sizing or spacing props, **Then** only the component-related classes appear — no sizing or spacing utility classes are emitted.
3. **Given** an `Inline` or `Cluster` component, **When** a developer passes sizing or spacing props, **Then** the values are type-checked against the shared `SizingProps` and `SpacingProps` capability interfaces.

---

### User Story 5 - Override the Rendered Element (Priority: P3)

An application developer wants the Inline to render as a semantic `<nav>` element for a navigation bar, or a Cluster to render as a `<ul>` element for a tag list. They pass `as="nav"` or `as="ul"` and the component renders the correct semantic element with all layout classes and behavior.

**Why this priority**: Semantic HTML landmarks improve accessibility and SEO. Supporting an `as` prop follows the established polymorphic pattern and allows these primitives to serve both as generic wrappers and meaningful landmarks.

**Independent Test**: Render `<Inline as="nav" gap="sm"><a>Link</a></Inline>` and verify the output is a `<nav>` element with Inline classes.

**Acceptance Scenarios**:

1. **Given** the `Inline` component, **When** a developer renders `<Inline as="nav" gap="sm"><a>Link</a></Inline>`, **Then** the output is a `<nav>` element (not `<div>`) with Inline classes and child content.
2. **Given** the `Cluster` component, **When** a developer renders `<Cluster as="ul" gap="sm"><li>A</li><li>B</li></Cluster>`, **Then** the output is a `<ul>` element with Cluster classes.
3. **Given** either component with no `as` prop, **When** rendered, **Then** it renders as a `<div>` element by default.

---

### User Story 6 - Consumer className Composes Correctly and Ref Forwards (Priority: P3)

An application developer uses Inline with both a `gap` prop and a custom `className`. They expect all classes to appear on the root element with the consumer's class appended last. They also need a ref to the DOM node for measurement or integration purposes.

**Why this priority**: Class composition and ref forwarding are standard React contracts. They are lower priority than the core layout behavior established in Stories 1–3.

**Independent Test**: Render `<Inline gap="sm" className="my-inline">` and verify class ordering. Pass a `ref` and verify it points to the root element.

**Acceptance Scenarios**:

1. **Given** the Inline or Cluster component, **When** a developer renders it with a `gap` prop and a `className="custom"`, **Then** the root element's `class` attribute contains the component classes followed by the consumer's class in that relative order.
2. **Given** the Inline or Cluster component, **When** a developer attaches a ref via `ref={myRef}`, **Then** `myRef.current` references the root DOM element.
3. **Given** either component rendered with `as="section"`, **When** a ref is attached, **Then** `myRef.current` references the `<section>` element.
4. **Given** either component, **When** a developer renders with `id`, `data-*`, or `aria-*` attributes, **Then** those attributes appear on the root element alongside the component classes.

---

### User Story 7 - Storybook Documentation (Priority: P3)

A developer exploring the component library in Storybook finds `Inline` and `Cluster` components with stories demonstrating each supported gap value, alignment and justification combinations, wrapping behavior for Cluster at different container widths, and nested layout examples.

**Why this priority**: Documentation supports discoverability and correct usage but can be deferred until the components are implemented and tested.

**Independent Test**: Open the Inline and Cluster Storybook stories and verify each supported configuration has a story that renders correctly.

**Acceptance Scenarios**:

1. **Given** Storybook, **When** a developer navigates to the `Inline` component, **Then** there are stories for each `gap` value (`sm`, `md`, `lg`, `xl`) and common alignment/justification combinations that render correctly.
2. **Given** Storybook, **When** a developer navigates to the `Cluster` component, **Then** there are stories for each `gap` value, alignment combinations, and a responsive wrapping example that demonstrates items flowing onto new lines in a constrained container.
3. **Given** Storybook, **When** a developer views Inline or Cluster stories, **Then** a nested layout story demonstrates the component combined with other primitives (e.g., Inline inside Stack, or Cluster inside Container).

---

### Edge Cases

- What happens when `Inline` or `Cluster` is empty (no children)? The root element with the component classes renders correctly; no child-related layout errors occur.
- What happens when a wrapper element is placed between the component and its intended children? The gap relationship applies only between the immediate children of the component element — the intermediate wrapper becomes the sole flex child. This is correct CSS behavior, but component tests should verify that developers understand this constraint.
- What happens when an invalid `gap` value is passed? The TypeScript compiler rejects it at build time. At runtime, unrecognized values produce no unexpected class.
- What happens during server-side rendering? The resolved classes must be identical to client-rendered output; no browser-only resolution may occur.
- What happens when Cluster children have fixed widths? Children with intrinsic or fixed widths size naturally and wrap according to the container's available space — Cluster does not require or enforce specific child dimensions.
- What happens when `as` is set to a void element (e.g., `"input"`, `"img"`)? The polymorphic type system must prevent this — `as` must be restricted to elements that can contain children.
- What happens when `align` and `justify` are combined on Inline? Both classes apply to the root element. The combination is valid CSS and the design system alignment utilities can coexist on the same element.
- What happens when Inline children overflow the container horizontally? Since Inline does not wrap, children that collectively exceed the container width will overflow. This is intentional behavior — developers who need wrapping should use Cluster instead.
- What happens when sizing props conflict with a Cluster that must shrink below its children's minimum size? Content may overflow a Cluster that is sized smaller than its children's minimum widths. Developers should size Cluster containers appropriately for their content.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Both `Inline` and `Cluster` MUST be exported from `@pathable/react` as public API surfaces.
- **FR-002**: The default rendered element for `Inline` and `Cluster` MUST be a `<div>`; an `as` prop MUST allow overriding to semantic HTML elements (e.g., `"main"`, `"section"`, `"article"`, `"nav"`, `"ol"`, `"ul"`).
- **FR-003**: The `as` prop MUST be polymorphically typed using the established codebase pattern (`ElementType` + `HTMLAttributes<HTMLElement>` + `forwardRef<HTMLElement>`), matching the `Container` component's approach.

- **FR-004**: `Inline` MUST render a horizontal flex container (`flex-direction: row`) that does not wrap — children remain on a single row regardless of container width.
- **FR-005**: `Cluster` MUST render a horizontal flex container that wraps (`flex-wrap: wrap`), allowing children to flow onto additional lines when the container width is insufficient.

- **FR-006**: Both `Inline` and `Cluster` MUST expose a `gap` prop with values `"sm"`, `"md"`, `"lg"`, and `"xl"`. Each value MUST map to the corresponding gap modifier class from its respective SCSS contract. The actual pixel values for each named size are defined by the SCSS contract and may differ between components based on their layout context.
- **FR-007**: When `gap` is omitted or undefined on either component, only the base component class MUST be applied without a gap modifier. The default gap is provided by the CSS custom property default in the SCSS contract.

- **FR-008**: `Inline` MUST expose an `align` prop whose values map to verified alignment classes (`"start"`, `"center"`, `"end"`, `"stretch"`, `"baseline"`), controlling the cross-axis alignment of children within the row.
- **FR-009**: `Inline` MUST expose a `justify` prop whose values map to verified justification classes (`"start"`, `"center"`, `"end"`, `"between"`, `"around"`), controlling the inline-axis distribution of children along the row.
- **FR-010**: `Cluster` MUST expose an `align` prop whose values map to verified alignment classes (`"start"`, `"center"`, `"end"`, `"stretch"`, `"baseline"`), controlling the cross-axis alignment of items within each wrapped row.

- **FR-011**: When `align` or `justify` props are omitted or undefined, no corresponding alignment or justification class MUST be applied (default CSS behavior is used).

- **FR-012**: Both `Inline` and `Cluster` MUST accept sizing props (`width`, `maxWidth`) and external spacing props (`margin`, `marginX`, `marginY`, directional margins) from the shared `SizingProps` and `SpacingProps` capability interfaces. Each prop value MUST map to its corresponding verified utility class from `@pathable/styles`.
- **FR-013**: When sizing or spacing props are omitted, no sizing or spacing utility classes MUST be emitted on the root element.

- **FR-014**: Both components MUST merge classes in the documented order: base component class → gap modifier → alignment/justification classes → sizing/spacing utility classes → consumer-provided `className`.
- **FR-015**: Both components MUST NOT introduce any wrapper DOM element. All classes and props MUST apply to the single root element. Children MUST render as direct children of the root element.
- **FR-016**: Both components MUST NOT re-order, wrap, or otherwise modify their children. Children are rendered in document order as provided by the consumer.
- **FR-017**: Both components MUST forward refs correctly to the rendered root element regardless of the `as` prop value.
- **FR-018**: Both components MUST pass through all native HTML attributes (`id`, `data-*`, `aria-*`, event handlers, etc.) to the root element, constrained by polymorphic typing.

- **FR-019**: Both components MUST produce identical DOM output (classes and structure) during server-side rendering and client-side rendering for all supported prop combinations.

- **FR-020**: `Inline` and `Cluster` MUST NOT accept typography, color, tone, display, visibility, or child-wrapping props. They are horizontal-layout primitives, not text or surface components.
- **FR-021**: `Inline` and `Cluster` MUST NOT accept layout-relationship props that belong to other primitives: no vertical stacking (Stack), no grid columns (Grid), no recursive nesting controls.

- **FR-022**: Unit tests MUST verify that `Inline` renders a non-wrapping horizontal flex container (no `flex-wrap`) and `Cluster` renders a wrapping horizontal flex container (`flex-wrap: wrap`).
- **FR-023**: Unit tests MUST verify that each supported `gap` value maps to the correct gap modifier class on the root element for both components.
- **FR-024**: Unit tests MUST verify that each supported `align` value maps to the correct alignment class for both components.
- **FR-025**: Unit tests MUST verify that each supported `justify` value maps to the correct justification class for `Inline`.
- **FR-026**: Unit tests MUST verify that no wrapper element exists (a single root element contains the component classes and child content) for both components.
- **FR-027**: Unit tests MUST verify ref forwarding, `as` element selection, missing prop behavior, class merging with `className`, native prop passthrough, and sizing/spacing prop mappings for both components.
- **FR-028**: A component test MUST verify immediate-child layout behavior: a wrapper element between the component and its intended children breaks the gap and alignment relationship, making the wrapper the sole flex child.

- **FR-029**: Storybook stories MUST exist for `Inline` demonstrating each supported `gap` value, common alignment and justification combinations, and a nested layout example (Inline inside Stack, Inline with Container).
- **FR-030**: Storybook stories MUST exist for `Cluster` demonstrating each supported `gap` value, alignment combinations, a constrained-width responsive wrapping example, and a nested layout example.
- **FR-031**: All Storybook stories MUST be deterministic with no uncontrolled randomness, dates, or live network dependencies.

- **FR-032**: Both components MUST consume their styling exclusively from the `@pathable/styles` package. Any new SCSS contracts required (e.g., a `pathable-inline` component wrapper or additional gap modifiers) MUST be added to `packages/styles` before the React wrapper exposes them.
- **FR-033**: The existing `pathable-cluster` SCSS contract in `packages/styles` is the authoritative source for Cluster behavior. If this contract requires gap scale expansions or new modifiers, those changes MUST be made in `packages/styles`.
- **FR-034**: Both component implementations MUST follow the established reactor pattern from the semantic-prop foundation and the polymorphic pattern from the Box primitive.

### Key Entities

- **Inline**: A new React component exported from `@pathable/react`. It renders a single, non-wrapping horizontal flex container (default `<div>`, overridable via `as`) that controls horizontal spacing, cross-axis alignment, and inline-axis justification of its immediate children. It accepts a `gap` prop (`"sm"`, `"md"`, `"lg"`, `"xl"`), an `align` prop, a `justify` prop, sizing and spacing props from the shared capability system, plus native HTML attributes, consumer `className`, and ref forwarding.

- **Cluster**: A new React component exported from `@pathable/react`. It renders a single, wrapping horizontal flex container (default `<div>`, overridable via `as`) that allows children to flow onto additional lines, with consistent spacing between both items and rows. It accepts a `gap` prop (`"sm"`, `"md"`, `"lg"`, `"xl"`), an `align` prop, sizing and spacing props from the shared capability system, plus native HTML attributes, consumer `className`, and ref forwarding.

- **`.pathable-cluster` SCSS contract**: An existing SCSS component wrapper in `packages/styles/src/pathable-component-wrappers/pathable-cluster.scss` that defines the wrapping flex behavior (`display: flex; flex-wrap: wrap;`) with a configurable horizontal and vertical gap via `--pathable-cluster-gap`, cross-axis alignment via `--pathable-cluster-align`, and four gap modifier classes (`--gap-sm`, `--gap-md`, `--gap-lg`) plus alignment modifier classes (`--align-start`, `--align-center`, `--align-end`, `--align-stretch`). Cluster consumes this contract and may require gap scale expansions.

- **Inline SCSS contract**: A SCSS component wrapper (either existing or to be created in `packages/styles`) that defines the non-wrapping horizontal flex behavior and gap modifiers for the Inline component. The Inline React component consumes this contract, which must exist in `packages/styles` before the React wrapper is exposed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can wrap a sequence of items in `<Inline gap="sm">` and receive a horizontal non-wrapping flex container with token-based spacing using a single typed component — no CSS class knowledge or manual margin required.
- **SC-002**: A developer can wrap a group of tags in `<Cluster gap="sm">` and receive a wrapping flex container where items flow onto new lines when space is constrained, with consistent spacing between both items and rows — no manual breakpoint or width management required.
- **SC-003**: Changing the `gap` prop to `"md"`, `"lg"`, or `"xl"` on either component produces the correct spacing with no code changes beyond the prop value.
- **SC-004**: Setting `<Inline align="center" justify="between">` center-aligns children vertically and distributes them with space between horizontally using verified alignment and justification utilities.
- **SC-005**: Setting `<Cluster align="start">` aligns items within each wrapped row to the start of the cross-axis.
- **SC-006**: Setting sizing and spacing props (`width`, `maxWidth`, `marginX`) on either component applies the correct verified utility classes to the root element with no extra wrapper.
- **SC-007**: The rendered output clearly differentiates `Inline` (non-wrapping single row) from `Cluster` (wrapping multi-line) when inspected in the DOM, even with identical children and `gap` values.
- **SC-008**: Unit tests confirm each component's distinguishing behavior (`flex-wrap: nowrap` for Inline, `flex-wrap: wrap` for Cluster), correct gap/align/justify class mapping, and no wrapper elements.
- **SC-009**: Server-rendered output matches client-rendered output for all supported prop combinations for both components.
- **SC-010**: CI passes — all lint, type-check, unit test, and Storybook test gates succeed without new suppressions.
- **SC-011**: Storybook stories for each gap value, alignment combination, and wrapping example render correctly and pass automated contract or accessibility checks.
- **SC-012**: Ref forwarding works correctly for both components, pointing to the rendered DOM element for all `as` values.

## Assumptions

- The semantic-prop foundation (slice 01) is complete and provides the shared `SizingProps`, `SpacingProps`, class-merging pattern (`mergeClasses`), and internal resolver infrastructure.
- The Box primitive (slice 04) has established the polymorphic component pattern that both Inline and Cluster will follow for `as` prop, ref forwarding, and native prop passthrough.
- The Stack primitive (slice 06) has established the pattern of consuming an existing SCSS component wrapper with gap modifiers — Inline and Cluster follow a similar discipline.
- The `.pathable-cluster` SCSS contract in `packages/styles` is the authoritative source for Cluster wrapping behavior. Its existing gap modifiers (`--gap-sm` at 4px, `--gap-md` at 8px, `--gap-lg` at 16px) may differ in pixel values from the Stack gap scale, and may need expansion to include an `--gap-xl` modifier to align with the shared gap prop values (`"sm"`, `"md"`, `"lg"`, `"xl"`).
- An Inline SCSS contract (`pathable-inline`) will be created in `packages/styles` (if it does not already exist) providing `flex-direction: row` and gap modifier classes. The React Inline component will consume this contract.
- Inline gap modifier class suffixes (`--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`) follow the same naming convention as Stack and Cluster.
- The `align` prop values for Inline and Cluster use the existing `.pathable-flex-align-{value}` utility classes or equivalent contract classes. The Cluster SCSS already has built-in alignment modifiers that may take precedence.
- The `justify` prop for Inline uses the existing `.pathable-flex-justify-{value}` utility classes from `@pathable/styles`.
- The `gap` prop uses named scale values (`"sm"`, `"md"`, `"lg"`, `"xl"`) rather than raw numeric values. This is consistent with the established pattern from Stack and the existing SCSS modifier class naming convention.
- The cluster `gap` prop sets both horizontal and vertical gaps. A separate `row-gap` prop for Cluster (mentioned in the original feature brief) may require additional SCSS contract changes and will be evaluated during planning.
- Internal spacing props (`padding`, `paddingX`, `paddingY`) are not supported on Inline or Cluster, consistent with the Stack primitive's approach. Developers who need internal padding should wrap content in a `Box` or apply padding to individual children.
- Storybook stories must use deterministic, fixed fixtures with no uncontrolled randomness, dates, or live network dependencies.
- `Inline` does not provide a `flex-wrap` override — its non-wrapping behavior is fixed. Developers who need wrapping should use `Cluster`.
- Neither component exposes a `flex-direction` override — `row` is the fixed direction for both, consistent with their semantic intent as horizontal-axis primitives.