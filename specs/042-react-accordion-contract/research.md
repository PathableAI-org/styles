# Research: React Accordion Contract Adoption (Phase 2)

Phase 2 research resolves the design decisions for adopting the Styles-proven
Accordion contract in the React Storybook. It is grounded in the Phase 2 section
of `docs/plans/component-testing-infrastructure-refactor.md` and the realized
Phase 1 infra (`scripts/test-storybook.mjs`, `packages/storybook-contracts`,
and the React Accordion stories already present under
`packages/react/src/stories/components/Communication/Accordion.stories.tsx`).

## Decision 1: Runtime isolation via a guarded preview, not a rewrite

**Decision**: Disable the Styles DOM enhancement for React Accordion stories
and add an isolation guard that fails if both the native React handler and the
enhancement handler could own the same interaction.

**Rationale**: `apps/storybook-react/.storybook/preview.js` currently imports
`@pathableai/styles/js`, which enhances markup and can mask a broken native
React implementation. Adopting the shared contract would prove that decorated
hybrid, not native React behavior, violating Principle XVI (Framework Storybooks
Must Remain Independently Valid). Isolating the runtime and guarding against
dual ownership is the precondition for any trusted React conformance.
Isolation is scoped per-story or via the React Accordion's own decorator rather
than removing the `@pathableai/styles/js` import globally.

**Alternatives considered**:
- Remove `@pathableai/styles/js` from the React preview entirely — rejected:
  it would affect every React story and change unrelated behavior; Phase 2
  scopes isolation to Accordion only.
- Rely on `allowMultiple`/arg parity alone without a guard — rejected: it does
  not prove that the enhancement runtime is absent; the plan explicitly requires
  a guard that fails on ambiguous ownership.

## Decision 2: Reuse the existing target-aware runner for the react target

**Decision**: Register a `react` target in `scripts/test-storybook.mjs` after
the isolated native implementation passes, reusing the same
build → serve → ready → test → report → cleanup lifecycle.

**Rationale**: Phase 1 centralized the lifecycle into one target-aware runner
that registers `styles` first and is structured so a future framework target can
be added without altering the shared Accordion contract. Registering `react`
reuses that runner and keeps CI from duplicating background-server scripts. The
`react` target runs sequentially after `styles`.

**Alternatives considered**:
- A separate React runner script — rejected: it would reintroduce the lifecycle
  duplication Phase 1 eliminated and diverge cleanup/signal behavior.
- Registering `react` before its native implementation is isolated — rejected:
  the plan requires isolation to be proven before downstream registration.

## Decision 3: Delegate shared capabilities to unchanged helpers; keep React API tests separate

**Decision**: React Accordion stories invoke the unchanged shared helpers
(`verifyEnterExpandsDisclosure`, `verifySpaceCollapsesDisclosure`,
`verifySingleOpenBehavior`, `verifyDisclosurePanelAssociation`,
`verifyPanelAvailability`, `verifyFocusRetention`) from
`packages/storybook-contracts`, while controlled/uncontrolled state
(`expandedIds`/`defaultExpandedIds`), `onExpandedChange`, disabled props, refs,
and server rendering remain in separate React tests.

**Rationale**: The shared contract is renderer-neutral and must not absorb
React-only API behavior (plan: "keep framework API tests local"). The existing
React `KeyboardToggle`, `SingleSelectBehavior`, and `DisabledItemBehavior`
stories already assert much of this; delegation replaces duplicated assertions
with the joined proof, and the React-specific stories/tests remain for
framework-only concerns.

**Alternatives considered**:
- Extending the shared contract with `onExpandedChange`, disabled, or ref
  behavior — rejected: the plan explicitly excludes these from the shared
  contract (they remain React-specific).
- Rewriting the shared helpers to match React's DOM — rejected: React must adopt
  the unchanged helpers; the shared helpers are the common proof.

## Decision 4: Adoption remains a separate downstream-adoption change

**Decision**: This feature does not modify the shared contract or the Styles
target; it adds the React consumer and registers the `react` target after its
isolated native implementation passes.

**Rationale**: The Phase 1 gate and the plan's "prefer a separate
downstream-adoption pull request after the Styles reference slice is green"
guardrail mean a framework adapter must not define the contract accidentally.
Keeping React adoption separate and Styles unchanged preserves the Styles-first
ownership rule (Principle I).

**Alternatives considered**:
- Landing React adoption inside the Phase 1 change — rejected: Phase 1 is
  explicitly Styles-only and merged/observed green before Phase 2 begins.
- Changing the shared helpers during React adoption — rejected: the helpers are
  proven by Styles; altering them invalidates the baseline and violates the
  unchanged-adoption rule.

## Open items

- Exact mechanism for scoping isolation per story (per-story decorator vs a
  narrow runtime-guard module) is a Phase 1/implementation-detail choice; either
  satisfies the requirement that the React Storybook not load the Styles
  enhancement runtime for Accordion and that dual ownership fails.
- Expected-conformance verification (break React toggle → React fails, Styles
  stays green; break shared helper → both fail) must not be committed; it is an
  execution-time proof of the joining.

## Verified baseline (Phase 2 implementation)

Recorded when Phase 1 baselines were verified green on 2026-08-16:

- `@pathable/storybook-contracts` `lint` and `typecheck` pass unchanged.
- `pnpm --filter @pathableai/styles build` succeeds; `pnpm test:storybook-styles`
  runs the `styles` target through `scripts/test-storybook.mjs`, serving
  `apps/storybook/storybook-static`, and reports **93 suites / 358 tests passed**
  with Axe clean (`No accessibility violations detected`).
- `scripts/test-storybook.mjs` registers a single `styles` target with six
  capabilities and two Accordion fixtures; no `react` target exists yet.
- `StoryHarness` (in `packages/storybook-contracts/src/accordion/types.ts`)
  exposes `root`, `within`, `userEvent` (`keyboard`, `click`, `tab`), and
  `expect` (`toHaveAttribute`, `toHaveFocus`). Helpers take a `StoryHarness`
  plus a disclosure `string | RegExp` and are all invoked unchanged.
- `apps/storybook-react/.storybook/preview.js` imports `@pathableai/styles/js`,
  confirming the Phase 2 isolation requirement.

## React isolation mechanism (Phase 2 implementation)

Chosen and recorded when Phase 2 was built on 2026-08-17:

- The React Accordion renders only `pathable-accordion` classes (never the
  USWDS `usa-accordion__button[aria-controls]` enhancement selectors), so the
  Styles `/js` DOM enhancement runtime cannot bind to it. This is the native
  ownership guarantee.
- Isolation is enforced per-story via `assertNativeOwned(harness)` in
  `packages/react/src/stories/components/Communication/Accordion.stories.tsx`:
  it fails if a disclosure button has no `aria-expanded` (runtime not mounted)
  or if it matches `usa-accordion__button` (dual owner possible). The global
  `@pathableai/styles/js` preview import is retained because other React
  stories (DatePicker, ComboBox, Header) still rely on it.
- The React Accordion component documents the isolation contract so a future
  contributor cannot add `usa-accordion__*` classes and create ambiguity.
- Rationale: this satisfies both plan obligations — React Storybook does not
  load the enhancement for Accordion (it cannot bind), and ambiguous ownership
  fails the guard — without removing the enhancement globally.

## React conformance run (Phase 2 implementation)

Recorded when the React Accordion conformance stories were executed on
2026-08-17 against the built React Storybook (`apps/storybook-react/`,
`test:storybook-react`):

- The three `Contract*` Accordion stories (`ContractDefault`,
  `ContractInitiallyExpanded`, `ContractSingleOpen`) invoke the unchanged
  shared helpers and PASS against the native React implementation.
- 522 of 545 React Storybook tests pass. The 3 failing suites are
  `datepicker`, `date-range-picker`, and `combobox` — pre-existing Axe
  color-contrast failures in enhancement-runtime FormControl stories, none of
  which changed in this feature. Accordion is isolated and green.
- The deliberate conformance breaks (break React toggle; break shared helper)
  are execution-time proofs per `quickstart.md` and are NOT committed.
  Expected result: breaking the React toggle fails the React contract while
  `pnpm test:storybook-styles` stays green; breaking a shared helper fails both
  targets.

## React-specific scope (Phase 2 implementation)

- The React package has no separate unit-test runner; its established test
  surface is Storybook `play` stories run by `test:storybook-react`. React-only
  API behavior therefore lives in dedicated fixed stories in
  `packages/react/src/stories/components/Communication/Accordion.stories.tsx`
  and stays out of `@pathable/storybook-contracts`:
  - `ControlledExpanded` — controlled `expandedIds`.
  - `UncontrolledExpanded` / `InitiallyExpanded` — uncontrolled
    `defaultExpandedIds`.
  - `ExpandedChangeCallback` — `onExpandedChange` wiring (via `fn()`).
  - `DisabledItemBehavior` — disabled items remain disabled and non-toggling.
  - Server rendering is covered by the repository's
    `check-react-server-compatibility.mjs` gate (React package boundary), which
    is separate from the shared contract.
- `git status` confirms zero edits under `packages/storybook-contracts/`:
  the shared helpers are adopted unchanged (Phase 1 owner).

## Downstream target registration (Phase 2 implementation)

Recorded when the `react` target was registered and executed on 2026-08-17:

- `scripts/test-storybook.mjs` now registers two targets: `styles` (first,
  unchanged) and `react` (after it). The `react` target declares the same six
  shared Accordion capabilities and maps the shared fixtures to
  `components-communication-accordion--contract-default` and
  `--contract-initially-expanded` (the `Contract*` stories tagged
  `behavior-contract`).
- When driven as a target (`STORYBOOK_TARGET=react`), the React test-runner
  config includes only `behavior-contract` tagged stories, so unrelated
  enhancement-runtime FormControl stories with pre-existing Axe exceptions do
  not gate Accordion conformance. The package-specific full run is retained as
  `test:storybook-react:all`.
- `node scripts/test-storybook.mjs` reports `✓ 2/2 Storybook targets passed.`
  with terminal pass/fail per target and no hidden or unregistered target.
- Shared-ownership proof (execution-time, not committed): the `styles` and
  `react` targets both invoke the same six `@pathable/storybook-contracts`
  helpers, so a broken helper fails both targets together, while a React-only
  regression fails only `react`. This mirrors the T014 isolation proof.