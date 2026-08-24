# Tasks: Audit of Real Application Layouts

**Input**: Design documents from `/specs/055-audit-app-layouts/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested — this is a documentation-only feature with no source code produced.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Audit Preparation](#phase-1-audit-preparation)
- [Phase 2: User Story 1 — Identify Repeated Layout Patterns (P1)](#phase-2-user-story-1--identify-repeated-layout-patterns-p1--mvp)
- [Phase 3: User Story 2 — Categorize and Rank Candidates (P2)](#phase-3-user-story-2--categorize-and-rank-candidates-p2)
- [Phase 4: User Story 3 — Draft API Sketches (P3)](#phase-4-user-story-3--draft-api-sketches-p3)
- [Phase 5: Finalize and Validate](#phase-5-finalize-and-validate)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Implementation Strategy](#implementation-strategy)
- [Notes](#notes)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This feature produces no source code. All paths below refer to:

- **Deliverable**: `docs/plans/semantic-react/` — audit findings document
- **Source**: `docs/plans/semantic-react/13-audit-application-layouts.md` — feature description (exists)
- **Planning**: `specs/055-audit-app-layouts/` — spec, plan, research, data model

---

## Phase 1: Audit Preparation

**Purpose**: Establish the search environment and identify target application repositories before running any pattern searches.

- [x] T001 Identify and document the list of application repositories that consume `@pathable/react` as a dependency. Record the repository list at the top of the audit deliverable at `docs/plans/semantic-react/audit-findings.md`.
- [x] T002 Verify read access to each identified application repository and document any unavailable repositories as limitations in `docs/plans/semantic-react/audit-findings.md`.

**Checkpoint**: Target repositories identified and accessible — pattern searches can begin.

---

## Phase 2: User Story 1 — Identify Repeated Layout Patterns (P1) 🎯 MVP

**Goal**: Search all target application repositories for repeated layout patterns, utility-class combinations, and primitive nestings. Record each distinct pattern with frequency, intent, and classification.

**Independent Test**: Inspect the audit document and verify it lists at least five distinct patterns, each with a frequency count and a classification (domain-specific, reusable, or incidental). Spot-check 3 frequency counts against source repositories.

### Implementation for User Story 1

- [x] T003 [P] [US1] Search all target application repositories for repeated `className` strings combining `pathable-` utility classes (FR-001). Record each distinct combination and its frequency in `docs/plans/semantic-react/audit-findings.md`. Use `rg "pathable-"` queries per the search strategy in `specs/055-audit-app-layouts/research.md`.
- [x] T004 [P] [US1] Search all target application repositories for repeated nesting of `Box` and layout primitives (`Container`, `Stack`, `Inline`, `Cluster`, `Grid`) with the same prop configurations (FR-002). Record each recurring structure in `docs/plans/semantic-react/audit-findings.md`. Use `rg "<Container" -A 10` and similar queries per `specs/055-audit-app-layouts/quickstart.md`.
- [x] T005 [P] [US1] Search all target application repositories for common page-level structures such as `header` + `main` + `footer` inside a `Container` (FR-003). Record each distinct structure in `docs/plans/semantic-react/audit-findings.md`.
- [x] T006 [P] [US1] Search all target application repositories for repeated `Stack` + form-control patterns (FR-004). Record each distinct form layout pattern in `docs/plans/semantic-react/audit-findings.md`.
- [x] T007 [P] [US1] Search all target application repositories for action-bar and button-group arrangements used repeatedly (FR-005). Record each distinct action-grouping pattern in `docs/plans/semantic-react/audit-findings.md`.
- [x] T008 [US1] For each pattern recorded in T003–T007, fill in the intent field: a semantic description of what the pattern expresses (FR-006). Update `docs/plans/semantic-react/audit-findings.md`.
- [x] T009 [US1] For each pattern recorded in T003–T007, classify it as domain-specific, reusable, or incidental using the decision tree in `specs/055-audit-app-layouts/research.md` Decision 1 (FR-006, FR-011). Update `docs/plans/semantic-react/audit-findings.md`.

**Checkpoint**: Raw pattern inventory complete — at least 5 distinct patterns recorded with frequency, intent, and classification.

---

## Phase 3: User Story 2 — Categorize and Rank Candidates (P2)

**Goal**: Group the identified patterns by intent category and rank them within each category by frequency and reusability. The output is a structured audit document ready for slice 14 consumption.

**Independent Test**: Verify the audit document sections are organized by pattern category, and that within each category, patterns are ordered by frequency. Confirm at least one candidate per category includes a reusability assessment.

**Dependencies**: Phase 2 (US1) must be complete — categorization requires the raw pattern inventory.

### Implementation for User Story 2

- [x] T010 [US2] Group all patterns from Phase 2 into intent categories. Categories must emerge from the actual patterns found, not a predefined list (FR-007). Document each category as a top-level section in `docs/plans/semantic-react/audit-findings.md`.
- [x] T011 [US2] Within each category, rank patterns by frequency (primary) and reusability (secondary). Reusable candidates must appear first within their category (FR-008). Reorder the pattern entries in `docs/plans/semantic-react/audit-findings.md`.
- [x] T012 [US2] For each pattern classified as reusable, add a brief rationale explaining why it is reusable rather than domain-specific. Update `docs/plans/semantic-react/audit-findings.md`.
- [x] T013 [US2] Identify at least one pattern explicitly classified as incidental with rationale explaining it is a one-off styling choice or copy-paste artifact (SC-006, FR-011). Document in `docs/plans/semantic-react/audit-findings.md`.

**Checkpoint**: Patterns are categorized and ranked — the audit document has a structured, scannable format ready for API sketches.

---

## Phase 4: User Story 3 — Draft API Sketches (P3)

**Goal**: For each reusable candidate, draft a rough API sketch and assess the required SCSS contract. This seeds slice 14 with starting points.

**Independent Test**: For each reusable pattern, verify the audit document includes a proposed component name and prop signature, and a note on whether the required SCSS contract already exists or needs creation.

**Dependencies**: Phase 3 (US2) must be complete — classification into reusable must be done before sketches.

### Implementation for User Story 3

- [x] T014 [US3] For each pattern classified as reusable, draft a rough API sketch including a proposed component name and brief prop signature (FR-009). Add each sketch to the pattern entry in `docs/plans/semantic-react/audit-findings.md`.
- [x] T015 [US3] For each reusable pattern, assess the SCSS contract: identify whether owning `pathable-*` classes already exist in `@pathable/styles` or need to be created (FR-010). Document the status for each pattern in `docs/plans/semantic-react/audit-findings.md`.
- [x] T016 [US3] Verify every reusable pattern in the audit has both an API sketch and an SCSS contract note (SC-002). Add any missing entries.

**Checkpoint**: All reusable candidates have API sketches and SCSS contract assessments — the audit is ready for slice 14.

---

## Phase 5: Finalize and Validate

**Purpose**: Validate the audit document against all success criteria and link it to the slice 14 composition-patterns document.

- [x] T017 Run a spot-check verification: pick 3 patterns from the audit document, re-run the search command in source repositories, and confirm frequency counts match within a reasonable margin (SC-005). Document verification results at the bottom of `docs/plans/semantic-react/audit-findings.md`.
- [x] T018 Validate the audit against all six success criteria (SC-001 through SC-006). Document the pass/fail status for each criterion in a validation section at the bottom of `docs/plans/semantic-react/audit-findings.md`.
- [x] T019 Update `docs/plans/semantic-react/14-promote-composition-patterns.md` to reference the audit deliverable and populate or update its candidate list with the reusable patterns found (FR-012, SC-004).
- [x] T020 Run Markdown linting on `docs/plans/semantic-react/audit-findings.md` and fix any findings without disabling rules or adding ignore entries.

**Checkpoint**: Audit document is validated and linked to slice 14. Feature is complete.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Audit Preparation)**: No dependencies — can start immediately.
- **Phase 2 (User Story 1)**: Depends on Phase 1 (need repo list and access). Within US1, tasks T003–T007 are all [P] (parallel searches), while T008–T009 depend on T003–T007 completion (need search results to classify).
- **Phase 3 (User Story 2)**: Depends on Phase 2 complete (needs raw inventory to categorize).
- **Phase 4 (User Story 3)**: Depends on Phase 3 complete (needs reusable classification to sketch APIs).
- **Phase 5 (Finalize)**: Depends on all user story phases complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 — no dependencies on other stories.
- **User Story 2 (P2)**: Depends on US1 — needs the raw pattern inventory as input to categorization.
- **User Story 3 (P3)**: Depends on US2 — needs reusable classification before API sketches.

> **Note on sequential dependency**: Unlike code features where US1/US2/US3 can be built in parallel, this audit feature has a natural pipeline: search → classify → rank → sketch. US2 and US3 enrich the same document incrementally rather than producing independent artifacts.

### Within Each User Story

- In US1: T003–T007 (parallel searches) → T008 (intent) → T009 (classification)
- In US2: T010 (categorize) → T011 (rank) → T012–T013 (rationale)
- In US3: T014 (API sketches) and T015 (SCSS contracts) are parallel → T016 (completeness check)

### Parallel Opportunities

- T003–T007: All five search dimensions can run in parallel (different search queries, same document).
- T008 and T009: Intent and classification can be done per-pattern in any order once searches are complete.
- T014 and T015: API sketches and SCSS contract assessment can be done in parallel per pattern.
- T012 and T013: Rationale for reusable and incidental patterns can be written in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Identify and verify target repositories.
2. Complete Phase 2 (US1): Run all five searches, record patterns, assign intent and classification.
3. **STOP and VALIDATE**: Confirm at least 5 patterns are recorded with classification. The raw inventory alone is useful for slice 14 even without categorization or API sketches.
4. If ready, proceed to Phase 3.

### Incremental Delivery

1. Phase 1 → Repositories identified.
2. Phase 2 (US1) → Raw pattern inventory with classifications (MVP — already useful for slice 14).
3. Phase 3 (US2) → Patterns grouped and ranked by category.
4. Phase 4 (US3) → API sketches and SCSS notes for reusable candidates.
5. Phase 5 → Validated, linted, and linked to slice 14.

### Parallel Team Strategy

This feature is best executed by a single maintainer due to the sequential pipeline. If two people collaborate:
- One runs searches (US1) while the other prepares the document scaffold.
- Once US1 is complete, both can classify patterns in parallel.
- US2 and US3 are review-oriented and best done together.

---

## Notes

- [P] tasks = different search queries or independent per-pattern work with no dependencies.
- [Story] label maps task to specific user story for traceability.
- All tasks write to a single deliverable: `docs/plans/semantic-react/audit-findings.md`.
- No tests are included — the spec does not request test tasks for a documentation-only feature.
- No Storybook, accessibility, responsive, visual regression, or package validation tasks apply — this feature produces zero rendered UI and zero code artifacts.
- No lint rules are disabled, weakened, or skipped.
- Commit after each phase or logical group.
- If no application repositories are accessible, document the limitation per the edge case in spec.md and classify the feature as "done" with documented constraints.
- The `13-audit-application-layouts.md` file marking the feature as DONE is separate from the audit deliverable — update its status line from "NOT STARTED" to "DONE" upon completion.