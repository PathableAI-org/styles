# Component Testing Infrastructure Refactor Plan

**Status:** Proposed  
**Planning baseline:** `origin/main` at `ac51712` on 2026-08-15  
**Reference component:** Accordion  
**Reference implementation:** `@pathableai/styles`

## Goal

Create one maintainable component-testing system that proves user-visible and
assistive-technology-visible behavior first in `packages/styles`, then reuses
the same behavior contract against `packages/react` and future framework
packages without coupling those packages to the same renderer, DOM tree, state
model, or public API.

This is an infrastructure-first refactor. Accordion is the only component in
the first implementation slice. Broader component coverage starts only after
that slice has established a stable authoring model, a Styles-only feedback
loop, CI ownership, reporting, and migration path.

## Non-negotiable Styles-first rule

Every shared component behavior must follow this sequence:

1. Define the observable capability and deterministic fixture.
2. Implement the validation in the framework-neutral contract module.
3. Invoke it from the `packages/styles` Storybook story, exercising the public
   `@pathableai/styles` CSS and JavaScript entry points.
4. Make the focused Styles command pass in local validation and CI.
5. Only then adopt the unchanged shared validation in React or another
   framework package.

A downstream framework may add package-specific tests at any time, but it must
not become the first or only executable owner of a shared behavior. Prefer a
separate downstream-adoption pull request after the Styles reference slice is
green so a framework adapter cannot define the contract accidentally.

## Current state

### What already works

- The testing principles in `docs/testing/` clearly separate deterministic
  stories, interactions, shared parity, accessibility, visual evidence,
  package-specific tests, and application end-to-end tests.
- The HTML and React packages have separate Storybook applications and browser
  test runners.
- Both Storybook test runners execute Axe after stories render.
- The top-level `behavior-contracts/` pilot defines three readable Accordion
  scenarios and runs them against the real Styles Storybook using Cucumber and
  Playwright.
- CI builds both Storybooks, browser-tests both catalogs, runs the behavior
  pilot, checks the Styles visual smoke set, and validates React build, types,
  package shape, server compatibility, and a packed Next.js consumer.

### Gaps and competing paths

| Area                      | Current evidence                                                                                                                            | Refactor need                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Shared behavior ownership | `behavior-contracts/` owns a Cucumber pilot, while `docs/testing/tooling-and-structure.md` proposes `packages/storybook-contracts/` helpers | Select one default component-level contract path and remove duplicate assertions only after equivalence is proven  |
| Styles interactions       | All 36 component story files under `packages/styles/src/stories/components/` have no Storybook `play` function                              | Add a focused Styles interaction loop before expanding parity to another package                                   |
| Accordion coverage        | Styles has two deterministic fixtures and three external Cucumber scenarios; React has its own similar interaction stories                  | Move the common behavior into one renderer-neutral validation used first by Styles; keep framework API tests local |
| Package isolation         | The React Storybook preview imports `@pathableai/styles/js`, which can enhance markup and mask broken native React behavior                 | Add an explicit runtime-isolation assertion before any React parity result is trusted                              |
| Commands                  | `test:storybook` runs both catalogs, `test:storybook-react` is focused, but there is no symmetric `test:storybook-styles` command           | Provide fast, explicit Styles-first and per-target commands plus a predictable aggregate                           |
| Runner lifecycle          | `scripts/test-storybook.sh`, `behavior-contracts/run.mjs`, and CI YAML each build, serve, wait, test, and clean up in different ways        | Consolidate lifecycle behavior behind one target-aware runner with bounded readiness and reliable cleanup          |
| Accessibility policy      | Styles disables several Axe rules catalog-wide; React mostly uses narrow story exceptions                                                   | Introduce one exception registry and ratchet policy; do not claim automated checks are certification               |
| Coverage reporting        | `storybook-coverage.mjs` proves selected story IDs exist, not that supported component capabilities are covered                             | Track fixed states and behavior-contract adoption separately from story presence                                   |
| Visual evidence           | Styles visual smoke tests use a hand-picked pattern list and screenshot-size heuristics                                                     | Keep this as smoke evidence; do not represent it as full component visual regression                               |

The current system therefore has useful parts but no single contributor path
from a shared requirement to Styles proof, downstream conformance, and coverage
reporting.

## Target architecture

```text
docs/testing requirements
          |
          v
packages/storybook-contracts (private, renderer-neutral helpers)
          |
          +--> packages/styles story -- first required proof
          |
          +--> packages/react story -- later conformance proof
          |
          +--> future framework story -- later conformance proof

target-aware Storybook runner
          |
          +--> build --> serve --> ready --> test --> report --> cleanup
          |
          +--> styles target, then optional downstream targets
```

