# Research: Component Test Rollout (Phase 3)

Phase 3 research resolves the design decisions for the risk-ordered rollout of
component-contract coverage across the design system. It is grounded in the
Phase 3 section of `docs/plans/component-testing-infrastructure-refactor.md`,
the specification in `spec.md`, and the already-realized Phase 1 and Phase 2
infrastructure: `packages/storybook-contracts` (Accordion manifest + six single-
capability helpers), the target-aware `scripts/test-storybook.mjs` runner
(`styles` and `react` targets), the accessibility-exception registry
(`scripts/accessibility-exceptions.mjs`), and the evidence report
(`scripts/storybook-evidence-report.mjs`).

Phase 3 must not invent a second authoring model. It reuses the proven
Styles-first sequence exactly once per component: define the observable
capability and deterministic fixture, implement the validator in the shared
contract package, invoke it from the Styles Storybook against the built public
`@pathableai/styles`, make the focused Styles command pass locally and in CI,
and only then let a downstream package adopt the unchanged validation. Phase 3
applies that sequence across the existing component and pattern inventory in
risk order.

## Decision 1: A rollout ledger, not a monolithic manifest, tracks rollout status

**Decision**: Add a component rollout ledger — a reviewable, repository-owned
registry — that records, per component story target, its wave, its Styles-
proven status, its shared-contract capabilities (or its Styles-only status),
and the order of any downstream adoption. The ledger is the Phases-1/2
Accordion capability manifest generalized across components; it is the single
source of truth for what is proven and what remains.

