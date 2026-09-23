# Implementation Plan: Optional Form Section

**Branch**: `248-optional-form-section` | **Date**: 2026-09-22 | **Spec**: [spec.md](./spec.md) | **Issue**: [#236](https://github.com/PathableAI-org/styles/issues/236)

**Input**: Feature specification from `specs/248-optional-form-section/spec.md`

## Summary

Add a Styles-first `pathable-optional-form-section` visual and semantic contract
and a React `OptionalFormSection` wrapper for revealing optional form content.
The component uses a required level 2-6 heading containing a native disclosure
button, supports controlled and uncontrolled expanded state, and keeps children
mounted behind the `hidden` attribute so field state and successful form values
survive collapse. Validation and error-reveal workflows remain application-owned.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19 with React 18 peer support, SCSS
through Dart Sass, HTML, and Markdown.

**Primary Dependencies**: React, `@pathableai/styles`, Storybook 10, Testing
Library, Vitest, Playwright, and axe-playwright.

**Storage**: N/A. Expanded state is consumer-controlled or held in component
memory for the current mounted lifecycle; child form state remains owned by the
nested controls or application.

**Testing**: Vitest/jsdom unit tests; TypeScript typecheck; Sass/Stylelint;
Styles and React Storybook builds; Playwright Storybook interaction, keyboard,
accessibility, quality, coverage, and visual gates; React 18/19 packed Next.js
consumers.

**Target Platform**: Published `@pathableai/styles` and `@pathableai/react`
packages in modern browsers, React 18/19 applications, SSR, and React Server
Component frameworks with the interactive component below a client boundary.

**Project Type**: Multi-package design-system library.

**Performance Goals**: Toggling updates disclosure state in the next React
render without remounting descendants; ten simultaneous instances retain unique
relationships and responsive interaction.

**Constraints**: Styles-first; required non-empty string heading; required
heading level 2-6; neutral root `div`; native button disclosure rather than
`details` or `Accordion`; children always mounted; collapsed successful controls
remain submittable; no disabled state, animation, validation policy, automatic
error reveal, product copy, or issue #235 dependency.

**Scale/Scope**: One shared style/markup contract, one React component and public
API, unit and Storybook coverage, package documentation and guidance, minor
Styles and React changesets, and package/consumer validation.

## Constitution Check

*GATE: Passed before research and re-checked after design.*

### Source and Package Scope

- `packages/styles` owns `pathable-optional-form-section`, its element classes,
  and deterministic static semantic examples before React consumes the contract.
- `packages/react` exposes the CamelCase `OptionalFormSection` adapter without
  private CSS or duplicated visual semantics.
- Shared semantics are a neutral `div`, a selected `h2`-`h6`, a native
  `button type="button"`, and an always-mounted content `div` whose `hidden`
  state follows expansion.
- The dedicated classes do not use `usa-accordion__*`, the Styles JavaScript
  enhancement, `details`, or the general `Accordion` component.

### Consumer and Publishable Validation

- The React entrypoint already imports `@pathableai/styles/components`, so normal
  `@pathableai/react` consumption requires no application-owned Styles import.
- `OptionalFormSection`, `OptionalFormSectionProps`, and
  `OptionalFormSectionHeadingLevel` are exported and verified in generated
  declarations.
- Builds, `publint`, `attw`, changeset status, and React 18/19 packed Next.js
  consumers validate the published packages.
- The additive API and CSS contract receive minor changesets for both packages.

### Validation Gates

- Applicable gates include ESLint, Stylelint, Markdownlint, token lint,
  Prettier, TypeScript, package builds, Vitest, package checks, both Storybook
  builds/tests, axe, coverage, quality, visual smoke, server compatibility,
  agent guidance, changesets, and packed consumers.
- No gate is disabled, weakened, silenced, converted to warning-only, or avoided
  through file exclusion.

### Story and Interaction Requirements

- Styles stories provide deterministic Collapsed, Expanded, NestedFormGroup,
  NestedFieldset, LongContent, Narrow, IncreasedText, and ForcedColors markup.
- React stories additionally prove Uncontrolled, Controlled, CollapsedSubmit,
  MultipleInstances, and keyboard/focus behavior.
- Browser tests use roles, labels, and submitted `FormData` to verify pointer,
  Enter, Space, focus retention, non-submission, retained state, collapsed
  submission, and unique relationships.
- Fixtures use stable synthetic content without dates, randomness, or networks.

### Accessibility

- A native button supplies Enter/Space behavior and uses `aria-expanded` plus
  `aria-controls`; the content region is labelled by the button.
- The button stays focused after toggles and uses the shared visible-focus
  treatment, including forced-colors mode.
- `hidden` removes collapsed descendants from presentation and sequential
  navigation without unmounting or disabling them.
- Static JSX lint, rendered axe, keyboard/focus, accessible-name, relationship,
  and multiple-instance tests are required. Empty/whitespace headings fail fast.
- Validation and expansion for hidden invalid fields are documented as
  application responsibilities rather than implied component behavior.

### Responsive and Resilient States

- Long/localized headings and children, narrow containers, increased text, and
  forced colors receive fixed stories and browser-rendered checks.
- Heading text wraps without clipping the disclosure indicator or focus ring;
  content does not introduce horizontal page scrolling.
- Disabled is intentionally absent in v1. Loading, error, and read-only behavior
  belong to children or applications rather than the disclosure shell.
- No animation is introduced, so reduced-motion handling is unnecessary.

### Visual Regression

- Stable Styles and React fixtures protect spacing, heading hierarchy, state
  indication, wrapping, focus visibility, and collapsed/expanded presentation.
- Browser-rendered checks, not serialized DOM snapshots alone, provide visual
  evidence.

### Documentation Surface Ownership

- The spec and contracts define feature behavior and API requirements.
- Styles Storybook is canonical for classes, semantic markup, and static visual
  states; React Storybook is canonical for executable interaction behavior.
- The React README is canonical for consumer API usage. Agent guidance links
  component-selection, accessibility, and server/client obligations without
  duplicating the complete API.

### Cross-Framework Impact

- The framework-neutral Styles contract is delivered and proven before the
  React adapter.
- Styles and React Storybooks build and test independently; React-only behavior
  does not masquerade as a shared JavaScript capability.

### Complexity Tracking

- No constitution violation is required.
- Issue #235 may be composed inside the section after it exists, but is not an
  implementation, branch, API, or delivery dependency for issue #236.

## Project Structure

### Documentation (this feature)

```text
specs/248-optional-form-section/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── component-api.md
│   └── semantic-markup.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
packages/styles/
├── src/pathable-component-wrappers/
│   ├── pathable-optional-form-section.scss
│   └── pathable-form-controls.scss
└── src/stories/components/FormControls/
    └── OptionalFormSection.stories.ts

packages/react/
├── src/components/OptionalFormSection/
│   ├── OptionalFormSection.tsx
│   └── __tests__/OptionalFormSection.test.tsx
├── src/stories/components/FormControls/
│   └── OptionalFormSection.stories.tsx
├── src/index.ts
├── README.md
└── agent-guidance/pathable-react/
    ├── SKILL.md
    └── references/server-and-client.md

.changeset/
└── <generated-name>.md
```

**Structure Decision**: Establish the dedicated framework-neutral composition
and static catalog evidence in Styles, then add a thin React state adapter,
behavior tests, documentation, guidance, release metadata, and packed-consumer
proof. Keep this primitive separate from Accordion and from any catalog picker.

## Complexity Tracking

No constitution violations.
