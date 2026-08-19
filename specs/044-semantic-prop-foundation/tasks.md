# Tasks: Semantic Utility Type System and Class Resolvers

**Input**: Design documents from `specs/044-semantic-prop-foundation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED by the feature specification (FR-009, FR-010). Unit tests must achieve 100% coverage of resolver functions and mergeClasses.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Table of Contents

- [Format](#format-id-p-story-description)
- [Path Conventions](#path-conventions)
- [Phase 1: Setup (Shared Infrastructure)](#phase-1-setup-shared-infrastructure)
- [Phase 2: User Story 1 - Capability Inventory and Gap Analysis (P1)](#phase-2-user-story-1---capability-inventory-and-gap-analysis-p1-)
- [Phase 3: User Story 2 - Typed Semantic Props and Resolvers (P1)](#phase-3-user-story-2---typed-semantic-props-and-resolvers-p1-)
- [Phase 4: User Story 3 - Class-Merging Order and Conflict Policy (P2)](#phase-4-user-story-3---class-merging-order-and-conflict-policy-p2)
- [Phase 5: User Story 4 - Unit Test Coverage for Every Mapping (P2)](#phase-5-user-story-4---unit-test-coverage-for-every-mapping-p2)
- [Phase 6: Polish & Cross-Cutting Concerns](#phase-6-polish--cross-cutting-concerns)
- [Dependencies & Execution Order](#dependencies--execution-order)
- [Parallel Example: User Story 2](#parallel-example-user-story-2)
- [Implementation Strategy](#implementation-strategy)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- All changes are within `packages/react/`
- Source code: `packages/react/src/internal/resolvers/`
- Tests: `packages/react/src/internal/resolvers/__tests__/`
- Documentation: `packages/react/docs/`
- Config: `packages/react/vitest.config.ts`, `packages/react/package.json`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add Vitest test runner and establish directory structure

- [x] T001 Install Vitest as devDependency in `packages/react/package.json` via `pnpm --filter @pathableai/react add -D vitest @vitest/coverage-v8`
- [x] T002 [P] Create `packages/react/vitest.config.ts` with ESM config, test glob pointing to `src/**/*.test.ts`, coverage targeting `src/internal/resolvers/**/*.ts` with 100% functions threshold
- [x] T003 [P] Add `test:unit`, `test:unit:watch`, and `test:unit:coverage` scripts to `packages/react/package.json`
- [x] T004 Create directory structure: `packages/react/src/internal/resolvers/` and `packages/react/src/internal/resolvers/__tests__/`

**Checkpoint**: Vitest is installed, config exists, directory structure ready

---

## Phase 2: User Story 1 - Capability Inventory and Gap Analysis (P1) 🎯 MVP

**Goal**: Produce a verified inventory document of all `@pathable/styles` utility CSS classes, organized by semantic capability, with recorded gaps

**Independent Test**: Inspect `packages/react/docs/capability-inventory.md` and confirm it lists 21 utility families (bg, text, padding, padding-x, padding-y, margin, margin-x, margin-y, margin-top, margin-bottom, display, font-family, text-weight, text-align, border, border-radius, flex, align-items, justify-content, width, maxw) with class prefixes, values, SCSS source files, plus a Gaps section

### Implementation for User Story 1

- [x] T005 [US1] Create capability inventory document at `packages/react/docs/capability-inventory.md` listing all 21 utility families from `packages/styles/src/_utilities.scss` with: SCSS module key, class prefix, CSS property, enumerated values, responsive flag, state variants, owning SCSS source file; organized into the 8 semantic capability groups (sizing, spacing, display, alignment, visibility, flex/grid, typography, color/tone); include a Gaps section recording all documented gaps from data-model.md

**Checkpoint**: Inventory document exists, verified against SCSS source, gaps documented — ready for type definition

---

## Phase 3: User Story 2 - Typed Semantic Props and Resolvers (P1)

**Goal**: Define all TypeScript value types, capability interfaces, and pure resolver functions that map semantic values to verified `@pathable/styles` CSS class strings

**Independent Test**: Import any resolver, call with valid/undefined/null/invalid values, verify correct class string or undefined. Verify all resolvers reference zero browser globals. Verify `tsc --noEmit` passes without errors.

### Implementation for User Story 2

- [x] T006 [US2] Create shared value types and capability interfaces in `packages/react/src/internal/resolvers/types.ts`: `Width`, `MaxWidth`, `SpacingScale`, `Display`, `AlignItems`, `JustifyContent`, `TextAlign`, `Flex`, `FontFamily`, `FontWeight`, `BackgroundColor`, `TextColor` as string-literal unions per data-model.md; `SizingProps`, `SpacingProps`, `DisplayProps`, `AlignmentProps`, `FlexGridProps`, `TypographyProps`, `ColorToneProps` interfaces

- [x] T007 [P] [US2] Implement sizing resolvers in `packages/react/src/internal/resolvers/sizing.ts`: `widthClass` maps `Width` values to `pathable-width-*` classes; `maxWidthClass` maps `MaxWidth` values to `pathable-maxw-*` classes; each using `Record + as const satisfies` pattern per contracts/resolver-api.md

- [x] T008 [P] [US2] Implement spacing resolvers in `packages/react/src/internal/resolvers/spacing.ts`: `paddingAllClass`, `paddingXClass`, `paddingYClass`, `marginAllClass`, `marginXClass`, `marginYClass`, `marginTopClass`, `marginBottomClass` — each mapping `SpacingScale` values (`0`–`10`, `15`) to the corresponding `pathable-padding-*` / `pathable-margin-*` classes

- [x] T009 [P] [US2] Implement display resolver in `packages/react/src/internal/resolvers/display.ts`: `displayClass` mapping `Display` values to `pathable-display-*` classes

- [x] T010 [P] [US2] Implement alignment resolvers in `packages/react/src/internal/resolvers/alignment.ts`: `alignItemsClass` mapping `AlignItems` values to `pathable-flex-align-*` classes; `justifyContentClass` mapping `JustifyContent` values to `pathable-flex-justify-*` classes; `textAlignClass` mapping `TextAlign` values to `pathable-text-*` classes (note: shared `pathable-text` prefix, disambiguated by function name)

- [x] T011 [P] [US2] Implement flex/grid resolver in `packages/react/src/internal/resolvers/flexGrid.ts`: `flexClass` mapping `Flex` values (`1`, `fill`) to `pathable-flex-*` classes

- [x] T012 [P] [US2] Implement typography resolvers in `packages/react/src/internal/resolvers/typography.ts`: `fontFamilyClass` mapping `FontFamily` values to `pathable-font-family-*` classes; `fontWeightClass` mapping `FontWeight` values to `pathable-text-*` classes (shared `pathable-text` prefix; function name `fontWeightClass` disambiguates)

- [x] T013 [P] [US2] Implement color/tone resolvers in `packages/react/src/internal/resolvers/colorTone.ts`: `backgroundColorClass` mapping `BackgroundColor` values to `pathable-bg-*` classes; `textColorClass` mapping `TextColor` values to `pathable-text-*` classes (shared `pathable-text` prefix; function name `textColorClass` disambiguates)

- [x] T014 [US2] Create internal barrel export at `packages/react/src/internal/resolvers/index.ts` that re-exports all types from `types.ts` and all resolver functions from each module; verify `src/index.ts` does NOT import from this file (package boundary contract)

- [x] T015 [US2] Run `pnpm --filter @pathableai/react typecheck` and `pnpm --filter @pathableai/react lint` — fix any errors

**Checkpoint**: All value types, interfaces, and resolvers exist. TypeScript compiles cleanly. No browser globals referenced. Public entry point does not expose internal resolvers.

---

## Phase 4: User Story 3 - Class-Merging Order and Conflict Policy (P2)

**Goal**: Implement the `mergeClasses` utility and document the conflict resolution policy

**Independent Test**: Call `mergeClasses` with component base, semantic, and consumer class strings; assert output follows the `component → semantic → consumer` order. Verify conflict policy is documented in source.

### Implementation for User Story 3

- [x] T016 [US3] Implement `mergeClasses` in `packages/react/src/internal/resolvers/mergeClasses.ts`: accepts variadic `(string | undefined | null)[]` sources, filters empty/undefined/null, joins with space, returns `undefined` if all sources empty. Add to internal barrel in `index.ts`.

- [x] T017 [US3] Document conflict policy in `packages/react/src/internal/resolvers/conflictPolicy.md`: shorthand vs directional (directional wins via CSS cascade order), duplicate classes are harmless, consumer `className` always takes final precedence per contracts/resolver-api.md

- [x] T018 [US3] Run typecheck and lint — fix any errors

**Checkpoint**: `mergeClasses` works, conflict policy documented, typecheck and lint pass

---

## Phase 5: User Story 4 - Unit Test Coverage for Every Mapping (P2)

**Goal**: Achieve 100% unit test coverage for all resolver functions and mergeClasses, covering valid values, undefined, null, and invalid inputs

**Independent Test**: Run `pnpm --filter @pathableai/react test:unit:coverage` and verify 100% functions coverage for `src/internal/resolvers/`. All tests pass. No resolver code references browser globals.

### Implementation for User Story 4

- [x] T019 [P] [US4] Create unit tests in `packages/react/src/internal/resolvers/__tests__/sizing.test.ts`: test `widthClass` and `maxWidthClass` for each valid value (exact class string), `undefined` input, `null` input, and invalid value — all return expected results

- [x] T020 [P] [US4] Create unit tests in `packages/react/src/internal/resolvers/__tests__/spacing.test.ts`: test all 8 spacing resolvers (`paddingAllClass`, `paddingXClass`, `paddingYClass`, `marginAllClass`, `marginXClass`, `marginYClass`, `marginTopClass`, `marginBottomClass`) — each for valid values 0–10, 15; undefined; null; invalid

- [x] T021 [P] [US4] Create unit tests in `packages/react/src/internal/resolvers/__tests__/display.test.ts`: test `displayClass` for each of `flex|block|inline|inline-block|none`, undefined, null, invalid

- [x] T022 [P] [US4] Create unit tests in `packages/react/src/internal/resolvers/__tests__/alignment.test.ts`: test `alignItemsClass`, `justifyContentClass`, `textAlignClass` — each for all valid values, undefined, null, invalid

- [x] T023 [P] [US4] Create unit tests in `packages/react/src/internal/resolvers/__tests__/flexGrid.test.ts`: test `flexClass` for `1` and `fill`, undefined, null, invalid

- [x] T024 [P] [US4] Create unit tests in `packages/react/src/internal/resolvers/__tests__/typography.test.ts`: test `fontFamilyClass` for all 4 values, `fontWeightClass` for all 3 values — undefined, null, invalid for each

- [x] T025 [P] [US4] Create unit tests in `packages/react/src/internal/resolvers/__tests__/colorTone.test.ts`: test `backgroundColorClass` for all 9 values, `textColorClass` for all 6 values — undefined, null, invalid for each

- [x] T026 [P] [US4] Create unit tests in `packages/react/src/internal/resolvers/__tests__/mergeClasses.test.ts`: test merge order (base → semantic → consumer), all undefined inputs, mixed undefined and valid, empty string handling, single input, duplicate classes

- [x] T027 [P] [US4] Create browser-globals test in `packages/react/src/internal/resolvers/__tests__/purity.test.ts`: import all resolver modules, verify no file references `window`, `document`, `navigator`, `localStorage`, or any DOM API; verify all resolver functions are synchronous and non-throwing for any input

- [x] T028 [US4] Run `pnpm --filter @pathableai/react test:unit:coverage` — verify 100% functions coverage and all tests pass; fix any failures or coverage gaps

**Checkpoint**: All unit tests pass, 100% resolver coverage, no browser globals referenced

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, package boundary verification, final validation

- [x] T029 [P] Add `className` escape-hatch note to `packages/react/README.md` explaining that when a desired utility lacks a semantic prop mapping, consumers can use `className` directly with the `@pathable/styles` class name

- [x] T030 [P] Verify package boundary: run `pnpm --filter @pathableai/react build` then `grep -r "widthClass\|mergeClasses\|SizingProps" packages/react/dist/` — confirm no resolver exports leak into public build output

- [x] T031 Run full quickstart validation per `specs/044-semantic-prop-foundation/quickstart.md`: build styles, typecheck, unit test, lint, full build — all pass

- [x] T032 [P] Ensure `src/internal/` matches existing pattern: verify `tsconfig.json` includes `src/` (all internal code type-checked), `"files": ["dist"]` excludes from publish, `src/index.ts` has no resolver imports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **User Story 1 (Phase 2)**: No hard dependency on Phase 1 beyond directory existing — can start after T004
- **User Story 2 (Phase 3)**: Depends on US1 (Phase 2) for verified class inventory; depends on Phase 1 for directory and typecheck infrastructure
- **User Story 3 (Phase 4)**: Depends on US2 (Phase 3) — `mergeClasses` composes resolver output
- **User Story 4 (Phase 5)**: Depends on US2 (Phase 3) and US3 (Phase 4) for all functions to test
- **Polish (Phase 6)**: Depends on all phases complete

### User Story Dependencies

- **US1 (P1)**: Can start after T004 (directory created). No other story dependencies.
- **US2 (P1)**: Depends on US1 (inventory) — types must align with verified classes
- **US3 (P2)**: Depends on US2 (resolvers exist for merge testing)
- **US4 (P2)**: Depends on US2 + US3 (all functions exist to test)

### Within Each User Story

- US2: T006 (types) before T007–T013 (resolvers import types), then T014 (barrel), then T015 (verify)
- US2: T007–T013 can all run in parallel (independent files)
- US3: T016 before T017 (document references merge behavior), then T018
- US4: T019–T027 all parallel, then T028 (aggregate verification)

### Parallel Opportunities

- T002, T003 can run in parallel (config file and package.json edits are independent)
- All US2 resolver modules (T007–T013) can run in parallel — each is a separate file with no inter-dependencies
- All US4 test files (T019–T027) can run in parallel — each tests a separate module
- T029, T030, T032 in Phase 6 can run in parallel

---

## Parallel Example: User Story 2

```bash
# After types.ts (T006) is done, launch all resolver modules together:
Task: "Implement sizing resolvers in packages/react/src/internal/resolvers/sizing.ts"
Task: "Implement spacing resolvers in packages/react/src/internal/resolvers/spacing.ts"
Task: "Implement display resolver in packages/react/src/internal/resolvers/display.ts"
Task: "Implement alignment resolvers in packages/react/src/internal/resolvers/alignment.ts"
Task: "Implement flex/grid resolver in packages/react/src/internal/resolvers/flexGrid.ts"
Task: "Implement typography resolvers in packages/react/src/internal/resolvers/typography.ts"
Task: "Implement color/tone resolvers in packages/react/src/internal/resolvers/colorTone.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (Vitest + directory)
2. Complete Phase 2: User Story 1 (inventory document)
3. Complete Phase 3: User Story 2 (types + resolvers)
4. **STOP and VALIDATE**: Typecheck passes, resolvers work, inventory is accurate
5. This alone provides value — downstream components can start importing resolvers

