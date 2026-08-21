# Feature Specification: Grid Primitive

**Feature Branch**: `050-grid-primitive`

**Created**: 2026-08-21

**Status**: Draft

**Input**: User description: "Implement Grid, a layout primitive for design-system-approved column and gap patterns. Grid intentionally does not expose the full CSS Grid language; it expresses the project's standard grid layouts as semantic props."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Arrange Content in a Multi-Column Grid (Priority: P1)

A developer building a product page, dashboard, or form uses the Grid component to arrange child elements into a uniform multi-column layout. They specify the number of columns and the spacing between items using semantic props, without writing raw CSS Grid rules.

**Why this priority**: Multi-column grids are the most common and fundamental use case for a Grid primitive. Without this capability, developers must write custom CSS Grid rules, defeating the purpose of a design-system layout primitive.

**Independent Test**: Render a Grid with `cols={3}` and three child items. Verify that the rendered output is a CSS Grid container with three equal-width columns, and that each immediate child occupies one grid cell. This can be tested in isolation without any other primitives.

**Acceptance Scenarios**:

1. **Given** a Grid with `cols={2}` and two child elements, **When** the component renders, **Then** the output is a grid container with two equal-width columns, and each child occupies a single cell.
2. **Given** a Grid with `cols={3}` and six child elements, **When** the component renders, **Then** the output is a grid container with three equal-width columns, and children wrap to the next row after filling columns.
3. **Given** a Grid with `cols={4}` and mixed content (text, images, cards), **When** the component renders, **Then** all immediate children participate in the grid, and grandchildren are not affected by grid placement.
4. **Given** a Grid with `cols={2}` rendered on the server (SSR), **When** the same component renders on the client, **Then** the output HTML and CSS classes are identical.

---

### User Story 2 - Control Grid Spacing (Priority: P1)

A developer needs consistent, design-system-governed spacing between grid cells. They control spacing using a `gap` prop that maps to predefined spacing tokens rather than arbitrary pixel values.

**Why this priority**: Spacing control is essential for grid usability. Without it, every grid layout would require manual CSS overrides for spacing, undermining the primitive's purpose.

**Independent Test**: Render a Grid with `cols={2} gap="lg"` and verify that the gap CSS class matches the design system's large gap token. Test each gap size independently.

**Acceptance Scenarios**:

1. **Given** a Grid with `gap="sm"`, **When** the component renders, **Then** the gap between grid cells matches the design system's small gap token.
2. **Given** a Grid with `gap="md"`, **When** the component renders, **Then** the gap between grid cells matches the design system's medium gap token.
3. **Given** a Grid with `gap="lg"`, **When** the component renders, **Then** the gap between grid cells matches the design system's large gap token.
4. **Given** a Grid with neither `gap`, `columnGap`, nor `rowGap` specified, **When** the component renders, **Then** the grid uses the default gap defined by the design system's SCSS contract.

---

### User Story 3 - Align Grid Items Vertically (Priority: P2)

A developer needs to control the vertical alignment of items within a grid row. Items of varying heights should align to the start, center, end, or stretch to fill the row height.

**Why this priority**: Vertical alignment is a common layout need, but secondary to the core column and gap configuration. Most grids work with the default alignment, but specific designs require alignment control.

**Independent Test**: Render a Grid with `cols={3} align="center"` and items of different heights. Verify that all items are vertically centered within their row.

**Acceptance Scenarios**:

1. **Given** a Grid with `align="center"` and items of varying heights, **When** the component renders, **Then** all items are vertically centered within their grid row.
2. **Given** a Grid with `align="start"` and items of varying heights, **When** the component renders, **Then** all items are aligned to the start of their grid row.
3. **Given** a Grid with `align="end"` and items of varying heights, **When** the component renders, **Then** all items are aligned to the end of their grid row.

---

### User Story 4 - Apply External Spacing and Sizing (Priority: P2)

A developer composes a Grid within a larger layout and needs to apply margin, width, or other external spacing and sizing properties to the grid container itself.

**Why this priority**: External spacing and sizing are essential for compositional layouts, but the grid's core layout behavior is the primary concern. Users can work around missing sizing props with wrapper elements.

**Independent Test**: Render a Grid with `width="100%"` and `marginBottom="md"`. Verify that the grid container receives the width and margin classes.

