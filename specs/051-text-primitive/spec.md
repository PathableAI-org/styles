# Feature Specification: Text Primitive

**Feature Branch**: `051-text-primitive`

**Created**: 2026-08-21

**Status**: Draft

**Input**: User description: "Implement the Text typographic primitive for the React design system: semantic text roles (body, small, caption) and semantic tones (default, muted, danger, success) backed by verified pathable/styles SCSS contracts"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Style Text with Semantic Roles (Priority: P1)

A developer building a product page, form, or dashboard needs to display text at a design-system-governed size and hierarchy. They use the `Text` component with a `variant` prop (`body`, `small`, `caption`) so the text automatically receives the correct typography — font family, size, line height, and weight — without writing any font CSS. The default variant is the primary reading style for paragraphs.

**Why this priority**: Semantic text roles are the core purpose of the primitive. Without a way to express body, small, and caption typography, developers fall back to raw `className` utilities and lose type-safe design-system intent.

**Independent Test**: Render `<Text>Example</Text>` and verify the output is a `<p>` element carrying the default body text class with the design system body typography applied. Can be tested in isolation without tones, polymorphic elements, or test data.

**Acceptance Scenarios**:

1. **Given** a `Text` with no `variant` prop, **When** it renders, **Then** it produces a `<p>` element with the default body text class, and the text is styled with the design system body typography.
2. **Given** a `Text` with `variant="small"`, **When** it renders, **Then** the output text is styled with the small text typography class.
3. **Given** a `Text` with `variant="caption"`, **When** it renders, **Then** the output text is styled with the caption text typography class.
4. **Given** a `Text` with an unsupported variant value, **When** the component evaluates the prop, **Then** the value is rejected by the TypeScript type system and the component behaves predictably (documented fallback) at runtime.

---

### User Story 2 - Communicate Text Meaning with Tone (Priority: P1)

A developer needs to convey the semantic meaning of text — default, muted, danger, or success — without hard-coding palette values. They use the `tone` prop to map to the design system's semantic text color tokens.

**Why this priority**: Semantic tone is the second core capability of the component. It lets applications express "muted" or "danger" text that remains meaningful across themes and future palette changes.

**Independent Test**: Render `<Text tone="muted">`, `<Text tone="danger">`, and `<Text tone="success">` and verify the correct semantic tone text classes are applied. Test each tone independently.

**Acceptance Scenarios**:

1. **Given** a `Text` with `tone="muted"`, **When** it renders, **Then** the text uses the design system's muted text color token.
2. **Given** a `Text` with `tone="danger"`, **When** it renders, **Then** the text uses the design system's danger color token.
3. **Given** a `Text` with `tone="success"`, **When** it renders, **Then** the text uses the design system's success color token.
4. **Given** a `Text` with no `tone`, **When** it renders, **Then** the text uses the default text color with no tone class applied.

---

### User Story 3 - Render as Another Text Element (Priority: P2)

A developer needs to render text as an inline element (`span`), a form `label`, a `figcaption`, or another semantically valid element while keeping the same typography and tone.

**Why this priority**: The `as` prop is required by the plan, but the default `p` covers the most common case; semantic-element rendering is progressive enhancement.

**Independent Test**: Render `<Text as="span">`, `<Text as="label">`, and `<Text as="figcaption">` and verify the correct element is produced with the same typography/tone classes.

**Acceptance Scenarios**:

1. **Given** a `Text` with `as="span"`, **When** it renders, **Then** the output is a `<span>` styled with the requested typography.
2. **Given** a `Text` with `as="label"`, **When** it renders, **Then** the output is a `<label>` carrying the component's class, and native props valid for `<label>` (such as `htmlFor`) are accepted.
3. **Given** a `Text` with a native prop that is invalid for the selected element, **When** the prop is passed, **Then** the TypeScript type system rejects it, preserving native element semantics.

---

### User Story 4 - Compose with Native Props, Class Names, and Refs (Priority: P2)

A developer needs to pass native attributes, merge a custom `className`, and hold a reference to the rendered element, exactly as with any other primitive.

**Why this priority**: Composition is important for real-world use but builds on the polymorphic foundation established above.

**Acceptance Scenarios**:

1. **Given** a `Text` with a custom `className`, **When** it renders, **Then** the component's required typography and tone classes appear before the consumer `className` in the class attribute, consistent with the established merge order.
2. **Given** a `Text` with a ref, **When** it renders, **Then** the ref is forwarded to the rendered DOM element.
3. **Given** a `Text` rendered on the server and another on the client with identical props, **When** both render, **Then** the resulting markup and classes are identical (no browser-only behavior).

