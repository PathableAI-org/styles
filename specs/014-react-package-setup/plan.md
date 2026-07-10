# Implementation Plan: React Package Workspace Setup

**Branch**: `021-react-package-setup` | **Date**: 2026-07-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/014-react-package-setup/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)

## Summary

Create a new pnpm workspace package `@pathable/react` at `packages/react/` that wraps `@pathable/styles` components as idiomatic React components, starting with a static proof-of-concept Button. The React package includes `@pathable/styles` as a dependency so consumers get styles automatically without a separate install. Stories are defined adjacent to components (mirroring the `packages/styles` convention) and composed into the main Storybook via Storybook composition. A standalone React Storybook (`apps/storybook-react`) serves the React stories on port 6007.

## Technical Context

**Language/Version**: JavaScript/TypeScript (JSX) using React 18/19

**Primary Dependencies**:
- `@pathable/styles` (workspace dependency — provides compiled CSS and `pathable-button` class)
- `react` + `react-dom` (peer dependencies, consumer-provided)
- `storybook` + `@storybook/react-vite` (dev, for React Storybook)

**Storage**: N/A — no storage layer for a component library

**Testing**: Storybook serves as the visual and functional validation surface; BDD acceptance scenarios from spec

**Target Platform**: Browser (React applications), distributed as npm package

**Project Type**: Library (React component library / npm package)

**Performance Goals**: N/A — proof-of-concept, no performance targets

**Constraints**:
- Zero additional CSS/Sass compilation required from consumers — bundled CSS from `@pathable/styles` is sufficient
- No runtime dependencies beyond `@pathable/styles`
- Button is static proof-of-concept: only `children` prop, no variants, no click handlers, no className forwarding

**Scale/Scope**: Single package workspace (`packages/react`), single component (Button, default variant only), standalone Storybook + composition into main Storybook

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle III — pnpm Workspaces Structure the Repository
**Compliant**: The new package `packages/react` is registered in the existing `pnpm-workspace.yaml` under the `packages/*` glob. Consumes `@pathable/styles` via `workspace:*` protocol.

### Principle IV — First Implementation Slice Is Narrow
**Compliant**: This feature is explicitly scoped to creating the React package workspace and a single static Button component. No Vue, React components beyond Button, Tailwind presets, or full docs site.

### Principle V — Published Artifacts Must Be Reliable
**Compliant**: The React package will declare `package.json` entrypoints (`main`/`exports`) for the built output. Build is a pnpm script.

### Principle VI — Token Naming Must Be Semantic and Stable
**Compliant**: The React Button applies the existing `pathable-button` CSS class from `@pathable/styles`. No new tokens or naming.

### Principle VII — Design Source Alignment Matters
**Compliant**: No new Figma design source for this setup — the Button reuses existing styles.

### Principle VIII — Accessibility Is Part of Token Quality
**Compliant**: The Button renders a native `<button>` element which inherits existing accessibility from `@pathable/styles` styling. No custom ARIA or behavior that could introduce accessibility traps.

### Principle IX — Framework Independence Comes First
**Compliant**: `@pathable/styles` remains framework-independent. The React package is a downstream consumer — it does not embed or redefine token definitions.

### Principle X — Documentation Is a First-Class Package Concern
**Compliant**: README documentation for `packages/react` will be included.

### Principle XI — Versioning and Release Discipline
**Compliant**: Semantic versioning applies. Initial release is effectively a new package, starting at 0.1.0 or similar.

### Change Scope Granularity
- **M** (Module/Capability): `@pathable/react` package workspace + React Storybook + Storybook composition
- **U** (Unit/Design Object): Button component, Button story, React Storybook config, main Storybook composition ref

**Gate Status: PASS** — No unjustified violations.

## Project Structure

### Documentation (this feature)

```text
specs/014-react-package-setup/
├── plan.md                    # This file (/speckit-plan command output)
├── research.md                # Phase 0 output (/speckit-plan command)
├── data-model.md              # Phase 1 output (/speckit-plan command)
├── quickstart.md              # Phase 1 output (/speckit-plan command)
├── contracts/                 # Phase 1 output (/speckit-plan command)
│   └── exports.md             # Public API contract for @pathable/react
├── behavior/
│   ├── bdd.draft.feature      # Phase 0 behavior projection
│   ├── behavior-scenarios.draft.json
│   ├── uif.intent.json
│   └── data-fixtures.intent.json
├── checklists/
│   ├── requirements.md
│   └── behavior-testability.md
└── tasks.md                   # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.jsx          # React Button component (static wrapper)
│   │       └── Button.stories.jsx  # Stories adjacent to component
│   ├── index.js                    # Public API barrel export
│   └── stories/                    # Additional stories (following @pathable/styles convention)
│       └── components/
│           └── Basic/
│               └── Button.stories.jsx
├── package.json                    # name: @pathable/react, deps: @pathable/styles
├── README.md
└── ...build config

apps/storybook-react/
├── .storybook/
│   ├── main.js                     # Storybook config (Vite-based, stories glob)
│   └── preview.js                  # Preview config (imports compiled CSS)
├── package.json                    # storybook + @storybook/react-vite
└── README.md

apps/storybook/
├── .storybook/
│   └── main.js                     # Updated: add refs config for Storybook composition
└── ...
```

**Structure Decision**: Monorepo with two new workspaces — `packages/react` for the component library and `apps/storybook-react` for the standalone React Storybook. The main `apps/storybook` gets a composition ref added to its `main.js`. This follows the existing convention where `apps/storybook` serves the HTML stories from `packages/styles`.

## Complexity Tracking

No constitution violations requiring justification. Complexity is minimal — a single-component package with standard Storybook setup.

## Design Artifacts

- Internal object design: `./class-diagram.md`
- Service sequences: `./contracts/sequences.md`
- Behavior draft: `./behavior/bdd.draft.feature`
- BDD contracts: `./contracts/bdd/`
- Expected UIF contracts: `./contracts/uif/`
- Behavior contracts: `./contracts/behavior/`
- Data model: `./data-model.md`
- Interface contracts: `./contracts/`
- Validation path: `./quickstart.md`

## Visual fidelity navigation

- Visual validation decisions: `./research.md`
- Visual interaction contracts: `./contracts/uif/` and `./contracts/behavior/`
- Visual flow sequences: `./contracts/sequences.md`
- Visual proof execution: `./quickstart.md`