**Acceptance Scenarios**:

1. **Given** a Grid with `width="100%"`, **When** the component renders, **Then** the grid container spans the full width of its parent.
2. **Given** a Grid with `marginBottom="lg"`, **When** the component renders, **Then** the grid container has the appropriate bottom margin class.
3. **Given** a Grid with `maxWidth="container"`, **When** the component renders, **Then** the grid container is constrained to the container width.

---

### User Story 5 - Render as a Semantic Element (Priority: P3)

A developer needs the grid to render as a semantic HTML element (e.g., `<section>`, `<ul>`) instead of the default `<div>`, preserving accessibility and document structure.

**Why this priority**: Semantic HTML is important for accessibility but is a progressive enhancement. The default `<div>` works for most cases.

**Independent Test**: Render a Grid with `as="section"` and verify that the output element is a `<section>` with the correct grid CSS classes applied.

**Acceptance Scenarios**:

1. **Given** a Grid with `as="section"`, **When** the component renders, **Then** the output is a `<section>` element with the grid CSS classes.
2. **Given** a Grid with no `as` prop, **When** the component renders, **Then** the output defaults to a `<div>` element.
3. **Given** a Grid with `as="ul"` and `<li>` children, **When** the component renders, **Then** the `<li>` children participate in the grid layout.

---

### Edge Cases

- What happens when a Grid has zero children? The grid container renders but contains no grid cells.
- What happens when a Grid receives an invalid column count (e.g., `cols={0}`, `cols={7}`)? The component must fall back to a sensible default or the nearest valid column configuration.
- What happens when a Grid is nested inside another Grid? The nested grid behaves independently; only immediate children of each grid participate in their respective layouts.
- What happens when a child of a Grid has `display: contents`? The child's own children participate in the grid — this is standard CSS Grid behavior and is not suppressed by the primitive.
- What happens when a Grid is rendered inside a constrained container narrower than the combined column widths? The grid columns shrink proportionally to fit the container, as defined by the CSS Grid spec.
- How does the Grid handle very long content in a single cell? Content wraps within the cell; the column width is maintained.

## Requirements *(mandatory)*

### Functional Requirements

#### Source Contract (packages/styles)

- **FR-001**: The `@pathable/styles` package MUST provide a `pathable-grid` SCSS contract that defines `display: grid` and column configurations for the supported column counts.
- **FR-002**: The SCSS contract MUST support column configurations for 2, 3, and 4 equal-width columns via modifier classes.
- **FR-003**: The SCSS contract MUST provide gap modifier classes (`--gap-sm`, `--gap-md`, `--gap-lg`, `--gap-xl`) that map to the design system's spacing tokens.
- **FR-004**: The SCSS contract MUST provide grid alignment modifier classes that map `align-items` values to the design system's alignment tokens.
- **FR-005**: The SCSS contract MUST be exported through the `pathable-layout-composition.scss` entrypoint so it is available to consumers and wrapper packages.

#### React Wrapper (packages/react)

- **FR-006**: The `@pathable/react` package MUST export a `Grid` component that renders a CSS Grid container using the `pathable-grid` SCSS contract.
- **FR-007**: The `Grid` component MUST accept a `cols` prop (`2`, `3`, or `4`) that maps to the corresponding column modifier class (e.g., `pathable-grid--cols-2`).
- **FR-008**: The `Grid` component MUST accept a `gap` prop (`"sm"`, `"md"`, `"lg"`, `"xl"`) that maps to the corresponding gap modifier class (e.g., `pathable-grid--gap-lg`).
- **FR-009**: The `Grid` component MAY accept `columnGap` and `rowGap` props where the SCSS contract supports separate axis gap control, allowing independent horizontal and vertical gap values.
- **FR-010**: The `Grid` component MUST accept an `align` prop that maps to the grid alignment modifier classes provided by the SCSS contract.
- **FR-011**: The `Grid` component MUST support the shared sizing props (e.g., `width`, `maxWidth`, `minWidth`, `height`) from the `SizingProps` capability interface.
- **FR-012**: The `Grid` component MUST support the shared external spacing props (margin, but not padding) from the `SpacingProps` capability interface.
- **FR-013**: The `Grid` component MUST accept an `as` prop that allows the rendered element to be any valid HTML element, defaulting to `div`.
- **FR-014**: The `Grid` component MUST forward a `ref` to the rendered DOM element.
- **FR-015**: The `Grid` component MUST merge consumer-supplied `className` values with the resolved grid, column, gap, alignment, sizing, and spacing classes using the established `mergeClasses()` pattern.
- **FR-016**: The `Grid` component MUST NOT render any wrapper or intermediate DOM elements — all classes must be applied to the single root element.
- **FR-017**: The `Grid` component MUST NOT generate different HTML output on the server and client for the same props.