**Rationale**: The Phase 3 requirement (`FR-014`) and the plan's completion
criteria ("the component rollout ledger records each component's Styles proof
before downstream adoption") require an explicit, inspectable record spanning
dozens of components over an extended period. A single monolithic manifest would
be unreviewable; per-component manifests keyed by a shared ledger keeps each
entry small while the ledger answers the cross-component questions (what is
proven, what order, what wave). It also satisfies the "no second component in
the shared system until its Styles proof is green" gate because a component is
only *listed as proven* after its focused Styles run passes.

**Alternatives considered**:
- A markdown table in `docs/testing/` — rejected: it is not machine-readable and
  cannot feed the evidence report or CI; the manifest/ledger model already
  established in `packages/storybook-contracts` is.
- One broad `verifyComponent` per component — rejected by Constitution
  Principle XIV and the Phase 1 convention: helpers stay one-capability each, and
  the ledger tracks capability-only proof rather than a blobby "covered" flag.

## Decision 2: Ledger lives in `packages/storybook-contracts` alongside the manifests

**Decision**: The rollout ledger is a new module in the private
`packages/storybook-contracts` package (e.g. `src/rollout/rollout.ts` exported
from `src/index.ts`), listing every component target with wave, capability
manifest references, and Styles/package-specific proof status. The
`scripts/storybook-evidence-report.mjs` reporter reads the ledger (plus the
`.storybook-evidence.json` green-run signal) to emit per-component evidence.

**Rationale**: The contract package already owns the Accordion manifest and is
the established home for renderer-neutral contract metadata. Keeping the ledger
there lets the reporter and CI read one dependency, keeps private packages
leak-free (it never enters a publishable package), and mirrors where the
Accordion manifest lives today. The ledger is data, not behavior; validators in
the same package stay one-capability and the ledger simply indexes them.

**Alternatives considered**:
- A `scripts/rollout.yml` or `rollout.json` at repo root — rejected: it would
  duplicate the manifest data model already in `packages/storybook-contracts`
  and split contract metadata across two locations.
- Computed from the runner's target registry alone — rejected: the runner tracks
  capabilities per *target*, not per component's Styles proof lifecycle and wave;
  a distinct ledger is the required completion criterion.

## Decision 3: Reusable helpers form a small shared taxonomy, not a second framework

**Decision**: As the stateful Wave A components are proven, extract genuinely
cross-component validators into a small, named set of shared capability groups
(disclosure, overlay, composite-widget, focus), each exported as single-
capability helpers under `packages/storybook-contracts/src/`. A helper is
promoted to a shared group only when two or more components share the exact
observable promise; the Accordion disclosure validators are the first seed of
the `disclosure` group. No helper absorbs React props, renderer context, CSS
selectors, or package internals.

**Rationale**: The plan names these four groups explicitly ("establish reusable
disclosure, overlay, composite-widget, and focus helpers"). Limiting promotion
to real sharing prevents the helper set from becoming a second framework — the
primary Phase 3 risk. Each helper stays named for one capability
(`verifyEscapeClosesOverlay`, not `verifyModal`), preserving the property that a
broken helper fails every target that adopts it.

**Alternatives considered**:
- A separate shared-behavior package beyond `storybook-contracts` — rejected: it
  fragments the renderer-neutral helpers and duplicates the Phase 1 intent.
- Blanket "promote everything to shared" — rejected: `FR-013` only promotes a
  pattern when another package exposes the same user-facing promise; Styles-only
  surfaces stay fixtures.

## Decision 4: Files-by-wave naming keeps the ledger and reporter deterministic

**Decision**: Each component's Styles interaction lives in its existing
deterministic `.stories.ts` (adding fixture exports and `play` functions that
call the shared helpers), and the ledger references components by their stable
story id (e.g. `components-form-controls-combobox--default`). The narrow
iteration filter (a per-component or per-wave subtree) is passed to the runner
when it supports stable filtering, per the Phase 1 runner contract.

**Rationale**: Stories remain the rendering and fixture boundary (Principle XIV,
`FR-016`). Deterministic named fixtures per supported starting state and fixed
`play` functions are the existing pattern from the Accordion slice; the ledger
reuses story ids so the reporter, runner, and exceptions registry agree on
targets. Narrow per-component filtering keeps the focused Styles loop fast as the
rollout scales and directly serves `FR-015` (fail with story/capability
context).

**Alternatives considered**:
- A parallel "contract stories" tree separate from the real component stories —
  rejected: it would duplicate fixtures and diverge from the proven Accordion
  pattern where the real story file owns both the fixture and the `play`.
- Relying on the full `test:storybook` aggregate for every component — rejected:
  it forfeits the fast, focused Styles-only loop the plan requires and makes CI
  slower as coverage grows.

## Decision 5: Styles-only surfaces are represented in the ledger, not promoted

**Decision**: Pattern, recipe, dashboard, discovery, and interaction-control
stories that no other package exposes as the same user-facing promise are
recorded in the ledger as **Styles-only** evidence (deterministic states,
semantics, viewport/content pressure, Axe) and are not given shared contract
helpers. They are still a11y-checked and covered by the aggregate, but they are
not `shared` capabilities.

**Rationale**: `FR-012` and `FR-013` explicitly bound the shared system to
components with a cross-package user-facing promise. Most composition-led
surfaces (application shells, marketing patterns, dashboard recipes) are
Styles-only in this phase; forcing them into the shared contract system would
inflate the helpers and violate the "don't invent interaction tests for purely
static structures" rule (`FR-009`). Remaining Styles-only interaction controls
that no downstream package claims stay fixtures until a consumer exposes the
same promise.

**Alternatives considered**:
- Promote every pattern to a shared helper — rejected: violates `FR-013`, bloats
  the contract package, and would claim cross-package conformance where none
  exists.
- Exclude Styles-only surfaces from the ledger entirely — rejected: the ledger
  must record their Styles-proven evidence so coverage reporting is honest and
  nothing silently slips out of scope.

## Decision 6: Rollout proceeds one component at a time within each wave

**Decision**: Each wave is executed in the plan's order, one component at a time,
unless components share only non-overlapping infrastructure (then they may be
worked in parallel because their fixtures and outputs cannot overwrite each
other). A component's contract and Styles proof complete before its downstream
adapter begins; `FR-003` and the ledger enforce this.

**Rationale**: This is the plan's explicit sequencing and the Constitution's
narrow-first-slice discipline. It guarantees a component's focused Styles result
exists before any package adopts it and keeps each pull request reviewable, as
Phase 1 and Phase 2 already demonstrated with Accordion. The ledger's `status`
field is what makes "Styles-proven before adoption" auditable.

**Alternatives considered**:
- A big-bang rollout of many components in one change — rejected: the plan's
  Risks section explicitly warns against big-bang migration and the shift to
  "one component at a time unless they share only infrastructure."

## Open items

- The exact per-component or per-wave iteration-filter flag on the runner is an
  implementation detail (the Phase 1 runner registers a `styles` target with
  capabilities today); whichever flag is chosen must preserve the runtime-
  initialized assertion and target/story/capability failure context required by
  `FR-015`.
- Wave ordering (A → E) remains the default. SegmentedControl is the approved
  narrow exception: its React wrapper now exposes the same user-facing promise,
  so its Wave E shared-contract promotion proceeds before unfinished Waves B–D
  while preserving Styles proof before React adoption in separate pull requests.
- The conformance proofs (break a component's behavior → its contract fails while
  unrelated targets stay green; break a shared helper → every adopting target
  fails) are execution-time proofs and are not committed.

## Decision 7: Reprioritize SegmentedControl as a two-step shared promotion

**Decision**: Promote SegmentedControl from its stale Styles-only ledger entry to
a shared Wave E contract now that `@pathableai/react` exposes the same observable
semantics and keyboard behavior. Land the renderer-neutral helpers and focused
Styles proof first; adopt the unchanged helpers in React only in a later pull
request after the Styles proof is merged.

The initial shared boundary is single-select semantics, wrapped Arrow-key
navigation, disabled-option skipping, vertical navigation, multi-select
semantics, independent keyboard toggling, and static one-option semantics.
Styles-owned visual/layout behavior and React props, callback payloads,
controlled-state mechanics, fallback policy, and attribute forwarding remain
package-specific.

**Rationale**: The downstream-promise promotion condition in `FR-013` is now
satisfied. Keeping proof and adoption separate preserves the auditable
`not-started → styles-proven → adopted` transition despite the approved wave
reprioritization.
