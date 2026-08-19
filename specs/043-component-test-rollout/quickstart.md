# Quickstart: Component Test Rollout (Phase 3)

This is the validation/run guide for Phase 3. It proves a component's contract
and Styles proof through the focused Styles command, then drives the rollout
ledger and evidence report. It does not contain implementation bodies; those
belong in the implementation phase.

## Prerequisites

- Node.js `^24 || >=26`, pnpm `11.11.0` (root `engines`).
- Phase 1 and Phase 2 infrastructure present:
  - `packages/storybook-contracts` (Accordion manifest + helpers).
  - `scripts/test-storybook.mjs` (target-aware runner, `styles` + `react`).
  - `scripts/storybook-evidence-report.mjs` and
    `scripts/accessibility-exceptions.mjs`.
- A clean working tree on branch `043-component-test-rollout`.

## Install

```bash
pnpm install
```

## Focused Styles contract (per component or wave)

```bash
# Build the Styles package and the private contract package
pnpm --filter @pathableai/styles build
pnpm --filter @pathable/storybook-contracts build

# Focused Styles Storybook/contract run (no React build)
pnpm test:storybook-styles
```

For a narrow per-component or per-wave iteration (when the runner supports
stable filtering):

```bash
node scripts/test-storybook.mjs styles --filter components-form-controls-combobox
```

**Expected**: the `styles` target serves `apps/storybook/storybook-static`,
runs the component's `play` functions, and reports terminal pass/fail with Axe
clean. A failed component proof must name the target, story, and capability
(`FR-015`) rather than silently skipping.

## Verify the rollout ledger

```bash
node scripts/storybook-evidence-report.mjs
```

**Expected**: the evidence report lists, per ledger component, three separate
measures —

1. deterministic state fixtures (story presence),
2. executable behavior-contract adoption (`styles-proven` / `adopted` per
   capability),
3. automated Axe execution —

plus the accessibility exceptions for each story. No aggregate is labeled WCAG
certification. A ledger entry claiming proof with no green focused run is a
report failure.

## Full aggregate (after coverage grows)

```bash
pnpm test:storybook            # aggregate: styles + react, sequential
```

**Expected**: terminal pass/fail per registered target with no skipped, missing,
or unregistered target hidden behind a single aggregate green status.

## Conformance proofs (execution-time, not committed)

- **Break a component's behavior** (e.g. its toggle/selection): its focused
  Styles contract fails while unrelated targets stay green.
- **Break a shared helper**: every target that adopts that helper fails together
  (proves shared ownership).
- **Framework isolation**: a downstream package must prove it does not load the
  Styles DOM enhancement for the shared component before its `adopted` status is
  recorded.

## Validation gates (run with `CI=true`)

1. Focussed contract-package lint and typecheck.
2. `pnpm --filter @pathableai/styles build`.
3. The focused Styles Storybook/contract command.
4. Styles Storybook build and Axe browser tests.
5. Lifecycle negative-path tests when runner code changes.
6. `pnpm lint`, `pnpm typecheck`, `git diff --check`.
7. `pnpm test:visual` when fixtures or rendered states change.
8. `pnpm test:next-consumer` when publishable package code, exports, or
   dependency boundaries change.
9. React server-compatibility and React Storybook checks only when React is in
   scope for the pull request.
10. Explicit human keyboard/focus review for new interactive scope;
    assistive-technology review where announcement or reading order matters.

CI must report terminal pass/fail for the styles target and any downstream
target changed by the pull request; aggregate green may not hide a skipped,
missing, or unregistered target.

## Reference

- Ledger contract: `./contracts/rollout-ledger.md`
- Helper taxonomy: `./contracts/helper-taxonomy.md`
- Data model: `./data-model.md`
- Design decisions: `./research.md`