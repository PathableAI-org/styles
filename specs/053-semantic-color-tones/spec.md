# Feature Specification: Semantic Color and Tone Model

**Feature Branch**: `053-semantic-color-tones`

**Created**: 2026-08-23

**Status**: Draft

**Input**: User description: "Define the shared semantic color and tone vocabulary for React consumers, formalize the tone roles consumed by Text (09), Heading (10), and future components, ground each role in a verified SCSS contract, and provide shared TypeScript types (TextTone, SurfaceTone, BorderTone)."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Request Meaning Instead of Palette Values (Priority: P1)

A developer building an application surface needs to express semantic intent — "this text is muted", "this surface is subtle", "this border indicates danger" — without hard-coding a specific palette value such as `red-600`. They use a shared, single tone vocabulary so the meaning stays stable across themes, dark mode, and future palette changes.

**Why this priority**: This is the core purpose of the feature. A single, theme-independent tone vocabulary is what lets `Text`, `Heading`, and future components (`Surface`, `Border`) agree on what "danger" or "subtle" means, instead of each component inventing its own color mappings.

**Independent Test**: Consult the tone vocabulary document and confirm that each tone role (`default`, `muted`, `danger`, `success` for text; `default`, `subtle`, `primary` for surface; `default`, `danger` for border) resolves to a verified SCSS class, with no palette-value alias required. Can be verified by documentation and mapping tests alone, before any component adopts it.

**Acceptance Scenarios**:

1. **Given** an application developer, **When** they request a text tone of `danger`, **Then** the vocabulary maps that role to a deterministic design-system class — not to a raw palette token such as `red-600`.
2. **Given** an application developer, **When** they request a surface tone of `subtle`, **Then** the vocabulary maps that role to a verified surface class.
3. **Given** an application developer, **When** they request a border tone of `danger`, **Then** the vocabulary maps that role to a verified border class.
4. **Given** a tone value not present in the vocabulary, **When** the value is evaluated, **Then** it is rejected by the type system (and any runtime fallback is documented and tested).

---

### User Story 2 - Text Adopts the Shared Tone Vocabulary (Priority: P1)

The `Text` primitive shipped with its own inline tone values (`default`, `muted`, `danger`, `success`). A developer using `Text` should get those tones from the shared `TextTone` type, so `Text` and every future component share one source of truth for what a text tone is.

**Why this priority**: `Text` is the primary consumer named by the plan. Consolidating its `tone` prop onto the shared vocabulary is the concrete React-side deliverable that proves the vocabulary is consumable.

**Independent Test**: Render `<Text tone="muted">` and verify the rendered tone class is unchanged from before while the prop is now typed from the shared `TextTone` union. Can be tested without any other component.

**Acceptance Scenarios**:

1. **Given** a `Text` with `tone="muted"`, **When** it renders, **Then** it produces the same muted text tone class as before, now driven by the shared `TextTone` type.
2. **Given** a `Text` with `tone="danger"`, **When** it renders, **Then** it produces the danger text tone class.
3. **Given** a `Text` with an invalid `tone` value, **When** the value is evaluated, **Then** the TypeScript type system rejects it.
4. **Given** a `Text` with no `tone`, **When** it renders, **Then** no tone class is applied and the default text color is used, as before.

---

### User Story 3 - Every Tone Role Is Grounded in a Verified Contract (Priority: P2)

A maintainer needs confidence that each advertised tone actually resolves to compiled CSS. For each tone role in the vocabulary, either an authoritative SCSS contract already exists, a missing contract is created in `@pathable/styles`, or the gap is explicitly recorded with a tracking reference.

**Why this priority**: A tone vocabulary is only trustworthy if every name it advertises resolves to a real, published class. This is the audit-and-alignment work that makes the vocabulary authoritative rather than aspirational.

**Independent Test**: Review the tone vocabulary document and confirm a one-to-one mapping from each tone role to either a verified SCSS contract or a tracked gap reference. Can be tested without any React rendering.

**Acceptance Scenarios**:

1. **Given** a tone role that already has a verified SCSS contract, **When** the audit runs, **Then** the vocabulary records the contract source and resolved class name(s).
2. **Given** a tone role without an authoritative SCSS contract, **When** the audit runs, **Then** the contract is created in `@pathable/styles` (or recorded as a gap with a tracking reference).
3. **Given** the completed audit, **When** a maintainer consults the vocabulary, **Then** no advertised tone resolves to an unverified or missing class without a documented gap.

---

### User Story 4 - Shared TypeScript Types Exist for Consumers (Priority: P2)

