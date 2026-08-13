# Implementation Plan: Accordion Behavior Contract Pilot

**Branch**: `036-accordion-behavior-contract` | **Date**: 2026-08-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/036-accordion-behavior-contract/spec.md`

## Summary

Create a top-level `behavior-contracts/` harness that owns a three-scenario
Gherkin contract for observable Accordion behavior and executes it through
Cucumber step definitions backed by Playwright. The runner builds and serves
one deterministic Storybook target at a time, then executes the same feature
against the styles JavaScript reference implementation and the React-owned
implementation. Package-specific Storybook stories supply only deterministic
mounting states; target mappings and runtime details remain outside the
framework-neutral feature file.

## Technical Context

**Language/Version**: JavaScript ESM on Node.js 24 or 26, matching the root engine policy

**Primary Dependencies**: `@cucumber/cucumber` 13.2, Playwright 1.61, Storybook 10, existing `serve` 14

**Storage**: N/A; source-controlled feature, mapping, runner, and specification files only

**Testing**: Cucumber browser scenarios, package-specific Storybook test runners, ESLint, Prettier, Markdownlint, TypeScript, package and Storybook builds

**Target Platform**: Chromium in local and Linux CI environments

**Project Type**: pnpm ESM monorepo containing publishable style and React libraries plus independent Storybook applications

**Performance Goals**: One command produces six target-specific results; each catalog has a bounded 30-second readiness window and every spawned process is cleaned up

**Constraints**: The Gherkin contract remains package-independent; React must not load the styles JavaScript bundle; the vanilla target must exercise the published styles behavior; failures cannot be silently skipped

**Scale/Scope**: Accordion only, three shared scenarios, two targets, two deterministic starting fixtures

## Constitution Check

*GATE: Passed before research and re-checked after design.*

### Source and Package Scope

- [x] `behavior-contracts/` becomes the repository-owned framework-neutral
  behavior source; `packages/styles` continues to own the compiled JavaScript,
  CSS, markup classes, semantics, and documentation.
- [x] No component API, token, class, asset, or visual state is added.
- [x] React continues to use its native `Accordion` implementation while
  proving parity against the source-owned shared behavior definition.
- [x] The change removes the global styles JavaScript import from the React
  Storybook so tests cannot receive two competing Accordion implementations.

### Consumer and Publishable Validation

- [x] No publishable package export or runtime dependency changes.
- [x] The new Cucumber dependency is root-only development tooling.
- [x] Existing package builds, types, packed-consumer validation, and exported
  `Accordion` behavior remain unchanged.

### Validation Gates

- [x] Add focused styles, React, and aggregate behavior-contract commands.
- [x] Run contract matrix, React typecheck/build, both Storybook suites, lint,
  format, Markdownlint, package consumer validation, and `git diff --check`.
- [x] No lint or accessibility rule is disabled or excluded.

### Story and Interaction Requirements

- [x] Existing deterministic Accordion stories supply collapsed and initially
  expanded fixtures; the styles catalog gains the missing initially-expanded
  fixed story.
- [x] Shared steps use accessible roles, names, keyboard actions, focus, ARIA
  state, and associated-panel availability.
- [x] The Gherkin scenario names remain readable; traceability IDs use tags.
- [x] Existing package-specific `play` coverage remains for target-specific APIs
  and catalog debugging.

### Accessibility

- [x] Enter, Space, focus retention, `aria-expanded`, `aria-controls`, and panel
  availability are browser-executed for both targets.
- [x] Existing rendered Axe checks remain mandatory and separate.
- [x] No claim of manual assistive-technology certification is introduced.

### Responsive and Resilient States

- [x] This feature does not change Accordion presentation or responsive states.
- [x] Existing narrow and long-content stories remain in place.
- [x] Shared behavior uses synthetic, deterministic content.

### Visual Regression

- [x] Existing stable stories remain visual fixtures; no screenshot baseline is
  generated or updated by the behavior runner.
- [x] The harness asserts rendered browser behavior rather than serialized DOM
  snapshots.

### Documentation Surface Ownership

- [x] `behavior-contracts/README.md` owns contributor instructions for shared
  contracts, target registration, and extension to future packages.
- [x] Storybook continues to own component usage documentation.
- [x] Spec Kit artifacts record architecture decisions and validation evidence.

### Cross-Framework Impact

- [x] Both HTML and React Storybooks build and test independently.
- [x] The aggregate command runs the same scenario definitions against each
  target rather than relying on Storybook composition.

### Complexity Tracking

No constitution violations require justification.

## Project Structure

### Documentation (this feature)

```text
specs/036-accordion-behavior-contract/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
├── contracts/
│   └── runner.md
└── tasks.md
```

### Source Code (repository root)

```text
behavior-contracts/
├── README.md
├── cucumber.mjs
├── run.mjs
├── targets.mjs
├── features/
│   └── accordion.feature
├── steps/
│   └── accordion.steps.mjs
└── support/
    ├── hooks.mjs
    └── world.mjs

apps/storybook/.storybook/preview.js
apps/storybook-react/.storybook/preview.js
packages/styles/src/stories/components/Communication/Accordion.stories.ts
packages/react/src/stories/components/Communication/Accordion.stories.tsx
package.json
pnpm-lock.yaml
```

**Structure Decision**: Shared executable contracts and their runner live at
repository root. Individual packages expose deterministic catalog fixtures but
do not own or import the Gherkin scenarios. The target registry maps shared
fixture names to package-specific Storybook story identifiers and server/build
details.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md):

1. Use the official Cucumber JavaScript runner for Gherkin parsing and step
   execution.
2. Drive Storybook iframe targets with the existing Playwright browser
   dependency.
3. Keep target mappings explicit instead of generating framework test code.
4. Run targets sequentially with owned server lifecycle and failure-safe
   cleanup.
5. Remove global styles JavaScript from React Storybook to prove independent
   behavior ownership.

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md) defines scenarios, fixtures, targets,
  capabilities, and results.
- [contracts/runner.md](./contracts/runner.md) defines CLI, target registration,
  Gherkin vocabulary, lifecycle, and failure contracts.
- [quickstart.md](./quickstart.md) defines the end-to-end validation path.

## Post-Design Constitution Re-evaluation

All gates remain passed. The design strengthens Principles I, IV, X, XIV, and
XVI by making shared behavior executable while retaining framework-native
implementations and independent Storybook validation. No shared runtime is
forced on React and no wrapper-only behavior is introduced.

## Design Artifacts

- Research decisions: `./research.md`
- Data model: `./data-model.md`
- Runner and target contract: `./contracts/runner.md`
- Validation path: `./quickstart.md`
