# Implementation Plan: React Entry Point Wiring

**Branch**: `061-react-entry-point-wiring` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/061-react-entry-point-wiring/spec.md`

## Summary

Change the `@pathableai/react` package entry point so it imports only the structural stylesheet layers —
`@pathableai/styles/components` and `@pathableai/styles/utilities` — instead of
`import '@pathableai/styles'`, which today pulls the full default stylesheet (including the `:root`
default theme token layer). This makes the React package structurally independent of the default
theme token layer, so `ThemeProvider` consumers who supply their own tokens render without a
cascade-order battle against the package's own stylesheet. Backward compatibility is preserved by
leaving the default (`.`) and theme (`./theme`) subpath exports of `@pathableai/styles` unchanged:
consumers who want the default token layer add that import at the application boundary, exactly as
they do today. The change is a two-line entry-point edit plus a build-config externalization fix
and a documentation/release note.

## Technical Context

**Language/Version**: TypeScript 5.7 + React 19 (`packages/react`; peer `^18.0.0 || ^19.0.0`),
Node.js ESM for build/lint scripts. Vite 8 drives the React library build
(`vite build && tsc -p tsconfig.build.json`).

**Primary Dependencies**: `react` (peer), `@pathableai/styles` (`workspace:*`, runtime dependency
whose compiled CSS subpaths are the source of truth for structural styles); dev: `vite`,
`vitest`, `publint` (`check:package`), `attw`/`@arethetypeswrong/cli` (`check:types`).

**Storage**: N/A — pure import/entry-point change; no runtime state or persistence.

**Testing**: `vitest` (package-entry smoke), `tsc` typecheck, `eslint` (`--max-warnings=0`),
`publint --pack false` (`check:package`), `attw --pack --profile esm-only` (`check:types`),
`test:storybook-react` and `test:storybook-react-server` gates, and `pnpm lint:tokens` (confirms
the token vocabulary is untouched).

**Target Platform**: Published npm package `@pathableai/react` (and, unchanged, `@pathableai/styles`).
Runs in the browser and during server rendering (Next.js App Router).

**Project Type**: Library (React wrapper package within a pnpm monorepo).

**Performance Goals**: N/A — a static module-graph change; no runtime cost.

**Constraints**: Backward compatibility is a release gate — the default (`import '@pathableai/styles'`)
and theme-subpath (`import '@pathableai/styles/theme'`) consumer paths must render identically
(SC-002/FR-003/FR-004); no token values, component behavior, or the `ThemeProvider` component may
change (FR-008); the structural subpaths (`./components`, `./utilities`) and the default (`.`) /
theme (`./theme`) mappings of `@pathableai/styles` must remain available and unchanged (FR-007);
the React Vite build must keep the styles imports external so the published package retains runtime
side-effect imports for the structural layers instead of bundling the CSS; no lint/type-check
suppression.

**Scale/Scope**: 1 source file (`packages/react/src/index.ts`), 1 build config
(`packages/react/vite.config.ts`), 1 README (`packages/react/README.md`), and a changeset for the
breaking-change release note. No `packages/styles` source change.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- Changes are confined to `packages/react`: the entry-point side-effect import
  (`src/index.ts`), the library-build externalization list (`vite.config.ts`), and the package
  README. A `.changeset` entry records the breaking change. No `packages/styles` source, asset,
  token, or CSS change.
- The owning `packages/styles` contract — the `./components` and `./utilities` subpaths (compiled
  `dist/components.css` and `dist/utilities.css`) — already exists (feature 057) and is not
  modified. This feature only re-points the React entry to those two subpaths and drops the
  default `.` import, which is the full stylesheet including the `:root` default theme tokens.
- No component is added or renamed, so the CamelCase-parity naming rule is not invoked. No
  wrapper-only styles, tokens, assets, or visual semantics are introduced (constitution IV).

### Consumer and Publishable Validation

- Consumers of `@pathableai/react` continue to receive the required structural styles automatically
  through the wrapper's entry-point imports (constitution V) — component wrappers and utilities —
  but no longer receive the default theme tokens implicitly. This is a deliberate, documented
  breaking change (spec FR-005 and edge cases); the wrapper still lists `@pathableai/styles` as a
  runtime dependency and imports its compiled structural layers at the public entry point.
- Publishability is validated with `check:package` (`publint --pack false`) and `check:types`
  (`attw --pack --profile esm-only`) in addition to `vite build` + `tsc`; a successful monorepo
  build alone is not treated as proof of publishability. The plan also keeps the existing
  `test-next-consumer.mjs` packed-consumer check as the transitive-installability evidence.
- The breaking change is recorded via a Changeset and documented in `packages/react/README.md`,
  following the release/change-management policy (constitution IV/XIII).

### Validation Gates

- Applicable gates: `packages/react` `lint` (eslint + jsx-a11y, `--max-warnings=0`), `typecheck`,
  `test:unit` (vitest), `build` (vite + tsc), `check:package` (publint), `check:types` (attw), the
  `test:storybook-react` contract gate, `test:storybook-react-server`, and `pnpm lint:tokens`. No
  lint, type-check, or test check is disabled, weakened, skipped, or removed.
- No file is excluded from its validator to make CI pass. The repo-wide eslint ignore of `specs/**`
  as a documentation directory is an intentional, pre-existing exclusion, not one introduced here.
- No warning-only configuration is introduced.

### Story and Interaction Requirements

*Not applicable* — no new component and no change to any rendered component. The feature changes
only which CSS layers the package imports. Existing Storybook stories are unaffected because
Storybook loads the full styles path at the application boundary; the story contract gate remains
the regression proof for the backward-compatible paths.

### Accessibility

- No markup, component, role, keyboard, or focus change — the feature introduces no new
  accessibility violations.
- The one accessibility-adjacent risk is documented as the breaking change: a consumer who imports
  `@pathableai/react` with no stylesheet import at all will receive structural styles but no
  default tokens (unstyled content). The README and Changeset explicitly mitigate this.

### Responsive and Resilient States

*Not applicable* — no rendered component UI change; no loading/empty/error/disabled states are
affected.

### Visual Regression

- No token value or visual change. SC-002 requires the two backward-compatible paths (default and
  theme-subpath) to render identically to today; this is proven by before/after visual and
  structural comparison of the existing stable stories, not by changing fixtures.
- Stable stories remain deterministic visual-regression fixtures; serialized DOM snapshots alone
  are not relied on as the complete proof.

### Documentation Surface Ownership

- Canonical source for the consumer-facing contract and the breaking-change note is
  `packages/react/README.md`. `packages/styles/README.md` already documents the subpath mapping
  (feature 057) and is the canonical source for what each styles subpath resolves to. These two
  surfaces are linked rather than duplicating the mapping (constitution XII).
- No Astro docs-site change is required; Storybook remains the executable catalog.

### Cross-Framework Impact

- No `packages/styles` source or shared CSS contract change, so the styles Storybook is unaffected.
  The React Storybook must still build and test independently in its own framework context
  (constitution XVI), which `test:storybook-react` enforces.

### Complexity Tracking

- No constitution violations. No entry needed.

## Project Structure

### Documentation (this feature)

```text
specs/061-react-entry-point-wiring/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── react-entry-point.md
│   └── styles-subpaths.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   └── index.ts             # MODIFIED: import '@pathableai/styles/components' +
│                            #           import '@pathableai/styles/utilities'
│                            #           (replaces import '@pathableai/styles')
├── vite.config.ts           # MODIFIED: externalize the two styles subpaths so the
│                            #           runtime side-effect imports survive in dist/index.js
└── README.md                # MODIFIED: three consumer paths + breaking-change note

.changeset/                  # NEW: patch/minor changeset recording the breaking change
```

**Structure Decision**: The change is confined to the existing React entry point and its library
build config. The two subpath targets already exist in `packages/styles` (feature 057); no styles
source is touched. Documentation lives in the React README (consumer contract) with the styles
subpath mapping referenced from `packages/styles/README.md`. A Changeset records the release intent.

## Complexity Tracking

> No constitution violations.

## Design Artifacts

- Data model: `./data-model.md` (minimal — no runtime data entities; documents the consumer-path
  and stylesheet-subpath domain facts).
- Interface contracts: `./contracts/react-entry-point.md` and `./contracts/styles-subpaths.md`.
- Research decisions: `./research.md`.
- Validation path: `./quickstart.md`.
- Internal object design (`class-diagram.md`): not applicable — this is a two-line import change
  with no class/service/adapter structure.
- Service sequences (`contracts/sequences.md`): not applicable — no service boundary, API, command,
  event, async worker, retry, or rollback path exists.