A component author needs named, typed unions — `TextTone`, `SurfaceTone`, `BorderTone` — in the internal type layer so future components declare their tone props consistently.

**Why this priority**: Shared types are the mechanism that prevents component-by-component tone drift. They are less user-visible than the vocabulary itself but are required before `Surface` (feature 12) and other components adopt tones.

**Independent Test**: Import the shared types from the internal type layer and confirm each union contains the agreed values and rejects unknown values at compile time.

**Acceptance Scenarios**:

1. **Given** a component author, **When** they import `TextTone`, **Then** the type contains at minimum `"default"`, `"muted"`, `"danger"`, and `"success"`.
2. **Given** a component author, **When** they import `SurfaceTone`, **Then** the type contains at minimum `"default"`, `"subtle"`, and `"primary"`.
3. **Given** a component author, **When** they import `BorderTone`, **Then** the type contains at minimum `"default"` and `"danger"`.
4. **Given** a value outside the union, **When** the type is used, **Then** the TypeScript type system rejects the value.

---

### User Story 5 - Contrast and Forced-Colors Behavior Is Evidenced (Priority: P3)

A maintainer needs documented evidence that every tone role, in a forced-colors or high-contrast environment, remains legible and does not convey meaning by color alone.

**Why this priority**: Accessibility is a release requirement, but this work verifies the vocabulary rather than defining it. It completes the feature's quality obligations.

**Independent Test**: Evaluate each tone role against its intended surface and record contrast ratios and forced-colors behavior. Document findings in the feature branch.

**Acceptance Scenarios**:

1. **Given** each text tone role rendered on the default surface, **When** contrast is evaluated, **Then** the ratio meets the applicable contrast obligation for its text size.
2. **Given** each tone role in a forced-colors environment, **When** the environment applies its palette, **Then** the semantic meaning is preserved and color is not the sole signal.
3. **Given** the completed evaluation, **When** a maintainer consults the vocabulary, **Then** contrast and forced-colors evidence is recorded for every tone role.

---

### Edge Cases

- What happens when a tone value is omitted? No tone class is applied; the element uses the default color for its role.
- What happens when a consumer passes an unknown tone value at runtime? The TypeScript union rejects it at compile time; a runtime fallback is documented and tested.
- What happens when the SCSS audit finds a tone role with no existing contract? The contract is created in `@pathable/styles` or recorded as a gap with a tracking reference — never silently advertised.
- What happens when a tone role is supported by `Text` but not yet by a surface or border contract? The vocabulary records the role per category; a missing surface or border contract is a tracked gap, not a blocker for text tones.
- What happens when a future component wants a tone value not yet in the vocabulary? The value is added to the shared union only after a verified SCSS contract exists, preserving the source-first rule.
- What happens in a forced-colors environment? Semantic color is preserved through system color keywords; the component must not rely on palette values for meaning.
- What happens when `Text` is updated to the shared type while an application passes a previously-valid custom string? The union remains a closed set of verified values; custom strings are rejected by the type system and must use `className`/`style` as the escape hatch.

## Requirements *(mandatory)*

### Functional Requirements

#### Tone Vocabulary (source of truth)

- **FR-001**: The feature MUST produce a tone vocabulary document that records, for each tone category (text, surface, border), every supported tone role, its SCSS contract source, and its resolved class name(s).
- **FR-002**: The tone vocabulary MUST be theme-independent: applications request a semantic role (for example `danger`) rather than a palette value (for example `red-600`).
- **FR-003**: The tone vocabulary MUST be deterministic and server-renderable — tone-to-class resolution MUST NOT depend on browser state, runtime feature detection, or non-deterministic input.
- **FR-004**: The text tone roles MUST include at minimum `default`, `muted`, `danger`, and `success`, plus any additional roles verified from the SCSS audit.
- **FR-005**: The surface tone roles MUST include at minimum `default`, `subtle`, and `primary`, plus any additional roles the SCSS audit verifies as supported.
- **FR-006**: The border tone roles MUST include at minimum `default` and `danger`, plus any additional validated boundary roles.

#### Source Contract (packages/styles)

- **FR-007**: For every tone role in the vocabulary, `@pathable/styles` MUST provide a verified SCSS contract that resolves to design-system semantic color tokens — no hardcoded values outside the token system.
- **FR-008**: For any tone role without an authoritative SCSS contract, the feature MUST either create the contract in `@pathable/styles` or record the gap with a tracking reference; an unverified tone MUST NOT be advertised as supported.
- **FR-009**: Tone contracts MUST resolve their visual values from existing `@pathable/styles` semantic color tokens, preserving contrast, forced-colors, and theme behavior.
- **FR-010**: New or modified tone SCSS contracts MUST be exported through the appropriate shared entrypoint so compiled classes are available to consumers and wrapper packages.

