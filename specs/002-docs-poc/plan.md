# Implementation Plan: GitHub Pages Docs PoC

**Branch**: `002-docs-poc` | **Date**: 2026-07-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-docs-poc/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Table of Contents

- [Summary](#summary)
- [Technical Context](#technical-context)
- [Constitution Check](#constitution-check)
- [Project Structure](#project-structure)
- [Complexity Tracking](#complexity-tracking)
- [Phase 0 Deliverables](#phase-0-deliverables)
- [Phase 1 Deliverables](#phase-1-deliverables)

## Summary

Create a minimal "hello world" Astro + Starlight documentation site at `apps/docs` as a new pnpm workspace. The site consumes `@pathable/styles` via `workspace:*` dependency and uses Pathable CSS custom properties for visual styling. Add CI/CD via GitHub Actions: PRs validate the build, pushes to `main` deploy `apps/docs/dist` to GitHub Pages. The site has four light-content pages (Getting Started, Foundations, For Agents, Roadmap) and honestly states it is a proof of concept, not a complete component library.

## Technical Context

**Language/Version**: TypeScript (Astro + Starlight ecosystem); Node via `packageManager: pnpm@10.33.0`

**Primary Dependencies**: astro, @astrojs/starlight, @pathable/styles (workspace:*). No React, Vue, Tailwind, or Storybook.

**Storage**: None — static site, no database.

**Testing**: None in this PoC (no Playwright, no visual regression).

**Target Platform**: GitHub Pages (static HTML/CSS/JS). Modern browsers.

**Project Type**: Static documentation site / monorepo workspace.

**Performance Goals**: Static site — performance is not a concern at this scale.

**Constraints**: Must preserve existing `packages/styles` behavior unchanged. No npm publishing. No component library dependencies.

**Scale/Scope**: 5 MDX pages, 1 custom stylesheet, 1 GitHub Actions workflow (with PR and deploy variants). All 19 FRs are concrete and unambiguous — no NEEDS CLARIFICATION items remain.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
| ----------- | ----------- | ------- |
| III. pnpm Workspaces | ✅ | Adding `apps/*` to workspace.yaml extends the existing pattern |
| IV. First Slice Narrow | ✅ | Docs PoC only — no React, Vue, Storybook, or component catalog |
| IX. Framework Independence | ✅ | Astro/Starlight consume styles via CSS import, not framework coupling |
| X. Documentation First-Class | ✅ | This feature directly implements the documentation principle |
| Stack Constraints | ✅ | pnpm only, zero new runtime deps beyond Astro/Starlight |

**Result**: All gates pass. No violations or complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-docs-poc/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output: technology confirmations
├── data-model.md        # Phase 1 output: workspace/entity topology
├── quickstart.md        # Phase 1 output: validation path
├── contracts/           # Phase 1 output: interface contracts (minimal for docs PoC)
├── spec.md              # Feature specification
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Created by /speckit-tasks (not /speckit-plan)
```

### Source Code (repository root)

```text
apps/docs/                              # New docs workspace
├── package.json                        # @pathable/docs, private, workspace:*
├── astro.config.mjs                    # Starlight configuration
├── tsconfig.json                       # TypeScript config for Astro
├── public/                              # Static assets (if any)
├── src/
│   ├── content/
│   │   └── docs/                        # Starlight content
│   │       ├── index.mdx                # Homepage
│   │       ├── getting-started/
│   │       │   └── index.mdx            # Getting Started page
│   │       ├── foundations/
│   │       │   └── index.mdx            # Foundations page
│   │       ├── for-agents/
│   │       │   └── index.mdx            # For Agents page
│   │       └── roadmap/
│   │           └── index.mdx            # Roadmap page
│   └── styles/
│       └── custom.css                   # Custom docs stylesheet (consumes @pathable/styles tokens)
├── dist/                                # Build output (gitignored)

.github/workflows/
├── docs-ci.yml                          # PR validation workflow
└── docs-deploy.yml                      # Main-branch deploy workflow

packages/styles/                          # Existing — untouched
├── ...
```

**Structure Decision**: Single docs workspace under `apps/docs` following the monorepo pattern established by `packages/styles`. GitHub Actions workflows go in `.github/workflows/` as is standard.

## Complexity Tracking

No constitution violations to justify. Skipped.

## Phase 0 Deliverables

### research.md

Minimal research document. All technical choices are explicitly specified in the feature description and spec — no NEEDS CLARIFICATION items remain. See [research.md](./research.md) for consolidated technology confirmations.

## Phase 1 Deliverables

### data-model.md

Entity topology of the docs workspace. See [data-model.md](./data-model.md).

### contracts/

Minimal interface contracts for this static-site PoC. See [contracts/README.md](./contracts/README.md).

### quickstart.md

Validation path for the implementation. See [quickstart.md](./quickstart.md).

### Agent context update

Will be executed after Phase 1 artifacts are created.
