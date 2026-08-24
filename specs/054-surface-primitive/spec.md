# Feature Specification: Surface Primitive

**Feature Branch**: `054-surface-primitive`

**Created**: 2026-08-24

**Status**: Draft

**Input**: User description: "Implement `Surface`, a semantic visual-container primitive that coordinates foreground, background, border, elevation, and focus treatment into a single semantic prop. `Surface` is not a typed alias for `background-color`; it expresses a coordinated surface treatment grounded in the shared semantic tone vocabulary. The feature ships only if real code and design evidence demonstrates repeated, coordinated surface behavior that `Box` with `className` cannot serve."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Request a Coordinated Surface Treatment with One Prop (Priority: P1)

A developer building an application panel, card, or region needs to express a complete surface treatment — its background, foreground, border, elevation, and focus appearance — as a single semantic choice. They use `variant="subtle"` (or `"primary"` or `"default"`) and receive a coordinated set of design-system classes, instead of hand-assembling raw background, border, shadow, and focus utilities that can drift out of sync.

**Why this priority**: This is the core purpose of `Surface`. A single semantic prop that selects an entire coordinated treatment is what makes `Surface` distinct from `Box` plus ad-hoc `className`. Without it, the component has no reason to exist.

**Independent Test**: Render `<Surface variant="subtle">Panel</Surface>` and verify the DOM element carries the resolved surface variant classes covering background, border, elevation, and focus treatment as a coordinated set. Can be tested with a unit test and verified visually in Storybook.

**Acceptance Scenarios**:

1. **Given** an application developer, **When** they render a `Surface` with `variant="subtle"`, **Then** the rendered element receives the coordinated background, border, elevation, and focus classes for the subtle treatment.
2. **Given** an application developer, **When** they render a `Surface` with `variant="primary"`, **Then** the rendered element receives the coordinated treatment for the primary surface, including a foreground treatment that remains legible on the primary background.
3. **Given** an application developer, **When** they render a `Surface` with no `variant`, **Then** the rendered element receives the default surface treatment.
4. **Given** a `variant` value outside the supported set, **When** the value is evaluated, **Then** the TypeScript type system rejects it at compile time.

---

### User Story 2 - Render the Right Element Without Extra Wrappers (Priority: P1)

A developer needs `Surface` to render a plain `div` by default and to allow a semantic element override (for example `as="section"`, `as="article"`, or `as="aside"`). The component must produce exactly one DOM node — the selected element — with all resolved classes and forwarded attributes on that node, never an extra wrapper.

**Why this priority**: Element selection and a clean, wrapper-free DOM are the baseline contract for any React primitive in this system. A wrapper element would break layout, refs, and semantic document structure.

**Independent Test**: Render `<Surface as="section" />` and verify the output is a single `<section>` element with the surface classes, no child wrapper. Attach a ref and verify `ref.current` is that element. Can be tested with unit tests.

**Acceptance Scenarios**:

1. **Given** a `Surface` with no `as`, **When** it renders, **Then** the output is a single `<div>` element.
2. **Given** a `Surface` with `as="section"`, **When** it renders, **Then** the output is a single `<section>` element with the surface classes applied.
3. **Given** a `Surface` with a forwarded ref, **When** the component mounts, **Then** `ref.current` points to the rendered element.
4. **Given** any `Surface` instance, **When** the DOM is inspected, **Then** there are no extra wrapper elements — classes and attributes live on the single rendered element.

---

### User Story 3 - Apply a Semantic Border Tone (Priority: P2)

A developer needs to signal boundary meaning through the surface's border — for example, a `danger` border around an invalid or error state, or the `default` border for a neutral boundary. They use the shared `borderTone` prop rather than a raw border-color value.

**Why this priority**: Border tone is a named part of the shared tone vocabulary consumed by `Surface`, but it is a refinement on top of the core variant treatment. It is secondary to the coordinated variant prop.

