# Tasks: Next Consumer Compatibility

**Input**: Design documents from `specs/034-next-consumer-compat/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Packed-artifact and downstream regression coverage is required by the feature specification. Test tasks precede the fixes they protect.

## Phase 1: Setup

**Purpose**: Establish the scoped command and fixture dependency surface.

- [ ] T001 Add the `test:next-consumer` root command and pinned Next 15/React 18 validation dependencies in `package.json`
- [ ] T002 Regenerate `pnpm-lock.yaml` for the validation dependency additions without altering package release versions

---

## Phase 2: Foundational

**Purpose**: Build the reusable packed-package validation harness before changing package output.

**⚠️ CRITICAL**: User story implementation starts only after the harness can reproduce the current package defects.

- [ ] T003 Create temporary-directory, command execution, tar extraction, and cleanup helpers in `scripts/test-next-consumer.mjs`
- [ ] T004 Add packed manifest and tarball file-list assertions for both packages in `scripts/test-next-consumer.mjs`
- [ ] T005 Run `pnpm test:next-consumer` and record the expected baseline React-runtime, missing-style-import, and asset failures in `specs/034-next-consumer-compat/quickstart.md`

**Checkpoint**: The packed-package harness fails for the observed consumer defects rather than passing against workspace source.

---

## Phase 3: User Story 1 - Render PathAble components in an App Router application (Priority: P1) 🎯 MVP

**Goal**: A Next.js 15 App Router application using React 18 builds and server-renders representative PathAble React components without a conflicting runtime.

**Independent Test**: The generated temporary application imports Card, Link, List, Tag, and Loading from the packed React tarball, builds, starts, and returns all representative content without React-version errors.

### Tests for User Story 1

- [ ] T006 [US1] Generate the Next.js 15/React 18 App Router fixture and representative component page in `scripts/test-next-consumer.mjs`
- [ ] T007 [US1] Add production build, server lifecycle, HTTP content, and React-error assertions in `scripts/test-next-consumer.mjs`

### Implementation for User Story 1

- [ ] T008 [US1] Externalize React, React DOM, both JSX runtimes, and the styles entry in `packages/react/vite.config.ts`
- [ ] T009 [US1] Update the React public source entry to preserve the external styles side-effect import in `packages/react/src/index.ts`
- [ ] T010 [US1] Verify the packed React runtime imports consumer React and passes the generated production build/render path via `pnpm test:next-consumer`

**Checkpoint**: The consumer build and server-render contract passes independently, even before all stylesheet asset assertions are repaired.

---

## Phase 4: User Story 2 - Apply complete published styling (Priority: P1)

**Goal**: The automatic React styling contract resolves every local stylesheet asset from packed packages.

**Independent Test**: The packed React entry exposes the automatic public styles import, and every local URL parsed from packed styles CSS exists at its resolved tarball path.

### Tests for User Story 2

- [ ] T011 [US2] Add packed CSS URL parsing, safe path resolution, and missing-asset assertions in `scripts/test-next-consumer.mjs`

### Implementation for User Story 2

- [ ] T012 [P] [US2] Copy all referenced USWDS image families to package-root `img/` paths in `packages/styles/scripts/copy-icons.mjs`
- [ ] T013 [P] [US2] Copy referenced Roboto Mono files while preserving existing PathAble fonts in `packages/styles/scripts/copy-fonts.mjs`
- [ ] T014 [US2] Include package-root images in the publishable styles files contract in `packages/styles/package.json`
- [ ] T015 [US2] Document the verified automatic styling and application usage contract in `packages/react/README.md`
- [ ] T016 [US2] Build and pack both packages and verify every stylesheet asset and public style import via `pnpm test:next-consumer`

**Checkpoint**: The packed packages provide complete styling without a direct downstream styles import or consumer bundler workaround.

---

## Phase 5: User Story 3 - Prepare corrected packages safely (Priority: P2)

**Goal**: Both corrected package contracts have patch release intent newer than 0.0.1 without modifying existing generated release output or publishing.

**Independent Test**: Changesets status projects patch releases for both packages, while the original generated changelogs, versions, and consumed Changeset deletions remain present in the worktree history.

### Implementation for User Story 3

- [ ] T017 [US3] Add a patch Changeset for both corrected public contracts under `.changeset/`
- [ ] T018 [US3] Run Changesets status and document projected next versions without running version or publish commands in `specs/034-next-consumer-compat/quickstart.md`

**Checkpoint**: Release intent is ready and publication remains unperformed.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete required package and repository evidence.

- [ ] T019 [P] Run React lint, typecheck, publint, and Are the Types Wrong gates from `specs/034-next-consumer-compat/quickstart.md`
- [ ] T020 [P] Run styles build, React build, and packed Next consumer smoke from `specs/034-next-consumer-compat/quickstart.md`
- [ ] T021 Run `pnpm test:storybook-react`, `pnpm check:format`, and `git diff --check`
- [ ] T022 Reconcile final files, tarball evidence, limitations, and exact gate results in `specs/034-next-consumer-compat/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on Setup and blocks package fixes.
- **User Story 1 (Phase 3)**: Depends on the packed-package harness; establishes the runtime-compatible MVP.
- **User Story 2 (Phase 4)**: Depends on the harness and React entry decision; its icon and font copy tasks may proceed in parallel.
- **User Story 3 (Phase 5)**: Depends on the final public contracts from User Stories 1 and 2.
- **Polish (Phase 6)**: Depends on all three stories.

### User Story Dependencies

- **US1**: Independent after Foundational; provides the runtime-compatible MVP.
- **US2**: Independent asset work after Foundational, but final automatic-style verification shares the public React entry fixed in US1.
- **US3**: Must follow US1 and US2 so release notes describe the final corrected contracts.

### Parallel Opportunities

- T012 and T013 edit separate styles build scripts and can run in parallel.
- T019 and T020 exercise different quality-gate groups and can run in parallel when machine resources allow.

## Parallel Example: User Story 2

```text
Task: T012 Copy referenced USWDS images in packages/styles/scripts/copy-icons.mjs
Task: T013 Copy referenced Roboto Mono fonts in packages/styles/scripts/copy-fonts.mjs
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete User Story 1.
3. Validate the packed React tarball in the Next.js 15/React 18 production path.
4. Continue because the user's requested release requires complete styling and assets as well as runtime compatibility.

### Incremental Delivery

1. Prove current packed failures.
2. Restore consumer-owned React runtime and server rendering.
3. Restore automatic, asset-complete styling.
4. Add patch release intent without publishing.
5. Run all required package and repository gates.

## Notes

- Every task uses the required checkbox, sequential ID, optional parallel marker, story label where applicable, and concrete file path.
- Preserve the existing generated 0.0.1 changes throughout; do not restore deleted consumed Changesets or rewrite changelogs.
- Do not run `pnpm release`, `changeset publish`, `npm publish`, or any equivalent publication command.