---

### User Story 5 - Support Assistive and Reading Scenarios (Priority: P3)

A developer needs to confirm the `Text` component supports accessible reading — sufficient color contrast for every supported variant/tone combination, no reliance on color alone, and consistent behavior in forced-colors and high-contrast modes.

**Why this priority**: Accessibility is a release requirement for all rendered UI, but it verifies rather than defines the component's core behavior.

**Independent Test**: Render the supported `variant`/`tone` combinations and evaluate contrast ratios and forced-colors behavior against the design-system tokens. Document findings in the feature branch.

**Acceptance Scenarios**:

1. **Given** any supported `variant` and `tone` combination, **When** evaluated against the design system's text color and background tokens, **Then** the text color meets the applicable contrast requirement for its size (normal or large text as defined by the contrast standard).
2. **Given** a rendered `Text` in a forced-colors environment, **When** the environment applies its color palette, **Then** the text remains visible and no informational meaning is lost solely through color.
3. **Given** a `Text` with no `tone` inside a surface or section with a non-default background, **When** contrasted, **Then** the default color token still meets the contrast obligation for its context.

---

### Edge Cases

- What happens when `variant` is omitted? The component falls back to the default body variant.
- What happens when `tone` is omitted? No tone class is applied; the text uses the default text color.
- What happens when the consumer passes an unknown `variant` or `tone` value at runtime? The value is rejected at compile time by the TypeScript union type; a runtime fallback is documented and tested.
- What happens when both `variant` and `as="label"` are specified? Both are applied: the label element receives the typography classes.
- What happens when the consumer passes a native prop invalid for the selected element? The TypeScript type system rejects it.
- What happens when text content is very long? The text wraps naturally within its container; no overflow is introduced.
- What happens in forced-colors mode? Semantic color is preserved through system color keywords; the component must not rely on palette values for meaning.
- What happens when the component is nested inside a constrained container? Text wraps to fit; no horizontal overflow is introduced.

## Requirements *(mandatory)*

### Functional Requirements

#### Source Contract (packages/styles)

- **FR-001**: The `@pathable/styles` package MUST provide a `pathable-text` SCSS contract that defines semantic typography role classes (at minimum body, small, caption) sourced from the design-system typography tokens.
- **FR-002**: The SCSS contract MUST define semantic text tone classes (at minimum `default`, `muted`, `danger`, `success`) that resolve to the design-system semantic color tokens (`--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-danger`, `--pathable-color-success`).
- **FR-003**: Every supported role class and tone class MUST resolve its visual values from existing `@pathable/styles` tokens (typography scale and semantic color tokens) — no hardcoded values outside the token system.
- **FR-004**: The SCSS contract MUST be exported through `pathable-layout-composition.scss` (or the appropriate shared entrypoint) so the compiled classes are available to consumers and wrapper packages.
- **FR-005**: The SCSS contract MUST preserve contrast, forced-colors, and theme behavior of the design-system tokens it references, and MUST document any required support in the compiled CSS.

#### React Primitive (packages/react)

- **FR-006**: The `@pathable/react` package MUST export a `Text` component that renders a typography-primitive root element using the `pathable-text` SCSS contract.
- **FR-007**: The `Text` component MUST default to rendering a `<p>` element.
- **FR-008**: The `Text` component MUST accept an `as` prop allowing any valid text element — including at minimum `p`, `span`, `label`, and `figcaption` — that applies the component's classes to that element.
- **FR-009**: The `Text` component MUST accept a `variant` prop with validated union values that include `"body"`, `"small"`, and `"caption"`, and MUST be extensible to additional roles verified from the SCSS contract.
- **FR-010**: The `Text` component MUST accept a `tone` prop with validated union values that include `"default"`, `"muted"`, `"danger"`, and `"success"`, and MUST be extensible to additional tones verified from the SCSS contract.
- **FR-011**: The `Text` component MUST deterministically map each `variant` value to its typography class and each `tone` value to its class, with no browser-only resolution.
- **FR-012**: The `Text` component MUST accept native element props valid for the selected element, and MUST NOT accept props invalid for the selected element (type-safe polymorphic props).
- **FR-013**: The `Text` component MUST merge its required typography classes, resolved variant/tone classes, and consumer-supplied `className` using the established `mergeClasses()` pattern with a documented class order.
- **FR-014**: The `Text` component MUST forward a `ref` to the rendered DOM element.
- **FR-015**: The `Text` component MUST NOT render any wrapper or intermediate DOM elements — all classes apply to the single text-element root.
- **FR-016**: The `Text` component MUST NOT expose raw font size, font weight, line-height, or font-family props — `className` and `style` remain the escape hatch.
- **FR-017**: Server and client renders of the same props MUST produce identical HTML and classes.

