# Implementation Plan: React Dashboard Overview Composition Page

**Branch**: `040-react-dashboard-overview` | **Date**: 2026-08-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/040-react-dashboard-overview/spec.md`

## Summary

Add a `Dashboard/Dashboard Overview` **pattern/composition story** to the React
Storybook mirroring the styles catalog's `Dashboard Overview`
(`packages/styles/src/stories/dashboard/DashboardOverview.stories.ts`). The
story composes existing React primitives — `DashboardHeader`, `ActivityList`,
`Button`, and `Table` — with the KPI region rendered via the documented
`pathable-kpi-*` styles-contract classes. It exposes three fixed deterministic
states (`Populated`, `Loading`, `Empty`), a `Mobile` narrow viewport story, and
a `Playground`. No new production component, prop, or export is introduced.

## Technical Context

**Language/Version**: TypeScript 5.7+, React 18/19

**Primary Dependencies**: `@pathableai/styles` (workspace:`*` — runtime
dependency, already declared), `@pathableai/react` public entrypoint components
(`DashboardHeader`, `ActivityList`, `Button`, `Table`), `storybook/test`
(`fn`, `userEvent`, `within`, `expect`).

**Storage**: N/A — presentational Storybook pattern story; deterministic fixtures only.

**Testing**: Storybook (`@storybook/test` play functions, `@storybook/addon-a11y`), ESLint (`--max-warnings=0`), `tsc` type-check, React Storybook build + test-runner.

**Target Platform**: Web browsers (React Storybook rendering).

**Project Type**: Design-system pattern/composition story in `packages/react`
(`apps/storybook-react`) over the `@pathableai/styles` contract.

**Performance Goals**: N/A — static presentational stories.

**Constraints**: No `packages/styles` change; no new React component/export; no
wrapper-only styling. Every rendered class must map to a documented
`@pathable/styles` class contract. Story content must be deterministic.

**Scale/Scope**: 1 new story file + spec/plan documentation. No source/library
code changes, no new dependencies, no package publish.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- [x] Only `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`
  is added. No `packages/styles` change, no component/export change.
- [x] Owning styles contract identified: `packages/styles` `Dashboard Overview`
  CSS-only composition (`pathable-dashboard-header`, `pathable-kpi-grid`,
  `pathable-activity-list`, `pathable-table`) — exists and is exported.
- [x] No new wrapper component name; the composition reuses existing React
  primitives (`DashboardHeader`, `ActivityList`, `Button`, `Table`) whose names
  are CamelCase forms of the equivalent `pathable-*` styles names.
- [x] Preserves the shared package's semantic HTML (`h1` header title,
  `role="listitem"` rows, native buttons) and visual behavior.

### Consumer and Publishable Validation

- [x] No public API or export change. Components used are already exported from
  the React package entrypoint, which transitively imports `@pathable/styles`
  CSS/fonts/assets (Principle V).
- [x] No new declarations or breaking changes. `pnpm check:package` /
  `pnpm check:types` remain green (no package content change).
- [x] N/A publishable validation — no package changes to publish.

### Validation Gates

- [x] Plan identifies `pnpm --filter @pathableai/react lint`, `typecheck`,
  `build`, and `pnpm test:storybook-react` gates.
- [x] No lint weakening/disablement; findings fixed at source.
- [x] No silent file exclusion to pass CI.

### Story and Interaction Requirements

- [x] Fixed named stories per supported state: `Populated`, `Loading`,
  `Empty`, `Mobile` — plus a `Playground` (exploratory only).
- [x] Browser-executed interaction test for keyboard focus/activation of header
  action buttons and an activity-list action.
- [x] Accessible queries (`getByRole`, `getByText`) and observable outcomes;
  no `data-testid`/CSS selectors.
- [x] Deterministic content — no dates, random values, or network calls.
- [x] Doc string explains pattern-story semantic intent and that it composes
  existing primitives (no new API).

### Accessibility

- [x] Exactly one `h1` (header title); native buttons/links; visible focus.
- [x] Static JSX a11y linting + rendered a11y checks (test-runner/a11y addon)
  both covered; no broad rule disablement.
- [x] KPI trend text visible (color is supplementary); loading placeholders
  `aria-hidden`.
- [x] Synthetic, non-sensitive fixture content.

### Responsive and Resilient States

- [x] `Mobile` story covers narrow viewport wrap/stacking.
- [x] Long label handling inherited from styles contract (KPI LongLabel,
  header LongTitle).
- [x] `Loading` and `Empty` resilient states covered as fixed stories.
- [x] Forced-colors/reduced-motion inherited from styles contract.

### Visual Regression

- [x] `Populated`, `Loading`, `Empty`, `Mobile` serve as deterministic
  visual-regression fixtures; visual checks protect typography, spacing,
  wrapping, responsive behavior, focus, and state presentation.

### Documentation Surface Ownership

- [x] Storybook is the executable catalog for this pattern (canonical source).
  Spec/plan describe requirements and decisions; `AGENTS.md` plan pointer
  updated to `specs/040-react-dashboard-overview/plan.md`.

### Cross-Framework Impact

- [x] No `packages/styles` or shared-contract change — N/A. The styles
  Storybook remains untouched and its `Dashboard Overview` remains canonical.

### Complexity Tracking

- [x] No violations.

**Gate Result**: ALL PASS. No violations. Proceed to Phase 0.

## Phase 0: Research

All unknowns resolved from repository-internal context (see `research.md`):

| Research Item | Resolution |
|---|---|
| Component vs pattern | **Pattern story**, no new component. File `packages/react/src/stories/dashboard/DashboardOverview.stories.tsx`. |
| Story title | `Dashboard/Dashboard Overview` (joins existing `Dashboard/` stories) |
| KPI region | Render via documented `pathable-kpi-*` classes (no React wrapper yet — followed-up separately) |
| States | `Populated`, `Loading`, `Empty` + `Mobile` view; `Playground` for exploration |
| Interaction test | Keyboard focus + Enter/Space activation on header action button (and activity action) using `fn()` |
| Story discovery | Glob `packages/react/src/stories/**/*.stories.tsx` (already configured) — no config change |

**Output**: `research.md`

## Phase 1: Design & Contracts

- **Data model**: `./data-model.md` — composed page entities (no production API).
- **Story contract**: `./contracts/story.md` — story metadata, DOM output per
  state, behavior contract.
- **Validation path**: `./quickstart.md` — runnable validation scenarios.

## Constitution Check (Post-Design Re-evaluation)

- [x] Principle IV — reuses existing React primitives; no new component/API.
- [x] Principle V — no CSS import change; transitive styles via package entry.
- [x] Principle X — semantic heading, native controls, `aria-hidden` loading
  placeholders, visible KPI trend text.
- [x] Principle XIV — pattern story composes existing components; fixed named
  stories + `Playground`; interaction tests via accessible queries.
- [x] Principle XV — `Mobile` + `Loading`/`Empty` coverage.
- [x] Principle XVI — React Storybook builds/tests independently via
  `pnpm docs:react` / `pnpm test:storybook-react`; styles Storybook untouched.

**Post-Design Gate Result**: ALL PASS.

## Project Structure

### Documentation (this feature)

```text
specs/040-react-dashboard-overview/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── contracts/
│   └── story.md         # Phase 1 output — pattern story contract
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
packages/react/src/stories/dashboard/
├── DashboardHeader.stories.tsx        # existing
├── ActivityList.stories.tsx           # existing
└── DashboardOverview.stories.tsx      # [CREATE] pattern story (this feature)
```

**Structure Decision**: The new story lives alongside the existing `Dashboard/`
stories in `packages/react/src/stories/dashboard/`, mirroring the styles
Storybook's `stories/dashboard/` layout. The story `title` is
`Dashboard/Dashboard Overview`, so it renders under the same `Dashboard` section
as `DashboardHeader` and `ActivityList` in the React Storybook. No new SCSS,
component, export, dependency, or config change is needed; story auto-discovery
glob already covers this path.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations found. This section is intentionally blank.

## Design Artifacts

- Research decisions: `./research.md`
- Data model: `./data-model.md`
- Interface contract: `./contracts/story.md`
- Validation path: `./quickstart.md`

## Visual fidelity navigation

- Visual validation decisions: `./research.md`
- Visual interaction contract: `./contracts/story.md`
- Visual proof execution: `./quickstart.md`

## Mandatory Post-Execution Hooks

Check `.specify/extensions.yml` for `hooks.after_plan`:
- `speckit.git.commit` (optional): Auto-commit after implementation planning
- `speckit.agent-context.update` (disabled): skipped

## Completion Report

**Branch**: `040-react-dashboard-overview`

**Generated Artifacts**:
- `specs/040-react-dashboard-overview/plan.md` (this file)
- `specs/040-react-dashboard-overview/research.md`
- `specs/040-react-dashboard-overview/data-model.md`
- `specs/040-react-dashboard-overview/contracts/story.md`
- `specs/040-react-dashboard-overview/quickstart.md`
- `AGENTS.md` (updated plan reference)

**Readiness**: Ready for `/speckit-tasks`.