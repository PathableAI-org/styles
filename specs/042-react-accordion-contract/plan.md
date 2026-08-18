# Implementation Plan: React Accordion Contract Adoption

**Branch**: `042-react-accordion-contract` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/042-react-accordion-contract/spec.md`

## Summary

Adopt the Styles-proven, renderer-neutral Accordion contract in the React
Storybook (Phase 2 of `docs/plans/component-testing-infrastructure-refactor.md`).
The plan (a) isolates the React Accordion from the Styles DOM enhancement
runtime and adds a guard that fails on ambiguous handler ownership, (b) adds
deterministic React fixtures and has the React stories invoke the **unchanged**
shared helpers from `packages/storybook-contracts`, (c) keeps React-specific
behavior (controlled/uncontrolled `expandedIds`/`defaultExpandedIds`,
`onExpandedChange`, disabled, refs, server rendering) in separate React tests,
and (d) registers a `react` downstream target in `scripts/test-storybook.mjs`
**only after** its isolated native implementation passes. Styles, the shared
contract, and the `styles` target remain unchanged. Broader component coverage
(Phase 3) is out of scope.

## Technical Context

**Language/Version**: TypeScript/JavaScript ESM on Node.js `^24 || >=26`, matching the root `engines` policy (`pnpm@11.11.0`)

**Primary Dependencies**: Storybook 10 React renderer and `@storybook/test` (already present), the private `@pathable/storybook-contracts` package (Phase 1) with the unchanged Accordion helpers; `@pathableai/styles/js` is intentionally isolated for React Accordion stories

**Storage**: N/A; source-controlled fixtures, isolation guard, runner target registry, and specification files only

**Testing**: React Storybook `play` stories invoking the shared helpers, plus separate React tests for controlled/uncontrolled state, `onExpandedChange`, disabled props, refs, and server rendering; ESLint, Prettier, Markdownlint, TypeScript, package builds, and `pnpm pack` checks to prove no publishable-package leakage

**Target Platform**: Chromium in local macOS and Linux CI environments

**Project Type**: pnpm ESM monorepo containing the publishable `@pathableai/styles` and `@pathableai/react` libraries plus independent `apps/storybook` (HTML) and `apps/storybook-react` applications

**Performance Goals**: Register `react` after `styles`; keep the Styles path independent and green; each target has a bounded readiness window and every spawned browser/server is cleaned up

**Constraints**: The shared helpers and contract are **unchanged** (React adopts them); React conformance is trusted only without the Styles enhancement runtime for Accordion; dual ownership fails the guard; React is a downstream aggregate target only after isolated native implementation passes

**Scale/Scope**: Accordion only, the six shared capabilities, registered `styles` (unchanged) plus a new `react` target

## Constitution Check

*GATE: Passed before Phase 0 research. Re-checked after Phase 1 design.*

### Source and Package Scope

- [x] No new source-layer contract, token, font, icon, asset, or component class
  is defined. The shared `packages/storybook-contracts` package and its
  Accordion helpers are **unchanged**; React adopts them.
- [x] `packages/styles` remains authoritative; the plan does not modify it.
- [x] `packages/react` Accordion behavior is the isolated native implementation;
  existing styled behavior is preserved through the shared package and
  enhancement runtime remains excluded for Accordion only.
- [x] The React component keeps the CamelCase form (`Accordion`) of the
  equivalent `packages/styles` name; no naming change.
- [x] No wrapper-only styling or private visual semantics are introduced.

### Consumer and Publishable Validation

- [x] `packages/storybook-contracts` is not publishable and must not leak into
  either `@pathableai/styles` or `@pathableai/react` npm payloads; a
  packed-artifact check (`pnpm pack --dry-run` or equivalent) runs whenever
  dependency or export boundaries change.
- [x] No public component API or generated declaration changes for the React
  Accordion.
- [x] No breaking changes to public APIs, markup contracts, CSS contracts, or
  package exports.

### Validation Gates

- [x] Register the `react` target after `styles`; aggregate `test:storybook`
  cannot hide a skipped/missing/unregistered target.
- [x] Run React-specific lint/typecheck/tests, package build, both Storybook
  builds, the `styles` then `react` target lifecycle, and `git diff --check`.
- [x] No lint or accessibility rule is disabled, weakened, skipped, or excluded;
  the shared accessibility-exception registry's narrow story/rule scoping holds.

### Story and Interaction Requirements

- [x] React Accordion gains/keeps deterministic, named fixtures for each shared
  starting state (`Default`, `InitiallyExpanded`) plus fixed `play` stories that
  call the unchanged shared helpers.
- [x] Stories use accessible role/name queries (`getByRole`, `getByLabelText`,
  `getByText`) and observable semantic outcomes; generated IDs may vary but
  disclosure-to-panel relationships must resolve correctly.
- [x] The interaction run asserts the runtime initialized before interacting and
  fails with target/story/capability context; stories remain deterministic.
- [x] React-specific behavior (controlled/uncontrolled, `onExpandedChange`,
  disabled, refs, server rendering) stays in separate React tests.

### Accessibility

- [x] Enter/Space toggling, single-open behavior, `aria-expanded`,
  disclosure-to-panel association, panel availability (`hidden`), and focus
  retention are browser-executed for both the `styles` and `react` targets.
- [x] Axe execution remains a separate, mandatory rendered check; the evidence
  report measures fixtures, contract adoption, and automated accessibility
  execution separately.
- [x] No automated aggregate is labeled WCAG certification; manual
  keyboard/focus/assistive-technology review remains separate evidence.
- [x] Test content remains synthetic and deterministic.

### Responsive and Resilient States

- [x] The plan does not change Accordion presentation or responsive states; the
  existing React fixtures (including `Narrow`, `LongContent`) remain the
  rendering boundary.
- [x] The shared contract asserts panel availability and focus retention, and the
  React catalog keeps its existing responsive fixtures.

### Visual Regression

- [x] Existing React stable stories remain visual fixtures; the target-aware
  runner does not generate or update screenshots. The `react` target asserts
  rendered browser behavior rather than serialized DOM snapshots.

### Documentation Surface Ownership

- [x] The shared Accordion contract and its evidence boundary remain owned by
  the storybook-contracts manifest / `docs/testing/`.
- [x] The adoption contract (`contracts/adoption.md`) and `quickstart.md` own the
  React isolation, fixtures, and downstream-registration instructions.
- [x] Storybook continues to own component usage documentation.

### Cross-Framework Impact

- [x] The `styles` target remains first and green; the `react` target is added
  after it and runs strictly after `styles`.
- [x] The React Storybook builds and tests in its own framework context; the
  shared runner verifies both independently.
- [x] React conformance is not trusted until isolation is proven and the shared
  baseline is unaffected.

### Complexity Tracking

No constitution violations require justification.

## Project Structure

### Documentation (this feature)

```text
specs/042-react-accordion-contract/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
├── contracts/
│   └── adoption.md
└── tasks.md     # Next phase (/speckit-tasks)
```

### Source Code (repository root)

```text
packages/storybook-contracts/          # UNCHANGED Phase 1 shared helpers
packages/react/src/stories/components/Communication/Accordion.stories.tsx  # fixed fixtures + play calling shared helpers
packages/react/src/components/Accordion/                  # native React implementation (unchanged)
apps/storybook-react/.storybook/preview.js                # isolate Styles enhancement runtime for Accordion
scripts/test-storybook.mjs                                # add `react` target after `styles`
scripts/*isolation-guard*                                 # NEW guard that fails on ambiguous ownership (Accordion-scoped)
packages/react/…                                          # React-specific tests: controlled/uncontrolled, onExpandedChange, disabled, refs, server rendering
package.json                                              # ensure test:storybook-react / aggregate remain documented
.github/workflows/ci-full.yml                             # reuse shared runner; publish target-labelled evidence incl. react
```

**Structure Decision**: The `react` registration reuses the Phase 1 runner
(`scripts/test-storybook.mjs`), which already owns the lifecycle and registers
`styles` first; a new `react` target is appended after it. Isolation lives in
the React preview storybook wiring and an Accordion-scoped guard, keeping the
shared contract and `packages/styles` untouched.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md):

1. Isolate React from the Styles enhancement runtime via a guarded preview, not
   a rewrite.
2. Reuse the existing target-aware runner for the `react` target.
3. Delegate shared capabilities to unchanged helpers; keep React API tests
   separate (controlled/uncontrolled, `onExpandedChange`, disabled, refs,
   server-rendering).
4. Keep React adoption a separate downstream-adoption change; Styles and the
   shared contract remain unchanged.

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md) defines the shared helper, native React
  implementation, isolation guard, React Accordion fixture, React-specific
  test, and downstream target registration entities.
- [contracts/adoption.md](./contracts/adoption.md) contracts isolation,
  React fixtures/delegation, React-specific scope, downstream registration, and
  the verification proof.
- [quickstart.md](./quickstart.md) defines the end-to-end path from the untouched
  Styles baseline, through React isolation and target registration, to aggregate
  reporting.

## Post-Design Constitution Re-evaluation

All gates remain passed. The design strengthens Principles I, IV, X, XIV, XV,
and XVI by making the React package consume the same Styles-proven Accordion
behavior through unchanged shared helpers, isolating its native implementation
from the enhancement runtime, and registering `react` only after isolation —
while keeping the shared contract, `packages/styles`, and their npm payload
untouched.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _None_ | _No constitution violations_ | _—_ |

## Design Artifacts

- Research decisions: `./research.md`
- Data model: `./data-model.md`
- Adoption and target contract: `./contracts/adoption.md`
- Validation path: `./quickstart.md`