# Feature Specification: Component Test Infrastructure

**Feature Branch**: `041-component-test-infra`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "Look at the plan described in
docs/plans/component-testing-infrastructure-refactor.md and create a new feature
to represent phase 1."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

Phase 1 is an infrastructure-first refactor. Its users are design-system
maintainers and contributors who need one durable path from a shared component
requirement to a reusable, executable validation that is first proven by the
Styles package. Accordion is the only component entering the shared system in
this phase; React adoption and broader component coverage are explicitly
deferred.

### User Story 1 - Define Shared Accordion Behavior Once (Priority: P1)

A maintainer can consolidate the existing competing Accordion evidence (the
Cucumber pilot, the Styles fixtures, the React stories, and the component
documentation) into one recorded capability manifest so that the shared,
observable Accordion contract is owned in a single reviewable place.

**Why this priority**: Recording the contract boundary first is the minimum
useful outcome. It reconciles what currently works and prevents a shared
assertion from disappearing silently before any infrastructure is built, which
protects the existing evidence base.

**Independent Test**: Review the capability manifest alongside the existing
Cucumber Accordion feature and both Accordion stories, and verify that no
currently-supported shared assertion is missing.

**Acceptance Scenarios**:

1. **Given** the existing Gherkin scenarios, Styles fixtures, React stories,
   component documentation, and published Styles JavaScript behavior, **When**
   the Accordion capability manifest is recorded, **Then** Enter expansion,
   Space collapse, single-open behavior, disclosure-to-panel association, panel
   availability, and focus retention are captured as the initial shared
   contract.
2. **Given** controlled/uncontrolled props, callbacks, refs, and server-rendering
   behavior, **When** the shared contract is scoped, **Then** these remain
   package-specific and are explicitly outside the shared contract.
3. **Given** disabled and multiple-open behavior whose Styles promise is not yet
   documented, **When** the manifest is recorded, **Then** these are recorded as
   unresolved shared scope rather than silently claimed.

---

### User Story 2 - Provide One Shared Validation Path (Priority: P1)

A contributor can author a shared component capability once and apply the same
validator against any framework package, with the Styles package as the
required first proof, without coupling each package to the same renderer, DOM
tree, state model, or public API.

**Why this priority**: This is the core of the refactor. Until shared component
capabilities live in one renderer-neutral place and are proven by Styles first,
every package will keep rewriting component behavior independently and no
symmetric downstream conformance path exists.

**Independent Test**: Inspect the private shared validation package and the
Styles Accordion stories, and confirm the shared functions exercise only
accessible roles, user actions, and observable outcomes while a Styles-only
command passes without building or starting the React Storybook.

**Acceptance Scenarios**:

1. **Given** a shared Accordion capability, **When** it is defined for one
   capability at a time, **Then** it is expressed in terms of accessible
   role/name queries and observable semantic outcomes and requires no framework
   APIs, renderer context types, CSS selectors, or package internals.
2. **Given** the Styles package, **When** its catalog consumes the shared
   helpers and the built public Styles behavior, **Then** the focused Styles
   command runs without starting the React Storybook.
3. **Given** a missing or uninitialized runtime fixture, **When** interaction
   begins, **Then** the run fails with useful target, story, and capability
   context instead of silently skipping, and no publishable package adds the
   shared validation to its npm payload.

---

### User Story 3 - Run Consistent Target Lifecycle (Priority: P2)

A contributor or CI can exercise a Storybook target through one predictable
build-serve-ready-test-report-cleanup lifecycle that behaves identically across
commands and CI, with the Styles target registered first.

**Why this priority**: Today the shell script, the Cucumber runner, and the CI
workflow each build, serve, wait, test, and clean up differently. Without one
consistent target-aware runner, lifecycle and cleanup behavior remain duplicated
and flaky, and Styles-first ownership stays undocumented.

**Independent Test**: Exercise the successful, test-failure, unavailable-port,
unavailable-catalog, SIGINT, and SIGTERM paths and confirm no owned browser or
server process remains after any of them.

**Acceptance Scenarios**:

1. **Given** a registered styles target, **When** `test:storybook-styles` and the
   aggregate `test:storybook` run, **Then** the runner drives build, serve,
   readiness, test execution, labeling, and cleanup consistently and unknown
   targets, occupied ports, missing builds, missing stories, or test failures
   are hard failures.
2. **Given** a target lifecycle completes or is interrupted, **When** cleanup
   runs, **Then** every browser and server the runner started is stopped.
3. **Given** aggregation runs, **When** the aggregate completes, **Then** its
   documented contract clearly describes that it is the styles target plus
   package-specific targets and it does not hide a skipped, missing, or
   unregistered target.

---

### User Story 4 - Report Evidence Without Overstating It (Priority: P2)

A contributor can read one report that measures deterministic state fixtures,
executable behavior-contract adoption, and automated accessibility execution
separately, so that story presence, capability coverage, and accessibility
checks are not conflated.

