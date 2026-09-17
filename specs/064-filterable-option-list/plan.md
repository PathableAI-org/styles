# Implementation Plan: Filterable Option List

**Branch**: `064-filterable-option-list` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/064-filterable-option-list/spec.md`

## Summary

Add a Styles-first `pathable-filterable-option-list` contract and a React
`FilterableOptionList` wrapper for filtering and selecting multiple options from
a bounded, scrollable catalog. The component uses native fieldset, search input,
list, and checkbox semantics; supports controlled and uncontrolled query and
selection state; retains hidden or externally unloaded selections; submits every
selected identifier once; and exposes one polite status channel.

## Technical Context

**Language/Version**: TypeScript 5.7, React 19 with React 18 peer support, SCSS
through Dart Sass, and Markdown.

**Primary Dependencies**: React, `@pathableai/styles`, USWDS checkbox/form
foundations, Storybook 10, Testing Library, Vitest, Playwright, and
axe-playwright.

**Storage**: N/A. State is controlled by the consumer or held in component memory
for the current render lifecycle.

**Testing**: Vitest/jsdom unit tests; TypeScript typecheck; Sass/style linting;
Styles and React Storybook builds; Playwright Storybook interaction, keyboard,
accessibility, quality, coverage, and visual gates; packed Next.js consumers.

**Target Platform**: Published `@pathableai/styles` and `@pathableai/react`
packages used by modern browsers, React 18/19 applications, SSR, and React
Server Component frameworks with the interactive component below a client
boundary.

**Project Type**: Multi-package design-system library.

**Performance Goals**: A local query updates the visible results and status in
under 100 ms for 500 supplied options in the supported test environment.

**Constraints**: Styles-first implementation; native checkbox semantics; no
ARIA listbox; no domain data, fetching, loading, authorization, virtualization,
or group-required validation; no new brand tokens; no wrapper-only CSS; no
shared Storybook rollout claim without Styles-first proof; one live region.

**Scale/Scope**: One shared style contract, one React component and public API,
unit and Storybook coverage, package documentation and guidance, one minor React
and Styles changeset, and consumer/package validation. Intended for dozens or hundreds of
options, with 500 as the tested local-filter boundary.

## Constitution Check

*GATE: Passed before research and re-checked after design.*

### Source and Package Scope

- `packages/styles` owns the new `pathable-filterable-option-list` visual class
  contract and documents static semantic states before React consumes it.
- `packages/react` exposes the CamelCase `FilterableOptionList` adapter and uses
  the shared classes without private styling.
- Semantic HTML remains fieldset/legend, labeled search input, list/list-item,
  native checkbox, description references, status text, and hidden successful
  form controls.
- Existing form, input, label, legend, and checkbox classes are reused; the new
  stylesheet owns only the composition's layout, scrolling, status, details,
  and empty-state presentation.

### Consumer and Publishable Validation

- The existing React entrypoint continues to import the compiled Styles package;
  consumers need no additional stylesheet import.
- Public options, props, callbacks, filtering modes, and attribute-forwarding
  types are exported from the React package root and validated in declarations.
- `publint`, `attw`, package build, changeset status, and React 18/19 packed Next
  consumers validate what is actually published.
- This is additive and receives minor `@pathableai/react` and
  `@pathableai/styles` changesets.

### Validation Gates

- Applicable gates include ESLint, Stylelint, Markdownlint, token lint, Prettier,
  TypeScript, Styles and React builds, Vitest, package validation, Storybook
  browser/axe tests, coverage, quality, visual smoke, server compatibility,
  agent guidance, and packed consumers.
- No validator is weakened, skipped, converted to warning-only, or bypassed by
  file exclusion.

### Story and Interaction Requirements

- Styles stories cover static Default, Selected, Disabled, Empty, NoMatches,
  LongContent, ManyOptions, Narrow, IncreasedText, and ForcedColors states.
- React stories add Playground, Controlled, Uncontrolled, ExternalFiltering,
  and FormComposition behavior while retaining fixed regression stories.
- Browser tests use roles and labels to verify filtering, native Space toggling,
  focus visibility, hidden-selection retention, status output, form submission,
  and reset.
- Stories use fixed synthetic options without network, dates, or randomness.

### Accessibility

- Native checkbox and fieldset semantics avoid an incompatible listbox/checkbox
  model and preserve expected Tab and Space behavior.
- The filter has a real label; placeholder text is supplemental only.
- Description and metadata nodes receive stable IDs and are referenced through
  `aria-describedby`, keeping checkbox names concise.
- One visible `role="status"` node with `aria-live="polite"` and
  `aria-atomic="true"` reports result and total selection state.
- Static linting, rendered axe checks, keyboard/focus behavior, names,
  descriptions, disabled state, and form behavior are all tested.

### Responsive and Resilient States

- The option region has a bounded vertical size, no horizontal overflow, and
  enough internal focus clearance for keyboard-visible outlines.
- Narrow, long, localized-looking, increased-text, and forced-color stories
  protect wrapping, readability, focus, and selected/disabled state cues.
- Empty catalog and no-match output are distinct visible states rather than fake
  options. Loading and error states remain consumer-owned.
- No animation is introduced, so reduced-motion behavior requires no exception.

### Visual Regression

- Deterministic Styles and React fixed stories cover the visual contract across
  default, selected, disabled, overflow, empty, no-match, narrow, and long-text
  states.
- Browser-rendered visual checks protect token usage, spacing, wrapping,
  scrolling, focus visibility, and state appearance; snapshots are not the sole
  proof.

### Documentation Surface Ownership

- The specification and API contract define requirements and public behavior.
- `packages/styles` Storybook is canonical for class/markup and static visual
  states; React Storybook is canonical for interactive executable behavior.
- The React README is canonical for consumer API examples. Agent guidance links
  the accessibility and server/client usage rules without duplicating the full
  API reference.

### Cross-Framework Impact

- The source visual contract is framework-neutral and is proven first in the
  Styles Storybook.
- Styles and React Storybooks build and test independently. No React-only CSS or
  shared rollout metadata obscures a framework-specific failure.

### Complexity Tracking

- No constitution violation is required.
- Implementation began stacked on PR #243 for the private FormGroup composite
  registry. PR #243 has since landed, and this branch was rebased onto `main`
  before final validation.

## Project Structure

### Documentation (this feature)

```text
specs/064-filterable-option-list/
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
│   ├── pathable-filterable-option-list.scss
│   └── pathable-form-controls.scss
└── src/stories/components/FormControls/
    └── FilterableOptionList.stories.ts

packages/react/
├── src/components/FilterableOptionList/
│   ├── FilterableOptionList.tsx
│   └── __tests__/FilterableOptionList.test.tsx
├── src/components/FormGroup/__tests__/FormGroup.test.tsx
├── src/stories/components/FormControls/FilterableOptionList.stories.tsx
├── src/index.ts
├── README.md
└── agent-guidance/pathable-react/
    ├── SKILL.md
    └── references/server-and-client.md

.changeset/
└── <generated-name>.md
```

**Structure Decision**: Add the visual contract and static catalog evidence to
the authoritative Styles workspace first, then add a thin React adapter, its
behavior tests, consumer documentation, guidance, and release metadata. Keep
behavior coverage package-local for this initial feature rather than claiming a
shared rollout capability.

## Complexity Tracking

No constitution violations.
