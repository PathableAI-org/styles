# Feature Specification: Theming Documentation and End-to-End Validation

**Feature Branch**: `062-theming-documentation`

**Created**: 2026-08-25

**Status**: Draft

**Input**: User description: "Prove the complete theming API is correct, safe, and discoverable, and close out every acceptance criterion in the parent plan. This feature ships no new runtime surface; it adds the documentation, cross-cutting checks, and end-to-end evidence that tie features 01–05 into a verified, usable whole." (Source: `docs/plans/react-theming/06-theming-documentation.md`)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - End-to-end proof that a partial theme resolves colors (Priority: P1)

A developer trusts the typed theming API only if they can see it working end to end: a representative layout rendered under a partial theme resolves the overridden colors to the provided values, and everything else falls back to the Pathable defaults.

**Why this priority**: This is the decisive correctness evidence for the entire theming series. If a partial theme cannot be demonstrated to resolve correctly in a rendered layout, the documented API is not trustworthy regardless of how complete the reference is.

**Independent Test**: Can be fully tested by running an automated rendered test that renders a representative layout with a partial theme and asserts the resolved colors for both overridden and unspecified tokens.

**Acceptance Scenarios**:

1. **Given** a representative layout rendered with a partial theme that overrides a small set of colors, **When** the rendered output is inspected, **Then** the overridden tokens resolve to the provided values.
2. **Given** the same partial theme, **When** the rendered output is inspected, **Then** every token not overridden resolves to its default value.
3. **Given** a layout where the provider wraps only a subtree, **When** the rendered output is inspected, **Then** content inside the subtree uses the overridden values and content outside the subtree uses the defaults.

---

### User Story 2 - Backward compatibility: no provider means identical rendering (Priority: P1)

A developer who does not use `ThemeProvider` must see every existing component render exactly as it did before the theming series began.

**Why this priority**: Backward compatibility is a release gate. The theming work is only safe to ship if the default, no-theme path is provably unchanged; otherwise every existing consumer is at risk.

**Independent Test**: Can be fully tested by comparing the rendered output (visual and structural) of representative components with no `ThemeProvider` before and after the theming series, and confirming there is no difference.

**Acceptance Scenarios**:

1. **Given** an application that renders components with no `ThemeProvider`, **When** the output is compared to the pre-theming state, **Then** the rendering is identical (same structure and same default token values).

---

### User Story 3 - Discover what each token controls (Priority: P2)

A developer who wants to override colors must be able to find, in a single reference, every color token, what it controls, its CSS custom property, and its default value.

**Why this priority**: Discoverability is a core deliverable of this feature. Without a complete vocabulary reference, consumers must reverse-engineer the compiled stylesheet or the theme type to learn what they can override, which is the exact pain the theming API set out to remove.

**Independent Test**: Can be fully tested by reading the reference and confirming it lists every public color token with its property, default value, and role, and that the listed values match the actual defaults.

**Acceptance Scenarios**:

1. **Given** the token vocabulary reference, **When** a developer looks up any public color token, **Then** they find its CSS custom property, its default value, and a plain-language description of what it controls.
2. **Given** the reference and the actual default theme, **When** the two are compared, **Then** every listed token is present in the default theme and every default-theme token is listed (no omissions, no invented tokens).

---

### User Story 4 - Follow a short guide to override, extend, and choose a path (Priority: P2)

A developer must be able to follow a short guide to (a) override a few colors with `createTheme` + `ThemeProvider`, (b) extend `defaultTheme` directly, and (c) decide between the default stylesheet import and the provider-driven path.

**Why this priority**: The typed API is only as useful as the guidance that explains how to use it and when to choose which mechanism. This guide is the primary "how to use it" artifact for consumers.

**Independent Test**: Can be fully tested by a developer completing the documented steps to produce a representative brand override without consulting package source code, and by reading the guide to determine which integration path applies to their situation.

**Acceptance Scenarios**:

1. **Given** the consumer guide, **When** a developer follows its override instructions using `createTheme` + `ThemeProvider`, **Then** they produce a working override with no hand-written CSS.
2. **Given** the consumer guide, **When** a developer wants to start from the full default theme, **Then** the guide shows how to extend `defaultTheme` directly by overriding individual keys.
3. **Given** the consumer guide, **When** a developer must choose between the default stylesheet import and the provider-driven path, **Then** the guide explains the trade-off and when each is appropriate.

---

### User Story 5 - Every parent acceptance criterion is closed out (Priority: P3)

A maintainer reviewing the theming series can confirm that each acceptance criterion in the parent plan has been explicitly verified or documented as addressed, with no criterion left silently unaddressed.

**Why this priority**: The parent plan's acceptance criteria are the contract for the entire series. Closing them out is a completeness requirement, but it is a final cross-check that depends on the artifacts produced by the earlier stories.

**Independent Test**: Can be fully tested by reviewing the verification record and confirming each parent acceptance criterion is marked satisfied or explicitly addressed, with evidence for each.

**Acceptance Scenarios**:

1. **Given** the parent theming plan's acceptance criteria list, **When** the verification record is reviewed, **Then** every criterion is checked off or explicitly addressed, with evidence for each.

---

### Edge Cases

