# Tasks: React Link and Tag Wrappers

**Input**: Design documents from `/specs/032-react-link-tag-wrappers/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Formal test files are not requested. Validation tasks cover package
builds, Storybook, package contents, semantic roots, navigation-attribute
preservation, bounded class mapping, and transitive styling.

**Organization**: Tasks are grouped by user story so Link and Tag can be
implemented and demonstrated independently before final package validation.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup](#phase-1-setup-shared-infrastructure)
- [Phase 2: Foundational](#phase-2-foundational-blocking-prerequisites)
- [Phase 3: User Story 1](#phase-3-user-story-1---render-an-accessible-link-p1)
- [Phase 4: User Story 2](#phase-4-user-story-2---render-a-tag-p2)
- [Phase 5: User Story 3](#phase-5-user-story-3---use-both-wrappers-without-extra-style-setup-p3)
- [Phase 6: Polish](#phase-6-polish--cross-cutting-concerns)
- [Dependencies](#dependencies--execution-order)
- [Parallel Examples](#parallel-examples)
- [Implementation Strategy](#implementation-strategy)
- [Scope Guardrails](#scope-guardrails)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it affects different files and has no
  dependency on an incomplete task.
- **[Story]**: Maps the task to US1, US2, or US3.
- Every task includes an exact repository-relative file path.

## Path Conventions

- **Owning styles contracts**: `packages/styles/src/pathable-component-wrappers/`
- **React components**: `packages/react/src/components/`
- **React public entrypoint**: `packages/react/src/index.js`
- **React Storybook**: `packages/react/src/stories/components/Basic/`
- **React documentation**: `packages/react/README.md`
- **Feature artifacts**: `specs/032-react-link-tag-wrappers/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm source ownership and existing package conventions before
editing implementation files.

