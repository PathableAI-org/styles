---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.

  Task categories below marked with applicability conditions MUST only be
  included when the condition is met. Do not generate Storybook, accessibility,
  responsive, or visual tasks for changes that cannot affect rendered UI or
  component contracts. An applicability decision is required, not boilerplate.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

<!-- Design-system wrapper foundational tasks — only when the feature
     changes or adds wrapper components -->
- [ ] T010 Add or update the owning `packages/styles` contract before wrapper
      work begins (required for design-system wrapper features)
- [ ] T011 Verify wrapper package entrypoints import/package required
      `@pathable/styles` CSS, fonts, icons, JavaScript helpers, and assets
      automatically (required for wrapper features)
- [ ] T012 Verify each `packages/react` component name is the CamelCase form
      of its equivalent `packages/styles` component name with any `pathable`
      prefix removed (required for React wrapper features)
- [ ] T013 Verify wrapper components preserve the shared package's semantic
      HTML, accessibility behavior, class contracts, design tokens, and
      intended visual behavior (required for wrapper features)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T020 [P] [US1] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T021 [P] [US1] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 1

- [ ] T022 [P] [US1] Create [Entity1] model in src/models/[entity1].py
- [ ] T023 [P] [US1] Create [Entity2] model in src/models/[entity2].py
- [ ] T024 [US1] Implement [Service] in src/services/[service].py (depends on T022, T023)
- [ ] T025 [US1] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T026 [US1] Add validation and error handling
- [ ] T027 [US1] Add logging for user story 1 operations

<!-- Story task categories — only when the feature affects rendered UI or
     component contracts. Skip these entirely for non-UI work. -->

<!-- Fixed stories for supported states -->
- [ ] T028 [P] [US1] Add `Default` story with realistic default props in
      [path/to/Component.stories.tsx]
- [ ] T029 [P] [US1] Add `Disabled` story in [path/to/Component.stories.tsx]
      (if component supports disabled state)
- [ ] T030 [P] [US1] Add one fixed named story per meaningful variant in
      [path/to/Component.stories.tsx]

<!-- Interaction tests (interactive components only) -->
- [ ] T031 [P] [US1] Add keyboard activation interaction test using
      `getByRole` and `storybook/test` in [path/to/Component.stories.tsx]
- [ ] T032 [P] [US1] Verify focus management and visible focus indicator in
      interaction test in [path/to/Component.stories.tsx]

<!-- Accessibility validation (rendered UI only) -->
- [ ] T033 [US1] Verify Storybook a11y addon reports no new violations for
      [component] stories; document and justify any narrow story-level
      exceptions
- [ ] T034 [US1] Run static accessibility linting (`eslint-plugin-jsx-a11y`)
      on [component] source and fix findings

<!-- Responsive and constrained-content cases -->
- [ ] T035 [P] [US1] Add `Narrow` or `Mobile` viewport story for [component]
      in [path/to/Component.stories.tsx]
- [ ] T036 [P] [US1] Add `LongContent` story with localized-looking text for
      [component] in [path/to/Component.stories.tsx]
- [ ] T037 [US1] Verify keyboard focus visibility, high-contrast behavior,
      and reduced-motion preference for [component]

<!-- Visual fixtures (when visual regression is active) -->
- [ ] T038 [P] [US1] Add deterministic visual-regression fixture stories for
      [component] states in [path/to/Component.stories.tsx]

<!-- Package and consumer validation (when publishable packages change) -->
- [ ] T039 [US1] Run `pnpm build` for affected packages and verify output
- [ ] T040 [US1] Run `pnpm pack --dry-run` or equivalent package-content
      validation for affected packages, including wrapper transitive imports
- [ ] T041 [US1] Verify type declarations are generated and type-checked
      for [package]

<!-- Documentation updates -->
- [ ] T042 [P] [US1] Update Storybook metadata for [component] with semantic
      intent, usage guidance, misuse warnings, and accessibility obligations
- [ ] T043 [P] [US1] Update package README or Astro docs for [feature]
      (identify canonical source and derive/link others)

<!-- CI integration (when new artifact types or checks are introduced) -->
- [ ] T044 [US1] Add or update CI workflow steps for [new check or artifact
      type]

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [ ] T050 [P] [US2] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T051 [P] [US2] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 2

- [ ] T052 [P] [US2] Create [Entity] model in src/models/[entity].py
- [ ] T053 [US2] Implement [Service] in src/services/[service].py
- [ ] T054 [US2] Implement [endpoint/feature] in src/[location]/[file].py
- [ ] T055 [US2] Integrate with User Story 1 components (if needed)

<!-- Repeat applicable task categories from User Story 1 as needed for US2 -->

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [ ] T060 [P] [US3] Contract test for [endpoint] in tests/contract/test_[name].py
- [ ] T061 [P] [US3] Integration test for [user journey] in tests/integration/test_[name].py

### Implementation for User Story 3

- [ ] T062 [P] [US3] Create [Entity] model in src/models/[entity].py
- [ ] T063 [US3] Implement [Service] in src/services/[service].py
- [ ] T064 [US3] Implement [endpoint/feature] in src/[location]/[file].py

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Additional unit tests (if requested) in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run lint checks and fix findings without disabling rules, adding
  ignore entries, reducing rule severity, or using skip/silence flags unless a
  human maintainer has explicitly approved a narrow bypass
- [ ] TXXX Run package-content validation for affected packages
  (`pnpm pack --dry-run` or equivalent), including wrapper transitive imports
- [ ] TXXX Run type checking for affected packages
- [ ] TXXX Run quickstart.md validation

<!-- Cross-framework verification — only when shared styles or contracts change -->
- [ ] TXXX Build and test all affected framework Storybooks in their own
      framework context; confirm composition does not hide independent failures

<!-- Visual regression approval — only when visual fixtures changed -->
- [ ] TXXX Review visual-regression snapshots; approve intentional changes;
      do not use snapshot approval to conceal unexplained regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for [endpoint] in tests/contract/test_[name].py"
Task: "Integration test for [user journey] in tests/integration/test_[name].py"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Avoid: adding visual behavior only inside a wrapper package before the
  corresponding `packages/styles` contract exists
- Avoid: disabling, weakening, skipping, or silencing lint checks. Agents must
  fix lint findings or escalate for explicit human approval of a narrow bypass.
- Avoid: generating Storybook, accessibility, responsive, or visual tasks for
  changes that cannot affect rendered UI or component contracts. An
  applicability decision is required, not boilerplate tasks.
- Avoid: using Playground/Controls stories as a substitute for fixed,
  deterministic regression stories.
- Avoid: using serialized DOM snapshots as a complete substitute for
  browser-rendered visual or behavioral validation.