**Why this priority**: The current reporting proves story IDs exist, not that
capabilities are covered, and the Styles catalog disables several Axe rules
catalog-wide. Distinguishing these measures is what lets the refactor tighten
accessibility policy honestly instead of broadening failures to pass.

**Independent Test**: Read the Accordion report and confirm it names the Styles
story, each covered capability, its Axe execution, and any exception, while
treating a story ID as distinct from behavior coverage and never labeling an
automated aggregate as WCAG certification.

**Acceptance Scenarios**:

1. **Given** an accessibility exception, **When** it is recorded, **Then** it is
   scoped to the narrowest story and rule with rationale and a tracking
   reference rather than a catalog-wide exclusion.
2. **Given** the report measures coverage, **When** it is produced, **Then**
   deterministic state fixtures, executable behavior-contract adoption, and
   automated accessibility execution are reported as three separate measures.
3. **Given** visual smoke and manual keyboard or assistive-technology review,
   **When** evidence is reported, **Then** they remain separate evidence and are
   never labeled as automated WCAG certification.

---

### User Story 5 - Retire the Pilot Only After Equivalence (Priority: P3)

A maintainer can remove the duplicate top-level Accordion pilot only after the
new Styles validation produces equivalent evidence, keeping the Cucumber pilot
green and independently runnable in the meantime.

**Why this priority**: The pilot currently owns the only executable Accordion
contract. It must remain the safety net until equivalence is proven, so the
refactor can migrate one component at a time without ever weakening existing
assertions.

**Independent Test**: Compare the new Styles `play` results with every existing
Cucumber scenario and confirm equivalence before the pilot's feature, steps,
custom runner, Cucumber dependency, and duplicate CI job are removed, and
confirm no other feature depends on them.

**Acceptance Scenarios**:

1. **Given** the new Styles validation produces equivalent Accordion evidence,
   **When** equivalence review passes, **Then** the duplicate pilot runner,
   steps, dependency, and CI job are removed and `docs/testing/` is updated to
   match the implemented system.
2. **Given** equivalence is not yet accepted, **When** the refactor proceeds,
   **Then** the pilot command remains green and independently runnable and its
   assertions are not weakened.
3. **Given** the new path proves unstable, **When** it is not yet adopted,
   **Then** its CI requirement can be removed while the pilot continues to run
   and the new runner is fixed rather than passing on weakened assertions.

### Edge Cases

- A second component is introduced into the shared system during this phase
  (outside scope; must be rejected to protect the initial slice).
- A shared helper is used by a framework package before the Styles-focused
  command and CI result are green (forbidden; Styles must be the first and only
  owner of each shared behavior in this phase).
- A required fixture or capability is missing from the Styles catalog but the
  run reports success (must fail clearly instead of silently skipping).
- A shared behavior is validated through CSS selectors or package internals
  rather than accessible queries and observable outcomes.
- The shared validation package leaks into a publishable package's npm payload.
- React loads the Styles enhancement runtime during this phase (out of scope,
  but must not be made to accidentally pass the Styles contract).
- Two targets run concurrently and collide on static-output directories or
  ports.
- An accessibility exception broadens beyond the narrowest justified rule scope
  to make the refactor pass.
- The report presents a story ID, a capability, or an automated Axe run as
  proof of coverage it does not actually provide.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The repository MUST record an Accordion capability manifest that
  names the initial shared contract: Enter expansion, Space collapse,
  single-open behavior, disclosure-to-panel association, panel availability,
  and focus retention.
- **FR-002**: The manifest MUST record controlled/uncontrolled props, callbacks,
  refs, and server-rendering behavior as package-specific and outside the shared
  contract, and MUST record disabled and multiple-open behavior as unresolved
  shared scope until the Styles package documents the same promise.
- **FR-003**: The repository MUST contain a private, renderer-neutral shared
  validation package with explicit exports, linting, formatting, and type
  checking whose dependencies are limited to the accessible-query, user-action,
  and assertion primitives it needs.
- **FR-004**: Shared validations MUST be exported as small functions named for a
  single capability (for example, one for Enter expansion rather than one broad
  Accordion test).
- **FR-005**: Shared validations MUST accept an `HTMLElement` or a small
  structural interface and MUST NOT accept React props, Storybook renderer
  context types, CSS selectors, or package internals.
- **FR-006**: The Styles Accordion catalog MUST include deterministic, named
  fixtures for each shared starting state and MUST call the shared helpers while
  importing the built public Styles behavior.
- **FR-007**: The Styles interaction run MUST assert that the runtime has
  initialized before interaction and MUST fail with target, story, and
  capability context rather than skipping.
- **FR-008**: Contributors MUST have a focused Styles Storybook/test command and
  MUST be able to run the Styles path without building or starting the React
  Storybook.
- **FR-009**: The repository MUST consolidate build, serve, readiness, test
  execution, labeled results, and cleanup behind one target-aware runner that
  registers the styles target first and treats unknown targets, occupied ports,
  missing builds, missing stories, or test failures as hard failures.
- **FR-010**: The runner MUST execute targets sequentially in this phase and
  MUST stop every browser and server it starts on success, failure, or
  interruption.