- A partial theme that overrides zero tokens (an empty override): the resolved theme must equal the default theme, and the rendered output must match the no-theme path.
- A partial theme that overrides every token: the resolved theme must contain no fallthrough, and the rendered output must use only the provided values.
- A token that is overridden but listed with an invalid value at runtime: the theme factory must reject it at creation time (this is validated by the type-check / factory behavior documented by earlier features, not newly built here).
- An invalid token key (a misspelled or non-existent key): this must fail at type-check time, never silently at runtime — this feature verifies that behavior rather than implementing it.
- The vocabulary reference must stay in sync with the default theme; a token added to or removed from the theme but missing from the reference is a defect.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The documentation MUST include a token vocabulary reference that maps every public color token key to its CSS custom property, its default value, and a plain-language description of its role.
- **FR-002**: The token vocabulary reference MUST be complete and accurate — it MUST cover the full public color-token set with no omissions and no invented tokens, and its default values MUST match the actual defaults.
- **FR-003**: The documentation MUST include a consumer guide that shows how to override a small set of colors using `createTheme` together with `ThemeProvider`, with no hand-written CSS.
- **FR-004**: The consumer guide MUST show how to extend `defaultTheme` directly by starting from the full default theme and overriding individual keys.
- **FR-005**: The consumer guide MUST explain how to choose between the default stylesheet import path and the provider-driven path, including when each is appropriate.
- **FR-006**: An automated end-to-end rendered test MUST render a representative layout with a partial theme and assert that the overridden tokens resolve to the provided values.
- **FR-007**: The end-to-end test MUST assert that tokens not overridden in the partial theme resolve to their default values.
- **FR-008**: The end-to-end test MUST assert that overrides are scoped to the provider's subtree — content outside the subtree resolves to default tokens.
- **FR-009**: Backward compatibility MUST be verified with automated evidence that rendering with no `ThemeProvider` is identical to the pre-theming state.
- **FR-010**: The feature MUST verify each acceptance criterion in the parent theming plan and mark every one as satisfied or explicitly addressed.
- **FR-011**: Verification MUST confirm that invalid token keys are rejected at type-check time, not silently accepted at runtime.
- **FR-012**: Verification MUST confirm that `defaultTheme` and the full token list are exported and documented.
- **FR-013**: Verification MUST confirm that the tone types (`TextTone`, `SurfaceTone`, `BorderTone`) are importable from the public entry point.
- **FR-014**: Verification MUST confirm that component and utility stylesheets can be imported without also importing the default theme tokens.
- **FR-015**: This feature MUST NOT add new token categories or components, generate dark-mode tokens, or remove or rename any existing component or export.

### Key Entities

- **Color token vocabulary (ThemeColors)**: The public color-token surface. Each key maps to a CSS custom property, a default value, and a role; this is the subject of the vocabulary reference.
- **Theme configuration (ThemeConfig)**: The public theme configuration surface (colors) that consumers override.
- **defaultTheme**: The complete, resolved default color-token set, which serves as both the fallback and the source for the vocabulary reference.
- **createTheme**: The factory that merges partial input with defaults and returns a fully resolved theme.
- **ThemeProvider**: The scoping mechanism that emits resolved tokens within a subtree.
- **Tone types (TextTone, SurfaceTone, BorderTone)**: The public type vocabulary that must be importable from the public entry point.
- **Stylesheet layers**: The importable layers of the styles package — component styles, utility styles, and the default theme layer — whose independence from one another must be verified.
- **Parent acceptance criteria**: The checklist from the parent theming plan that must be closed out by this feature.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the public color-token keys are present in the vocabulary reference with their CSS custom property, default value, and role — zero omissions and zero invented tokens.
- **SC-002**: A developer can complete a representative multi-token brand override using only the consumer guide, without consulting package source code.
- **SC-003**: The automated end-to-end test passes, demonstrating that overridden tokens resolve to provided values, unspecified tokens resolve to defaults, and overrides stay scoped to the provider subtree.
- **SC-004**: Backward compatibility is verified: rendering with no provider is identical to the pre-theming state across the representative layout and all supported component visual states.
- **SC-005**: 100% of the parent plan's acceptance criteria are explicitly checked off or addressed, each with evidence.
- **SC-006**: All automated validation gates (lint, type-check, build, and tests) pass.

## Assumptions

- The runtime surface (`ThemeProvider`, `createTheme`, `defaultTheme`, the tone types, and the stylesheet subpath exports) already exists and is correct as delivered by features 01–05; this feature documents and validates it, it does not build it.
- The token vocabulary reference and consumer guide live under the repository's `docs/` area and are surfaced through the project's canonical public documentation site, consistent with the project's documentation-responsibilities principle (one canonical source per fact, with other surfaces linking to it).
- The end-to-end test is implemented as a Storybook story or a small integration test (the two options named in the parent plan), rendering a representative existing layout (e.g., the app-shell or a page-composition pattern) rather than a bespoke fixture.
- The vocabulary reference is derived from `defaultTheme` (itself generated from the SCSS token definitions), so its values cannot drift from the actual defaults; the reference is presented as a reviewed, human-consumable table.
- "Identical rendering" for backward compatibility is measured by visual and structural comparison of before/after output for the no-theme path.
- The parent plan's acceptance criteria list is the authoritative checklist that this feature closes out.
