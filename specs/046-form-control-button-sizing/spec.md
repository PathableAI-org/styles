# Feature Specification: Form Controls and Button Adopt Sizing Props

**Feature Branch**: `046-form-control-button-sizing`

**Created**: 2026-08-20

**Status**: Draft

**Input**: "Add `width="full"` (and other safe sizing props) to form controls (`TextInput`, `Select`, `TextArea`, etc.) and `Button`. These are the most commonly widened components in application code and benefit most from removing ad-hoc utility-class strings."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set Full-Width on a Form Control (Priority: P1)

An application developer building a form wants a `TextInput` or `Select` to stretch to the full width of its container. Instead of manually adding a CSS class string, they pass `width="full"` as a typed prop and receive editor autocompletion, type-checking, and predictable output.

**Why this priority**: Full-width is the single most common layout override for form controls and buttons. If this does not work, the feature delivers no meaningful value.

**Independent Test**: Render `<TextInput width="full" />` and verify the root element carries the `pathable-width-full` class with no additional wrapper DOM element. The control renders and behaves identically to its non-semantic-prop counterpart in all other respects.

**Acceptance Scenarios**:

1. **Given** the `TextInput` component is imported from `@pathable/react`, **When** a developer renders `<TextInput width="full" />`, **Then** the rendered root `<input>` element includes the class `pathable-width-full` and no additional wrapper element is present.
2. **Given** the `Button` component, **When** a developer renders `<Button width="full" />`, **Then** the root element includes the class `pathable-width-full` and the component's click, focus, disabled, and keyboard behavior is unchanged.
3. **Given** the `TextArea` component, **When** a developer renders `<TextArea width="full" />`, **Then** the root `<textarea>` element includes the class `pathable-width-full`.
4. **Given** any supported form control, **When** a developer passes no sizing props, **Then** the component renders identically to its current behavior with no unexpected classes or DOM changes.

---

### User Story 2 - Constrain Maximum Width on a Button or Form Control (Priority: P2)

An application developer wants to limit how wide a `Button` or `Select` can grow — for example, preventing a full-width button in a wide layout from becoming awkwardly stretched, or constraining a `TextArea` to a readable measure.

**Why this priority**: Max-width constraints are the natural complement to full-width. Together, they enable responsive form layouts where controls expand but don't exceed comfortable reading widths.

**Independent Test**: Render `<Button maxWidth="tablet" />` and verify the root element carries the `pathable-maxw-tablet` class. Render `<TextInput width="full" maxWidth="desktop" />` and verify both classes appear on the single root element.

**Acceptance Scenarios**:

1. **Given** the `Button` component, **When** a developer renders `<Button maxWidth="tablet" />`, **Then** the root element includes the class `pathable-maxw-tablet`.
2. **Given** the `Select` component, **When** a developer renders `<Select width="full" maxWidth="desktop" />`, **Then** the root element includes both `pathable-width-full` and `pathable-maxw-desktop` classes.
3. **Given** the `TextArea` component, **When** a developer renders `<TextArea maxWidth="mobile-lg" />`, **Then** the root `<textarea>` element includes the class `pathable-maxw-mobile-lg`.

---

### User Story 3 - Consumer className Composes with Semantic Props (Priority: P2)

An application developer uses both semantic sizing props and a custom `className` on the same form control. They expect both to appear on the root element, with the consumer's class appended after semantic classes so any intentional overrides take effect.

**Why this priority**: Class composition is essential for real-world use. Without it, developers would be forced to choose between semantic props and custom classes, defeating the purpose of the feature.

**Independent Test**: Render `<Button width="full" className="my-custom" />` and verify the root element's class string contains both `pathable-width-full` and `my-custom`, with the consumer class listed last.

**Acceptance Scenarios**:

1. **Given** the `Button` component, **When** a developer renders `<Button width="full" className="my-custom" />`, **Then** the root element's `class` attribute contains the component's default classes, `pathable-width-full`, and `my-custom`, in that relative order.
2. **Given** the `TextInput` component, **When** a developer renders `<TextInput maxWidth="tablet" className="form-input" />`, **Then** the root element's `class` attribute contains both `pathable-maxw-tablet` and `form-input`.
3. **Given** any supported component, **When** a developer passes only `className` without semantic sizing props, **Then** the component renders with its default classes plus the consumer class, identical to current behavior.

