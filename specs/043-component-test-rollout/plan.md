# Implementation Plan: Component Test Rollout

**Branch**: `043-component-test-rollout` | **Date**: 2026-08-18 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/043-component-test-rollout/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Phase 3 of `docs/plans/component-testing-infrastructure-refactor.md` applies the
Proven Styles-first component-test sequence across the whole component and
pattern catalog in risk order. It reuses the Phase 1 shared renderer-neutral
`packages/storybook-contracts` system and the Phase 2 `react` target without
inventing a second authoring model. The plan (a) introduces a component rollout
ledger that records each component's wave, Styles-proven status, shared
capabilities (or Styles-only status), and downstream-adoption order, (b)
generalizes shared validators into a small capability taxonomy (disclosure,
overlay, composite-widget, focus) that stateful Wave A proves first, (c) applies
the sequence one component at a time across form controls (Wave B), navigation
and collections (Wave C), status and feedback (Wave D), and visual and
composition-led surfaces (Wave E), and (d) extends the focused Styles and
evidence-report commands so each component proof is reported separately from
story presence and Axe. No new visual contract, token, or wrapper package is
introduced; Accordion's contract is already proven and is not reworked here.

## Technical Context

**Language/Version**: JavaScript ESM on Node.js `^24 || >=26`, matching the root `engines` policy (`pnpm@11.11.0`)

**Primary Dependencies**: Storybook 10 test-runner and `@storybook/test`, Playwright (already present); `@pathable/storybook-contracts` (already present, Accordion manifest and six helpers); no new runtime dependency

**Storage**: N/A — source-controlled rollout ledger, manifests, followers, reports, and spec files only

**Testing**: Focused Styles Storybook `play` interactions and `@storybook/test` assertions per component; the evidence report reads the ledger and green-run signal; ESLint, Prettier, Markdownlint, TypeScript, package and Storybook builds, and `pnpm pack` checks to prove no publishable-package leakage

**Target Platform**: Chromium in local macOS and Linux CI environments

**Project Type**: pnpm ESM monorepo containing the publishable `@pathableai/styles` and `@pathableai/react` libraries plus independent `apps/storybook` (HTML) and `apps/storybook-react` applications, and the private `packages/storybook-contracts` workspace

**Performance Goals**: One focused Styles command proves a component (or wave) without building or starting the React Storybook; a narrow per-component filter keeps the loop fast as coverage grows; every spawned browser/server is cleaned up

**Constraints**: Shared validators accept only an `HTMLElement`/`StoryHarness` or a small structural interface (never React props, Storybook renderer context types, CSS selectors, or package internals); Styles is the first and only executable owner of each shared behavior until a downstream target (proven isolated) adopts the unchanged helper; one component at a time per wave; failures are hard failures rather than silent skips; no broad accessibility exception and no new visual contract are introduced

**Scale/Scope**: ~57 component stories under `packages/styles/src/stories/components/` plus pattern/recipe/dashboard/discovery/interaction-control surfaces; a rollout ledger; a small shared-capability taxonomy; new focused runner filter and evidence reporting

## Constitution Check

*GATE: Passed before Phase 0 research. Re-checked after Phase 1 design.*

### Source and Package Scope

- [x] The rollout ledger and shared helpers live in the **private**
  `packages/storybook-contracts` workspace package. It is not a wrapper package
  and adds no framework-native component, class, token, font, icon, or asset.
- [x] `packages/styles` remains the authoritative source; each component proof
  only adds deterministic `play` behavior/fixtures that exercise the built public
  `@pathableai/styles` CSS and JS entry points. No new visual contract, token,
  or markup class is introduced.
- [x] `packages/react` is adopted only component-by-component after a Styles
  proof exists and a runtime-isolation guard passes (Phase 2 precedent). No
  wrapper-only styling or visual semantics are introduced.
- [x] Component names, when a wrapper adops, remain the CamelCase form of the
  `packages/styles` name with any `pathable` prefix removed.

### Consumer and Publishable Validation

- [x] `@pathable/storybook-contracts` is not publishable and must not leak into
  either `@pathableai/styles` or `@pathableai/react` npm payloads. The plan
  includes a packed-artifact / tarball check (`pnpm pack --dry-run` or
  equivalent) whenever dependency or export boundaries change.
- [x] No new public component API or generated declaration change in a
  publishable package. No breaking change to public APIs, markup contracts, CSS
  contracts, or package exports.

### Validation Gates

- [x] Focused per-component (or per-wave) Styles contract keeps the existing
  `test:storybook-styles` command and the documented aggregate
  `test:storybook` that cannot hide a skipped/missing/unregistered target.