#### Shared Type Layer (packages/react internal)

- **FR-011**: The internal type layer (established by feature 01) MUST define a `TextTone` type whose values match the verified text tone roles.
- **FR-012**: The internal type layer MUST define a `SurfaceTone` type whose values match the verified surface tone roles.
- **FR-013**: The internal type layer MUST define a `BorderTone` type whose values match the verified border tone roles.
- **FR-014**: `SurfaceTone`, `BorderTone`, and the `textToneClass` resolver MUST remain internal (not exported from the public `@pathable/react` entry point). `TextTone` MAY remain publicly re-exported through the `Text` component's public API for backward compatibility, since it was already a public export before this feature.

#### Text Adoption

- **FR-015**: The `Text` component's `tone` prop MUST consume the shared `TextTone` type, replacing any inline tone union, without changing the rendered tone classes for previously supported values.
- **FR-016**: The `Text` component MUST NOT adopt surface or border tone types — those apply to their respective future components.

#### Testing

- **FR-017**: Unit tests MUST verify that each tone role maps to the correct class for each tone category.
- **FR-018**: Unit tests MUST verify that invalid (out-of-union) tone values are rejected at compile time, and that any runtime fallback is documented and covered.
- **FR-019**: Unit tests MUST verify that server-rendered tone classes do not depend on browser state (purity).
- **FR-020**: Tests MUST verify that the `Text` tone behavior is unchanged after migration to the shared `TextTone` type.

#### Accessibility Evidence

- **FR-021**: The feature MUST document contrast evidence for every text tone role against its intended surface.
- **FR-022**: The feature MUST document forced-colors behavior for every tone role, ensuring color is not the sole signal for meaning.

### Key Entities *(include if feature involves data)*

- **TextTone**: The semantic meaning categories for text (`default`, `muted`, `danger`, `success`, plus audited roles) — each maps to a design-system semantic text color token/class.
- **SurfaceTone**: The semantic meaning categories for surfaces (`default`, `subtle`, `primary`, plus audited roles) — each maps to a design-system surface token/class.
- **BorderTone**: The semantic meaning categories for borders (`default`, `danger`, plus validated roles) — each maps to a design-system border token/class.
- **Tone Vocabulary**: The canonical document recording, per category, each tone role's SCSS source and resolved class name(s), including any tracked gaps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A tone vocabulary document exists recording every supported text, surface, and border tone role with its SCSS source and resolved class name(s).
- **SC-002**: Shared `TextTone`, `SurfaceTone`, and `BorderTone` types exist in the internal type layer, verified by automated tests.
- **SC-003**: Every advertised tone role resolves to a verified SCSS contract or a tracked gap; no unverified tone is advertised as supported.
- **SC-004**: The `Text` component's `tone` prop consumes the shared `TextTone` type with no change to its rendered tone classes, verified by automated tests.
- **SC-005**: Each tone role maps to its correct class deterministically, with identical output on server and client, verified by automated tests.
- **SC-006**: Contrast and forced-colors evidence is recorded for every tone role in the feature branch.
- **SC-007**: The full existing `Text`/layout-primitive test suite continues to pass with no regressions.
- **SC-008**: CI passes.

## Assumptions

- The design system's semantic color tokens (`--pathable-color-text`, `--pathable-color-text-muted`, `--pathable-color-danger`, `--pathable-color-success`, surface, and border tokens) largely exist; the audit formalizes their tone mappings and identifies any missing contracts.
- The tone values `"default"`, `"muted"`, `"danger"`, `"success"` (text), `"default"`, `"subtle"`, `"primary"` (surface), and `"default"`, `"danger"` (border) are the baseline; additional roles are added only after the SCSS audit verifies them.
- The shared tone types live in the internal type layer established by feature 01. `SurfaceTone`, `BorderTone`, and `textToneClass` are not public exports; `TextTone` remains a public re-export through the `Text` component's API for backward compatibility.
- When a tone lacks an authoritative SCSS contract, the default resolution is to create the contract in `@pathable/styles`; a gap is recorded with a tracking reference only when creating the contract is not feasible within this feature.
- The `Surface` component (feature 12) will consume `SurfaceTone` in its own feature; this feature only defines the type and vocabulary, not the `Surface` component.
- `Heading` has no tone prop and does not adopt the shared tone types in this feature.
- `style` and `className` remain the escape hatches for application-specific raw color values; they are not part of the design-system tone vocabulary.