#### Component Behavior

- **FR-018**: Only immediate children of the Grid MUST participate in the CSS Grid layout. Grandchildren MUST NOT be affected by grid placement.
- **FR-019**: The `Grid` component MUST NOT expose props for arbitrary `grid-template-columns`, `grid-template-rows`, `grid-area`, named grid lines, masonry, or subgrid behavior.
- **FR-020**: The `Grid` component MUST NOT expose typography, color, tone, display, or visibility props.

#### Testing

- **FR-021**: Unit tests MUST verify that each valid `cols` value produces the correct grid column modifier class.
- **FR-022**: Unit tests MUST verify that each valid `gap` value produces the correct gap modifier class.
- **FR-023**: Unit tests MUST verify that the `align` prop maps to the correct alignment class.
- **FR-024**: Unit tests MUST verify that the `as` prop changes the rendered element.
- **FR-025**: Unit tests MUST verify that `ref` forwarding provides access to the DOM element.
- **FR-026**: Component tests MUST verify that immediate children, but not grandchildren, participate in the grid layout.
- **FR-027**: Tests MUST NOT have any child-wrapping DOM elements between the Grid root and its children.

#### Storybook

- **FR-028**: A Storybook story MUST exist for a 2-column grid with gap configuration.
- **FR-029**: A Storybook story MUST exist for a 3-column grid with gap configuration.
- **FR-030**: A Storybook story MUST exist for a 4-column grid with mixed content.
- **FR-031**: A controls/playground story MUST exist for interactive exploration of supported props.
- **FR-032**: All stories MUST be deterministic — no random values, current dates, or live network dependencies.

### Key Entities

- **GridLayout**: The visual arrangement produced by a CSS Grid container with a specified number of equal-width columns and a uniform gap. It governs the placement of immediate children only.
- **GridColumn**: A single child element participating in the grid, occupying one cell in the current row. Children of varying content types and sizes are supported.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can create a multi-column grid layout by writing a single JSX element (`<Grid cols={3} gap="md">`) without any custom CSS.
- **SC-002**: Every supported column count (2, 3, 4) renders correctly with the appropriate grid column class, verified by automated tests.
- **SC-003**: Every supported gap value (sm, md, lg, xl) renders correctly with the appropriate gap class, verified by automated tests.
- **SC-004**: The Grid component produces identical HTML output when rendered on the server and on the client, verified by SSR test assertions.
- **SC-005**: All existing design system layout primitives (Stack, Inline, Cluster, Container, Box) continue to function correctly alongside the Grid primitive, verified by the full test suite passing.
- **SC-006**: A consumer importing `@pathable/react` can use the Grid component without importing `@pathable/styles` separately.

## Assumptions

- The gap scale for Grid uses the same spacing tokens (`sm`, `md`, `lg`, `xl`) established by the Stack primitive, with values of 8px, 16px, 24px, and 32px respectively.
- Column counts are limited to 2, 3, and 4 — these are the design-system-approved column configurations derived from existing grid patterns in the codebase (KPI grid, bento grid).
- The `align` prop for Grid uses the same `pathable-flex-align-*` utility classes used by Stack and Inline for `align-items`, since CSS Grid also uses `align-items` for vertical alignment.
- Responsive column counts are excluded per the plan's explicit direction. If responsive grid behavior is needed in the future, the SCSS contract will be extended first.
- The `as` prop and ref forwarding follow the same polymorphic patterns established by Box, Stack, Inline, and Cluster.
- The `mergeClasses()` pattern, `SizingProps`, and `SpacingProps` capability interfaces are already available from the semantic utility type system (slice 01).
- Padding is excluded from the Grid's spacing surface because layout primitives should not define internal padding — that is the responsibility of the content placed inside the grid.