- [x] Run contract-package lint/typecheck, `pnpm --filter @pathableai/styles
  build`, the focused Styles command, Styles Storybook build plus Axe browser
  tests, lifecycle negative-path tests, `pnpm lint`, `pnpm typecheck`, and
  `git diff --check`.
- [x] No lint or accessibility rule is disabled, weakened, skipped, or
  excluded; exceptions stay scoped to the narrowest story/rule in the shared
  registry.

### Story and Interaction Requirements

- [x] Each proven component gains deterministic, named stories for its supported
  starting states plus fixed `play` functions calling the shared helpers (or
  remains a Styles-only fixture for static/pure surfaces).
- [x] Helpers use accessible role/name queries (`getByRole`, `getByLabelText`,
  `getByText`) and observable semantic outcomes; generated IDs may vary but
  relationships (disclosure-to-panel, overlay, composite association) resolve
  correctly.
- [x] Helper names map one capability per function (e.g.
  `verifyEscapeClosesOverlay`), never a broad `verify<Component>`.
- [x] The interaction run asserts the runtime initialized before interacting
  and fails with target/story/capability context rather than silently skipping;
  stories remain deterministic (`FR-015`, `FR-016`).

### Accessibility

- [x] Keyboard activation, focus placement/containment/restoration, accessible
  names, disclosure/overlay/composite semantics, and state relationships are
  browser-executed per component as applicable; no purely static structure gains
  a manufactured interaction test (`FR-009`).
- [x] Axe execution remains a separate, mandatory rendered check; the evidence
  report measures fixtures, executable contract adoption, and automated
  accessibility execution as three separate measures.
- [x] Manual announcement quality for live/status components (Wave D) remains a
  separate review item and is never labeled an automated conformance result
  (`FR-011`).
- [x] No automated aggregate is labeled WCAG certification; manual
  keyboard/focus/assistive-technology review remains separate evidence; test
  content stays synthetic and deterministic.

### Responsive and Resilient States

- [x] Components are evaluated for narrow/mobile layouts, long and
  localized-looking content, constrained containers, and increased text size;
  keyboard focus visibility is preserved (Principle XV).
- [x] Loading, empty, error, disabled, read-only, invalid, and required states
  are covered when part of the component contract (principally Waves B and D).
- [x] High-contrast/forced-colors and reduced-motion behavior is considered when
  supported; a combinatorial story per prop/viewport/theme is not required.

### Visual Regression

- [x] Stable stories remain deterministic visual-regression fixtures for
  meaningful component states; the plan protects tokens, typography, spacing,
  responsive behavior, focus indicators, overflow, wrapping, icon alignment, and
  state presentation where applicable.
- [x] Coverage relies on browser-rendered validation, not serialized DOM
  snapshots as a substitute.

### Documentation Surface Ownership

- [x] The rollout ledger (contract `./contracts/rollout-ledger.md`) owns which
  component is proven and in what order; the evidence report and quickstart
  derive from it.
- [x] Storybook continues to own component usage documentation; the ledger and
  quickstart own contributor validation instructions; `docs/testing/` is updated
  so commands, paths, and the Styles-first rule match the implemented system.

### Cross-Framework Impact

- [x] `packages/styles` is the first and only executable owner of each shared
  behavior in this phase until a framework target adopts the unchanged helper
  after its own Styles proof and isolation guard.
- [x] The target-aware runner registers `styles` first; `react` (from Phase 2)
  continues to run after it; a future framework target can be added without
  altering the shared contract.
- [x] Each adopting framework's Storybook continues to build and test in its own
  framework context; composition into the primary catalog must not hide an
  independent framework failure.

### Complexity Tracking

- [x] No constitution violations require justification (see below; the rollout
  itself is additive within existing private/test infrastructure).

## Project Structure

### Documentation (this feature)

```text
specs/043-component-test-rollout/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output — resolved all unknowns
├── data-model.md        # Phase 1 output — rollout ledger + capability taxonomy
├── quickstart.md        # Phase 1 output — focused Styles validation path
├── contracts/           # Phase 1 output — public contract definitions
│   ├── rollout-ledger.md    # ledger shape, status/category/wave rules
│   └── helper-taxonomy.md   # shared-capability helper groups
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/storybook-contracts/       # NEW ledger + shared-capability taxonomy (private)
├── src/
│   ├── accordion/                  # existing (unchanged helpers/manifest)
│   ├── rollout/                    # NEW rollout ledger
│   │   └── rollout.ts              # RolloutEntry[] + wave/status rules
│   ├── disclosure/                 # NEW shared group (banner/header/sidenav/search)
│   │   └── verifyDisclosureTogglesButton.ts (illustrative; seeds from accordion)
│   ├── overlay/                    # NEW shared group (wave A: modal, combobox, datepicker, toast)
│   │   └── verifyEscapeClosesOverlay.ts
│   ├── composite-widget/           # NEW shared group (combo-box, date-range, segmented)
│   │   └── verifyOptionNavigable.ts
│   ├── focus/                      # NEW shared group (modal containment, sidenav, skipnav)
│   │   └── verifyFocusRestoredOnClose.ts
│   └── index.ts                    # re-export ledger + helpers
```

