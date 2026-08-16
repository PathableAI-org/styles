# Runner Contract: Component Test Infrastructure (Phase 1)

This document contracts the target-aware Storybook runner, its CLI, target
registration, lifecycle, failure semantics, and cleanup. It replaces the
duplicated lifecycle logic currently spread across `scripts/test-storybook.sh`,
`behavior-contracts/run.mjs`, and CI YAML.

## Purpose

One component-neutral runner owns, per registered target:

`build → serve → ready → test → report → cleanup`

It registers `styles` first. Target selection is explicit. Unknown targets,
occupied ports, missing build output, missing stories, and test failures are
**hard failures** — never silently skipped.

## CLI

| Command | Behavior |
| ------- | -------- |
| `pnpm test:storybook-styles` | Runs the `styles` target only, without building or starting the React Storybook. |
| `pnpm test:storybook-react`  | Retains package-specific React testing (Phase 2 may re-express this through the runner). |
| `pnpm test:storybook`        | Documented aggregate: the `styles` target plus package-specific targets; must not hide a skipped/missing/unregistered target. |

Internal form: `node scripts/test-storybook.mjs [target...]`. With no
arguments, all registered targets run sequentially.

## Target Registration

Targets are declared in one registry (e.g. inside the runner or a
`scripts/targets.mjs` module) with:

- `name` — e.g. `styles`.
- `workspace` — the Storybook workspace, e.g. `@pathable/storybook`.
- `buildCommands` — ordered prerequisite builds.
- `staticDirectory` — built output to serve.
- `port` — dedicated static-server port.
- `capabilities` — shared capabilities this target claims.
- `fixtures` — shared fixture name → target story id.

A registered target must claim every required shared capability and provide
every shared fixture; a violation is a preflight failure with a
target-labelled message.

## Lifecycle

### Build

Run the target's `buildCommands` in order (e.g.
`pnpm --filter @pathableai/styles build` then
`pnpm --filter @pathable/storybook build-storybook`). A non-zero exit or
spawn error aborts the target.

### Serve

Start a static server rooted at `staticDirectory` bound to `127.0.0.1:<port>`.
Detect a pre-existing listener on the port as a hard failure (the runner never
adopts a foreign server).

### Ready

Probe the served URL with a bounded period (30s). If the catalog does not
become ready in time or the server exits early, fail with the target name and
URL.

### Test

Execute the runner against direct `/iframe.html` story URLs, so test-runner
interaction is decoupled from manager UI and composed-catalog behavior. The
focused Styles command exercises the Accordion stories that call the shared
helpers; the test-runner also runs Axe as a separate mandatory step.

### Report

Emit labeled results: one result per target and capability/fixture,
plus the three separate evidence measures (deterministic fixtures, executable
contract adoption, automated Axe). Terminal pass/fail for the styles target is
required in both local runs and CI.

### Cleanup

Stop every browser and server the runner started on success, failure, or
signal. Handle `SIGINT` and `SIGTERM`. Confirm no owned process remains; a
process that will not stop is itself an error.

## Failure Semantics

| Condition                                | Behavior                             |
| ---------------------------------------- | ------------------------------------ |
| Unknown target name                      | Hard failure naming known targets.   |
| Occupied `port`                          | Hard failure; stop/reject foreign server. |
| Missing `staticDirectory` build output   | Hard failure naming the target.      |
| Missing required story/fixture           | Hard failure naming target + fixture.|
| Capability assertion fails               | Hard failure naming target + capability + story. |
| Runner lifecycle interrupted (SIGINT/SIGTERM) | Cleanup all owned processes, then exit with the signal's expected code. |

## Concurrency

Targets run sequentially in this phase to avoid static-output and port
collisions. Parallel execution is deferred until target output directories are
isolated.

## Accessibility Exceptions

Do not disable Axe rules catalog-wide. Any exception lives in a shared,
reviewable registry scoped to the narrowest target, story, and rule with a
rationale and tracking reference. Converting a broad exclusion is a separate,
deliberate change; the runner never broadens an exception merely to make a run
pass.

## Evidence Boundaries

The runner results and the evidence report never conflate:

- story presence (a fixture exists),
- capability coverage (a behavior is executed and proven), or
- automated Axe execution (a rule ran).

No result, aggregate, or report is labeled WCAG certification, and visual smoke
and manual keyboard/assistive-technology review remain separate evidence.