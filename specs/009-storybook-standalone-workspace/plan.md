# Implementation Plan: Storybook Standalone Workspace

**Branch**: `009-storybook-standalone-workspace` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/Users/jake/Documents/GitHub/styles/specs/009-storybook-standalone-workspace/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)
- [Phase 0: Research & Unknowns](#phase-0-research--unknowns)
- [Phase 1: Design & Artifacts](#phase-1-design--artifacts)

## Summary

Extract the Storybook documentation site from `packages/styles` into its own pnpm workspace at `apps/storybook`, add a root-level `pnpm docs` command, and reconfigure the GitHub Pages deployment to serve the Storybook static site instead of the Astro/Starlight `apps/docs` site. This isolates Storybook's heavy dependency tree, creates a foundation for multi-framework (React, Vue) story support in the future, and provides a single-command developer experience for documentation.

## Technical Context

**Language/Version**: Node.js 23 (as used in existing CI and repository setup)

**Primary Dependencies**: Storybook ^10.4.6, @storybook/html-vite ^10.4.6, @storybook/addon-docs ^10.4.6, @storybook/manager-api ^8.6.14, @storybook/theming ^8.6.14, @fontsource/fredoka, @fontsource/nunito, @fontsource/montserrat, @fontsource/poppins

**Storage**: N/A — this is a documentation site with no runtime data storage

**Testing**: Storybook static build output verification (no unit/integration tests needed for the workspace itself)

**Target Platform**: Static site deployed to GitHub Pages; dev server on localhost:6006

**Project Type**: Monorepo documentation workspace (pnpm workspace + Storybook)

**Performance Goals**: Dev server starts within 30 seconds on warm cache; static build completes in under 2 minutes

**Constraints**: Must not break existing workflows (build, lint:styles, format); stories remain co-located in `packages/styles/src/stories/`; all existing Storybook configuration (theme, preview, manager) must be preserved

**Scale/Scope**: Single workspace creation; Storybook config migration; CI/CD workflow updates; ~40 existing story files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle Review

| Principle | Relevance | Assessment |
|-----------|-----------|------------|
| I. CSS Custom Properties Are the Runtime Contract | Low | This feature does not modify the token package |
| II. SCSS Is an Authoring and Extension Layer | Low | No SCSS changes planned |
| III. pnpm Workspaces Structure the Repository | **High** | Adding `apps/storybook` to `pnpm-workspace.yaml` and creating a new workspace protocol dependency follows this principle |
| IV. First Implementation Slice Is Narrow | Low | This is not the first implementation slice |
| V. Published Artifacts Must Be Reliable | Low | No package publishing involved |
| VI. Token Naming Must Be Semantic and Stable | Low | No token changes |
| VII. Design Source Alignment Matters | Low | No design source alignment concerns |
| VIII. Accessibility | Low | Storybook preserves existing a11y patterns; no a11y regression |
| IX. Framework Independence Comes First | **Medium** | The Storybook workspace consumes `@pathable/styles` via workspace protocol, which is correct; the docs workspace does not redefine or embed token definitions |
| X. Documentation Is a First-Class Package Concern | **High** | This feature directly advances the documentation goal by making docs easier to develop and deploy |
| XI. Versioning and Release Discipline | Low | No versioning changes |

### Stack & Dependency Constraint Check

| Constraint | Status |
|------------|--------|
| pnpm as package manager | ✅ Followed — workspace protocol `workspace:*` used |
| Dart Sass via `sass` npm package | ✅ Unchanged in `packages/styles` |
| Runtime dependencies | ✅ Storybook deps are devDependencies in the docs workspace |
| Node version range declared | No current `engines.node` in root `package.json` — this is a **pre-existing gap**, not introduced by this feature |

### R/M/U/O Scope

- **M** (Module): Documentation workspace creation — the module boundary is the `apps/storybook` package
- **U** (Unit): Individual Storybook config files, CI workflows, root scripts
- **O** (Operation): Exact file contents, dependency versions, commit messages

### Gate Decision: PASS

No constitution violations. The feature conforms to workspace discipline (Principle III), respects framework independence (Principle IX), and advances the documentation mandate (Principle X).

## Project Structure

### Documentation (this feature)

```text
specs/009-storybook-standalone-workspace/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
```

### Source Code (repository root)

```text
apps/storybook/
├── package.json                    # @pathable/storybook workspace
├── .storybook/
│   ├── main.js                     # Framework, stories pattern, addons, docs config
│   ├── preview.js                  # Import dist/styles.css, parameters
│   ├── manager.js                  # Custom branding theme
│   └── manager-head.html           # Google Fonts loading
└── storybook-static/               # Build output (gitignored)

.github/workflows/
├── docs-deploy.yml                 # Updated to build apps/storybook instead of apps/docs
└── docs-ci.yml                     # Updated to verify apps/storybook build

packages/styles/
├── package.json                    # Remove storybook/build-storybook scripts, remove storybook devDeps
└── src/stories/                    # Stories remain here (unchanged)

apps/docs/                          # Kept as legacy source but not built or deployed

pnpm-workspace.yaml                 # Add 'apps/storybook' glob
```

**Structure Decision**: Flat workspace under `apps/storybook/` following the existing `apps/` convention. Storybook configuration lives in `.storybook/` subdirectory (same layout as current `packages/styles/.storybook/`). Stories remain co-located with source in `packages/styles/src/stories/`. The static build output (`storybook-static/`) is gitignored.

## Complexity Tracking

> No constitution violations to justify — this feature is straightforward and conforms to all principles.

## Phase 0: Research & Unknowns

The spec has no [NEEDS CLARIFICATION] markers, and the technical context is well understood from existing codebase analysis. However, the following unknowns should be resolved through research:

1. How does the `@storybook/html-vite` framework handle stories referenced from outside the workspace? (cross-workspace story resolution)
2. What is the exact set of Storybook-related dependencies that need to move from `packages/styles` to `apps/storybook`?
3. Does the base path `/styles` in `astro.config.mjs` need a corresponding Storybook configuration for the GitHub Pages deployment?

### Research Output

See [research.md](./research.md) for consolidated findings.

## Phase 1: Design & Artifacts

### Data Model

See [data-model.md](./data-model.md) for the workspace configuration model.

### Quickstart

See [quickstart.md](./quickstart.md) for getting started guide.

### Contracts

The contracts directory contains:
- GitHub Actions workflow definitions for CI and deployment
- Root package.json script interfaces
- Workspace dependency contract between `apps/storybook` and `packages/styles`

See [contracts/](./contracts/) for details.

### Agent Context Update

After Phase 1 design artifacts are generated, the agent context script (`update-agent-context.sh`) will be executed to reference the new plan.