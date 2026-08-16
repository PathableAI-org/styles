# Quickstart: Component Test Infrastructure (Phase 1)

This is the end-to-end validation guide for the Phase 1 component-testing
infrastructure. It proves that a shared Accordion capability is authored once,
proven by `packages/styles` first, and reported without overstating evidence.
It is a validation/run guide — implementation details live in `tasks.md` and the
implementation phase.

## Prerequisites

- Node.js satisfying the root `engines` (`^24 || >=26`) and pnpm 11.
- `pnpm install` completed and `pnpm-lock.yaml` present.
- Nothing already listening on the Styles static-server port.

## Setup

```bash
pnpm install
```

## Validate the shared contract package in isolation

```bash
pnpm --filter @pathable/storybook-contracts lint
pnpm --filter @pathable/storybook-contracts typecheck
```

The private `storybook-contracts` package has explicit exports and must not add
any file to either publishable package's payload. When its dependency or export
boundary changes, confirm no leak with a packed-artifact check
(`pnpm pack --dry-run` or equivalent) on `@pathableai/styles` and
`@pathableai/react`.

## Build Styles and run the focused Styles command

```bash
pnpm --filter @pathableai/styles build
pnpm test:storybook-styles
```

Expected: the target-aware runner builds the Styles Storybook, serves it, waits
for readiness, exercises the Accordion stories that call the shared helpers,
runs Axe as a separate step, reports labeled results for the `styles` target,
and cleans up every process it started. This must run **without** building or
starting the React Storybook.

The Accordion capability manifest (`packages/storybook-contracts/src/accordion/manifest.ts`)
names the initial shared contract: Enter expansion, Space collapse, single-open,
disclosure-to-panel association, panel availability, and focus retention.

## Inspect the evidence report

```bash
node scripts/storybook-evidence-report.mjs
```

Expected: three separate measures — deterministic fixtures, executable
contract adoption, and automated Axe execution — with the Accordion story, each
covered capability, and any access to a reviewable exception registry. No
aggregate is labeled WCAG certification, and visual smoke and manual
keyboard/focus/assistive-technology review remain separate.

## Exercise the runner's failure paths

Each of these must terminate with a nonzero exit and leave zero owned browser
or server processes:

- test failure (introduce a deliberate assertion break),
- unavailable port,
- unavailable catalog/build output,
- `SIGINT` and `SIGTERM` mid-run.

```bash
# Sanity: signal handling while a run is in progress
node scripts/test-storybook.mjs styles &
kill -INT %1
```

## Aggregate validation

```bash
pnpm test:storybook
```

Expected: a documented aggregate covering the `styles` target plus
package-specific targets, with terminal pass/fail per target. A skipped,
missing, or unregistered target is a failure, never hidden by a green overall
result.

## Retire the pilot only after equivalence

Keep the existing pilot independently runnable until equivalence is proven:

```bash
pnpm test:contracts:styles
```

After the new Styles `play` results are shown equivalent to all three existing
Gherkin scenarios, the pilot's feature, steps, custom runner, `@cucumber/cucumber`
dependency, and duplicate CI job are removed in the same or a follow-up cleanup.

## References

- Shared model and capabilities: [data-model.md](./data-model.md)
- Runner lifecycle, CLI, and failure semantics: [contracts/runner.md](./contracts/runner.md)
- Decision rationale: [research.md](./research.md)
- Requirements: [spec.md](./spec.md)