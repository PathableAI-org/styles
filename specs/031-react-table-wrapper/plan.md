# Implementation Plan: React Table Wrapper

**Branch**: `031-react-table-wrapper` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/031-react-table-wrapper/spec.md`

## Summary

Add `Table` to `packages/react` as a thin semantic wrapper around the existing
`packages/styles` `pathable-table` contract. It will preserve consumer-composed
native table children and attributes, map the default, borderless, compact, and
striped presentations to existing classes, export through `@pathable/react`,
and rely on the package entrypoint for transitive Pathable styling.

## Technical Context

**Language/Version**: JavaScript modules with React JSX, following current
`packages/react` source conventions and the repository Node engine policy.

**Primary Dependencies**: React, `prop-types`, Vite, and `@pathable/styles` as
the owning design-system contract.

**Storage**: N/A; presentational library component with no persistence.

**Testing**: React package build, React Storybook build, package-content dry
run, and manual semantic/accessibility scenarios from [quickstart.md](./quickstart.md).

**Target Platform**: Browser UI consumers importing `@pathable/react`.

**Project Type**: pnpm workspace library package with React Storybook examples.

**Performance Goals**: A developer can render a documented Pathable table in
under 5 minutes; the wrapper adds no data fetching or state-management cost.

**Constraints**: Preserve native table semantics; keep `packages/styles`
authoritative; keep `packages/react` thin; introduce no wrapper CSS, tokens,
interaction orchestration, or lint bypasses.

**Scale/Scope**: One React component, one public export, one Storybook story
family, README documentation, and package validation evidence.

## Constitution Check

*GATE: Must pass before Phase 0 research and again after Phase 1 design.*

- Owning source contract exists at
  `packages/styles/src/pathable-component-wrappers/pathable-table.scss` and is
  documented by `packages/styles/src/stories/components/Basic/Table.stories.js`.
- `Table` follows React naming parity by removing `pathable` from
  `pathable-table` and using CamelCase.
- All visual presentations map to existing source classes; no new source-layer
  visual contract is required.
- Consumers continue importing only from `@pathable/react`; its public
  entrypoint already imports `@pathable/styles/dist/styles.css`.
- Native table children remain consumer-owned; the wrapper does not create a
  competing rows-and-columns data model.
- No lint rule is disabled, weakened, skipped, or silenced.
- Complexity violations: none.

**Gate Status**: PASS.

## Scope Lock (R/M/U/O)

- **R**: `styles` pnpm workspace; environment context only.
- **M**: `packages/react` component-wrapper capability; hard outer boundary.
- **U**: React `Table` wrapper aligned to `pathable-table`; primary planning
  object.
- **O**: Component class mapping, public export, stories, README examples, and
  validation commands.

Planning locks **M + U**. Changes to `packages/styles`, unrelated React
components, or application-oriented table orchestration require a separately
justified source-contract gap or feature.

## Project Structure

### Documentation (this feature)

```text
specs/031-react-table-wrapper/
├── plan.md
├── research.md
├── data-model.md
├── class-diagram.md
├── quickstart.md
├── checklists/
│   ├── requirements.md
│   └── behavior-testability.md
└── contracts/
    ├── props.md
    └── sequences.md
```

### Source Code (repository root)

```text
packages/styles/src/
├── pathable-component-wrappers/pathable-table.scss
└── stories/components/Basic/Table.stories.js

packages/react/
├── README.md
└── src/
    ├── index.js
    ├── components/Table/Table.jsx
    └── stories/components/Basic/Table.stories.jsx

apps/storybook-react/package.json
```

**Structure Decision**: Add only the React wrapper, export, stories, and
documentation. Keep the source styles contract unchanged unless implementation
uncovers a genuine contract defect that cannot be solved in the thin wrapper.

## Phase 0 Research

Research is complete in [research.md](./research.md). Decisions:

- Use `pathable-table` as the sole visual contract.
- Expose `Table` with consumer-composed semantic children rather than a data
  schema.
- Map `default`, `borderless`, `compact`, and `striped` to existing classes.
- Fall back to `default` for unsupported presentation values.
- Preserve attributes and transitive styling through existing package patterns.
- Validate package, Storybook, package contents, and semantic scenarios.

## Phase 1 Design & Contracts

Generated design artifacts:

- [data-model.md](./data-model.md)
- [class-diagram.md](./class-diagram.md)
- [contracts/props.md](./contracts/props.md)
- [contracts/sequences.md](./contracts/sequences.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- `packages/styles` remains authoritative and unchanged by the planned scope.
- `Table` maps only to `pathable-table` and its three basic modifiers.
- Consumer markup, table semantics, content, and attributes are preserved.
- Transitive styles remain anchored in `packages/react/src/index.js`.
- No wrapper-only CSS, data model, state management, design token, or lint
  bypass is planned.
- The M + U scope lock remains intact.

**Gate Status**: PASS.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|---------------------------------------|
| none | N/A | N/A |
