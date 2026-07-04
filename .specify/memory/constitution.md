<!--
  ------------------------------------------------------------------
  Sync Impact Report
  ------------------------------------------------------------------
  Version change: N/A (initial creation) → 1.0.0
  Principles: 11 new principles created from project requirements
  Sections added:
    - Core Principles (11 principles)
    - Stack and Dependency Constraints
    - Development Workflow & Quality Gates
    - Change Scope Granularity (from workflow-preset)
    - Architecture SSOT Boundary (from workflow-preset)
    - Architecture SSOT Compliance (from workflow-preset)
    - Governance
  Sections removed: none (initial)
  Templates requiring updates:
    - .specify/templates/plan-template.md           ✅ reviewed (no constitution-specific gates needed beyond generic)
    - .specify/templates/spec-template.md            ✅ reviewed (no constitution-specific updates needed)
    - .specify/templates/tasks-template.md           ✅ reviewed (no principle-driven task-type changes needed)
    - .specify/templates/constitution-template.md    ✅ updated (constitution written)
  Follow-up TODOs: none deferred
  ------------------------------------------------------------------
-->

# Pathable Design System Constitution

## Core Principles

### I. CSS Custom Properties Are the Runtime Contract

The `packages/design-tokens` package's primary public contract is compiled CSS
custom properties. Color, typography, spacing, radius, elevation, focus, and
theme tokens MUST be available as CSS variables in the published `dist` output.
Consumers MUST be able to import the compiled CSS and apply tokens without
using Sass. No runtime dependency on a CSS preprocessor is acceptable for the
default consumption path.

### II. SCSS Is an Authoring and Extension Layer

SCSS source MUST be organized with modules, partials, maps, and mixins where
they aid maintainability. Sass variables ($-prefixed) MUST NOT replace or
shadow the runtime CSS custom property contract — every Sass variable that
represents a published token MUST also produce a corresponding `--token-name`
CSS custom property. SCSS exists to generate and organize the published CSS and
to support advanced consumers who want to extend the package via `@use` and
`@forward`. The SCSS API is a secondary, opt-in surface; the CSS output is the
source of truth.

### III. pnpm Workspaces Structure the Repository

The repository MUST be structured as a pnpm workspace with a root
`pnpm-workspace.yaml` manifest. Shared scripts (lint, format, audit) SHOULD be
runnable from the root where practical. Package-specific scripts MUST remain
inside their package's `package.json`. Workspace boundaries MUST be respected:
future Vue, React, Tailwind, and docs packages MUST consume the token package
via workspace protocol (`"@pathable/design-tokens": "workspace:*"`) rather than
duplicating or redefining token definitions.

### IV. First Implementation Slice Is Narrow

The first implementation slice MUST create only the monorepo foundation and the
`packages/design-tokens` package. It MUST NOT implement Vue components, React
components, Tailwind presets, or a full documentation site unless explicitly
requested. Future packages MUST consume the token package rather than
duplicating token definitions. This principle prevents scope creep during
initial bootstrapping while keeping the architectural runway open for all
future workspaces.

### V. Published Artifacts Must Be Reliable

The `packages/design-tokens` package MUST publish both compiled CSS in `dist/`
and original SCSS source files for advanced consumers. The `package.json` MUST
declare clear entrypoints: `"main"` or `"exports"` for the compiled CSS and
`"sass"` for the SCSS source. Builds MUST be reproducible via pnpm scripts
(e.g., `pnpm build`). The package MUST be testable locally with `pnpm pack`
before publishing. No build step outside the workspace scripts model is
acceptable.

### VI. Token Naming Must Be Semantic and Stable

Token names MUST follow a semantic convention. Prefer names such as
`--color-bg-default`, `--color-text-primary`, `--space-16`, `--radius-8`, and
`--elevation-sm`. Brand or raw value tokens (e.g., `--color-blue-500`) MAY
exist but application-facing consumers SHOULD use semantic tokens whenever
possible. Breaking token renames (names that change meaning or remove a token)
REQUIRE a major version bump OR a clearly documented migration path in the
release notes.

### VII. Design Source Alignment Matters

The packages MUST reflect the Pathable Figma design system foundations. Figma
variables and styles are an important source of truth for names, values, and
intent. However, the repository MUST still contain reviewable source code and
documentation — Figma alone is not sufficient. If Figma and code disagree, the
discrepancy MUST be recorded as a tracked issue or documented decision and
resolved intentionally rather than silently diverging.

### VIII. Accessibility Is Part of Token Quality

Color and focus-related tokens MUST support accessible UI outcomes. The token
package MUST NOT claim full WCAG compliance for downstream products, but it
MUST avoid obvious accessibility traps, especially around text contrast, focus
indicators, state colors (hover, active, disabled), and disabled-state
affordances. Component packages in future workspaces MUST inherit and preserve
these accessibility intentions.

### IX. Framework Independence Comes First

The `packages/design-tokens` package MUST NOT require Nuxt, Vue, React,
Tailwind, Vite, Svelte, Angular, or any specific application framework. Vue,
React, Tailwind, and docs workspaces MUST consume the token package as
downstream packages — they MUST NOT embed, redefine, or regenerate the token
source of truth. Framework-specific packages MAY transform tokens (e.g.,
generating Tailwind config, Vue provide/inject, React context) but the
canonical definitions always reside in the design-token package.

