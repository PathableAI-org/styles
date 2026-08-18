# Quickstart: React Accordion Contract Adoption (Phase 2)

This is the end-to-end validation guide for adopting the Styles-proven
Accordion contract in the React Storybook. It proves that React runs the
**unchanged** shared helpers against an isolated native implementation and
registers as a downstream target only after isolation. It is a validation/run
guide — implementation details live in `tasks.md` and the implementation phase.

## Prerequisites

- Phase 1 merged and observed green (the shared helpers, the focused
  `test:storybook-styles` command, and the target-aware runner exist).
- Node.js satisfying the root `engines` (`^24 || >=26`) and pnpm 11.
- `pnpm install` completed and `pnpm-lock.yaml` present.
- Nothing already listening on the React static-server port.

## Setup

```bash
pnpm install
```

## Isolate native React behavior

Confirm the React Storybook does not load the Styles DOM enhancement runtime
for Accordion:

```bash
# Inspect the React Accordion story and preview wiring
grep -rn "@pathableai/styles" apps/storybook-react/.storybook/preview.js
```

When the isolation guard and preview wiring land, the React Accordion stories
render and interact through the React package's native behavior, and a
dual-ownership configuration (native React + enhancement handler on the same
interaction) fails the guard.

## Build and run the focused Styles command (unchanged baseline)

```bash
pnpm --filter @pathableai/styles build
pnpm test:storybook-styles
```

Expected: the Styles target (registered first) still passes, proving the shared
contract baseline is green before any React adoption is trusted.

## Run the React target

After isolation, register `react` as a downstream target and run it:

```bash
pnpm test:storybook-react
```

or run both targets sequentially:

```bash
node scripts/test-storybook.mjs styles react
```

Expected: the `react` target drives the same
build → serve → ready → test → report → cleanup lifecycle, exercises the React
Accordion `Contract*` stories that invoke the unchanged shared helpers, and
reports a terminal pass/fail result for the `react` target. It runs strictly
after (and never replaces) `styles`.

When driven as a target, the React test-runner includes only
`behavior-contract`-tagged Accordion stories so unrelated enhancement-runtime
FormControl stories with pre-existing Axe exceptions do not gate conformance.
For the full package-specific run that tests every React story (including those
stories), use:

```bash
pnpm test:storybook-react:all
```

## Run aggregate reporting

```bash
pnpm test:storybook
```

Expected: a documented aggregate covering the `styles` target first plus the
`react` downstream target, with terminal pass/fail per target. A skipped,
missing, or unregistered target is a failure, never hidden by a green overall
result.

## Verify conformance (execution-time proof, not committed)

1. **Break the React toggle implementation** — the React contract fails while
   the Styles contract remains green.
2. **Break the shared helper** — both the Styles contract and the React
   contract fail together, showing they share the same proof.

Run these deliberately and restore the code afterward; they must not be
committed.

## React-specific tests keep their own scope

Controlled/uncontrolled state (`expandedIds`/`defaultExpandedIds`),
`onExpandedChange`, disabled props, refs, and server rendering remain in
separate React tests and are outside the shared contract:

```bash
pnpm --filter @pathableai/react test
```

## References

- Adopted-correct model and capabilities: [data-model.md](./data-model.md)
- Isolation, fixtures, and target registration: [contracts/adoption.md](./contracts/adoption.md)
- Decision rationale: [research.md](./research.md)
- Requirements: [spec.md](./spec.md)