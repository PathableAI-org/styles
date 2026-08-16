# Research: Component Test Infrastructure (Phase 1)

This research resolves the technical unknowns for Phase 1 of the component
testing infrastructure refactor. It is infrastructure-first: Accordion is the
only component entering the shared system, and `packages/styles` is the only
registered target.

## Renderer-Neutral Shared Validation Location

**Decision**: Introduce a private, renderer-neutral `packages/storybook-contracts`
workspace package that exports small single-capability helpers
(e.g. `verifyEnterExpandsDisclosure`), each accepting an `HTMLElement` or a
small structural interface.

**Rationale**: A private workspace package is importable by the HTML Storybook
through pnpm workspace resolution while never being added to either
publishable package's `files`/`exports` payload. It matches the plan's proposed
`packages/storybook-contracts/` path and the existing pnpm `packages/*`
workspace glob. Keeping helpers renderer-neutral (no React props, no Storybook
renderer types, no CSS selectors, no package internals) means the same function
can later be reused unchanged by `packages/react` in Phase 2.

**Alternatives considered**:

- Reuse the existing top-level `behavior-contracts/` Cucumber pilot as the
  shared location. Rejected because the refactor explicitly demotes Gherkin
  from the default component-test authoring layer and wants a Storybook-native
  path.
- Add helpers directly into `packages/styles`. Rejected because it would couple
  a renderer-neutral validator to a publishable package's public surface and
  payload.
- A repository-root helper directory. Rejected because `packages/` gives pnpm
  workspace dependency semantics that a framework package can adopt later.

## Authoring Layer: Storybook `play` + Helpers Over Gherkin

**Decision**: Make direct Storybook `play` functions that call the shared
helpers the default component-test authoring layer; retain Gherkin only for the
existing pilot until equivalence review.

**Rationale**: Storybook already supplies deterministic package-specific
rendering, and `@storybook/test` / the test-runner give accessible queries
(`getByRole`, `getByLabelText`, `getByText`), keyboard actions, focus, ARIA
state, and observable-assertion primitives. A shared helper exercises one
capability, so a downstream package can adopt the unchanged function without
coupling to a second framework (Cucumber). This directly implements the plan's
`packages/storybook-contracts (private, renderer-neutral helpers)` node.

**Alternatives considered**:

- Keep Gherkin/Cucumber as the default. Rejected because Gherkin adds a second
  authoring and stepping layer for renderer-neutral actions that Storybook's
  test-runner already expresses, and the plan states Gherkin is not the default
  after this refactor.
- Generate `play` functions from the manifest. Rejected because committed or
  runtime-generated duplicates add drift and obscure the canonical source.

## Target-Aware Runner

**Decision**: Replace the duplicated `scripts/test-storybook.sh`,
`behavior-contracts/run.mjs`, and CI shell lifecycle with one target-aware
`scripts/test-storybook.mjs` runner owning target metadata, prerequisite
builds, direct `/iframe.html` story URLs, a static server, bounded readiness,
test execution, labeled results, signals, and cleanup.

**Rationale**: Today three separate lifecycle implementations each build, serve,
wait, test, and clean up differently. A single component-neutral runner
registers `styles` first and treats unknown targets, occupied ports, missing
build output, missing stories, and test failures as hard failures. Direct
`/iframe.html` story URLs remove manager UI and composed-catalog dependencies,
and a shared signal/cleanup path prevents leaked servers.

**Alternatives considered**:

- Extend the existing `behavior-contracts/run.mjs`. Rejected because it is the
  pilot runner the refactor retires and is Cucumber-specific.
- Keep `scripts/test-storybook.sh` and only add a styles variant. Rejected
  because it preserves the wall of duplicated lifecycle logic the refactor
  consolidates.

## Shared State Provenance and Capability Organization

**Decision**: Record a short Accordion capability manifest owning the six
initial shared capabilities (Enter expansion, Space collapse, single-open,
disclosure-to-panel association, panel availability, focus retention), with
controlled/uncontrolled props, callbacks, refs, and server-rendering kept
package-specific, and disabled/multiple-open recorded as unresolved shared scope.

