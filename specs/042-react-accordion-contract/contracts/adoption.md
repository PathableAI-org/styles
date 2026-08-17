# Adoption Contract: React Accordion Contract Adoption (Phase 2)

This document contracts how the React Storybook adopts the unchanged
Accordion contract after Styles, isolates native React behavior from the Styles
DOM enhancement runtime, and registers React as a downstream target.

## Purpose

Phase 2 reuses the Phase 1 Styles-first path for React, proving the same
shared Accordion observable behavior against an isolated native React
implementation. The shared contract is **unchanged**; React adopts it.

## Isolation

`apps/storybook-react/.storybook/preview.js` currently imports
`@pathableai/styles/js`, which can enhance markup. For Accordion:

- The React Storybook MUST NOT load the Styles DOM enhancement runtime for the
  Accordion component, so the React contract proves the React package's own
  native behavior.
- An isolation guard MUST fail when both the native React handler and the
  enhancement handler could own the same Accordion interaction, rather than
  silently allowing ambiguous ownership.
- React conformance is trusted only while the React Storybook does not rely on
  the enhancement runtime to produce the passing behavior.

## React Fixtures and Delegation

- The React catalog provides deterministic fixtures matching the shared initial
  states used by the unchanged helpers: a collapsed `Default` and an initially
  expanded `InitiallyExpanded`, plus any fixed stories needed by the shared
  capabilities.
- React stories invoke the **unchanged** shared helpers:
  `verifyEnterExpandsDisclosure`, `verifySpaceCollapsesDisclosure`,
  `verifySingleOpenBehavior`, `verifyDisclosurePanelAssociation`,
  `verifyPanelAvailability`, and `verifyFocusRetention`.
- Generated IDs may vary; disclosure-to-panel relationships must resolve
  correctly via accessible queries (`getByRole`, `getByLabelText`, `getByText`).

## React-Specific Tests (out of shared contract)

The following stay in separate React tests and are intentionally excluded from
the shared contract:

- controlled state (`expandedIds`) and uncontrolled state (`defaultExpandedIds`)
- `onExpandedChange`
- disabled props (`disabled` items)
- refs
- server rendering

## Downstream Target Registration

- Register a `react` target in `scripts/test-storybook.mjs` **only after** its
  isolated native implementation passes.
- The `react` target reuses the Phase 1 target-aware lifecycle
  (`build → serve → ready → test → report → cleanup`), runs strictly after
  `styles`, and reports a terminal pass/fail result.
- Aggregate reporting includes a React-owned result and never hides a skipped,
  missing, or unregistered target behind an aggregate green status.
- Unknown targets, occupied ports, missing builds/stories, and test failures
  remain hard failures.

## Verification

Execution-time proof (not committed):

1. Deliberately break the React toggle implementation — the React contract
   fails while the Styles contract remains green.
2. Deliberately break the shared helper — both the Styles contract and the
   React contract fail together, proving they share the same proof.