### Incremental Delivery

1. Setup + US1 → Inventory exists, classes are verified
2. + US2 → Types and resolvers are usable by component authors
3. + US3 → Class merging is safe and predictable
4. + US4 → Full test coverage ensures regression safety
5. + Polish → Package is documented and boundary-verified

### Suggested MVP Scope

**MVP = Phase 1 + 2 + 3**: Setup, inventory, types, and resolvers. At this point, components in `packages/react` can adopt semantic props by importing resolvers from `internal/resolvers/`. The `mergeClasses` utility (US3) is needed for practical adoption but technically US2 alone provides the value-type-to-class mapping.

### Execution Order Summary

```
T001 → T002, T003 (parallel) → T004
                                  ↓
                              T005 (US1 - inventory)
                                  ↓
                              T006 (US2 - types)
                                  ↓
                    T007 T008 T009 T010 T011 T012 T013 (US2 - resolvers, parallel)
                                  ↓
                              T014 → T015
                                  ↓
                    T016 → T017 → T018 (US3 - merge + conflict)
                                  ↓
    T019 T020 T021 T022 T023 T024 T025 T026 T027 (US4 - tests, parallel)
                                  ↓
                              T028 (US4 - verify)
                                  ↓
                    T029, T030, T032 (Polish, parallel)
                                  ↓
                              T031 (final quickstart)
```

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Resolver modules that share the `pathable-text` prefix (textColorClass, fontWeightClass, textAlignClass) are in separate files (colorTone.ts, typography.ts, alignment.ts) with unambiguous function names — no collision risk
- The visibility capability is a documented gap — no resolvers or types for it
- No new React components, no SCSS changes, no Storybook stories included per spec FR-013, FR-014
- Commit after each phase completion for logical granularity