> Grouping note: the Accordion `verify*Disclosure*` helpers remain in
> `src/accordion/` (their Phase 1 owner). `disclosure/` hosts *new*
> cross-component helpers (Banner/Header/Sidenav/Search) and may `re-export` the
> Accordion helpers as the group's seed rather than moving them, to avoid
> Phase 1 baseline churn.

```text
packages/styles/src/stories/components/…      # existing *.stories.ts, per component:
                                                - add deterministic named fixtures
                                                - add fixed play() calling shared helpers (shared) or
                                                  keep static (styles-only)
apps/storybook/.storybook/                    # shared Axe policy already wired; add focused filter support
scripts/test-storybook.mjs                    # add narrow per-component/wave filter; ledger-driven capabilities
scripts/storybook-evidence-report.mjs         # read rollout ledger; report per component/wave
scripts/accessibility-exceptions.mjs          # unchanged (registry already shared)
docs/testing/                                 # update commands, paths, Styles-first rule, ledger
package.json                                  # (optionally) add per-wave/component script aliases
.github/workflows/ci-full.yml                 # unchanged except ledger-aware evidence; publish target-labelled results
```

**Structure Decision**: The rollout ledger and any new shared helpers live in
the private `packages/storybook-contracts` package so pnpm treats them as
workspace dependencies the Styles (and later framework) Storybooks import
without adding files to any publishable package — the same decision Phase 1 made
for Accordion. Focused filtering and evidence reporting extend `scripts/`
tooling already owned at repository root. Components are proven in place in
their existing story files; no parallel "contract story" tree is introduced
(research Decision 4).

## Phase 0: Research

Research decisions are captured in [research.md](./research.md):

1. Use a repository-owned **rollout ledger** (in `packages/storybook-contracts`)
   rather than a monolithic manifest or a docs table.
2. Generalize shared validators into a small **capability taxonomy**
   (disclosure, overlay, composite-widget, focus) promoted only on real sharing.
3. Prove components **in place** in their existing story files; keep a narrow
   per-component/wave focused filter.
4. Represent **Styles-only** surfaces in the ledger as styles-only evidence, not
   promoted shared helpers.
5. Roll out **one component at a time** per wave, consistent with the plan.

## Phase 1: Design & Contracts

- [data-model.md](./data-model.md) defines the RolloutLedger, the shared-
  capability taxonomy, and the entities (component target, capability, fixture,
  downstream adoption).
- [contracts/rollout-ledger.md](./contracts/rollout-ledger.md) contracts the
  ledger shape, status/category/wave rules, downstream-adoption, and failure
  semantics.
- [contracts/helper-taxonomy.md](./contracts/helper-taxonomy.md) contracts the
  single-capability rule, the shared groups, and helper naming/promotion.
- [quickstart.md](./quickstart.md) defines the end-to-end validation path from a
  clean checkout through focused per-component Styles proof, ledger and
  evidence-report verification, and the conformance proofs.

## Post-Design Constitution Re-evaluation

All gates remain passed. The design strengthens Principles I, X, XIV, XV, and
XVI by extending an already-Shared renderer-neutral proof loop to the whole
catalog in risk order, keeping every behavior owned first by `packages/styles`,
keeping the contract package and ledger private, limiting shared helpers to real
cross-component promises, and reporting fixtures, adoption, and Axe separately
with no WCAG label and no invented interactions for static surfaces. No
publishable-package leak, wrapper-only styling, new visual contract, or broad
accessibility exception is introduced.

## Complexity Tracking

> The rollout scope is intentionally additive within existing private/test
> infrastructure; it does not widen packages' public surface. No constitution
> violation requires a justification beyond the additive scale of the rollout
> itself, which is recorded transparently in the ledger and the plan's
> FIFO/risk-order approach.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| _None_ | _No constitution violations_ | _—_ |

## Design Artifacts

- Research decisions: `./research.md`
- Data model: `./data-model.md`
- Rollout ledger contract: `./contracts/rollout-ledger.md`
- Shared capability helper contract: `./contracts/helper-taxonomy.md`
- Validation path: `./quickstart.md`

## Visual fidelity navigation

- Visual validation decisions: `./research.md`
- Visual proof execution: `./quickstart.md`
- Visual interaction contract scope: `./contracts/helper-taxonomy.md` (shared)
  driven by `./data-model.md` (ledger status)