Package stories continue to own rendering and deterministic initial state. The
shared module owns only focused interactions and observable assertions. It may
accept an `HTMLElement` or a small structural test interface, but must not
accept React props, Storybook renderer context types, CSS selectors, or package
internals.

Gherkin is not the default component test authoring layer after this refactor.
Retain it only where a feature file has a distinct stakeholder-facing purpose.
The Accordion pilot should remain in place until the new Styles story produces
equivalent evidence; then retire its duplicate runner, steps, and dependency in
the same or a follow-up cleanup change.

## Execution plan

### Phase 1: Refactor the infrastructure through Accordion

No second component enters the shared contract system during this phase.

#### 1.1 Record the Accordion contract and evidence boundary

- [ ] Reconcile the three existing Gherkin scenarios, Styles fixtures, React
      stories, component documentation, and published Styles JavaScript
      behavior into a short Accordion capability manifest.
- [ ] Preserve Enter expansion, Space collapse, single-open behavior,
      disclosure-to-panel association, panel availability, and focus
      retention as the initial shared contract.
- [ ] Keep controlled/uncontrolled props, callbacks, refs, and server-rendering
      behavior out of the shared contract; those remain React-specific.
- [ ] Record disabled and multiple-open behavior as unresolved shared scope
      until the Styles package exposes and documents the same promise.

**Verify:** Review the manifest against
`behavior-contracts/features/accordion.feature` and both Accordion stories; no
current shared assertion disappears silently.

#### 1.2 Create the private contract workspace

- [ ] Add `packages/storybook-contracts/` as a private workspace package with
      explicit exports, linting, formatting, and typechecking.
- [ ] Keep dependencies limited to the Storybook testing primitives needed for
      accessible queries, user actions, and assertions.
- [ ] Export small functions named for one capability, such as
      `verifyEnterExpandsDisclosure`, rather than one broad `testAccordion`
      helper.
- [ ] Require accessible role/name queries and observable semantic outcomes.
      Generated IDs may vary; relationships must resolve correctly.
- [ ] Add contract-module unit/type tests only for its own guards or utilities;
      the browser story remains the proof of component behavior.

**Verify:** The private package can be imported by the HTML Storybook without
adding files to either publishable package's npm payload.

#### 1.3 Make Styles the first executable consumer

- [ ] Expand the Styles Accordion catalog to include named, deterministic
      fixtures for each shared starting state.
- [ ] Add Styles `play` stories that call the new Accordion helpers while the
      catalog imports the built public `@pathableai/styles/js` behavior.
- [ ] Assert that the runtime has initialized before interaction and fail with
      useful target/story/capability context instead of silently skipping.
- [ ] Add a focused `test:storybook-styles` command and a narrower Accordion
      iteration filter if the Storybook runner supports stable filtering.
- [ ] Run the new path without building or starting the React Storybook.

**Gate:** The Accordion helper is not approved for another package until the
focused Styles command passes from a clean checkout and CI has a Styles-owned
result for it.

#### 1.4 Consolidate Storybook target orchestration

- [ ] Replace duplicated shell, Cucumber, and workflow lifecycle code with one
      component-neutral runner that owns target metadata, prerequisite builds,
      a direct `/iframe`-compatible static server, bounded readiness, test
      execution, labelled results, signals, and cleanup.
- [ ] Register `styles` first. Target selection must be explicit, and unknown
      targets, occupied ports, missing build output, missing stories, and test
      failures must be hard failures.
- [ ] Make `test:storybook-styles` invoke the Styles target, retain
      `test:storybook-react` for package-specific work, and make
      `test:storybook` a clearly documented aggregate.
- [ ] Reuse the runner in CI instead of duplicating background server scripts
      in YAML.
- [ ] Keep target execution sequential initially to avoid static-output and
      port collisions; parallelize only after output directories are isolated.

**Verify:** Exercise successful, test-failure, unavailable-port, unavailable
catalog, SIGINT, and SIGTERM paths and confirm no owned browser or server
process remains.

#### 1.5 Consolidate accessibility and reporting policy

- [ ] Move Axe exceptions into a shared, reviewable registry with target and
      story scope, rationale, and tracking reference.
- [ ] Convert catalog-wide exclusions to the narrowest known story-level
      exception before tightening any rule. Do not broaden failures merely to
      make the refactor pass.