**Independent Test**: Render `<Surface variant="default" borderTone="danger">` and verify the rendered element combines the variant classes with the resolved danger border-tone class. Can be tested with a unit test.

**Acceptance Scenarios**:

1. **Given** a `Surface` with `borderTone="danger"`, **When** it renders, **Then** the rendered element receives the danger border-tone class in addition to the variant treatment.
2. **Given** a `Surface` with no `borderTone`, **When** it renders, **Then** the border treatment is inherited from the resolved `variant` (or the default boundary) with no separate border-tone class.
3. **Given** a `borderTone` value outside the supported set, **When** the value is evaluated, **Then** the TypeScript type system rejects it at compile time.

---

### User Story 4 - Apply Elevation to a Surface (Priority: P2)

A developer needs to control the depth of a surface independently of its tone — for example, a raised card versus a flat, embedded region. They use the optional `elevation` prop, which maps to the design system's verified elevation/shadow steps, and never to arbitrary shadow values.

**Why this priority**: Elevation is part of the coordinated surface treatment but is usefully controlled on its own. It is secondary to the variant prop and is constrained to verified design-system steps.

**Independent Test**: Render `<Surface elevation="md">` and verify the rendered element receives the resolved elevation class. Verify the prop rejects an unsupported or arbitrary value. Can be tested with a unit test.

**Acceptance Scenarios**:

1. **Given** a `Surface` with `elevation="md"`, **When** it renders, **Then** the rendered element receives the medium elevation/shadow class.
2. **Given** a `Surface` with no `elevation`, **When** it renders, **Then** elevation is inherited from the resolved `variant` (or none) with no separate elevation class.
3. **Given** a `Surface` with `variant` and `elevation` both specified, **When** it renders, **Then** the elevation class and variant classes combine correctly on the same element.
4. **Given** an elevation value outside the verified design-system steps, **When** the value is evaluated, **Then** the TypeScript type system rejects it at compile time.

---

### User Story 5 - Size and Space a Surface with Shared Capability Props (Priority: P2)

A developer needs to control a surface's width and external spacing through the same semantic capability props used by other primitives (`width`, `maxWidth`, `margin`, and directional margins). `Surface` reuses the shared sizing and external-spacing capability interfaces rather than inventing its own.

**Why this priority**: Reusing the shared capability interfaces keeps the primitive consistent with the rest of the system, but this is ergonomic convenience on top of the core surface treatment.

**Independent Test**: Render `<Surface width="full" marginX="auto">` and verify the rendered element receives the resolved width and margin classes alongside the surface classes. Can be tested with a unit test.

**Acceptance Scenarios**:

1. **Given** a `Surface` with `width="full"` and `maxWidth="desktop"`, **When** it renders, **Then** the rendered element receives the resolved width and max-width classes.
2. **Given** a `Surface` with directional margin props, **When** it renders, **Then** the rendered element receives the corresponding margin classes.
3. **Given** a `Surface` with no sizing or spacing props, **When** it renders, **Then** no sizing or spacing classes are applied.

---

### User Story 6 - Accessible Surface Behavior (Priority: P1)

An accessibility reviewer needs `Surface` to remain usable in forced-colors/high-contrast modes, to preserve visible keyboard focus for any interactive surface, and to keep text legible against every supported surface background.

**Why this priority**: Accessibility is a release requirement. A surface that changes background, border, and elevation must not break contrast, focus visibility, or forced-colors behavior.

**Independent Test**: Inspect each supported variant with an accessibility checker for contrast and forced-colors behavior; verify focus visibility for the interactive treatment. Record evidence in the feature branch.

**Acceptance Scenarios**:

1. **Given** each supported surface variant, **When** text is rendered on the surface, **Then** the foreground/background combination meets WCAG AA contrast for normal text.
2. **Given** a surface rendered in forced-colors mode, **Then** its boundary and state remain visually distinguishable without relying on color alone.
3. **Given** an interactive surface, **When** it receives keyboard focus, **Then** a visible focus indicator is shown.
4. **Given** a surface in an environment with reduced motion, **When** it transitions, **Then** elevation/border transitions are removed or minimized.

