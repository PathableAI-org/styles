# Implementation Plan: Consolidated Theme Token CSS and Granular Exports

**Branch**: `057-consolidated-theme-token-css` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/057-consolidated-theme-token-css/spec.md`

## Summary

Harden the `@pathableai/styles` output contract so the future React theming API can
sit on a clean, separable CSS foundation. The work has three parts: (1) guarantee every
`--pathable-color-*` declaration lives in exactly one `:root` block (already authored in
`_semantic.scss`; this feature adds a lint-level enforcement and records the audit),
(2) split the compiled stylesheet into three separable layers — `components.css`,
`utilities.css`, and `theme-default.css` — whose union reproduces today's
`dist/styles.css`, and (3) expose granular `exports` subpaths so consumers can import
component styles without importing the default theme tokens. The feature is entirely
within `packages/styles`: no token value, name, or count changes, no React changes, and
the default `.` entry point is unchanged.

## Technical Context

**Language/Version**: SCSS (Dart Sass via the `sass` npm package); Node.js ESM for build/lint scripts.

**Primary Dependencies**: `@uswds/uswds` v3.x (authoring layer), `sass` v1.86+.

**Storage**: N/A — static compiled CSS package.

**Testing**: `stylelint` (`lint:styles`), `lint:tokens` (custom Node script), Storybook, `test:visual`.

**Target Platform**: Published npm package `@pathableai/styles`; framework-neutral compiled CSS.

**Project Type**: Library (design-system CSS package within a pnpm monorepo).

**Performance Goals**: N/A — build-time only; no runtime behavior change.

**Constraints**: No token value/name/count changes; no React package changes; the default
`.` export keeps resolving to `dist/styles.css`; exactly one `:root` block may declare
`--pathable-color-*`; loading `components.css` + `utilities.css` + `theme-default.css`
must render identically to `dist/styles.css`.

**Scale/Scope**: ~25 `--pathable-color-*` tokens, ~100 component wrapper partials, three
new compiled files, three new `exports` subpaths, and one lint invariant.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- Only `packages/styles` source and build/lint artifacts change (SCSS partials, entry
  files, `package.json`, and the `lint:tokens`/build scripts). No wrapper package changes.
- No `packages/react` component is added or renamed, so the CamelCase naming parity rule
  does not apply here.
- The owning `packages/styles` contract (the compiled CSS custom properties and component
  classes) is preserved verbatim; only its organization into three output files changes.

### Consumer and Publishable Validation

- The plan keeps the default `.` export intact and adds `./components`, `./utilities`, and
  `./theme` subpaths, each mapping to a concrete `dist/*.css` file.
- Publishable validation: the plan includes `pnpm pack --dry-run` for `@pathableai/styles`
  to confirm the three new files are included via the existing `files: ["dist", ...]` glob
  and the `exports` map resolves each subpath.
- No breaking change: default `.` resolution and rendered output are unchanged.

### Validation Gates

- Applicable gates: `lint:styles` (stylelint over `src/**/*.scss`), `lint:tokens`, and
  `build`. The plan does not disable, weaken, skip, or remove any lint check.
- No file is excluded from its validator to make CI pass.
- No warning-only configuration is introduced.

### Story and Interaction Requirements

*Not applicable* — this feature does not add or change rendered component UI, stories,
or interactive behavior. Existing stories are unaffected.

### Accessibility

*Not applicable for new rendered UI* — no markup, component behavior, or visual token
values change. The plan preserves existing accessibility guarantees by keeping the
compiled output behaviorally identical.

### Responsive and Resilient States

*Not applicable* — no rendered component UI, tokens, or states change.

### Visual Regression

*Not applicable for new visuals* — no token values change. The plan verifies parity by
comparing the split files' union against the existing `dist/styles.css`, which is the
behavioral guard for design-token/visual stability.

### Documentation Surface Ownership

- Canonical source for the new subpath contract is `packages/styles/package.json`'s
  `exports` map (and the feature plan/contracts). No README/docs-site change is required
  for this feature beyond the package metadata; the parent React-theming plan documents
  consumer-facing usage.

### Cross-Framework Impact

- `packages/styles` is a shared contract, so the plan verifies the styles package build
  still succeeds and that the default `styles.css` output is unchanged. Framework
  Storybooks consume the default `styles.css` and are not expected to change; a build
  re-run serves as the regression check.

### Complexity Tracking

- No constitution violations. No entry needed.

## Project Structure

### Documentation (this feature)

```text
specs/057-consolidated-theme-token-css/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── package-exports.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/styles/
├── package.json                       # MODIFIED: build script + exports subpaths
├── scripts/
│   └── lint-tokens.mjs                # MODIFIED: assert single --pathable-color-* :root block
├── src/
│   ├── index.scss                     # MODIFIED: also @forward the utility token block
│   ├── _uswds-theme.scss              # unchanged (config + USWDS settings docs)
│   ├── _colors.scss                   # unchanged (brand --pathable-brand-* :root)
│   ├── _semantic.scss                 # unchanged (single --pathable-color-* :root)
│   ├── _typography.scss               # unchanged
│   ├── _spacing.scss                  # unchanged
│   ├── _elevation.scss                # unchanged
│   ├── _radius.scss                   # unchanged
│   ├── _components-custom-properties.scss  # unchanged
│   ├── _utilities-config.scss         # NEW: extracted $pathable-utilities map (no CSS)
│   ├── _utilities-tokens.scss         # NEW: utility :root token block
│   ├── _utilities.scss                # MODIFIED: class generation only (uses config)
│   ├── theme-default.scss             # NEW: entry for theme tokens
│   ├── utilities.scss                 # NEW: entry for utility classes
│   ├── components.scss                # NEW: entry for component styles + fonts + grid
│   └── pathable-component-wrappers/   # unchanged
└── dist/
    ├── styles.css                     # unchanged output (combined)
    ├── components.css                 # NEW
    ├── utilities.css                  # NEW
    └── theme-default.css              # NEW
```

**Structure Decision**: Three new SCSS entry files compile the three layers directly
from the existing partials. The only partial that mixes tokens and classes —
`_utilities.scss` — is split so its `:root` token block (`_utilities-tokens.scss`) and
its class generation (`_utilities.scss`) can be emitted into `theme-default.css` and
`utilities.css` respectively. The shared `$pathable-utilities` map moves to a
no-CSS-output `_utilities-config.scss` so both consumers can reference it without
duplicating definitions.

## Complexity Tracking

> No constitution violations.