---

### User Story 4 - Documentation and Capability Matrix (Priority: P3)

A developer exploring the component library consults the capability matrix to see which components support which semantic props. They find that `Button`, `TextInput`, `Select`, and `TextArea` are listed with `width` and `maxWidth` marked as supported, along with a Storybook example demonstrating `width="full"` on each component.

**Why this priority**: Documentation supports discoverability and correct usage, but it can be deferred until the props themselves are implemented and tested.

**Independent Test**: Open the capability matrix and verify the listed components have `width` and `maxWidth` marked as supported. Open each component's Storybook and find a story demonstrating the full-width state.

**Acceptance Scenarios**:

1. **Given** the capability matrix document, **When** a developer consults it, **Then** each component that supports sizing props is listed with `width` and `maxWidth` marked as supported.
2. **Given** Storybook, **When** a developer navigates to the `Button` component, **Then** there is a story showing `width="full"` that renders correctly and passes automated contract checks.
3. **Given** Storybook, **When** a developer navigates to `TextInput`, `Select`, or `TextArea` components, **Then** each has a story showing `width="full"` that renders correctly.

---

### Edge Cases

- What happens when a developer passes an invalid sizing value (e.g., a misspelled width token)? The TypeScript compiler should reject it at build time; at runtime, the resolver returns `undefined` and the invalid value is silently omitted without crashing.
- What happens when a semantic sizing class conflicts with the component's own default width behavior? The semantic class is appended after component classes and the CSS cascade determines the outcome — no special conflict resolution is needed for width properties on the same element.
- What happens during server-side rendering with sizing props? The resolved classes must be identical to client-rendered output; no browser-only resolution may occur.
- What happens when a component receives ref forwarding alongside sizing props? The forwarded ref must still point to the root element; sizing props must not wrap or replace the root.
- What happens when native HTML attributes (`id`, `data-*`, `aria-*`, `disabled`, `placeholder`, event handlers) are passed alongside sizing props? All native attributes must pass through to the root element unchanged.
- What happens when a component already has a complex internal DOM structure (e.g., `Select` with icon, label, or dropdown trigger elements)? The sizing class must be applied to the outermost owned root element only; internal structure must remain unchanged.
- What happens when a component receives `width="auto"`? The `pathable-width-auto` class is applied, matching the behavior of the shared resolver.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: An audit MUST be performed on the current markup of `Button`, `TextInput`, `Select`, `TextArea`, and any additional form-control components identified during the audit to confirm which root element receives sizing classes.
- **FR-002**: The `Button` component's TypeScript interface MUST extend the `SizingProps` interface from the shared semantic-prop foundation.
- **FR-003**: The `TextInput` component's TypeScript interface MUST extend the `SizingProps` interface from the shared semantic-prop foundation.
- **FR-004**: The `Select` component's TypeScript interface MUST extend the `SizingProps` interface from the shared semantic-prop foundation.
- **FR-005**: The `TextArea` component's TypeScript interface MUST extend the `SizingProps` interface from the shared semantic-prop foundation.
- **FR-006**: Every form-control component identified during the audit as safe for sizing MUST extend the `SizingProps` interface from the shared semantic-prop foundation.
- **FR-007**: Every adopted component MUST resolve `width` and `maxWidth` values to their corresponding `@pathable/styles` CSS classes using the pure internal resolvers defined in the semantic-prop foundation.
- **FR-008**: Every adopted component MUST merge classes in the documented order: required component classes (e.g., `pathable-button`, `pathable-text-input`), followed by resolved semantic classes, followed by the consumer-provided `className`.
- **FR-009**: No adopted component may introduce a wrapper DOM element to carry sizing classes; the classes MUST be applied to the root element the component already owns.
- **FR-010**: Every adopted component MUST preserve its existing ref forwarding behavior.
- **FR-011**: Every adopted component MUST preserve its existing native element prop passthrough (`id`, `data-*`, `aria-*`, `disabled`, `placeholder`, `type`, event handlers, etc.) on the root element.
- **FR-012**: Every adopted component MUST produce identical DOM output (classes and structure) during server-side rendering and client-side rendering for all supported prop combinations.
- **FR-013**: Every adopted component MUST preserve its existing semantic HTML structure, accessibility behavior, keyboard interaction, focus management, and ARIA roles.
- **FR-014**: Unit or component tests MUST confirm correct class output on the root element and the absence of wrapper elements for each adopted component's sizing-prop combinations.
- **FR-015**: A Storybook example demonstrating `width="full"` MUST be added for each adopted component.
- **FR-016**: The capability matrix (versioned in `packages/react/`) MUST record the `width` and `maxWidth` support status for each adopted component.
- **FR-017**: No SCSS, `packages/styles` CSS output, or design token changes are permitted in this feature.
- **FR-018**: No padding, margin, display, visibility, typography, or color semantic props may be added to any component in this feature.

