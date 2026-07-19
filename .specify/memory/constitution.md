<!--
  ------------------------------------------------------------------
  Sync Impact Report
  ------------------------------------------------------------------
  Version change: 1.3.0 → 1.4.0
  Principles modified:
    - IV: "Wrapper Packages Are Thin Consumers" → "Wrapper Packages Preserve
      Semantic and Visual Parity" (expanded with semantic HTML, accessibility
      behavior, class contracts, type safety, and publishable validation)
    - X: "Accessibility Is Part of Token Quality" → "Accessibility Is a Release
      Requirement" (expanded with static linting, rendered testing, keyboard
      behavior, focus management, and manual-review dimensions)
    - XII: "Documentation Is a First-Class Package Concern" → "Documentation
      Surfaces Have Distinct Responsibilities" (expanded with canonical-source
      rules for Astro docs, Storybook, READMEs, and specs)
  Principles added:
    - XIV: Storybook Stories Are Executable Component Contracts
    - XV: Responsive and Inclusive States Are First-Class
    - XVI: Framework Storybooks Must Remain Independently Valid
  Sections added:
    - Automated Validation & Quality Gates (expands and replaces the former
      "Development Workflow & Quality Gates" section; adds enforceable gate,
      file-exclusion, and local/CI consistency rules)
    - Visual Regression Protection (new subsection under Quality Gates)
  Sections removed: none
  Templates requiring updates:
    - .specify/templates/plan-template.md           → updated with expanded Constitution Check
    - .specify/templates/spec-template.md            → updated with accessibility, story, and
                                                       responsive-state guidance
    - .specify/templates/tasks-template.md           → updated with story, interaction,
                                                       a11y, responsive, visual, package,
                                                       and documentation task categories
    - .specify/templates/constitution-template.md    → reviewed; generic template — no
                                                       project-specific content to sync
    - .specify/templates/checklist-template.md       → reviewed; generic template — no
                                                       project-specific content to sync
    - .specify/presets/workflow-preset/commands/*.md → reviewed; no constitution-specific
                                                       change required
    - .specify/presets/workflow-preset/templates/    → reviewed; no constitution-specific
                                                       change required
    - .specify/presets/toc-navigation/*              → reviewed; no constitution-specific
                                                       change required
    - .specify/extensions/git/commands/*.md          → reviewed; no constitution-specific
                                                       change required
    - .specify/extensions/agent-context/commands/*.md→ reviewed; no constitution-specific
                                                       change required
  Follow-up TODOs: none deferred
  ------------------------------------------------------------------
-->

# Pathable Design System Constitution

## Core Principles

### I. @pathable/styles Is the Authoritative Workspace

The `packages/styles` workspace and `@pathable/styles` package are the
authoritative source for PathAble visual design foundations, component-class
contracts, tokens, fonts, icons, compiled CSS, and framework-neutral behavior.
No wrapper package, application package, Storybook app, or framework adapter may
define a new visual contract before the corresponding style, asset, token, or
component-class behavior exists in `packages/styles`. Wrapper work MUST begin
by adding or changing the source-layer contract in `packages/styles`; downstream
packages then consume that contract.

### II. CSS Custom Properties Are the Runtime Contract

The `@pathable/styles` package's primary public contract is compiled CSS custom
properties and component classes. Color, typography, spacing, radius, elevation,
focus, state, theme, and component wrapper tokens MUST be available in the
published `dist` output. Consumers MUST be able to import the compiled CSS and
apply tokens/classes without using Sass. No runtime dependency on a CSS
preprocessor is acceptable for the default consumption path.

### III. SCSS Is an Authoring and Extension Layer

SCSS source MUST be organized with modules, partials, maps, and mixins where
they aid maintainability. Sass variables ($-prefixed) MUST NOT replace or
shadow the runtime CSS custom property contract — every Sass variable that
represents a published token MUST also produce a corresponding `--token-name`
CSS custom property. SCSS exists to generate and organize the published CSS and
to support advanced consumers who want to extend the package via `@use` and
`@forward`. The SCSS API is a secondary, opt-in surface; the CSS output is the
source of truth.

### IV. Wrapper Packages Preserve Semantic and Visual Parity

Framework packages such as `packages/react` exist as adapters over the shared
Pathable design system. They MAY expose framework-native components,
entrypoints, and type surfaces, but they MUST NOT duplicate, fork, or redefine
styles, fonts, icons, assets, tokens, spacing, accessibility states, or
component-class semantics owned by `packages/styles`. Adding a new wrapper
component, variant, or prop is only allowed after the equivalent
framework-neutral style contract has been added to `packages/styles`, covered
by its documentation or stories, and exported through the styles package.

Framework components MUST preserve the shared package's semantic HTML,
accessibility behavior, class contracts, design tokens, and intended visual
behavior. Framework packages MUST NOT duplicate or fork shared styling without
an explicit architectural decision recorded in the feature's `research.md`.

React components in `packages/react` MUST use the CamelCase form of the
equivalent `packages/styles` component name after removing any `pathable`
prefix. For example, `pathable-alert` maps to `Alert`, and
`pathable-button-group` maps to `ButtonGroup`.

Public component APIs and generated declarations MUST be type-safe and suitable
for consumers. Publishable artifacts MUST be validated as consumers receive
them: exports, included files, runtime entry points, peer dependencies, and
declarations. A successful monorepo build alone MUST NOT be treated as proof
that a package is publishable.

Breaking changes to public component APIs, markup contracts, CSS contracts, or
package exports MUST follow the repository's release and change-management
policy.

### V. Consumer Imports Must Be Complete

Consumers of a wrapper package MUST be able to install and import that wrapper
without also importing `@pathable/styles` in application code. A client that
adds `@pathable/react` as a dependency and imports from `@pathable/react` MUST
receive the required `@pathable/styles` CSS, fonts, icons, JavaScript helpers,
and other published assets automatically through the wrapper package's
dependency graph and entrypoints. Wrapper packages MUST declare
`@pathable/styles` as a runtime dependency, import the required compiled
styles/assets at their public entrypoint, and verify that package output
contains the transitive assets needed by consumers.

### VI. pnpm Workspaces Structure the Repository

The repository MUST be structured as a pnpm workspace with a root
`pnpm-workspace.yaml` manifest. Shared scripts (lint, format, audit) SHOULD be
runnable from the root where practical. Package-specific scripts MUST remain
inside their package's `package.json`. Workspace boundaries MUST be respected:
future Vue, React, Tailwind, and docs packages MUST consume `@pathable/styles`
via workspace protocol (`"@pathable/styles": "workspace:*"`) rather than
duplicating or redefining styles, assets, or token definitions.

### VII. Published Artifacts Must Be Reliable

The `@pathable/styles` package MUST publish compiled CSS, JavaScript helpers,
fonts, icons, and original SCSS source files for advanced consumers. The
`package.json` MUST declare clear `exports` for compiled CSS, JavaScript
helpers, distribution assets, and opt-in source access. Builds MUST be
reproducible via pnpm scripts (e.g., `pnpm build`). The package MUST be testable
locally with `pnpm pack --dry-run` or an equivalent package-content check before
publishing. No build step outside the workspace scripts model is acceptable.

### VIII. Token Naming Must Be Semantic and Stable

Token names MUST follow a semantic convention. Prefer names such as
`--pathable-color-text`, `--pathable-color-surface`, `--pathable-space-4`,
`--pathable-radius-md`, and `--pathable-elevation-sm`. Brand or raw value
tokens MAY exist but application-facing consumers SHOULD use semantic tokens
whenever possible. Breaking token renames (names that change meaning or remove
a token) REQUIRE a major version bump OR a clearly documented migration path in
the release notes.

### IX. Design Source Alignment Matters

The packages MUST reflect the Pathable Figma design system foundations. Figma
variables and styles are an important source of truth for names, values, and
intent. However, the repository MUST still contain reviewable source code and
documentation — Figma alone is not sufficient. If Figma and code disagree, the
discrepancy MUST be recorded as a tracked issue or documented decision and
resolved intentionally rather than silently diverging.

### X. Accessibility Is a Release Requirement

Accessibility applies to the shared styles, HTML examples, React components,
patterns, and documentation. Automated and behavioral accessibility gates MUST
pass before a pull request that affects rendered UI is merged.

Static JSX accessibility linting and rendered accessibility testing are
complementary and MUST NOT be treated as interchangeable. Automated tools MUST
be supplemented by behavioral tests for keyboard interaction, focus placement,
focus restoration, state communication, and accessible names where automation
cannot determine correctness.

Interactive components MUST preserve visible focus and semantic keyboard
behavior. Stable Storybook stories MUST participate in automated rendered
accessibility checks unless a narrow, documented exception exists.
Accessibility violations in required checks MUST block merge.

Color and focus-related tokens MUST support accessible UI outcomes. The token
package MUST NOT claim full WCAG compliance for downstream products, but it
MUST avoid obvious accessibility traps, especially around text contrast, focus
indicators, state colors (hover, active, disabled), and disabled-state
affordances. Component packages in future workspaces MUST inherit and preserve
these accessibility intentions.

Accessibility exceptions MUST NOT disable broad rules across the project merely
to accommodate one component. Story-level exceptions MUST be narrow, justified,
and limited to specific rules with documented rationale. Examples and tests
MUST use synthetic, non-sensitive data.

Periodic manual keyboard and assistive-technology review SHOULD be performed
as a quality practice on a schedule defined by contributor documentation. This
is a quality expectation, not an automated gate.

### XI. Framework Independence Comes from @pathable/styles

The `@pathable/styles` package MUST NOT require Nuxt, Vue, React, Tailwind,
Vite, Svelte, Angular, or any specific application framework. Vue, React,
Tailwind, and docs workspaces MUST consume `@pathable/styles` as downstream
packages — they MUST NOT embed, redefine, or regenerate the source of truth.
Framework-specific packages MAY map the styles contract into framework-native
APIs, but the canonical definitions always reside in `packages/styles`.

### XII. Documentation Surfaces Have Distinct Responsibilities

Documentation surfaces MUST avoid contradictory sources of truth. When the same
fact must appear on multiple surfaces, one surface is the canonical source and
others derive from or link to it.

- The Astro documentation site is the curated public entry point for
  installation, foundations, brand guidance, agent guidance, and roadmap
  information.
- Storybook is the exhaustive, executable catalog for components, states,
  interactions, accessibility, and compositions.
- Package READMEs and contributor/agent instructions contain operational
  commands and authoring procedures.
- Specifications and plans describe feature-specific requirements and
  implementation decisions.

The repository MUST include enough README documentation to support each
published package independently, even before the full docs site exists.

### XIII. Versioning and Release Discipline

Semantic versioning MUST be used across all published packages. Token additions
are usually minor changes. Token value fixes (color hex updates with same name
and meaning) MAY be patch changes. Token removals or renames are breaking
changes requiring a major version bump. Before publishing, build output and
package contents MUST be verified (via `pnpm pack --dry-run` or equivalent).
Future multi-package releases MUST clearly document which workspace packages
changed and what the nature of each change was.

### XIV. Storybook Stories Are Executable Component Contracts

Storybook is the exhaustive component and pattern workbench — not merely a
visual gallery. Stories define supported public behavior and serve as
regression fixtures, accessibility test targets, interaction test harnesses,
and visual-regression cases.

Every supported, externally meaningful component state MUST normally have a
deterministic, named story. A Controls or Playground story MAY support
exploration but MUST NOT substitute for fixed regression stories. Stories MUST
represent supported public behavior rather than invented props or undocumented
states.

Interactive components MUST include browser-executed interaction coverage for
their critical observable behavior, including keyboard behavior and focus
management where applicable. Storybook tests MUST prefer accessible queries
(`getByRole`, `getByLabelText`, `getByText`) and observable outcomes over
implementation details such as CSS selectors or `data-testid` attributes.

Stable stories used for tests or screenshots MUST avoid uncontrolled
randomness, current dates, live network dependencies, sensitive data, and
nondeterministic animation.

Component stories MUST document primitives and their supported states. Pattern
and recipe stories MUST demonstrate realistic compositions without silently
creating new production APIs. Story metadata and documentation MUST explain
semantic intent, appropriate use, misuse, accessibility obligations, and
important constraints rather than merely restating prop names.

### XV. Responsive and Inclusive States Are First-Class

The design system is intended for use in low-bandwidth, mobile-first,
accessibility-sensitive applications. Applicable components and patterns MUST
be evaluated for:

- Narrow and mobile layouts
- Long and localized-looking content
- Constrained containers
- Increased text size and wrapping
- Keyboard focus visibility
- High-contrast or forced-colors behavior when supported
- Reduced motion for animated behavior
- Loading, empty, error, disabled, and read-only states when those states are
  part of the component contract

A combinatorial story for every possible prop, viewport, and theme is not
required. Explicit coverage of meaningful supported contracts and historically
risky combinations SHOULD be provided.

### XVI. Framework Storybooks Must Remain Independently Valid

Each framework Storybook MUST build and test successfully in its own framework
context. Composition into the primary catalog MUST NOT hide a framework
Storybook's independent failures. The primary catalog SHOULD degrade gracefully
when an optional composed Storybook is unavailable during local development.

Shared design-system behavior MUST remain recognizable across HTML and
framework-specific representations. Changes to shared components SHOULD verify
affected Storybooks rather than only the package where the source edit occurred.

## Stack and Dependency Constraints

- **Package manager**: pnpm. npm or yarn lockfiles MUST NOT be committed.
- **SCSS compiler**: Dart Sass via the `sass` npm package. LibSass or
  node-sass are not supported.
- **Styles package dependencies**: Runtime dependencies MUST be limited to
  framework-neutral style foundations such as USWDS. Framework-specific
  runtime dependencies MUST NOT be added to `@pathable/styles`.
- **Wrapper package dependencies**: Wrapper packages MUST list
  `@pathable/styles` as a runtime dependency and MUST NOT require client code to
  import `@pathable/styles` separately for normal use.
- **Node version**: The repository root MUST declare an `engines.node` range in
  `package.json` that all workspace packages support.
- **Lockfile**: `pnpm-lock.yaml` MUST be committed to the repository for
  reproducible installs.

## Wrapper Package Contract

- **Source-first sequencing**: New visual behavior, component classes, tokens,
  fonts, icons, and asset contracts MUST be added to `packages/styles` before a
  wrapper package exposes them.
- **No wrapper-only styling**: Wrapper packages MUST NOT introduce private CSS
  that changes visual semantics outside the `@pathable/styles` contract.
- **Semantic and visual parity**: Wrapper components MUST preserve the shared
  package's semantic HTML, accessibility behavior, class contracts, design
  tokens, and intended visual behavior.
- **Automatic assets**: Wrapper public entrypoints MUST import or otherwise
  package the compiled styles and assets required for normal consumer use.
- **Transitive installability**: `pnpm pack --dry-run` or equivalent validation
  MUST demonstrate that a wrapper package can be installed and imported without
  a separate client-side `@pathable/styles` import.
- **Type safety**: Public component APIs and generated declarations MUST be
  type-safe and suitable for consumers.
- **Publishable validation**: Publishable artifacts MUST be validated as
  consumers receive them: exports, included files, runtime entry points, peer
  dependencies, and declarations. A successful monorepo build alone MUST NOT be
  treated as proof that a package is publishable.
- **Framework mapping only**: Wrapper props and component names MAY improve
  framework ergonomics, but each visual state MUST map to an existing
  `packages/styles` class, token, or documented pattern.
- **React naming parity**: React components in `packages/react` MUST be named
  by converting the equivalent `packages/styles` component name to CamelCase
  and removing any `pathable` prefix.

## Automated Validation & Quality Gates

### Validation as Product Contract

Source code, styles, stories, documentation, generated declarations, and
publishable package metadata MUST be validated by automated quality gates
appropriate to their file type and package.

Pull requests MUST run the applicable linting, formatting, type-checking,
build, test, accessibility, and package-validation gates before merge. Required
checks MUST fail on actionable violations; a warning-only configuration MUST
NOT create the appearance of enforcement.

Files MUST NOT be silently excluded from their applicable validator merely to
make CI pass. Rule suppressions and test exclusions MUST be narrowly scoped,
documented, and justified. Valid findings SHOULD be fixed at the source instead
of disabling a rule globally.

Generated output, caches, dependencies, and intentionally external artifacts
MAY be excluded explicitly. Local validation and CI validation MUST remain
materially consistent so contributors and coding agents can reproduce failures.

The established tool categories include: JavaScript/TypeScript linting, style
linting, Markdown linting, formatting, token validation, type checking,
Storybook testing, and package-distribution checks.

### Lint Enforcement

Agents MUST NOT disable, weaken, skip, or remove lint checks to make work pass.
This includes inline disable comments, ignore-file entries, rule severity
reductions, file or glob exclusions, package-script bypasses, CI-condition
changes, and command flags that silence lint failures. Agents MUST fix the
underlying issue or report the lint conflict as a blocker.

Only a human maintainer may bypass a lint rule. A human-approved bypass MUST be
narrow, include the rule name, explain the reason, and preserve the smallest
practical scope. Agents MAY implement a human-specified bypass only when the
approval is explicit in the task, issue, PR, or conversation context.

### Gate Categories

- **Token changes require build verification**: Any change to token values or
  names MUST be followed by a build (`pnpm build`) and the output checked into
  version control or validated by CI.
- **Wrapper changes require styles validation**: Any new wrapper component,
  variant, or prop MUST identify the owning `packages/styles` contract and
  verify the wrapper imports the compiled styles/assets automatically.
- **Visual diff review**: Token value changes SHOULD be reviewed with a visual
  diff or output comparison when color, elevation, or spacing values change.
- **Package contents**: Before release, run `pnpm pack --dry-run` or equivalent
  to verify the published package contains the expected files.
- **Commit discipline**: Changes that affect multiple workspace packages SHOULD
  be committed separately per workspace unless they are logically atomic.
- **Figma sync**: When Figma design tokens are updated, a corresponding
  repository issue or pull request MUST be created to track the code-side
  update. Silent divergence is not permitted.

### Visual Regression Protection

Visual regression protects design-system stability. Stable stories SHOULD serve
as deterministic visual-regression fixtures for meaningful component states.
Visual checks MUST protect design tokens, typography, spacing, responsive
behavior, focus indicators, overflow, wrapping, icon alignment, and state
presentation where applicable.

Visual snapshots MUST be updated only after intentional review of the rendered
change. Snapshot approval MUST NOT be used to conceal unexplained regressions.
Serialized DOM snapshots MUST NOT be treated as a complete substitute for
browser-rendered visual or behavioral validation.

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

**Version**: 1.4.0 | **Ratified**: 2026-07-04 | **Last Amended**: 2026-07-19