---

### User Story 7 - The Precondition Is Demonstrated Before Shipping (Priority: P1)

A maintainer must be able to verify that the feature is justified. Before implementation, at least two concrete application use cases must demonstrate repeated, coordinated surface behavior that cannot be served by `Box` with `className`. If this evidence does not exist, the feature is cancelled and nothing ships.

**Why this priority**: The feature is explicitly conditional. The precondition protects the system from adding a component that duplicates `Box`. It gates all other work.

**Independent Test**: Review the documented use-case evidence in the feature branch and confirm at least two concrete cases of repeated coordinated surface behavior are recorded; otherwise confirm the feature is marked cancelled.

**Acceptance Scenarios**:

1. **Given** at least two concrete application use cases of repeated coordinated surface behavior, **When** the precondition is evaluated, **Then** the evidence is recorded in the feature branch and implementation proceeds.
2. **Given** fewer than two such use cases, **When** the precondition is evaluated, **Then** the feature is cancelled, the feature status is updated to CANCELLED, a brief rationale is recorded, and nothing ships.

---

### Edge Cases

- What happens when `variant` is omitted? The component applies the default surface treatment; no variant class is emitted for an explicit selection.
- What happens when `borderTone` is combined with a `variant` that already defines a border? The border-tone class resolves per the documented class-merging/conflict policy; the outcome must be deterministic and tested.
- What happens when `elevation` conflicts with a `variant` that already bakes in elevation? The conflict policy determines the final class output, and the behavior must be deterministic and tested.
- What happens when a consumer passes an unknown `variant`, `borderTone`, or `elevation` value at runtime? The TypeScript union rejects it at compile time; any runtime fallback is documented and tested.
- What happens when a consumer passes a raw `color`, `background`, or `borderColor` prop? Those props are not part of `Surface`'s API; they are rejected by the type system, with `className`/`style` as the documented escape hatch.
- What happens when a consumer passes an arbitrary `box-shadow` value? It is not supported; elevation is limited to the verified design-system steps.
- What happens when `Surface` renders on the server versus the client? The resolved class output must be byte-identical (no browser-only resolution).
- What happens when a surface contains long or localized content? The surface should not clip or overflow; sizing and border-radius must not force content clipping.
- What happens in forced-colors/high-contrast mode? Boundaries and state are preserved through system colors; color is never the sole signal.
- What happens if the precondition is not met? The feature is cancelled, nothing ships, and the feature status is recorded as CANCELLED with a rationale.

## Requirements *(mandatory)*

### Functional Requirements

#### Precondition gate

- **FR-001**: The feature MUST NOT ship the `Surface` component unless at least two concrete application use cases demonstrate repeated, coordinated surface behavior that cannot be served by `Box` with `className`. The evidence MUST be documented in the implementation branch.
- **FR-002**: If the precondition in FR-001 is not met, the feature MUST be cancelled: the feature status is set to CANCELLED, a brief rationale is recorded in the feature plan, and no `Surface` component ships.

#### Source-layer design contracts (`@pathableai/styles`)

