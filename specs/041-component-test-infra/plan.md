# Implementation Plan: Component Test Infrastructure

**Branch**: `041-component-test-infra` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/041-component-test-infra/spec.md`

## Summary

Refactor the repository's component-testing infrastructure (Phase 1 of
`docs/plans/component-testing-infrastructure-refactor.md`) so that a shared,
renderer-neutral Accordion behavior contract is proven first by
`packages/styles`. The plan (a) records a single Accordion capability
manifest, (b) introduces a private `packages/storybook-contracts` validation
package with single-capability helpers, (c) makes the Styles Storybook the first
executable consumer through a focused `test:storybook-styles` command, (d)
consolidates the build/serve/ready/test/report/cleanup lifecycle into one
target-aware runner with accessibility-exception and evidence reporting, and (e)
retires the duplicate top-level Cucumber `behavior-contracts/` pilot only after
equivalence is proven. React adoption (Phase 2) and broader component coverage
(Phase 3) are explicitly out of scope.

## Technical Context

**Language/Version**: JavaScript ESM on Node.js `^24 || >=26`, matching the root `engines` policy (`pnpm@11.11.0`)

**Primary Dependencies**: Storybook 10 test-runner and `@storybook/test`, Playwright 1.61 (already present), existing `serve` 14; `@cucumber/cucumber` 13.2 remains only until the pilot equivalence review retires it

**Storage**: N/A; source-controlled manifest, helpers, runner, reports, and specification files only

**Testing**: New Style-focused Storybook `play` interactions and `@storybook/test` assertions; the target-aware runner (replacing duplicate shell/Cucumber/CI lifecycle); ESLint, Prettier, Markdownlint, TypeScript, package and Storybook builds, and `pnpm pack` checks to prove no publishable-package leakage

**Target Platform**: Chromium in local macOS and Linux CI environments

**Project Type**: pnpm ESM monorepo containing the publishable `@pathableai/styles` and `@pathableai/react` libraries plus independent `apps/storybook` (HTML) and `apps/storybook-react` applications

**Performance Goals**: One focused Styles command proves the Accordion helpers without building or starting the React Storybook; each target has a bounded readiness window and every spawned browser/server is cleaned up

**Constraints**: Shared validators accept only an `HTMLElement` or a small structural interface (never React props, Storybook renderer context types, CSS selectors, or package internals); Styles is the first and only executable owner of a shared behavior in this phase; the pilot stays green until equivalence is proven; failures are hard failures rather than silent skips

**Scale/Scope**: Accordion only, six shared capabilities, one registered `styles` target, plus the consolidation of existing runner/CI lifecycle code

## Constitution Check

*GATE: Passed before Phase 0 research. Re-checked after Phase 1 design.*

### Source and Package Scope

- [x] The new source is a **private** `packages/storybook-contracts` workspace package; it is not a wrapper package and adds no framework-native component, class, token, font, icon, or asset.
- [x] `packages/styles` remains the authoritative source; the plan only **adds deterministic Stories `play` behavior** that exercises the published `@pathableai/styles` CSS and JS entry points. No new visual contract, token, or markup class is introduced.
- [x] `packages/react` is not modified in this phase; React adoption is Phase 2 and requires a runtime-isolation guard first.
- [x] No wrapper-only styling or visual semantics are introduced.

### Consumer and Publishable Validation

- [x] The storybook-contracts package is not publishable and must not leak into either `@pathableai/styles` or `@pathableai/react` npm payloads. The plan includes a packed-artifact / tarball check (`pnpm pack --dry-run` or equivalent) whenever dependency or export boundaries change.
- [x] No public component API or generated declaration changes.
- [x] No breaking changes to public APIs, markup contracts, CSS contracts, or package exports.

### Validation Gates

- [x] Add a focused `test:storybook-styles` command, retain package-specific `test:storybook-react`, and make `test:storybook` a documented aggregate that cannot hide a skipped/missing/unregistered target.
- [x] Run focused contract-package lint/typecheck, `pnpm --filter @pathableai/styles build`, the focused Styles command, Styles Storybook build plus Axe browser tests, lifecycle negative-path tests, `pnpm lint`, `pnpm typecheck`, and `git diff --check`.
- [x] No lint or accessibility rule is disabled, weakened, skipped, or excluded; a reviewable accessibility-exception registry scopes exceptions to the narrowest story/rule instead of catalog-wide exclusions.

### Story and Interaction Requirements

- [x] The Styles Accordion catalog gains deterministic, named fixtures for each shared starting state (collapsed and initially expanded) plus fixed `play` stories calling the new helpers.
- [x] Helpers use accessible role/name queries (`getByRole`, `getByLabelText`, `getByText`) and observable semantic outcomes; generated IDs may vary but relationships (disclosure-to-panel) must resolve correctly.
- [x] Helper names map one capability per function (e.g. `verifyEnterExpandsDisclosure`) rather than a broad `verifyAccordion` helper.
- [x] The interaction run asserts the runtime initialized before interacting and fails with target/story/capability context; stories remain deterministic.

### Accessibility

- [x] Enter/Space toggling, single-open behavior, `aria-expanded`, disclosure-to-panel association, panel availability (`hidden`), and focus retention are browser-executed for the `styles` target.
- [x] Axe execution remains a separate, mandatory rendered check; the new evidence report measures fixtures, executable contract adoption, and automated accessibility execution as three separate measures.
- [x] No automated aggregate is labeled WCAG certification; manual keyboard/focus/assistive-technology review remains separate evidence.
- [x] Test content remains synthetic and deterministic.

### Responsive and Resilient States

- [x] This phase does not change Accordion presentation or responsive states; existing collapsed/expanded fixtures remain the rendering boundary.
- [x] The shared contract asserts panel availability and focus retention, and the Styles catalog keeps its existing responsive fixtures.

### Visual Regression

- [x] Existing stable stories remain visual fixtures; the target-aware runner does not generate or update screenshots. The focused Styles command asserts rendered browser behavior rather than serialized DOM snapshots.

### Documentation Surface Ownership

- [x] A new capability manifest (in the storybook-contracts package or `docs/testing/`) owns the shared Accordion contract and its evidence boundary.
- [x] `docs/testing/` is updated so commands, paths, failure behavior, and the Styles-first rule match the implemented system.
- [x] Storybook continues to own component usage documentation; the run/adoption guide owns contributor validation instructions.
- [x] An architecture record explains why direct Storybook helpers are the default and when Gherkin would still be justified.

### Cross-Framework Impact

- [x] `packages/styles` is the first and only registered target; no React Storybook or catalog change occurs.
- [x] The target-aware runner registers `styles` first and is structured so a future framework target can be added without altering the shared Accordion contract.
- [x] This phase verifies the Styles Storybook builds and passes in its own context; the React Storybook is deliberately not exercised.

### Complexity Tracking

No constitution violations require justification.

## Project Structure

### Documentation (this feature)

```text
specs/041-component-test-infra/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── checklists/
│   └── requirements.md
├── contracts/
│   └── runner.md
└── tasks.md     # Phase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
packages/storybook-contracts/          # NEW private, renderer-neutral validation package
├── package.json                        # private:true, explicit exports, lint/format/typecheck
├── tsconfig.json
├── README.md
└── src/
    ├── accordion/
    │   ├── manifest.ts                # Accordion capability manifest + evidence boundary
    │   └── verifyEnterExpandsDisclosure.ts
    │   ├── verifySpaceCollapsesDisclosure.ts
    │   ├── verifySingleOpenBehavior.ts
    │   ├── verifyDisclosurePanelAssociation.ts
    │   ├── verifyPanelAvailability.ts
    │   └── verifyFocusRetention.ts
    └── … (helpers accept HTMLElement or a small structural interface)