- **FR-011**: The shared command names MUST follow the documented layout: a
  focused `test:storybook-styles` command, a package-specific
  `test:storybook-react` command, and a clearly documented aggregate
  `test:storybook` command, and the runner MUST be reused by CI rather than
  duplicating background-server scripts in workflow YAML.
- **FR-012**: Accessibility exceptions MUST be held in a shared, reviewable
  registry with target, story, rule, rationale, and a tracking reference, and
  MUST be scoped to the narrowest known story-level exception.
- **FR-013**: Reporting MUST separate deterministic state fixtures, executable
  behavior-contract adoption, and automated accessibility execution, and visual
  smoke and manual review MUST remain separate evidence that is never labeled
  automated WCAG certification.
- **FR-014**: The new Styles Accordion validation MUST be compared against all
  existing Cucumber Accordion scenarios, and the pilot's feature, steps, custom
  runner, Cucumber dependency, and duplicate CI job MUST be removed only after
  that equivalence review passes and no other feature uses them.
- **FR-015**: Until equivalence is accepted, the pilot command MUST remain green
  and independently runnable, and if the new path is unstable its CI requirement
  may be removed while fixing the new runner rather than weakening existing
  assertions.
- **FR-016**: `docs/testing/` MUST be updated so commands, paths, failure
  behavior, and the Styles-first rule match the implemented system, and an
  architecture record MUST explain why direct Storybook helpers are the default
  and when Gherkin would still be justified.
- **FR-017**: The shared validation package MUST NOT add files to either
  publishable package's npm payload.
- **FR-018**: No second component MAY enter the shared system during this phase.
- **FR-019**: This feature MUST NOT disable, weaken, skip, or exclude applicable
  lint, accessibility, interaction, build, formatting, or package validation.

### Key Entities

- **Accordion Capability Manifest**: The recorded, reviewable statement of the
  shared, renderer-neutral Accordion observable contract and its evidence
  boundary, including what is deliberately excluded from shared scope.
- **Shared Capability / Validator**: A privately packaged, renderer-neutral
  function that exercises one observable Accordion behavior through accessible
  queries and asserts a semantic outcome.
- **Storybook Target**: A registered framework package (starting with Styles)
  that renders deterministic fixtures and calls shared validators within its own
  Storybook context.
- **Target-Aware Runner**: The single orchestrator that builds, serves, checks
  readiness, executes tests, labels results, and cleans up per registered target.
- **Accessibility Exception Registry**: The shared, reviewable record of narrow
  story- and rule-scoped Axe exceptions with rationale and tracking.
- **Evidence Report**: The per-feature output that measures fixtures,
  executable contract adoption, and automated accessibility execution
  separately from visual and manual evidence.
- **Accordion Pilot**: The existing top-level Cucumber contract that remains as
  the equivalence baseline until the new Styles validation proves equivalent.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Exactly one recorded Accordion capability manifest names the six
  initial shared capabilities (Enter expansion, Space collapse, single-open,
  disclosure-to-panel association, panel availability, focus retention) and
  their evidence boundary.
- **SC-002**: The private shared validation package is importable by the HTML
  Storybook and the focused Styles command passes from a clean checkout without
  adding any file to a publishable package's npm payload.
- **SC-003**: The focused Styles command runs successfully without building or
  starting the React Storybook, and CI reports a Styles-owned result for the
  Accordion helpers.
- **SC-004**: The target-aware runner produces terminal pass/fail results for
  the Styles target across success, test-failure, unavailable-port,
  unavailable-catalog, SIGINT, and SIGTERM paths and leaves zero owned browser
  or server processes after each.
- **SC-005**: The Accordion report names its Styles story, each covered
  capability, its Axe execution, and any exception, separating fixture,
  contract-adoption, and accessibility measures.
- **SC-006**: The existing Cucumber Accordion pilot remains green and
  independently runnable until the new Styles validation is proven equivalent,
  after which the pilot's duplicate runner, steps, dependency, and CI job are
  removed.
- **SC-007**: All existing required lint, build, Storybook, accessibility, and
  package validation continues to pass with no broadened or new broad
  exceptions.

## Assumptions

- The Styles package owns the shared visual, semantic, and framework-neutral
  behavior definition, and a new behavior must reach Styles before any framework
  package adopts it.
- Accordion is the only component in the initial slice; React adoption (Phase 2)
  and broader component coverage (Phase 3) are strictly out of scope for this
  feature.
- The existing Cucumber Accordion pilot remains the equivalence baseline and is
  retired only after the new Styles validation proves equivalent evidence.
- Deterministic component stories remain the rendering boundary for
  browser-executed component validation.
- Package-specific API behavior (props, callbacks, refs, server rendering)
  remains in package-specific tests and is outside the shared contract.
- Automated conformance evidence does not replace manual keyboard, focus, or
  assistive-technology review, which remain separate quality evidence.
- No automated aggregate is to be presented as WCAG certification or application
  end-to-end coverage.
- Phase 1 targets run sequentially to avoid static-output and port collisions;
  parallelization is deferred until target output directories are isolated.