- [ ] Report three separate measures: deterministic state fixtures, executable
      behavior-contract adoption, and automated accessibility execution.
- [ ] Keep visual smoke and manual keyboard/focus/assistive-technology review
      as separate evidence. Do not label any automated aggregate as WCAG
      certification.

**Verify:** The Accordion report identifies the Styles story, each covered
capability, its Axe execution, and any exception without treating a story ID as
behavior coverage.

#### 1.6 Prove parity, then remove the pilot duplication

- [ ] Compare the new Styles `play` results with all three existing Cucumber
      scenarios.
- [ ] Delete the top-level Accordion feature, steps, custom runner, Cucumber
      dependency, and duplicate CI job only after that equivalence review
      passes and no other feature uses them.
- [ ] Update `docs/testing/` so commands, paths, failure behavior, and the
      Styles-first rule match the implemented system.
- [ ] Add an architecture decision explaining why direct Storybook helpers are
      the default and when Gherkin would still be justified.

**Rollback:** Until equivalence is accepted, keep `pnpm test:contracts:styles`
green and independently runnable. If the new path is unstable, remove its CI
requirement and continue using the pilot while fixing the new runner; do not
weaken the existing assertions.

### Phase 2: Adopt the Accordion contract in React

This phase begins only after Phase 1 is merged and observed green.

- [ ] Ensure the React Storybook does not load the Styles DOM enhancement
      runtime for Accordion. Add a guard that fails if both native React and
      enhancement handlers can own the same interaction.
- [ ] Add deterministic React fixtures matching the shared initial states.
- [ ] Invoke the unchanged Accordion helpers from React stories.
- [ ] Retain separate React tests for controlled/uncontrolled state,
      `onExpandedChange`, disabled props, refs, and server rendering.
- [ ] Add React as a downstream target to aggregate reporting only after its
      isolated native implementation passes.

**Verify:** Deliberately break the React toggle implementation and show that
the React contract fails while the Styles contract remains green; deliberately
break the shared helper and show that both targets fail.

### Phase 3: Implement component tests in risk order

Apply the Styles-first sequence independently to every component. Complete a
component's contract and Styles proof before starting its downstream adapter.
Within each wave, take one component at a time unless the components share only
infrastructure and cannot overwrite each other's fixtures or output.

#### Wave A: Stateful keyboard and focus behavior

1. Modal — open/close, accessible name, initial focus, Escape, containment,
   and focus restoration.
2. Banner — disclosure semantics, activation, state, and content availability.
3. ComboBox — label, text entry, option navigation/selection, Escape, disabled,
   and invalid states.
4. DatePicker, then DateRangePicker — input/calendar synchronization, keyboard
   navigation, validation, range rules, and focus return.
5. Header, then Sidenav — responsive navigation disclosure, keyboard behavior,
   current state, and focus behavior.
6. Search — label, entry, submission, and responsive disclosure where
   supported.

These components have the highest risk of false confidence from static Axe
checks and should establish reusable disclosure, overlay, composite-widget,
and focus helpers.

#### Wave B: Native and custom form controls

1. Checkbox and Radio.
2. Select.
3. Input and Textarea.

Cover accessible labeling, entry/selection, keyboard operation, disabled,
required, invalid, hint, and error association behavior. Keep form callbacks
and framework-controlled state package-specific.

#### Wave C: Navigation, collections, and activation

1. Button, ButtonGroup, and Link.
2. Pagination, Breadcrumb, and Skipnav.
3. Table and List.

Focus on activation, current-page semantics, bypass behavior, grouping,
captions/headers, and collection semantics. Do not invent interaction tests for
purely static structures.

#### Wave D: Status, feedback, and progress communication

1. Alert and SiteAlert.
2. Toast and PageError.
3. Loading and Skeleton.
4. ProcessList, StepIndicator, and SummaryBox.
5. EmptyState.

Validate roles, names, live/status exposure where promised, meaningful
content, dismissal where supported, and current/progress state. Manual
announcement quality remains a separate review item.

#### Wave E: Visual and composition-led components

1. Card, Tag, and MediaBlock.
2. Icon.
3. Remaining Styles-only interaction controls, application-shell stories,
   dashboards, discovery patterns, structured workflows, and recipes.

Use deterministic states, semantics, viewport/content pressure, Axe, and
visual regression where interaction is not part of the contract. Promote a
pattern to a shared package contract only if another package exposes the same
user-facing promise.

## Affected files and ownership