packages/styles/src/stories/components/Communication/Accordion.stories.ts
apps/storybook/.storybook/             # wire focused Styles test environment + shared Axe policy
scripts/test-storybook.mjs             # NEW target-aware runner (replaces test-storybook.sh duplication)
scripts/accessibility-exceptions.mjs   # NEW shared, reviewable exception registry
scripts/storybook-evidence-report.mjs  # NEW fixture/contract-adoption/Axe reporting
package.json                           # focused + aggregate commands; later remove Cucumber
.github/workflows/ci-full.yml          # call shared runner and publish target-labelled evidence
behavior-contracts/                    # retired ONLY after equivalence review passes
docs/testing/                          # commands, ownership, rollout, evidence limits, Styles-first rule
```

**Structure Decision**: The private contract package lives under `packages/` so
pnpm treats it as a workspace dependency the style Storybook can import without
adding files to either publishable package. The target-aware runner and
accessibility/evidence tooling live under `scripts/` (repository root) where the
existing `test-storybook.sh`, `test-next-consumer.mjs`, and
`check-react-server-compatibility.mjs` already live. The pilot retires in place
only after equivalence.

## Phase 0: Research

Research decisions are captured in [research.md](./research.md):

1. Replace duplicated lifecycle scripts with one target-aware Storybook runner.
2. Keep the storybook-contracts package private and restricted to Storybook
   testing primitives.
3. Prefer Storybook `play` + `@storybook/test` helpers over Gherkin as the
   default component-test authoring layer.
4. Register `styles` first and keep React runtime isolation out of scope.
5. Centralize Axe exceptions and separate fixture/contract/adoption/Axe reports.

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md) defines the Accordion capability manifest,
  shared helpers, the `styles` target, the target-aware runner, the
  accessibility-exception registry, and the evidence report.
- [contracts/runner.md](./contracts/runner.md) defines the runner CLI, target
  registration, readiness, lifecycle signals, failure semantics, and cleanup.
- [quickstart.md](./quickstart.md) defines the end-to-end validation path from a
  clean checkout through the focused Styles command and evidence report.

## Post-Design Constitution Re-evaluation

All gates remain passed. The design strengthens Principles I, IV, X, XIV, XV,
and XVI by making a shared component capability executable and owned by the
Styles package first, while keeping the contract package private, limiting
helpers to accessible actions and observable assertions, and deferring React
adoption until a runtime-isolation guard exists. No publishable-package leak,
wrapper-only styling, or broad accessibility exception is introduced.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _None_ | _No constitution violations_ | _—_ |

## Design Artifacts

- Research decisions: `./research.md`
- Data model: `./data-model.md`
- Runner and target contract: `./contracts/runner.md`
- Validation path: `./quickstart.md`