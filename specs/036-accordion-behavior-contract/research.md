# Research: Accordion Behavior Contract Pilot

## Executable Specification Runner

**Decision**: Use the official `@cucumber/cucumber` JavaScript package and keep
the Gherkin feature plus step definitions in a top-level
`behavior-contracts/` directory.

**Rationale**: Cucumber directly consumes `.feature` files and resolves each
step through registered JavaScript definitions. The feature remains readable
and framework-neutral while the executable glue can use the repository's
existing browser tooling.

**Alternatives considered**:

- Generate Storybook `play` functions from Gherkin. Rejected because committed
  or runtime-generated duplicates add drift and obscure the canonical source.
- Keep duplicated `play` assertions in each package. Rejected because this is
  the current drift risk the feature is intended to remove.
- Build a custom Gherkin parser. Rejected because the official maintained
  runner already supplies parsing, tags, scenario lifecycle, reporting, and
  failure semantics.

## Browser and Rendering Boundary

**Decision**: Use Playwright from shared Cucumber steps against direct
Storybook iframe URLs.

**Rationale**: Storybook already supplies deterministic package-specific
rendering, while Playwright provides real browser keyboard, focus, visibility,
and ARIA inspection. Direct iframe URLs remove manager UI and composed-catalog
dependencies from conformance.

**Alternatives considered**:

- Mount framework components directly inside Cucumber. Rejected because it
  requires framework-specific loaders and duplicates Storybook rendering
  configuration.
- Use only Storybook's test runner. Rejected because its `play` functions are
  owned by individual stories rather than one cross-target scenario source.

## Target Registration

**Decision**: Maintain one top-level target registry with target name,
Storybook package, build prerequisites, static directory, port, required
capabilities, and fixture-to-story mappings.

**Rationale**: Gherkin remains unaware of package names and story identifiers.
A future target can register equivalent fixtures without changing shared
scenarios or steps. Missing target data becomes a preflight failure.

**Alternatives considered**:

- Require identical story IDs across packages. Rejected because title and
  framework conventions may evolve independently.
- Put adapters inside each package. Rejected for the pilot because it disperses
  the shared conformance configuration the user requested at repository root.

## Behavior Independence

**Decision**: Keep the styles Storybook's `@pathableai/styles/js` import and
remove that global import from the React Storybook.

**Rationale**: The styles bundle installs delegated Accordion behavior on the
document and therefore supports stories rendered after initialization. React
already owns Accordion state and click handling. Loading both behaviors into
the React catalog makes independence unprovable and risks competing DOM/state
updates.

**Alternatives considered**:

- Leave the bundle globally loaded in React. Rejected because passing behavior
  could be supplied or affected by the reference implementation.
- Add a test-only environment flag. Rejected because the normal React
  Storybook should itself demonstrate framework-native ownership.

## Scenario Scope

**Decision**: Begin with three scenarios: Enter expands, Space collapses, and
opening a second item closes the first.

**Rationale**: These behaviors exist in the styles JavaScript and React default
contract, cover the essential disclosure state machine, and exercise separate
collapsed and expanded fixtures. Panel association, visibility, focus
retention, and ARIA state are asserted inside these scenarios.

**Alternatives considered**:

- Include disabled items. Deferred because disabled behavior currently exists
  as a React API but is not an explicit styles JavaScript capability.
- Include multiple-open behavior. Deferred because target configuration and
  public ownership should be resolved deliberately rather than inferred into
  this minimal pilot.

## Process Lifecycle

**Decision**: A Node launcher builds and serves one target at a time, waits for
readiness, invokes Cucumber with explicit target environment, and always stops
the spawned server. Aggregate validation runs targets sequentially.

**Rationale**: Sequential targets reduce port and resource contention, produce
clear target-labelled output, and make cleanup ownership explicit. Signal and
failure handlers prevent leaked servers.

**Alternatives considered**:

- Require contributors to start Storybooks manually. Rejected because the
  aggregate command and CI would be nondeterministic and burdensome.
- Start both Storybooks concurrently. Rejected for the pilot because it adds
  lifecycle complexity without improving contract coverage.

## Dependency Selection

**Decision**: Add `@cucumber/cucumber` 13.2 as a root development dependency
and reuse Playwright 1.61 and `serve` 14 already present at root.

**Rationale**: Cucumber 13.2 is the current official JavaScript runner at
planning time and supports maintained Node versions. Reusing existing browser
and static-server dependencies avoids additional overlapping tools.

**Alternatives considered**: Pinning an older Cucumber major was rejected
because no compatibility constraint in this repository requires it.

## Clarifications

All technical unknowns are resolved. No `NEEDS CLARIFICATION` markers remain.