| Path                                                                        | Planned change                                                                                | Dependency or sequencing                                   |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `packages/storybook-contracts/`                                             | Create private shared validation package                                                      | First implementation artifact after the Accordion manifest |
| `packages/styles/src/stories/components/Communication/Accordion.stories.ts` | Add deterministic behavior stories and shared helper calls                                    | First executable consumer                                  |
| `apps/storybook/.storybook/`                                                | Wire Styles test environment and shared Axe policy                                            | Must continue exercising public Styles runtime             |
| `scripts/test-storybook.*`                                                  | Replace duplicated target lifecycle with one runner                                           | Prove against Styles before registering React              |
| `package.json` and `pnpm-lock.yaml`                                         | Add focused commands/workspace dependencies; later remove Cucumber                            | Cucumber removal waits for equivalence                     |
| `.github/workflows/ci-full.yml`                                             | Call shared runner and publish target-labelled evidence                                       | Local failure paths verified first                         |
| `behavior-contracts/`                                                       | Retire duplicate Accordion pilot                                                              | Delete only after new Styles evidence is equivalent        |
| `packages/react/src/stories/components/Communication/Accordion.stories.tsx` | Adopt unchanged shared helpers                                                                | Phase 2 only                                               |
| `apps/storybook-react/.storybook/preview.js`                                | Isolate native React behavior from Styles enhancement JS                                      | Required before React conformance is trusted               |
| `docs/testing/`                                                             | Document implemented commands, ownership, rollout, and evidence limits                        | Update as infrastructure lands                             |
| `packages/styles/scripts/storybook-coverage.mjs`                            | Replace story-presence-only reporting with capability reporting or delegate to a new reporter | After the Accordion manifest format is stable              |
| `packages/styles/scripts/quality-gates.mjs` and `test-visual.mjs`           | Reuse server lifecycle where safe; retain distinct quality/visual assertions                  | Do not block initial contract extraction                   |

## Validation gates for each implementation pull request

Run non-interactively with `CI=true`.

1. Focused contract-package lint and typecheck.
2. `pnpm --filter @pathableai/styles build`.
3. The focused Styles Storybook/contract command.
4. Styles Storybook build and Axe browser tests.
5. Lifecycle negative-path tests when runner code changes.
6. `pnpm lint`, `pnpm typecheck`, and `git diff --check`.
7. `pnpm test:visual` when fixtures or rendered states change.
8. `pnpm test:next-consumer` when publishable package code, exports, or
   dependency boundaries change.
9. React server-compatibility and React Storybook checks only when React is in
   the pull request's scope.
10. Explicit human keyboard/focus review for new interactive contract scope;
    assistive-technology review where announcement or reading order matters.

CI must report terminal pass/fail results for the focused Styles target and any
downstream target changed by the pull request. Aggregate green status may not
hide a skipped, missing, or unregistered target.

## Risks and mitigations

- **False parity from shared runtime:** React currently loads Styles JavaScript.
  Isolate runtime ownership and add a negative guard before React adoption.
- **Big-bang migration:** Keep Cucumber green until Accordion equivalence is
  reviewed, then migrate one component at a time.
- **Helpers become a second framework:** Limit them to actions and observable
  assertions; package stories own rendering and setup.
- **Styles-first becomes documentation only:** Give Styles a dedicated command,
  CI result, manifest status, and merge gate before downstream registration.
- **Flaky browser lifecycle:** Use direct iframe URLs, bounded readiness,
  isolated targets, explicit capability failures, sequential execution, and
  owned-process cleanup tests.
- **Accessibility regressions are hidden by exceptions:** Centralize,
  story-scope, explain, and ratchet exceptions; never broaden an exception to
  complete a migration.
- **Coverage numbers overstate quality:** Report state, interaction, Axe,
  visual, and manual evidence separately.
- **Publishable package leakage:** Keep the contract package private and verify
  packed manifests/tarballs whenever dependency or export boundaries change.

## Completion criteria

The refactor is complete when:

- contributors have one documented path from a behavior requirement to a
  reusable validation;
- Accordion proves that path through `packages/styles` first and through an
  isolated React implementation second;
- the focused Styles command and CI result are stable and mandatory;
- one target-aware runner owns build, serve, readiness, execution, reporting,
  and cleanup;
- duplicate Accordion Cucumber infrastructure is removed only after evidence
  equivalence;
- accessibility exceptions and coverage reports are explicit and scoped;
- the component rollout ledger records each component's Styles proof before
  downstream adoption; and
- no automated result is presented as manual accessibility certification or
  application-level end-to-end coverage.
