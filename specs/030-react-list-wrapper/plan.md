# Implementation Plan: React List Wrapper

**Branch**: `030-react-list-wrapper` | **Date**: 2026-07-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/030-react-list-wrapper/spec.md`

## Summary

Add a `List` component to `packages/react` as a thin wrapper around the existing
`packages/styles` `pathable-list` contract. The wrapper will expose unordered,
ordered, and unstyled list presentations, preserve consumer content and
attributes, export through `@pathable/react`, and rely on the package's existing
public entrypoint to carry `@pathable/styles` styling to consumers.

## Technical Context

**Language/Version**: JavaScript modules with React JSX, matching the current
`packages/react` source files and root Node engine policy.

**Primary Dependencies**: React, `prop-types`, Vite, and `@pathable/styles` as
the owning design-system contract.

**Storage**: N/A; component wrapper with no persistence.

**Testing**: Package build, React Storybook build, package-content dry run, and
manual/Storybook validation scenarios described in [quickstart.md](./quickstart.md).

**Target Platform**: Browser UI consumers importing `@pathable/react`.

**Project Type**: pnpm workspace library package with Storybook examples.

**Performance Goals**: Developers can render a documented Pathable list in
under 5 minutes using package docs or Storybook examples; the wrapper adds no
runtime service or data-fetching cost.

**Constraints**: Keep `packages/styles` authoritative; keep `packages/react` as
a thin wrapper; do not introduce wrapper-only styling, tokens, visual semantics,
or lint bypasses.

**Scale/Scope**: One React component wrapper, one public export, one Storybook
story family, README documentation, and package validation evidence.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Feature changes `packages/react`; it depends on the existing
  `packages/styles` `pathable-list` contract.
- Owning source contract: `packages/styles/src/pathable-component-wrappers/pathable-list.scss`
  and `packages/styles/src/stories/components/Basic/List.stories.js`.
- React component name: `List`, derived from `pathable-list` by removing
  `pathable` and converting to CamelCase.
- Consumers must import only from `@pathable/react`; the existing public
  entrypoint imports `@pathable/styles/dist/styles.css` and must continue to do
  so.
- Visual behavior is limited to documented unordered, ordered, and unstyled
  presentations from the source styles story.
- Plan does not disable, weaken, skip, or silence lint checks.
- Complexity violations: none.

**Gate Status**: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/030-react-list-wrapper/
├── plan.md
├── research.md
├── data-model.md
├── class-diagram.md
├── quickstart.md
├── contracts/
│   ├── props.md
│   └── sequences.md
└── tasks.md
```

### Source Code (repository root)

```text
packages/styles/
└── src/
    ├── pathable-component-wrappers/pathable-list.scss
    └── stories/components/Basic/List.stories.js

packages/react/
├── README.md
├── package.json
└── src/
    ├── index.js
    ├── components/
    │   └── List/List.jsx
    └── stories/components/Basic/List.stories.jsx

apps/storybook-react/
└── package.json
```

**Structure Decision**: Keep the source-of-truth styles contract unchanged
unless implementation discovers a genuine source-layer gap. Add the React
wrapper under `packages/react/src/components/List/`, export it from
`packages/react/src/index.js`, document it in `packages/react/README.md`, and
demonstrate it in the React Storybook basic component stories.

## Phase 0 Research

Research is complete in [research.md](./research.md). Decisions:

- Use existing `pathable-list` as the only visual contract.
- Expose `List` as the React wrapper component name.
- Model presentation with the documented values `unordered`, `ordered`, and
  `unstyled`.
- Preserve transitive styling through the existing `@pathable/react` entrypoint.
- Validate with package build, Storybook build, and package-content dry run.

## Phase 1 Design & Contracts

Generated design artifacts:

- [data-model.md](./data-model.md)
- [class-diagram.md](./class-diagram.md)
- [contracts/props.md](./contracts/props.md)
- [contracts/sequences.md](./contracts/sequences.md)
- [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- `packages/styles` remains the authoritative owner of list visuals.
- `packages/react` exposes only an ergonomic mapping to existing class names.
- `List` satisfies React naming parity for `pathable-list`.
- Transitive style availability remains anchored in `packages/react/src/index.js`.
- No lint bypass, wrapper-only CSS, new design token, or undocumented visual
  behavior is planned.

**Gate Status**: PASS.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| none | N/A | N/A |