**Rationale**: The existing `behavior-contracts/targets.mjs`
`REQUIRED_CAPABILITIES` list and the Styles and React Accordion stories already
encode these behaviors. A manifest reconciling all sources prevents a current
shared assertion from disappearing silently and precisely bounds what is shared
versus package-specific versus unresolved.

**Alternatives considered**:

- Only mirror the existing `REQUIRED_CAPABILITIES` list. Rejected because a
  standalone manifest makes the evidence boundary explicit and reviewable at a
  glance.
- Treat disabled and multiple-open as in-scope. Rejected because the Styles
  package has not yet documented and exposed those promises (the Styles
  `Accordion.stories.ts` is currently CSS-only and delegates JS behavior to the
  React wrapper or `@pathableai/styles/js`).

## Accessibility Policy and Evidence Report

**Decision**: Move Axe exceptions into a shared registry with target, story,
rule, rationale, and tracking reference; convert catalog-wide exclusions to the
narrowest story-level exception; and report three separate measures —
deterministic state fixtures, executable behavior-contract adoption, and
automated accessibility execution — without labeling visual smoke or an
automated aggregate as WCAG certification.

**Rationale**: The constitution's Principle X forbids broad rule
disablement and demands narrow, justified, story-level exceptions. The current
Styles Axe config disables several rules catalog-wide. A reviewable registry
plus a distinct evidence report lets the refactor ratchet policy honestly
instead of broadening failures to pass.

**Alternatives considered**:

- Leave catalog-wide Axe exclusions as-is. Rejected because it violates the
  constitution and hides regressions behind broad suppressions.
- Conflate story presence with capability coverage in one number. Rejected
  because the plan explicitly separates fixtures, contract adoption, and Axe
  evidence.

## Pilot Retirement and Equivalence

**Decision**: Keep `behavior-contracts/` green and independently runnable until
the new Styles `play` results are proven equivalent to all three existing
Gherkin scenarios, then delete the pilot's feature, steps, custom runner,
Cucumber dependency, and duplicate CI job in the same or a follow-up cleanup.
Until acceptance, the pilot command (`test:contracts:styles`) remains a safety
net.

**Rationale**: The pilot is currently the only executable Accordion contract
besides package `play` stories. Removing it before equivalence would weaken
existing assertions. Keeping it green satisfies the refactor's "Rollback" and
"one component at a time" instructions.

**Alternatives considered**:

- Delete the pilot immediately. Rejected because equivalence has not been
  demonstrated and no other feature yet depends on the new path.
- Keep both indefinitely. Rejected because duplicate assertions are the drift
  risk the refactor removes once equivalence is proven.

## React Runtime Isolation

**Decision**: Keep React runtime isolation out of scope for this phase, but
require that the focused Styles command never build or start the React
Storybook and that no React story or catalog change occurs.

**Rationale**: The React Storybook preview currently imports `@pathableai/styles/js`
(e.g. the `styles-js-noop.js` shim in `apps/storybook-react/.storybook`), which
raises exactly the false-parity risk the refactor flags. Registering React is a
Phase 2 change that needs an explicit runtime-ownership guard, so Phase 1
registers only `styles` and defers React.

**Alternatives considered**:

- Register React in this phase. Rejected because it would trust React parity
  while the enhancement runtime can mask broken native behavior.
- Modify the React preview now. Rejected because the 036 plan and the user
  explicitly deferred all React changes.

## Dependency Selection

**Decision**: Add only Storybook test-runner and `@storybook/test` primitives to
the storybook-contracts package; reuse the existing Playwright, `serve`, and
Storybook 10 tooling already present at root; keep `@cucumber/cucumber` only
until pilot equivalence retirement.

**Rationale**: The shared package is intentionally minimal — explicit exports,
lint, format, and typecheck — and must not drag framework-specific runtime
dependencies into a publishable package. Reusing the root Storybook/Playwright
tooling matches the current repo and keeps validation materially consistent
between local and CI.

**Alternatives considered**: Pinning a separate test framework inside the
contract package. Rejected because it would make helpers depend on tooling the
real proof (the browser story) does not require.

## Clarifications

All technical unknowns are resolved. No `NEEDS CLARIFICATION` markers remain in
the plan or spec.