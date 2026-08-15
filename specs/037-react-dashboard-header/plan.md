# Implementation Plan: React Dashboard Header Wrapper

**Branch**: `037-react-dashboard-header` | **Date**: 2026-08-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/037-react-dashboard-header/spec.md`

## Summary

Create a React `DashboardHeader` component in `packages/react` that wraps the
existing `pathable-dashboard-header` styles contract owned by
`packages/styles`. The component renders a dashboard page header with a required
page title (`h1`), optional breadcrumb, context/status, description, and action
regions, plus `compact` and `stacked` modifier variants. Stories are published
under a new top-level `Dashboard` section in the React Storybook (title
`Dashboard/Dashboard Header`), mirroring the `Dashboard/Dashboard Header` entry
in the styles Storybook.

## Technical Context

**Language/Version**: TypeScript 5.7+, React 18/19

**Primary Dependencies**: `@pathableai/styles` (workspace:`*` — runtime dependency, already declared), React 18/19 (peer)

**Storage**: N/A — presentational React wrapper; no data storage

**Testing**: Storybook (`@storybook/test`, `@storybook/addon-a11y`), ESLint, `tsc` type-check, `publint`/`attw` package validation

**Target Platform**: Web browsers (React rendering)

**Project Type**: Design-system wrapper package (`packages/react`) over an existing SCSS/CSS contract

**Performance Goals**: N/A — static presentational component with no runtime logic beyond class assembly

**Constraints**: No wrapper-only styling; every rendered class must map to a documented `pathable-dashboard-header*` BEM class in the styles contract; no new tokens or SCSS

**Scale/Scope**: 1 new component file + 1 story file + 1 barrel export line + spec/plan documentation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- [x] Only `packages/react` changes (new component, story, barrel export). No `packages/styles` change.
- [x] Owning styles contract identified: `packages/styles/src/pathable-component-wrappers/pathable-dashboard-header.scss` (exists, 158 lines).
- [x] React name is CamelCase form of the styles name with `pathable` prefix removed: `pathable-dashboard-header` → `DashboardHeader` (constitution IV / React naming parity).
- [x] Wrapper preserves semantic HTML (`h1` title, `div` regions), class contracts, design tokens, and visual behavior from the styles contract.

### Consumer and Publishable Validation

- [x] `@pathableai/styles` already a runtime dependency; barrel `src/index.ts` already imports `@pathableai/styles` as a side-effect, so consumers get CSS/fonts/assets automatically (Principle V).
- [x] Public API (`DashboardHeaderProps`) and generated declarations are type-safe.
- [x] Plan includes `pnpm pack --dry-run` / `publint` / `attw` verification (no breaking change).

### Validation Gates

- [x] `pnpm lint` (eslint --max-warnings=0), `pnpm typecheck`, `pnpm build`, `pnpm test:storybook-react`, `pnpm check:package`, `pnpm check:types`.
- [x] No lint weakening/disablement; findings fixed at source.

### Story and Interaction Requirements

- [x] Deterministic named stories per supported state (default, without-actions, many-actions, compact, stacked, mobile, long-title) plus Playground.
- [x] Interaction test for keyboard focus/activation of action controls.
- [x] Accessible queries (`getByRole`, `getByText`); deterministic content.

### Accessibility

- [x] Semantic `h1` page heading; native button/link semantics for actions/breadcrumb; forced-colors/reduced-motion inherited from styles contract.
- [x] Static JSX linting + rendered a11y checks both covered; no broad rule disablement.

### Responsive and Resilient States

- [x] Mobile/narrow story; long-title story; actions wrap/stack inherited from styles contract (640px breakpoint).

### Visual Regression

- [x] Stable stories serve as deterministic fixtures; visual checks protect typography, spacing, wrapping, responsive behavior.

### Documentation Surface Ownership

- [x] Storybook is the canonical executable catalog for this component; spec/plan describe requirements and decisions.

### Cross-Framework Impact

- [x] No `packages/styles` or shared-contract change — N/A.

### Complexity Tracking

- [x] No violations.

**Gate Result**: ALL PASS. No violations. Proceed to Phase 0.

## Phase 0: Research

All unknowns resolved from repository-internal context (see `research.md`):

| Research Item | Resolution |
|---|---|
| Component name | `DashboardHeader` (strip `pathable-`, CamelCase `dashboard-header`) |
| File location | `packages/react/src/components/DashboardHeader/DashboardHeader.tsx` |
| BEM classes | `pathable-dashboard-header`, `__breadcrumb`, `__row`, `__title`, `__context`, `__description`, `__actions`, `--compact`, `--stacked` |
| Story location | `packages/react/src/stories/dashboard/DashboardHeader.stories.tsx` (mirrors styles `stories/dashboard/`) |
| Story title | `Dashboard/Dashboard Header` (new top-level section mirroring styles) |
| Barrel export | `export { DashboardHeader } from './components/DashboardHeader/DashboardHeader.js'` + type export |
| Styles strategy | Barrel already imports `@pathableai/styles`; no per-component CSS import |

**Output**: `research.md`

## Phase 1: Design & Contracts

- **Data model**: `./data-model.md` — `DashboardHeader` entity and its regions/props.
- **Interface contract**: `./contracts/props.md` — props, DOM output, empty-state behavior.
- **Validation path**: `./quickstart.md` — runnable validation scenarios.

## Constitution Check (Post-Design Re-evaluation)

- [x] Principle IV — `DashboardHeader` name confirmed; semantic HTML (`h1`, `div`, `p`) preserved.
- [x] Principle V — no direct CSS import in component; barrel provides transitive styles.
- [x] Principle X — semantic heading, native controls, forced-colors/reduced-motion inherited.
- [x] Principle XIV — fixed named stories + Playground; interaction test for keyboard behavior.
- [x] Principle XV — mobile + long-title coverage.
- [x] Principle XVI — React Storybook builds/tests independently via `pnpm docs:react` / `pnpm test:storybook-react`.

**Post-Design Gate Result**: ALL PASS.

## Project Structure

### Documentation (this feature)

```text
specs/037-react-dashboard-header/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── contracts/
│   └── props.md         # Phase 1 output — component API contract
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── components/
│   │   └── DashboardHeader/
│   │       └── DashboardHeader.tsx          # [CREATE] React wrapper component
│   ├── stories/
│   │   └── dashboard/
│   │       └── DashboardHeader.stories.tsx  # [CREATE] Storybook entry (title: 'Dashboard/Dashboard Header')
│   └── index.ts                              # [MODIFY] Add DashboardHeader export
```

**Structure Decision**: The component lives in `packages/react/src/components/DashboardHeader/`
following the `Card`/`AppShell` pattern (CamelCase directory matching component name, no
per-component `index.ts` barrel). The story lives in `packages/react/src/stories/dashboard/`
mirroring the styles Storybook's `stories/dashboard/` directory, with the story `title`
set to `Dashboard/Dashboard Header` so it renders under a new top-level `Dashboard` section
in the React Storybook — matching the styles Storybook structure rather than nesting under
`Components/`. No new SCSS or bundle/import changes needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations found. This section is intentionally blank.

## Design Artifacts

- Research decisions: `./research.md`
- Data model: `./data-model.md`
- Interface contract: `./contracts/props.md`
- Validation path: `./quickstart.md`

## Mandatory Post-Execution Hooks

Check `.specify/extensions.yml` for `hooks.after_plan`:
- `speckit.git.commit` (optional): Auto-commit after implementation planning
- `speckit.agent-context.update` (disabled): skipped

## Completion Report

**Branch**: `037-react-dashboard-header`

**Generated Artifacts**:
- `specs/037-react-dashboard-header/plan.md` (this file)
- `specs/037-react-dashboard-header/research.md`
- `specs/037-react-dashboard-header/data-model.md`
- `specs/037-react-dashboard-header/contracts/props.md`
- `specs/037-react-dashboard-header/quickstart.md`
- `AGENTS.md` (updated plan reference)

**Readiness**: Ready for `/speckit-tasks`.