- **FR-003**: For every supported `variant` value, `@pathableai/styles` MUST provide a verified SCSS contract that resolves a coordinated treatment covering foreground, background, border, and focus — no hardcoded values outside the token system.
- **FR-004**: The surface variant contract MUST resolve its visual values exclusively from existing `@pathableai/styles` semantic tokens (for example `--pathable-color-surface`, `--pathable-color-border`, `--pathable-color-accent`, `--pathable-color-focus-ring`), preserving contrast, forced-colors, and theme behavior.
- **FR-005**: For every supported `borderTone` value, `@pathableai/styles` MUST provide a verified SCSS border-tone contract, resolving to semantic border color tokens.
- **FR-006**: For every supported `elevation` step, `@pathableai/styles` MUST provide a verified elevation/shadow contract (for example the existing `--elevation-*` tokens), resolving to design-system shadow values — not arbitrary shadows.
- **FR-007**: Any surface, border-tone, or elevation contract that does not yet exist MUST be created in `@pathableai/styles` before the `Surface` React component exposes it; an unverified treatment MUST NOT be advertised as supported.
- **FR-008**: New or modified surface contracts MUST be exported through the appropriate shared entrypoint so compiled classes are available to consumers and the wrapper package.

#### React wrapper component (`@pathableai/react`)

- **FR-009**: The `Surface` component MUST be exported from `@pathableai/react`.
- **FR-010**: `Surface` MUST accept a `variant` prop whose value type is the shared `SurfaceTone` union (`default`, `subtle`, `primary`, plus any additional values verified from SCSS). `variant` selects a coordinated surface treatment, not a single color.
- **FR-011**: `Surface` MUST accept an optional `borderTone` prop whose value type is the shared `BorderTone` union (`default`, `danger`, plus any additional verified values).
- **FR-012**: `Surface` MUST accept an optional `elevation` prop constrained to the verified design-system elevation steps.
- **FR-013**: `Surface` MUST NOT accept raw `color`, `background`, or `borderColor` props, and MUST NOT accept arbitrary box-shadow values. `className` and `style` remain the escape hatches.
- **FR-014**: The default rendered element MUST be `div`, with a polymorphic `as` prop constrained to valid HTML elements and correctly narrowing native props per element.
- **FR-015**: `Surface` MUST support the shared sizing and external-spacing capability props (width, max-width, margin, and directional margins) from the shared capability interfaces established by feature 01.
- **FR-016**: `Surface` MUST merge classes in the documented order on the single root element: required surface classes → resolved variant/borderTone/elevation classes → resolved sizing/spacing classes → consumer `className`.
- **FR-017**: `Surface` MUST forward a ref to the rendered element.
- **FR-018**: `Surface` MUST NOT render any wrapper DOM elements — all classes and attributes are applied to the single rendered element.
- **FR-019**: `Surface` MUST produce deterministic, identical output when rendered on the server and in the browser, with no browser-only resolution.

#### Type system and resolvers

- **FR-020**: `Surface`'s `variant` prop MUST consume the shared internal `SurfaceTone` type (not an inline union), with no change to how tone types are otherwise resolved.
- **FR-021**: `Surface`'s `borderTone` prop MUST consume the shared internal `BorderTone` type.
- **FR-022**: A surface class resolver MUST map each supported `variant` value to its coordinated class set deterministically, with no browser dependencies.
- **FR-023**: A border-tone resolver MUST map each supported `borderTone` value to its class deterministically, with no browser dependencies.
- **FR-024**: An elevation resolver MUST map each supported `elevation` value to its verified class deterministically, with no browser dependencies.

#### Accessibility

- **FR-025**: Every supported surface variant MUST meet WCAG AA contrast for normal text rendered on it; contrast evidence MUST be documented for each variant.
- **FR-026**: Surface variants MUST remain visually distinguishable in forced-colors/high-contrast modes without relying on color alone.
- **FR-027**: Interactive surface treatments MUST preserve visible keyboard focus (for example a visible focus ring) and respect reduced-motion preferences for elevation/border transitions.

#### Storybook

- **FR-028**: Each supported surface variant MUST have a deterministic, named Storybook story.
- **FR-029**: The `borderTone` and `elevation` props MUST have at least one deterministic Storybook story each demonstrating their combination with a variant.
- **FR-030**: Stories MUST use accessible queries and deterministic content (no dates, random values, or live network calls).

#### Testing