#### Component Behavior

- **FR-018**: The `Text` component MUST NOT include typography, tone, or heading behavior outside its own primitive surface — for example, must not render a heading element with hierarchy semantics.
- **FR-019**: The `Text` component MUST NOT expose padding, margin, sizing, display, or other layout props that belong to layout primitives; the `style` attribute remains available.
- **FR-020**: The typography role system MUST remain separate from HTML heading levels and document outline semantics (that is the `Heading` responsibility).

#### Testing

- **FR-021**: Unit tests MUST verify that each valid `variant` value produces the correct typography class.
- **FR-022**: Unit tests MUST verify that each valid `tone` value produces the correct tone class.
- **FR-023**: Unit tests MUST verify that `as` changes the rendered element and that native props are restricted to the selected element.
- **FR-024**: Unit tests MUST verify that `ref` forwarding provides the rendered DOM element.
- **FR-025**: Tests MUST verify that no wrapper or extra DOM nodes are introduced — the component root must be the only element, with no intermediate wrappers between it and its children.
- **FR-026**: Unit tests MUST cover the documented runtime fallback for an unknown `variant`/`tone` value.
- **FR-027**: Unit tests MUST verify server-rendered output does not depend on browser state (purity).

#### Storybook

- **FR-028**: A Storybook story MUST exist for `<Text variant="body">`.
- **FR-029**: A Storybook story MUST exist for `<Text variant="small" tone="muted">`.
- **FR-030**: A Storybook story MUST exist for `<Text variant="caption" tone="danger">`.
- **FR-031**: Storybook stories MUST be deterministic and use accessible queries (`getByText`) rather than implementation details.
- **FR-032**: The Storybook stories MUST document the semantic intent of the role and tone values and the accessibility obligations (contrast, element semantics).

### Key Entities *(include if feature involves data)*

- **TextRole**: The semantic text typography categories (`body`, `small`, `caption`) — each maps to a design-system typography class/tokens.
- **TextTone**: The semantic meaning categories (`default`, `muted`, `danger`, `success`) — each maps to a design-system semantic color token.
- **TextElement**: The selected text element (`p`, `span`, `label`, `figcaption`), which determines which native props are valid and the element's semantics.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can produce a properly styled `body`, `small`, or `caption` text element by writing a single JSX element (`<Text variant="small" tone="muted" />`) without writing raw CSS.
- **SC-002**: Every supported variant (body, small, caption) renders the correct typography class, verified by automated tests.
- **SC-003**: Every supported tone (default, muted, danger, success) renders the correct tone class, verified by automated tests.
- **SC-004**: A developer can render the primitive as `p`, `span`, `label`, or `figcaption` while preserving typography and tone behavior, verified by automated tests.
- **SC-005**: The component produces identical HTML when rendered on the server and re-rendered on the client, verified by SSR test assertions.
- **SC-006**: Every supported variant/tone combination passes the fixed contrast obligation for its text size using the design-system tokens, documented in the feature branch.
- **SC-007**: Forced-colors behavior is verified and documented; color is never the sole signal for semantics.
- **SC-008**: `Text` is exported from `@pathable/react` and usable without importing `@pathable/styles` separately.
- **SC-009**: The full existing layout-primitive test suite continues to pass with no regressions.

## Assumptions

- The design system's typography scale (`body-lg`, `body-md`, `body-sm`, `caption-md`, label roles) and semantic text color tokens (`--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-danger`, `--pathable-color-success`) already exist; the `pathable-text` SCSS contract formalizes role classes that currently may have no dedicated semantic typography class contract.
- If the SCSS audit finds that supported role classes are missing from `@pathable/styles`, formalizing them becomes a prerequisite task in this feature (per the plan's wording).
- The variant values `"body"`, `"small"`, `"caption"`, and the tone values `"default"`, `"muted"`, `"danger"`, `"success"` are the baseline; additional verified roles may be added during the audit before planning.
- The `as`, ref, class-merging, and deterministic-rendering patterns follow the established `Box`/`Stack`/`Inline`/`Cluster`/`Grid` polymorphic primitive conventions.
- The `mergeClasses()` helper and the resolver capability system (`packages/react/src/internal/resolvers`) are already available.
- `style` remains available as an escape hatch for application-specific raw values; it is not part of the design-system API.
- Accessibility evidence (contrast calculations, forced-colors behavior) is recorded in the feature branch as a checklist item or documented evidence, per the plan's "DONE means".