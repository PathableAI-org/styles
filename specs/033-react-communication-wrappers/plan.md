# Implementation Plan: React Communication Wrappers

**Branch**: `033-react-communication-wrappers` | **Date**: 2026-07-20 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/033-react-communication-wrappers/spec.md`

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Scope Lock](#scope-lock-rmuo)
- [Project Structure](#project-structure)
- [Phase 0 Research](#phase-0-research)
- [Phase 1 Design and Contracts](#phase-1-design-and-contracts)
- [Post-Design Constitution Check](#post-design-constitution-check)
- [Complexity Tracking](#complexity-tracking)

## Summary

Add `Accordion`, `Alert`, `Banner`, `Modal`, `ProcessList`, `SiteAlert`,
`StepIndicator`, and `SummaryBox` to `packages/react` as typed adapters over the
verified Communication contracts in `packages/styles`. Presentational wrappers
map only implemented classes. Accordion, Banner, and Modal provide React-owned
state, keyboard, and focus behavior equivalent to the owning interaction
contracts without requiring consumers to initialize the DOM-mutating shared
JavaScript bundle. Source Storybook discrepancies are corrected before the
React stories establish the new public contract.

## Technical Context

**Language/Version**: TypeScript 5.7 with React JSX, following the current
`packages/react` source and declaration-build conventions.

**Primary Dependencies**: React 18 or 19, React DOM for modal portal rendering,
`@pathable/styles` as the owning visual contract, Vite, and Storybook test APIs.
No new runtime dependency is planned.

**Storage**: N/A; library components own only transient UI state.

**Testing**: Type checking, ESLint, formatting, React package build, standalone
React Storybook build and browser tests, rendered accessibility checks, stable
visual fixtures, source Storybook build, package-content dry run, publint, and
type-package validation.

**Target Platform**: Modern browser applications using React 18 or 19, including
applications that render package modules in server-capable build pipelines.

**Project Type**: pnpm workspace design-system library with independently
validated source and React Storybooks.

**Performance Goals**: A developer can adopt any wrapper in under 5 minutes;
all local disclosure and dialog state changes complete without network work or
visible input delay; closed content performs no background work.

**Constraints**: Keep `packages/styles` authoritative; expose no absent class or
state; add no wrapper CSS; preserve consumer attributes and content; use stable
identifiers; do not auto-import the browser-global shared JavaScript bundle;
preserve keyboard, focus, forced-colors, reduced-motion, and responsive behavior;
do not weaken validation.

**Scale/Scope**: Eight public components, eight exports and declarations, source
story corrections for verified drift, eight exhaustive React story families,
at least one Communication composition, README guidance, and publishable-package
validation.

## Constitution Check

*GATE: Passed before research and re-checked after design.*

### Source and Package Scope

- Owning contracts exist at `packages/styles/src/pathable-component-wrappers/`
  for all eight Communication components.
- Public React names remove `pathable` and use CamelCase: `Accordion`, `Alert`,
  `Banner`, `Modal`, `ProcessList`, `SiteAlert`, `StepIndicator`, and
  `SummaryBox`.
- React maps only selectors verified in source SCSS. Story-only
  `pathable-accordion--border-box`, `pathable-site-alert--warning`, and absent
  subelement selectors are not exposed.
- Source Storybook corrections document existing contracts; they do not create
  new CSS, tokens, modifiers, or visual semantics.

### Consumer and Publishable Validation

- `packages/react/src/index.ts` continues importing compiled Pathable CSS and
  `packages/react/package.json` retains `@pathable/styles` as a runtime
  dependency.
- Interactive behavior is delivered by the React components themselves; no
  separate application import of `@pathable/styles/js` is required.
- Public props and item types are exported through generated declarations.
- Build success is supplemented by pack inspection, publint, and type-package
  checks covering exports, files, entrypoints, dependencies, and declarations.

### Validation Gates

- Applicable gates are TypeScript type checking, ESLint, formatting, source and
  React Storybook builds, browser interaction tests, rendered accessibility,
  visual fixtures, package build, package-content inspection, publint, and type
  package validation.
- No file exclusion, warning-only enforcement, lint suppression, or broad
  accessibility exception is planned.

### Story and Interaction Requirements

- Each meaningful state receives a deterministic named story plus a Playground.
- Accordion, Banner, and Modal receive browser-executed keyboard and focus tests
  using accessible queries and observable state.
- Stories use synthetic fixed content, no live data, and include applicable
  narrow, long-content, forced-colors, and reduced-motion cases.
- Documentation states purpose, appropriate use, misuse, state meaning, and
  accessibility responsibilities.

### Accessibility and Resilience

- Alert semantics remain configurable without deriving urgency solely from
  color. Process and step sequences use ordered-list semantics.
- Accordion and Banner controls maintain `aria-expanded` and `aria-controls`.
  Modal maintains an accessible name, modal semantics, focus entry, focus
  containment, Escape close, and focus restoration.
- Stable stories cover long/localized content, increased text size, constrained
  widths, visible focus, and supported state presentations.

### Documentation and Cross-Framework Impact

- Source Storybook remains canonical for source class and interaction intent;
  React Storybook is canonical for React props, states, and browser behavior;
  the React README owns installation and import examples.
- Because source stories are corrected, the source Storybook builds and tests
  independently. No shared CSS contract or other framework wrapper changes.

**Pre-Research Gate Status**: PASS.

## Scope Lock (R/M/U/O)

- **R**: `styles` pnpm workspace; environment context only.
- **M**: Communication source contracts plus the `packages/react` wrapper and
  its Storybook/documentation surfaces; hard outer boundary.
- **U**: The eight Communication wrappers and their verified behavior; primary
  planning objects.
- **O**: Source-story alignment, bounded props and class mapping, local UI state,
  public exports/types, deterministic stories, README usage, and validation.

Planning locks **M + U**. New visual treatments, unrelated source components,
application state, analytics, persistence, routing, or product workflow logic
require separate scope.

## Project Structure

### Documentation (this feature)

```text
specs/033-react-communication-wrappers/
├── plan.md
├── research.md
├── data-model.md
├── class-diagram.md
├── quickstart.md
├── checklists/
│   ├── requirements.md
│   └── behavior-testability.md
└── contracts/
    ├── props.md
    ├── sequences.md
    └── stories.md
