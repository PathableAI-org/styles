# Contract: Behavior Contract Runner

## Public Commands

| Command | Required result |
| --- | --- |
| `pnpm test:contracts:styles` | Build, serve, and execute every discovered feature against styles |
| `pnpm test:contracts` | Execute every discovered feature against every registered target and fail if any fails |

All commands own their spawned server and browser lifecycle. They return zero
only when build, readiness, preflight, every scenario, and cleanup succeed.

## Target Registration Contract

Each target registration MUST provide:

```text
name
storybookWorkspace
buildCommands[]
staticDirectory
port
fixtures[sharedFixtureName] -> storyId
capabilities[]
```

The runner validates the target name, required capabilities, and fixture
mappings before starting Cucumber. Unknown target names and missing values are
errors.

## Gherkin Vocabulary

Shared step text is intentionally constrained:

- `Given an Accordion with all disclosures collapsed`
- `Given an Accordion with the first disclosure expanded`
- `When the user focuses the first disclosure`
- `When the user focuses the second disclosure`
- `When the user presses Enter`
- `When the user presses Space`
- `Then the first disclosure is expanded|collapsed`
- `Then the second disclosure is expanded|collapsed`
- `Then the first disclosure panel is available|unavailable`
- `Then focus remains on the first|second disclosure`

Step definitions locate disclosures by accessible role and name. They may use
`aria-controls` only to resolve the associated panel. They MUST NOT use PathAble
CSS classes, framework props, test IDs, hooks, or private component state.

## Fixture Resolution

Opening a fixture performs:

1. Read the active target from runner-provided environment.
2. Validate the shared fixture exists in that target's registry.
3. Construct the direct Storybook iframe URL from server URL and story ID.
4. Navigate with a bounded timeout.
5. Confirm the first expected disclosure is present before actions begin.

## Lifecycle Contract

1. Build all target prerequisites.
2. Start a static server for the built Storybook.
3. Poll the server until ready or the 30-second deadline expires.
4. Invoke Cucumber with the selected target and server URL.
5. Launch one browser for the target run.
6. Create and close an isolated browser context per scenario.
7. Close the browser after the scenario set.
8. Terminate the static server on success, failure, SIGINT, or SIGTERM.

## Failure Contract

The run MUST fail and identify the target when:

- a target name is unknown;
- a required capability or fixture is missing;
- a build command fails;
- the catalog does not become reachable;
- a story cannot be opened;
- a disclosure or associated panel cannot be resolved;
- an observable state, visibility, or focus assertion fails;
- Cucumber exits nonzero; or
- owned-process cleanup fails.

No required scenario uses pending, skipped, or undefined steps.

## Package Independence Contract

- The styles target runs with `@pathableai/styles/js` installed by its normal
  Storybook preview.
- Framework targets are not registered or changed by this pilot.
- Targets do not import the Gherkin feature or step definitions.
- The top-level runner imports no component source or styles JavaScript
  implementation module directly.