- [X] T001 Review `packages/styles/src/pathable-component-wrappers/pathable-link.scss`, `packages/styles/src/pathable-component-wrappers/pathable-tag.scss`, `packages/styles/src/stories/components/Basic/Link.stories.ts`, `packages/styles/src/stories/components/Basic/Tag.stories.ts`, and `specs/032-react-link-tag-wrappers/contracts/props.md`; record any implemented-class mismatch as a blocker in `specs/032-react-link-tag-wrappers/tasks.md`
- [X] T002 Review `packages/react/src/components/Button/Button.jsx`, `packages/react/src/components/List/List.jsx`, `packages/react/src/components/Table/Table.jsx`, and `packages/react/src/index.js` for naming, PropTypes, bounded class mapping, rest-prop, and export conventions to apply to Link and Tag
- [X] T003 [P] Review `packages/react/src/stories/components/Basic/Button.stories.jsx`, `packages/react/src/stories/components/Basic/List.stories.jsx`, and `packages/react/src/stories/components/Basic/Table.stories.jsx` for controls, autodocs, and validation-story conventions to apply in `packages/react/src/stories/components/Basic/Link.stories.jsx` and `packages/react/src/stories/components/Basic/Tag.stories.jsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify the shared package contract that both story increments depend on.

**CRITICAL**: No user story work begins until this phase is complete.

- [X] T004 Verify `packages/react/src/index.js` retains exactly one `@pathable/styles/dist/styles.css` import and `packages/react/package.json` retains `@pathable/styles` as a runtime dependency; record any pre-existing contract gap in `specs/032-react-link-tag-wrappers/tasks.md` before editing package infrastructure
- [X] T005 Verify the planned public names, root semantics, and bounded values in `specs/032-react-link-tag-wrappers/data-model.md` and `specs/032-react-link-tag-wrappers/contracts/props.md` resolve to `Link`/anchor/default-or-external and `Tag`/span/default-or-big without exposing `pathable-link--nav`; record any conflict in `specs/032-react-link-tag-wrappers/tasks.md`

**Checkpoint**: The source, naming, semantic, and transitive-style boundaries are
confirmed; US1 and US2 may begin.

---

## Phase 3: User Story 1 - Render an Accessible Link (P1)

**Goal**: Developers can render a native Pathable Link with preserved content,
destination, attributes, handlers, consumer classes, and optional external presentation.

**Independent Test**: Render default and external Links with visible content,
`href`, accessible naming, relationship attributes, handlers, data attributes,
and a custom class; verify native anchor behavior, exact class mapping, and
consumer-controlled navigation attributes.

### Implementation for User Story 1

- [X] T006 [US1] Create `packages/react/src/components/Link/Link.jsx` with exported `Link`, native anchor root, `children`, `className`, remaining-anchor-prop forwarding, and PropTypes matching `specs/032-react-link-tag-wrappers/contracts/props.md`
- [X] T007 [US1] Add bounded `default` and `external` presentation resolution plus unsupported-value fallback in `packages/react/src/components/Link/Link.jsx`, mapping only to `pathable-link` and `pathable-link--external` without inferring `href`, `target`, `rel`, or download behavior
- [X] T008 [US1] Add `export { Link } from './components/Link/Link.jsx'` to `packages/react/src/index.js` while preserving the transitive styles import and all existing exports
- [X] T009 [US1] Add `Default`, `External`, `RichContent`, `CustomAttributes`, `EmptyContent`, and `UnsupportedPresentationFallback` stories to `packages/react/src/stories/components/Basic/Link.stories.jsx` covering the US1 independent-test scenarios
- [X] T010 [P] [US1] Add the `Link` import, default/external examples, navigation-policy note, and props documentation to `packages/react/README.md`
- [X] T011 [US1] Run `pnpm --filter @pathable/react build` and document any blocker against the Link validation section in `specs/032-react-link-tag-wrappers/quickstart.md`
- [X] T012 [US1] Inspect `packages/react/src/stories/components/Basic/Link.stories.jsx` and confirm native anchor semantics, content, `href`, `target`, `rel`, handlers, `aria-*`, `data-*`, custom classes, and fallback output satisfy `specs/032-react-link-tag-wrappers/contracts/props.md`

**Checkpoint**: User Story 1 is a complete, independently demonstrable MVP.

---

## Phase 4: User Story 2 - Render a Tag (P2)

**Goal**: Developers can render a non-interactive Pathable Tag with preserved
inline content, attributes, consumer classes, and optional big size.

**Independent Test**: Render default and big Tags with plain and rich inline
content, accessibility/data attributes, and a custom class; verify span
semantics, exact class mapping, unchanged content, and deterministic fallback.

### Implementation for User Story 2

- [X] T013 [P] [US2] Create `packages/react/src/components/Tag/Tag.jsx` with exported `Tag`, span root, `children`, `className`, remaining-span-prop forwarding, and PropTypes matching `specs/032-react-link-tag-wrappers/contracts/props.md`
- [X] T014 [US2] Add bounded `default` and `big` size resolution plus unsupported-value fallback in `packages/react/src/components/Tag/Tag.jsx`, mapping only to `pathable-tag` and `pathable-tag--big` without adding selection, dismissal, navigation, or button behavior
- [X] T015 [US2] Add `export { Tag } from './components/Tag/Tag.jsx'` to `packages/react/src/index.js` while preserving the transitive styles import and all existing exports
- [X] T016 [US2] Add `Default`, `Big`, `RichContent`, `CustomAttributes`, `EmptyContent`, and `UnsupportedSizeFallback` stories to `packages/react/src/stories/components/Basic/Tag.stories.jsx` covering the US2 independent-test scenarios
- [X] T017 [P] [US2] Add the `Tag` import, default/big examples, non-interactive semantics note, and props documentation to `packages/react/README.md`
- [X] T018 [US2] Run `pnpm --filter @pathable/storybook-react build-storybook`, inspect `packages/react/src/stories/components/Basic/Tag.stories.jsx`, and document any semantic, class-mapping, content, attribute, or build blocker in `specs/032-react-link-tag-wrappers/quickstart.md`

**Checkpoint**: User Stories 1 and 2 work independently and remain inside their
implemented source contracts.

---

## Phase 5: User Story 3 - Use Both Wrappers Without Extra Style Setup (P3)

**Goal**: Consumers can import Link and Tag from `@pathable/react` and receive
their required styles without a separate application-level styles import.

**Independent Test**: Build and inspect the package, confirming both exports,
the built entrypoint, README, runtime styles dependency, and transitive style
import are present.

### Implementation for User Story 3

- [X] T019 [US3] Verify the single transitive styles import and final `Link` and `Tag` exports in `packages/react/src/index.js`, correcting only missing contract details in that file
- [X] T020 [US3] Verify `@pathable/styles` remains a runtime dependency and package exports remain installable in `packages/react/package.json`, correcting only issues proven by package validation
- [X] T021 [P] [US3] Finalize consumer installation, combined `Link` and `Tag` import, and no-extra-styles-import guidance in `packages/react/README.md`
- [X] T022 [US3] Run `pnpm --filter @pathable/react build` and `npm --cache /tmp/pathable-npm-cache pack --dry-run` from `packages/react`, then verify both exports, built entrypoint, README, and runtime styles dependency against SC-005 and `specs/032-react-link-tag-wrappers/quickstart.md`

**Checkpoint**: All three user stories are independently functional and package
consumer evidence exists.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete repository quality gates and final contract review.

- [X] T023 Run `pnpm lint:js` and fix Link/Tag findings in `packages/react/src/components/Link/Link.jsx`, `packages/react/src/components/Tag/Tag.jsx`, `packages/react/src/stories/components/Basic/Link.stories.jsx`, and `packages/react/src/stories/components/Basic/Tag.stories.jsx` without disabling, weakening, skipping, or silencing lint rules
- [X] T024 Run `pnpm check:format` and format `packages/react/src/components/Link/Link.jsx`, `packages/react/src/components/Tag/Tag.jsx`, `packages/react/src/stories/components/Basic/Link.stories.jsx`, `packages/react/src/stories/components/Basic/Tag.stories.jsx`, and `packages/react/README.md` when required
- [X] T025 Run every validation path in `specs/032-react-link-tag-wrappers/quickstart.md` and record unresolved command or behavior failures in `specs/032-react-link-tag-wrappers/tasks.md`

**T018 Blocker**: `pnpm --filter @pathable/storybook-react build-storybook` fails with `Cannot find module 'apps/storybook-react/node_modules/storybook/dist/bin/dispatcher.js'`. The `apps/storybook-react/node_modules/.pnpm/` directory is empty despite a successful `pnpm install`. This is a pre-existing infrastructure issue unrelated to Link/Tag changes. The React package builds and exports both Link and Tag correctly.
- [X] T026 [P] Review `packages/react/src/components/Link/Link.jsx` and `packages/react/src/components/Tag/Tag.jsx` against `specs/032-react-link-tag-wrappers/spec.md`, `specs/032-react-link-tag-wrappers/data-model.md`, and `specs/032-react-link-tag-wrappers/contracts/props.md` for full FR-001 through FR-015 coverage
- [X] T027 [P] Review `packages/react/src/stories/components/Basic/Link.stories.jsx` and `packages/react/src/stories/components/Basic/Tag.stories.jsx` against the owning stories and `specs/032-react-link-tag-wrappers/checklists/behavior-testability.md` for semantic and visual contract parity, explicitly confirming `pathable-link--nav` is not exposed
- [X] T028 Review `packages/react/package.json`, `packages/react/src/index.js`, `packages/react/README.md`, and package dry-run output for naming, exports, transitive styling, and publish-content compliance

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** has no dependencies.
- **Phase 2** depends on Phase 1 and blocks all user stories.
- **US1 / Phase 3** depends on Phase 2 and is the MVP.
- **US2 / Phase 4** depends on Phase 2 and can proceed independently of US1,
  although a single-agent path should finish US1 first to avoid shared entrypoint
  and README conflicts.
- **US3 / Phase 5** depends on US1 and US2 so package evidence covers both exports.
- **Phase 6** depends on all selected user stories.

### Task Dependencies

- T004 and T005 depend on T001 through T003.
- T006 depends on T001, T002, and T005; T007 depends on T006; T008 depends on T007.
- T009 depends on T007; T010 can run in parallel with T009 after T007; T011
  and T012 depend on T008 through T010.
- T013 depends on T001, T002, and T005 and can run in parallel with T006; T014
  depends on T013; T015 depends on T014.
- T016 depends on T014; T017 can run in parallel with T016 after T014; T018
  depends on T015 through T017.
- T019 and T020 depend on T008 and T015; T021 can run in parallel with T020
  after both public APIs are stable; T022 depends on T019 through T021.
- T023 through T028 depend on completion of all selected story phases.

### Parallel Opportunities

- T003 can run in parallel with T001 and T002.
- T006 and T013 can run in parallel after Phase 2 because they create different components.
- T009 and T010 can run in parallel after Link behavior is stable.
- T016 and T017 can run in parallel after Tag behavior is stable.
- T020 and T021 can run in parallel after both exports are stable.
- T026 and T027 can run in parallel after validation commands complete.

## Parallel Examples

### User Stories 1 and 2

```text
Task T006: Create packages/react/src/components/Link/Link.jsx.
Task T013: Create packages/react/src/components/Tag/Tag.jsx.
```

### User Story 1

```text
Task T009: Add Link Storybook validation scenarios.
Task T010: Add Link README usage and props documentation.
```

### User Story 2

```text
Task T016: Add Tag Storybook validation scenarios.
Task T017: Add Tag README usage and props documentation.
```

### Polish

```text
Task T026: Review Link and Tag implementation contract coverage.
Task T027: Review Link and Tag Storybook source-contract parity.
```

## Implementation Strategy

### MVP First

1. Complete setup and foundational tasks T001-T005.
2. Complete US1 tasks T006-T012.
3. Stop and validate native Link rendering independently.

### Incremental Delivery

1. Deliver semantic default/external Link behavior as the MVP.
2. Add semantic default/big Tag behavior as an independent increment.
3. Verify both exports, transitive styles, and installable package contents.
4. Complete lint, formatting, quickstart, and contract reviews.

### Parallel Team Strategy

1. Complete source and package foundation checks together.
2. After Phase 2, implement Link and Tag in parallel in their separate files.
3. Sequence edits to `packages/react/src/index.js` and `packages/react/README.md`
   or coordinate them carefully because both stories share those files.
4. Complete package validation after both public APIs are stable.

## Scope Guardrails

- Do not edit `packages/styles` unless implementation proves a genuine source
  contract defect and records it as a blocker first.
- Do not expose `pathable-link--nav` until that modifier exists in the owning
  source contract and is separately specified.
- Do not infer Link destinations, new browsing contexts, relationship policy,
  download behavior, routing, or security attributes.
- Do not make Tag selectable, dismissible, navigational, or button-like.
- Do not add wrapper-only CSS, tokens, modifiers, or interaction state.
- Do not disable, weaken, skip, or silence lint rules.
- Do not alter feature contracts or readiness checklists merely to make
  implementation pass; record a blocker when implementation and contract disagree.