### X. Documentation Is a First-Class Package Concern

The repository MUST eventually include a GitHub Pages documentation site
explaining installation, CSS import usage, SCSS usage, theme usage, package
exports, local development, build commands, publishing flow, and examples for
each downstream framework package. The first implementation slice MUST include
enough README documentation to support the `packages/design-tokens` package
independently, even before the full docs site exists.

### XI. Versioning and Release Discipline

Semantic versioning MUST be used across all published packages. Token additions
are usually minor changes. Token value fixes (color hex updates with same name
and meaning) MAY be patch changes. Token removals or renames are breaking
changes requiring a major version bump. Before publishing, build output and
package contents MUST be verified (via `pnpm pack --dry-run` or equivalent).
Future multi-package releases MUST clearly document which workspace packages
changed and what the nature of each change was.

## Stack and Dependency Constraints

- **Package manager**: pnpm. npm or yarn lockfiles MUST NOT be committed.
- **SCSS compiler**: Dart Sass via the `sass` npm package. LibSass or
  node-sass are not supported.
- **Design-token dependencies**: Zero runtime dependencies. Dev dependencies
  are limited to `sass`, build tooling, and test tooling.
- **Node version**: The repository root MUST declare an `engines.node` range in
  `package.json` that all workspace packages support.
- **Lockfile**: `pnpm-lock.yaml` MUST be committed to the repository for
  reproducible installs.

## Development Workflow & Quality Gates

- **Token changes require build verification**: Any change to token values or
  names MUST be followed by a build (`pnpm build`) and the output checked into
  version control or validated by CI.
- **Visual diff review**: Token value changes SHOULD be reviewed with a visual
  diff or output comparison when color, elevation, or spacing values change.
- **Package contents**: Before release, run `pnpm pack --dry-run` or equivalent
  to verify the published package contains the expected files.
- **Commit discipline**: Changes that affect multiple workspace packages SHOULD
  be committed separately per workspace unless they are logically atomic.
- **Figma sync**: When Figma design tokens are updated, a corresponding
  repository issue or pull request MUST be created to track the code-side
  update. Silent divergence is not permitted.

## Change Scope Granularity

Spec Kit planning and execution MUST use R/M/U/O scope granularity:

- R: Repository / Workspace. Environment only; too broad for scoped changes.
- M: Module / Capability. Hard outer boundary.
- U: Unit / Design Object. Primary planning boundary.
- O: Operation / Detail. Execution detail.

The R/M/U/O letter mapping is fixed. Do not paraphrase, expand, rename,
translate, or substitute these letters with other nouns.

Planning locks M + U.
Execution maps U -> concrete paths -> O-level changes.
If U -> concrete paths cannot be determined, report a context gap. Do not
widen scope to R or broad M.

This principle applies from planning onward. Requirement specification,
clarification, and checklist readiness MUST NOT infer M/U/O boundaries.

## Architecture SSOT Boundary

Ratified constitution principles are durable governance rules, not architecture
fact storage. Architecture decisions, domain facts, object design, flows, and
interface contracts belong in their architecture SSOT artifacts:

- `specs/<feature>/data-model.md`: domain model and domain facts.
- `specs/<feature>/class-diagram.md`: object, module, adapter, and internal
  design structure.
- `specs/<feature>/contracts/sequences.md`: cross-boundary flow, sequencing,
  async, retry, rollback, and failure paths.
- `specs/<feature>/contracts/`: interface and message contracts.
- `specs/<feature>/research.md`: architecture decisions and tradeoffs that need
  evidence.

Constitution principles may reference these SSOT artifact types, but MUST NOT
copy concrete implementation facts, temporary repository observations, or
module responsibility inventories into ratified governance text.

## Architecture SSOT Compliance

Ratified constitution principles define the compliance rule only. Concrete
architecture decisions, domain facts, object design, flows, and interface
contracts MUST remain in their Architecture SSOT artifacts.

Planning outputs MUST comply with existing Architecture SSOT artifacts.
Planning MUST NOT contradict, relocate, weaken, or silently replace
architecture SSOT content. If planning cannot produce outputs that comply with
existing Architecture SSOT artifacts, report a planning blocker instead of
generating inconsistent artifacts.

## Governance

This constitution supersedes all other practices where they conflict.
Amendments to this constitution require:

1. A documented rationale explaining the change.
2. A diff or description of the modified principles, sections, or rules.
3. A migration plan for any in-flight work that the change affects.
4. Approval via pull request review.

Versioning policy:
- MAJOR: Backward-incompatible governance changes, principle removals, or
  principle redefinitions.
- MINOR: New principles or materially expanded guidance.
- PATCH: Clarifications, wording improvements, typo fixes, or
  non-semantic refinements.

All specs, plans, tasks, reviews, and agent work MUST verify compliance with
this constitution. Violations MUST be documented in their complexity tracking
section with justification. Complexity is not automatically forbidden but it
MUST be transparent and justified.

**Version**: 1.0.0 | **Ratified**: 2026-07-04 | **Last Amended**: 2026-07-04