```

### Source Code (repository root)

```text
packages/styles/src/
├── pathable-component-wrappers/
│   ├── pathable-accordion.scss
│   ├── pathable-alert.scss
│   ├── pathable-banner.scss
│   ├── pathable-modal.scss
│   ├── pathable-process-list.scss
│   ├── pathable-site-alert.scss
│   ├── pathable-step-indicator.scss
│   └── pathable-summary-box.scss
└── stories/components/Communication/
    ├── Accordion.stories.ts
    ├── Alert.stories.ts
    ├── Banner.stories.ts
    ├── Modal.stories.ts
    ├── ProcessList.stories.ts
    ├── SiteAlert.stories.ts
    ├── StepIndicator.stories.ts
    └── SummaryBox.stories.ts

packages/react/
├── README.md
└── src/
    ├── index.ts
    ├── components/
    │   ├── Accordion/Accordion.tsx
    │   ├── Alert/Alert.tsx
    │   ├── Banner/Banner.tsx
    │   ├── Modal/Modal.tsx
    │   ├── ProcessList/ProcessList.tsx
    │   ├── SiteAlert/SiteAlert.tsx
    │   ├── StepIndicator/StepIndicator.tsx
    │   └── SummaryBox/SummaryBox.tsx
    └── stories/components/Communication/
        ├── Accordion.stories.tsx
        ├── Alert.stories.tsx
        ├── Banner.stories.tsx
        ├── Modal.stories.tsx
        ├── ProcessList.stories.tsx
        ├── SiteAlert.stories.tsx
        ├── StepIndicator.stories.tsx
        ├── SummaryBox.stories.tsx
        └── CommunicationPatterns.stories.tsx
```

**Structure Decision**: Follow the existing one-component-per-folder React
layout and mirror the source Storybook Communication taxonomy. Keep source edits
limited to correcting stories whose markup or claims exceed the implemented
contracts.

## Phase 0 Research

Research is complete in [research.md](./research.md). Decisions:

- Use the exact source selector inventory and exclude story-only states.
- Correct Banner to disclosure behavior and keep Site Alert non-dismissible.
- Implement interactive behavior with React state, stable identifiers, and a
  portal/focus contract rather than importing the one-time DOM mutator bundle.
- Use bounded typed item models for Accordion, Process List, and Step Indicator;
  preserve React content for message and dialog components.
- Preserve transitive compiled CSS and validate consumer package contents.
- Treat source and React Storybooks as independently required validation surfaces.

No `NEEDS CLARIFICATION` markers remain.

## Phase 1 Design and Contracts

Generated artifacts:

- [data-model.md](./data-model.md)
- [class-diagram.md](./class-diagram.md)
- [contracts/props.md](./contracts/props.md)
- [contracts/sequences.md](./contracts/sequences.md)
- [contracts/stories.md](./contracts/stories.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- All eight names map exactly to owning source contracts.
- Unsupported story states are excluded and scheduled for documentation cleanup.
- No wrapper CSS, token, visual modifier, service, or persistence is designed.
- React-owned interaction preserves the source behavior contract without global
  DOM mutation or a separate consumer JavaScript import.
- Props, semantic markup, identifiers, focus, and invalid-value behavior are
  explicit and testable.
- Both Storybooks, package artifacts, types, accessibility, interaction, and
  visual fixtures have independent validation paths.
- The M + U scope lock remains intact.

**Post-Design Gate Status**: PASS.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --- | --- | --- |
| none | N/A | N/A |
