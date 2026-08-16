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

# Run the React Storybook suite (package-specific)
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

`test:storybook-styles` drives `scripts/test-storybook.mjs styles`, which builds
the shared-contract package, the styles package, and the styles Storybook, serves
it, waits for readiness, runs the test-runner in a browser, writes a labeled
evidence file, and cleans up every process it started. `test:storybook` is the
documented aggregate: it runs the styles target through the runner and then the
React Storybook through its package-specific script. A skipped, missing, or
unregistered target is a hard failure, never hidden by a green overall result.

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
        types.ts
        _lib.ts
        verifyEnterExpandsDisclosure.ts
        verifySpaceCollapsesDisclosure.ts
        verifySingleOpenBehavior.ts
        verifyDisclosurePanelAssociation.ts
        verifyPanelAvailability.ts
        verifyFocusRetention.ts
      index.ts
```

Every helper is named for one capability (for example `verifyEnterExpandsDisclosure`),
never one broad "verify accordion" function. Helpers accept an `HTMLElement` (or a
minimal structural harness) plus the `storybook/test` primitives; they never take
framework props, renderer context types, CSS selectors, or package internals.
`apps/storybook` builds this package before building the styles catalog so
`packages/styles` stories can consume it without leaking anything into either
publishable package's npm payload.

Accordion is the only component in the shared package during Phase 1. The
Accordion capability manifest (`src/accordion/manifest.ts`) records the initial
shared contract, the deliberately package-specific behaviors, and the unresolved
shared scope (disabled and multiple-open until the styles package documents the
same promise).

The existing top-level `behavior-contracts/` directory is a Cucumber pilot. It
builds and serves Storybook through custom orchestration and currently registers
only the styles target. The preferred path for component-level parity is to reuse
renderer-neutral Storybook validation helpers directly from each package's
stories (as the Styles Accordion story does now). Gherkin remains appropriate
only when the feature files have a distinct stakeholder-facing role that
justifies the additional translation and execution layer. The pilot is retained
until the shared-helpers validation is proven equivalent, then retired.

## Accessibility exceptions and evidence

Axe exceptions are recorded in
[`scripts/accessibility-exceptions.mjs`](../../scripts/accessibility-exceptions.mjs),
scoped to a target, story, and single rule with a rationale and a tracking
reference — never a catalog-wide disablement. The catalog currently still carries
some broad exclusions; the registry records the narrow conversion target so they
can be ratcheted without broadening failures.

[`scripts/storybook-evidence-report.mjs`](../../scripts/storybook-evidence-report.mjs)
reports three separate measures for the shared Accordion contract: deterministic
state fixtures (story presence), executable behavior-contract adoption (read from
the runner's evidence file), and automated Axe execution. It does not label any
result WCAG certification, and visual smoke and manual keyboard/focus/
assistive-technology review remain separate evidence.

Next: [Adding tests for a component](adding-component-tests.md).