### Key Entities *(include if feature involves data)*

- **SizingProps**: A shared TypeScript interface (from the semantic-prop foundation, slice 01) defining optional `width` and `maxWidth` props with typed value unions. Form controls and `Button` extend this interface.
- **Button**: An existing `@pathable/react` component that renders a clickable `<button>` element with `pathable-button` styling. It accepts children, variant, size, disabled state, ref forwarding, native HTML attributes, and a consumer `className`. After this feature, it also accepts `width` and `maxWidth` semantic sizing props.
- **TextInput**: An existing `@pathable/react` component that renders an `<input>` element with text-input styling. It accepts type, value, placeholder, disabled state, ref forwarding, native HTML attributes, and a consumer `className`. After this feature, it also accepts `width` and `maxWidth` semantic sizing props.
- **Select**: An existing `@pathable/react` component that renders a select dropdown with Pathable styling. It accepts options, value, disabled state, ref forwarding, native HTML attributes, and a consumer `className`. After this feature, it also accepts `width` and `maxWidth` semantic sizing props.
- **TextArea**: An existing `@pathable/react` component that renders a `<textarea>` element with textarea styling. It accepts value, rows, placeholder, disabled state, ref forwarding, native HTML attributes, and a consumer `className`. After this feature, it also accepts `width` and `maxWidth` semantic sizing props.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can set a `Button`, `TextInput`, `Select`, or `TextArea` to full width using the `width="full"` typed prop with no knowledge of CSS class spellings required.
- **SC-002**: Component tests confirm that every adopted component receiving `width="full"` renders exactly one root element with the expected `pathable-width-full` class and no child wrapper.
- **SC-003**: Storybook stories showcasing `width="full"` on each adopted component render correctly and pass any automated contract or accessibility checks.
- **SC-004**: Server-rendered output matches client-rendered output for all new sizing-prop combinations on every adopted component.
- **SC-005**: All existing component behavior — children rendering, ref forwarding, native props, disabled states, keyboard interaction, focus visibility, and accessibility — remains intact for every adopted component.
- **SC-006**: CI passes — all lint, type-check, unit test, and Storybook test gates succeed without new suppressions.

## Assumptions

- The semantic-prop foundation (slice 01, `specs/044-semantic-prop-foundation`) is complete and provides working `SizingProps` and resolver functions in `packages/react/src/internal/resolvers/`.
- The `@pathable/styles` package already emits the required utility classes: `pathable-width-full`, `pathable-width-auto`, and `pathable-maxw-{mobile,mobile-lg,tablet,desktop}` for the max-width breakpoint values.
- The existing `Button`, `TextInput`, `Select`, and `TextArea` components each own a single root DOM element that is the correct target for sizing classes.
- Components not explicitly listed in this specification (e.g., `Checkbox`, `Radio`, `FileInput`) are excluded unless the audit identifies them as safe and valuable candidates.
- Only `width` and `maxWidth` are included in this slice; `minWidth` is excluded unless the styles contract audit reveals existing `@pathable/styles` min-width utility classes that are safe to map.
- The class-merging order and conflict policy are defined by the semantic-prop foundation (slice 01) and inherited as-is; this feature does not introduce new merge or conflict rules.
- Padding, margin, display, visibility, typography, and color semantic props remain excluded from all components in this feature per the documented scope.
- The capability matrix is a versioned document within `packages/react/`; its format and update process are established by the semantic-prop foundation or a prior slice.
- Storybook stories for the new props must use deterministic, fixed fixtures with no uncontrolled randomness, dates, or live network dependencies.