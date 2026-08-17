# Feature Specification: React Accordion Contract Adoption

**Feature Branch**: `042-react-accordion-contract`

**Created**: 2026-08-16

**Status**: Draft

**Input**: User description: "Look at the plan described in
docs/plans/component-testing-infrastructure-refactor.md and use the speckit-specify
tool to create a new feature to represent phase 2."

## Table of Contents

- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## User Scenarios & Testing *(mandatory)*

Phase 2 is the downstream conformance slice of the component-testing
infrastructure refactor. It begins only after Phase 1 is merged and observed
green. Phase 2 adopts the already-shared, Styles-proven Accordion behavior
contract in the React Storybook, isolates native React behavior from the Styles
DOM enhancement runtime, and registers React as a downstream target only after
its isolated native implementation passes. Broader component coverage remains in
Phase 3 and is out of scope here.

### User Story 1 - Proven Styles Contract Adopts in React (Priority: P1)

A contributor can take the unchanged Accordion helpers that the Styles package
already executes and invoke them from React stories, so that the same observable
component behavior is proven against an isolated native React implementation.

**Why this priority**: The Styles-first rule requires a shared behavior to be
proven by Styles before any other package owns it. Adopting the unchanged
helpers into React is the core value of this phase; without an isolated React
registration the downstream conformance path does not exist.

**Independent Test**: Run the React Accordion stories against the unchanged
shared helpers and confirm they pass through the React package's own native
behavior without the Styles enhancement runtime loading for Accordion.

**Acceptance Scenarios**:

1. **Given** the shared Accordion helpers are proven green by Styles, **When**
   the unchanged helpers are invoked from React stories, **Then** they exercise
   the React implementation's own native behavior.
2. **Given** a collapsed React Accordion disclosure, **When** a keyboard user
   activates it with Enter, **Then** the disclosure communicates an expanded
   state, its associated panel is available, and focus remains on the
   disclosure, as verified by the shared helper.
3. **Given** an expanded React Accordion disclosure, **When** a keyboard user
   activates it with Space, **Then** the disclosure communicates a collapsed
   state, its panel becomes unavailable, and focus remains on the disclosure.

---

### User Story 2 - Isolate Native React Behavior (Priority: P1)

A contributor can confirm that the React Accordion is an isolated native
implementation, not a decorated version passed through the Styles DOM
enhancement runtime, so that React conformance proves native behavior rather
than masking a broken implementation.

**Why this priority**: Today the React Storybook preview imports
`@pathableai/styles/js`, which can enhance markup and hide broken native React
behavior. Without an explicit isolation assertion, React conformance is not
trustworthy.

**Independent Test**: A guard fails if both the native React and the Styles
enhancement handler can own the same Accordion interaction, and the React
Storybook does not load the Styles enhancement runtime for Accordion.

**Acceptance Scenarios**:

1. **Given** the React Storybook for Accordion, **When** it renders, **Then** it
   does not load the Styles DOM enhancement runtime for Accordion.
2. **Given** a configuration where both native React and enhancement handlers
   could own the same interaction, **When** the guard evaluates the React path,
   **Then** it fails rather than silently allowing ambiguous ownership.
3. **Given** a broken React toggle implementation, **When** the React contract
   runs, **Then** the React contract fails while the Styles contract remains
   green.

---

### User Story 3 - Keep React-Specific Tests and Fixtures (Priority: P2)

A contributor can rely on deterministic React fixtures matching the shared
initial states while keeping React-specific API behavior (controlled and
uncontrolled state, `onExpandedChange`, disabled props, refs, and server
rendering) in separate React tests.

**Why this priority**: The shared contract intentionally excludes package API
behavior. Preserving React-specific tests keeps that boundary clean and ensures
the shared helpers never absorb framework-only concerns.

**Independent Test**: Determine deterministic React fixtures for the shared
initial states alongside separate React tests for controlled/uncontrolled state,
`onExpandedChange`, disabled props, refs, and server rendering.

**Acceptance Scenarios**:

1. **Given** the shared initial states, **When** React fixtures are authored,
   **Then** they are deterministic and match the shared starting states used by
   the unchanged helpers.
2. **Given** controlled/uncontrolled state, `onExpandedChange`, disabled props,
   refs, or server rendering, **When** they are tested, **Then** they are covered
   by separate React tests rather than the shared contract.
3. **Given** a new fixture or state, **When** it is added to React, **Then** it
   does not leak into the shared, renderer-neutral helpers.

---

### User Story 4 - Register React as a Downstream Target (Priority: P2)

A contributor can register React as a downstream target in aggregate reporting
only after its isolated native implementation passes, so that React conformance
is reported alongside Styles without masking a skipped or unregistered target.

**Why this priority**: Registration must follow proven isolation so the
aggregate never claims React conformance before its native implementation is
trusted.

**Independent Test**: After the isolated React Accordion implementation passes,
add React as a downstream target to aggregate reporting and run the aggregate.

**Acceptance Scenarios**:

1. **Given** React's isolated native implementation passes, **When** React is
   registered as a downstream target, **Then** aggregate reporting includes a
   React-owned result without hiding a skipped or missing target behind a
   single aggregate green status.
2. **Given** the shared helper is broken, **When** both targets run, **Then**
   both the Styles contract and the React contract fail together, demonstrating
   they share the same proof.
3. **Given** a React-only regression is introduced, **When** the aggregate runs,
   **Then** the React target fails while the Styles target remains green,
   isolating the failure to the downstream target.

### Edge Cases

- A React Accordion passes the contract only because the Styles enhancement
  runtime decorated the markup (must fail isolation).
- Both native React and enhancement handlers are present and able to own the
  same interaction (the guard must fail).
- A shared initial state has no matching deterministic React fixture.
- React uses a CSS selector or package internals instead of the accessible
  queries and observable outcomes in the shared helpers.
- A React-specific API behavior is added to the shared contract instead of a
  separate React test.
- React is registered as a downstream target before its isolated native
  implementation passes (forbidden).
- The shared helper is broken but only the React target is checked (both targets
  must fail to prove common ownership).
- A React fixture is nondeterministic or relies on a live network call or
  current date.
- The React Storybook loads the Styles enhancement runtime for only some stories,
  making isolation inconsistent.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The React Storybook MUST NOT load the Styles DOM enhancement
  runtime for the Accordion component.
- **FR-002**: The repository MUST add a guard that fails if both the native
  React implementation and the Styles enhancement handler can own the same
  Accordion interaction.
- **FR-003**: The React implementation MUST provide deterministic fixtures that
  match the shared Accordion initial states used by the unchanged helpers.
- **FR-004**: React stories MUST invoke the unchanged Accordion helpers from the
  shared validation package, without modifying the shared helper code as part of
  this feature.
- **FR-005**: React MUST retain separate tests for controlled and uncontrolled
  state, `onExpandedChange`, disabled props, refs, and server rendering, outside
  the shared contract.
- **FR-006**: React MUST be added as a downstream target to aggregate reporting
  only after its isolated native implementation passes.
- **FR-007**: A deliberately broken React toggle implementation MUST fail the
  React contract while leaving the Styles contract green.
- **FR-008**: A deliberately broken shared helper MUST fail both the Styles
  contract and the React contract, demonstrating the shared ownership of the
  proof.
- **FR-009**: React conformance MUST be trusted only when the React Storybook
  does not rely on the Styles enhancement runtime to produce the passing
  behavior.
- **FR-010**: This feature MUST NOT disable, weaken, skip, or exclude applicable
  lint, accessibility, interaction, build, formatting, or package validation.
- **FR-011**: This feature MUST NOT broaden a shared contract or accessibility
  exception to make the React adoption pass.

### Key Entities

- **Shared Accordion Helper**: The renderer-neutral validator, owned and proven
  by Styles in Phase 1, that React stories invoke unchanged.
- **Native React Implementation**: The isolated Accordion behavior owned by the
  React package, verified without the Styles enhancement runtime.
- **Isolation Guard**: The check that fails when native React and enhancement
  handlers could both own the same interaction.
- **React Accordion Fixture**: A deterministic React story matching a shared
  initial state.
- **React-Specific Test**: A test covering controlled/uncontrolled state,
  `onExpandedChange`, disabled props, refs, or server rendering, outside the
  shared contract.
- **Downstream Target Registration**: The addition of React to aggregate
  reporting after its isolated native implementation passes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The React Accordion stories invoke the unchanged shared helpers and
  pass against the React package's native behavior without the Styles
  enhancement runtime loading for Accordion.
- **SC-002**: A deliberately broken React toggle causes the React contract to
  fail while the Styles contract remains green.
- **SC-003**: A deliberately broken shared helper causes both the Styles contract
  and the React contract to fail together.
- **SC-004**: React is reported as a downstream target in aggregate reporting,
  and each registered target reports a terminal pass/fail result with no skipped,
  missing, or unregistered target concealed by an aggregate green status.
- **SC-005**: React-specific tests for controlled/uncontrolled state,
  `onExpandedChange`, disabled props, refs, and server rendering remain
  separate from the shared contract and continue to pass.
- **SC-006**: All existing required lint, build, Storybook, accessibility, and
  package validation continues to pass with no new broad exceptions.

## Assumptions

- Phase 1 is merged and observed green before this phase begins; this feature
  assumes the shared Accordion helpers and the focus Styles command already
  exist.
- The Styles DOM enhancement runtime is the only shared runtime that could mask
  native React behavior; isolating it is the required precondition for trusting
  React conformance.
- The Accordion shared contract is unchanged in this phase; React adopts it
  rather than modifying it.
- Package-specific API behavior remains in React-specific tests and is outside
  the shared contract.
- Broader component coverage (Phase 3) is strictly out of scope for this
  feature; Accordion is the only component adopted here.
- Automated conformance evidence does not replace manual keyboard, focus, or
  assistive-technology review, which remain separate quality evidence.
- React is registered as a downstream aggregate target only after its isolated
  native implementation passes.