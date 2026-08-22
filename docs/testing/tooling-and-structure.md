# Tooling and structure

Storybook is the primary component workbench and executable specification in
this repository. It supplies deterministic fixtures, documentation, interaction
tests, and accessibility checks for both the styles and React packages.

## Current Storybooks

| Implementation      | Story source                   | Storybook application   |
| ------------------- | ------------------------------ | ----------------------- |
| Styles and raw HTML | `packages/styles/src/stories/` | `apps/storybook/`       |
| React               | `packages/react/src/stories/`  | `apps/storybook-react/` |

React story conventions are defined in
[`packages/react/STORYBOOK_STANDARD.md`](../../packages/react/STORYBOOK_STANDARD.md).
The repository-level `AGENTS.md` also contains the required story checklist.

## Interaction-test tools

Stories import `within`, `userEvent`, `expect`, and related utilities from
`storybook/test`.

- `within(canvasElement)` scopes queries to the story.
- `getByRole`, `getByLabelText`, and `getByText` locate user-facing semantics.
- `userEvent` performs realistic keyboard and pointer interactions.
- `expect` asserts observable state.
- `step` gives an interaction a readable name in Storybook reports and the
  Interactions panel.

## Automated accessibility checks

Both Storybook applications run Axe through their test-runner configuration.
Stable stories are checked for detectable accessibility violations. Exceptions
must be narrow and documented; an exception does not make the underlying issue
conformant.

Accessibility scanning complements rather than replaces keyboard, focus, and
assistive-technology review.

## Commands

```bash
# Run the Styles Storybook suite (target-aware runner, styles first)
pnpm test:storybook-styles

# Run both Storybook suites (documented aggregate)
pnpm test:storybook

# Run the React Storybook suite (target-aware runner)
pnpm test:storybook-react

# Build the styles Storybook
pnpm build:docs

# Build the React Storybook
pnpm build:docs-react

# Run the default repository test suite
pnpm test

# Run visual smoke tests
pnpm test:visual
```

`test:storybook-styles` and `test:storybook-react` drive the corresponding
targets in `scripts/test-storybook.mjs`. The runner builds each target, serves it
with an in-process HTTP server, waits for readiness, runs the test-runner in a
browser, writes labeled evidence, and awaits server cleanup before exiting.
`test:storybook` runs both registered targets sequentially. A skipped, missing,
or unregistered target is a hard failure, never hidden by a green overall
result.

The current Storybook test command builds each catalog, serves it locally, and
runs its stories in a browser. CI runs equivalent build, browser-test,
accessibility, and visual-smoke steps, although workflow wiring may call package
scripts directly.

## Shared validation structure

Shared renderer-neutral behavior helpers live in
[`packages/storybook-contracts/`](../../packages/storybook-contracts/), a private,
framework-neutral workspace module rather than under either implementation
package:

```text
packages/
  storybook-contracts/
    src/
      accordion/
        manifest.ts
        _lib.ts
        verify*.ts
      segmented-control/
        manifest.ts
        types.ts
        _lib.ts
        verify*.ts
      rollout/
        rollout.ts
        types.ts
      types.ts
      index.ts
```

Every helper is named for one capability (for example `verifyEnterExpandsDisclosure`),
never one broad "verify accordion" function. Helpers accept an `HTMLElement` (or a
minimal structural harness) plus the `storybook/test` primitives; they never take
framework props, renderer context types, CSS selectors, or package internals.
`apps/storybook` builds this package before building the styles catalog so
`packages/styles` stories can consume it without leaking anything into either
publishable package's npm payload.

Component-specific manifests record shared capabilities, deliberately
package-specific behavior, unresolved scope, and bounded fixtures. Accordion is
the Phase 1 seed. SegmentedControl is the first component promoted through the
Phase 3 rollout ledger after a downstream React package exposed the same
user-facing promise. Its Styles reference behavior is story-owned because the
Styles package publishes the visual contract rather than SegmentedControl
runtime JavaScript.

`src/rollout/rollout.ts` records each component's risk wave, Styles proof status,
capabilities, fixtures, and downstream adoption. A shared entry must reach
`styles-proven` before another package can adopt its unchanged helpers.

The former top-level `behavior-contracts/` Cucumber pilot was retired: the
shared renderer-neutral helpers, proven Styles-first by
`test:storybook-styles`, now provide equivalent Accordion coverage directly
from each package's stories. Gherkin remains appropriate only when feature
files have a distinct stakeholder-facing role that justifies the additional
translation and execution layer; component-level parity uses the helpers.

## Accessibility exceptions and evidence

Axe exceptions are recorded in
[`scripts/accessibility-exceptions.mjs`](../../scripts/accessibility-exceptions.mjs),
scoped to a target, story, and single rule with a rationale and a tracking
reference — never a catalog-wide disablement. The catalog currently still carries
some broad exclusions; the registry records the narrow conversion target so they
can be ratcheted without broadening failures.

[`scripts/storybook-evidence-report.mjs`](../../scripts/storybook-evidence-report.mjs)
reports three separate measures for shared contracts: deterministic state
fixtures (story presence), executable behavior-contract adoption (read from the
runner's evidence file), and automated Axe execution. It does not label any
result WCAG certification, and visual smoke and manual keyboard/focus/
assistive-technology review remain separate evidence.

Next: [Adding tests for a component](adding-component-tests.md).