- **FR-031**: Unit tests MUST verify that each supported `variant` maps to the correct coordinated class set.
- **FR-032**: Unit tests MUST verify that `elevation` and `borderTone` combine correctly with `variant`.
- **FR-033**: Unit tests MUST verify `as` element selection, ref forwarding, native prop passthrough, class merging order, and the absence of extra DOM nodes.
- **FR-034**: Unit tests MUST verify that server-rendered output is identical to client-rendered output for all covered prop combinations.
- **FR-035**: Unit tests MUST verify that invalid (out-of-union) `variant`, `borderTone`, and `elevation` values are rejected at compile time.

### Key Entities *(include if feature involves data)*

- **Surface component**: A React component in `@pathableai/react` that renders a semantic visual container and coordinates foreground, background, border, elevation, and focus treatment through a `variant` prop plus optional `borderTone` and `elevation` props.
- **Surface variant (SurfaceTone)**: The semantic surface treatment selectors (`default`, `subtle`, `primary`, plus verified values), each mapping to a coordinated set of design-system classes.
- **Border tone (BorderTone)**: The semantic boundary meaning categories (`default`, `danger`, plus verified values), each mapping to a design-system border-tone class.
- **Elevation step**: A finite, verified depth level (for example `sm`, `md`, `lg`, `xl`), each mapping to a design-system shadow/elevation class.
- **Surface SCSS contract**: The framework-neutral style contract in `@pathableai/styles` providing the surface base class and coordinated variant/border-tone/elevation modifiers.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The precondition is either satisfied (with at least two documented concrete application use cases) or the feature is cancelled with a recorded rationale — no surface component ships without evidence.
- **SC-002**: `Surface` is exported from `@pathableai/react` and renders exactly one DOM node per instance with no wrapper elements, verified by DOM inspection tests.
- **SC-003**: Every supported `variant` maps to a verified SCSS contract covering foreground, background, border, and focus, verified by automated tests.
- **SC-004**: `borderTone` and `elevation` combine correctly with `variant`, verified by automated tests.
- **SC-005**: Server-rendered and client-rendered output are byte-identical for all covered prop combinations.
- **SC-006**: Every supported variant meets WCAG AA contrast for normal text, with contrast and forced-colors evidence recorded in the feature branch.
- **SC-007**: Storybook stories for each supported variant, and for `borderTone` and `elevation`, render without errors.
- **SC-008**: The full existing primitive test suite continues to pass with no regressions, and CI passes.

## Assumptions

- The shared `SurfaceTone` (`default`, `subtle`, `primary`) and `BorderTone` (`default`, `danger`) types already exist in the internal type layer from feature 11 (Semantic Color and Tone Model); this feature consumes them and grounds them in verified surface/border contracts.
- The surface `variant` prop is named `variant` (not `tone`) because it selects an entire coordinated treatment — background, border, elevation, and focus — rather than a single color.
- A `pathable-surface.scss` contract already exists with depth-oriented variants; the SCSS audit in this feature will reconcile the shared tone vocabulary (`default`, `subtle`, `primary`) with any existing surface variant contract, creating or recording gaps as needed. The `primary` tone mapping (`--pathable-color-accent` versus `--pathable-color-action-primary-bg`) is resolved during this audit.
- The elevation prop maps to the existing verified elevation steps (`--elevation-sm`/`md`/`lg`/`xl`); additional steps are added only if verified in the styles package.
- `variant` selects the coordinated treatment but `borderTone` and `elevation` may refine it; when a refinement conflicts with a variant's built-in treatment, the documented class-merging/conflict policy determines the deterministic output.
- The precondition evidence is evaluated against real application code in the repository; if fewer than two concrete use cases exist, the feature is cancelled and its number is skipped, matching the feature plan's intent.
- `style` and `className` remain the escape hatches for application-specific raw color/shadow values; they are not part of the `Surface` API.
- Sizing and external-spacing props come from the shared capability interfaces established by feature 01, and `Surface` reuses them rather than redefining them.
