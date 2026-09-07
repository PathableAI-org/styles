# Implementation Plan: Theming Documentation and End-to-End Validation

**Branch**: `062-theming-documentation` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/062-theming-documentation/spec.md`

## Summary

Ship the documentation, cross-cutting checks, and end-to-end evidence that tie the theming series
(features 01–05) into a verified, discoverable whole — with **no new runtime surface**. The runtime
surface this feature documents and validates already exists:

- `@pathableai/styles` split stylesheet subpaths (`./components`, `./utilities`, `./theme`, `.`).
- `@pathableai/react` theme vocabulary (`ThemeColors`, `ThemeConfig`, `themeColorToken`,
  `THEME_COLOR_KEYS`), data (`defaultTheme`, `createTheme`), the `ThemeProvider` component, and the
  tone types (`TextTone`, `SurfaceTone`, `BorderTone`).

This feature adds three kinds of artifact:

1. **A token vocabulary reference** (`docs/theming/token-vocabulary.md`) mapping every one of the
   25 `ThemeColors` keys to its `--pathable-color-*` CSS custom property, its default value, and a
   plain-language role (FR-001/FR-002).
2. **A consumer guide** (`docs/theming/consumer-guide.md`) showing how to override a few colors with
   `createTheme` + `ThemeProvider`, how to extend `defaultTheme` directly, and how to choose between
   the default stylesheet import and the provider-driven path (FR-003/FR-004/FR-005).
3. **Rendered validation evidence**: a Storybook story rendering a representative existing layout
   (`AppShell`) under a partial theme, plus a browser-executed test that asserts real
   `getComputedStyle` resolution of overridden vs. default tokens and subtree scoping
   (FR-006/FR-007/FR-008), and a backward-compatibility verification that no-provider rendering is
   identical to the pre-theming state (FR-009). A verification record closes out every parent-plan
   acceptance criterion (FR-010), including the type-check rejection of invalid keys (FR-011),
   `defaultTheme`/token-list export (FR-012), tone-type imports (FR-013), and structural-subpath
   import independence (FR-014).

## Technical Context

**Language/Version**: TypeScript 5.7 + React 19 (`packages/react`; peer `^18.0.0 || ^19.0.0`).
Markdown for the docs artifacts (linted with `markdownlint`). The rendered test runs in a real
browser via Playwright (Storybook test-runner), not in jsdom.

**Primary Dependencies**: `@pathableai/styles` (`workspace:*`), `@pathableai/react` (`workspace:*`),
Storybook 10 (`apps/storybook-react`: `@storybook/react-vite`, `@storybook/test-runner`,
`@storybook/addon-a11y`, `@storybook/addon-docs`, `axe-playwright`). Docs have no code dependency.

**Storage**: N/A — documentation and validation only; no runtime state or persistence.

**Testing**: For the rendered test, the Storybook test-runner drives a real Chromium page so
`getComputedStyle` resolves `var(--pathable-color-*)` to actual values (jsdom does not resolve CSS
custom properties, so a Vitest-only test cannot prove resolution). Existing gates remain the
regression proof: `pnpm lint` (js/styles/md/tokens/format), `pnpm typecheck`,
`pnpm test:storybook-react`, `pnpm test:visual`, `pnpm test:next-consumer`, and
`pnpm lint:tokens`.

**Target Platform**: Published npm packages `@pathableai/react` and `@pathableai/styles` (unchanged
by this feature) and the repository's `docs/` documentation area. The rendered test runs in the
React Storybook (port 6007).

**Project Type**: Library (documentation + rendered validation within a pnpm monorepo).

**Performance Goals**: N/A — no runtime surface; the rendered test adds one deterministic story.

**Constraints**: No new token categories, components, dark-mode tokens, or renames/removals
(FR-015). No new runtime surface — the plan must not propose edits to `packages/react` runtime
source, `packages/styles` source, or package `exports`. The vocabulary reference must be complete
and accurate (zero omissions, zero invented tokens; defaults must match `defaultTheme`/SCSS —
FR-002, SC-001). Documentation surfaces must obey constitution XII (one canonical source per fact;
other surfaces link). Lint checks must not be disabled or weakened.

**Scale/Scope**: New docs (`docs/theming/token-vocabulary.md`, `docs/theming/consumer-guide.md`,
`docs/theming/acceptance-verification.md`), one new Storybook story + a browser-executed assertion
wired into the React Storybook test-runner, plus README cross-links. No source change to either
package.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- Changes are confined to documentation (`docs/theming/` + package README cross-links) and the
  React Storybook test surface (`packages/react/src/stories/**`, `apps/storybook-react`). No
  `packages/styles` source, no `packages/react` runtime source (no component, theme, token, export,
  or entry-point change).
- No wrapper package or `packages/styles` contract is created or modified. The runtime contracts
  this feature documents already exist and are owned by features 057–061; this feature references
  them without altering them.
- No component is added or renamed, so the CamelCase-parity naming rule is not invoked. No
  wrapper-only styles, tokens, assets, or visual semantics are introduced (constitution IV).

### Consumer and Publishable Validation

- No published package content changes, so no new publishability surface is introduced. Existing
  publishable-validation gates (`check:package`, `check:types`, `test-next-consumer`) remain the
  regression proof that the documented exports are real and unchanged; the plan keeps them as
  verification evidence (FR-012/FR-013/FR-014).
- The docs describe only exported, already-published APIs; the plan cross-references the
  authoritative contracts (features 058–061) rather than re-typing them, so the docs cannot drift
  from the published surface without a separate, detectable change.
- No breaking change is proposed; nothing in the release/change-management policy is triggered.

### Validation Gates

- Applicable gates: `pnpm lint:md` (markdownlint on the new docs), `pnpm check:format` (prettier),
  `pnpm lint:js` (eslint + jsx-a11y on the new story), `pnpm lint:tokens` (confirms the 25-token
  vocabulary is untouched), `pnpm typecheck`, `pnpm test:storybook-react` (a11y + the new rendered
  assertion), `pnpm test:visual`, and `pnpm test:next-consumer`. No gate is disabled, weakened,
  skipped, or removed.
- No file is excluded from its validator to make CI pass. Markdown in `specs/**` and `docs/**` is
  covered by `lint:md`; the new story is covered by eslint/a11y/test-runner.
- No warning-only configuration is introduced.

### Story and Interaction Requirements

- One deterministic, named story is added: a representative `AppShell` layout rendered under a
  partial `ThemeProvider` theme. It uses fixed colors and synthetic content — no dates, randomness,
  or network. It is a regression/assertion fixture, not a Playground substitute (constitution XIV).
- The browser-executed assertion reads the observable outcome (`getComputedStyle` of elements that
  reference `var(--pathable-color-*)`), not `data-testid` or internal class selectors, in line with
  the observable-outcome preference in constitution XIV.
- No interactive component behavior changes, so no new keyboard/focus interaction coverage is
  required; the existing `accordion` behavior-contract coverage is unaffected.

### Accessibility

- The new story must pass the React Storybook a11y runner (axe) unchanged; it renders existing,
  already-audited components and adds no new violations.
- Static JSX linting (`eslint` + `jsx-a11y`) and rendered accessibility (`axe-playwright`) both run
  on the new story — complementary, not interchangeable (constitution X).
- The story uses synthetic, non-sensitive content.

### Responsive and Resilient States

- The rendered test targets a single deterministic desktop viewport; it is a color-resolution
  proof, not a combinatorial responsive audit. The `AppShell` layout's existing mobile/responsive
  stories and the visual smoke suite (`test:visual`) remain the responsive coverage.
- No loading/empty/error/disabled states are introduced.

### Visual Regression

- The new story is a deterministic fixture and can be added to the canonical visual list, but the
  decisive evidence is computed-style resolution, not a screenshot. Serialized DOM snapshots are
  not relied on as a complete substitute for browser-rendered validation (constitution "Visual
  Regression Protection").
- Backward compatibility (no-provider rendering identical to pre-theming) is evidenced by the
  existing stable-story visual smoke suite and the story contract gate, not by new bespoke
  fixtures.

### Documentation Surface Ownership

- Canonical sources (constitution XII): the token vocabulary (`docs/theming/token-vocabulary.md`)
  is canonical for "what each token controls" (the role descriptions); `defaultTheme` +
  `$semantic-colors` (via `packages/styles/src/_semantic.scss`) is canonical for default values; the
  feature 058/059 contracts are canonical for the key set and mapping. The consumer guide is
  canonical for "how to override/extend/choose a path". Package READMEs link to these docs rather
  than duplicating them.
- Storybook remains the executable catalog; the new story is the executable proof, and the
  vocabulary/guide link to it.

### Cross-Framework Impact

- No `packages/styles` source or shared CSS contract change, so the styles Storybook is unaffected.
  The React Storybook must still build and test independently in its own framework context
  (constitution XVI), which `test:storybook-react` enforces.

### Complexity Tracking

- No constitution violations. No entry needed.

## Scope (R/M/U/O)

Per constitution "Change Scope Granularity", planning locks **M + U**:

- **M (Module/Capability)** — hard outer boundary: "theming documentation + end-to-end
  validation". Only the `docs/` documentation surface and the React Storybook test surface are in
  scope. `packages/styles` and `packages/react` runtime source are out of scope.
- **U (Unit/Design Object)** — primary planning boundary, one per deliverable:
  1. Token vocabulary reference (`docs/theming/token-vocabulary.md`).
  2. Consumer guide (`docs/theming/consumer-guide.md`).
  3. End-to-end rendered test (Storybook story + browser assertion).
  4. Backward-compatibility verification evidence.
  5. Parent acceptance-criteria verification record (`docs/theming/acceptance-verification.md`).
- **O (Operation/Detail)** — execution detail, mapped to concrete paths during task generation
  (e.g., a specific table row, a specific README cross-link, a specific assertion line).

## Project Structure

### Documentation (this feature)

```text
specs/062-theming-documentation/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── token-vocabulary.md
│   ├── consumer-guide.md
│   └── rendered-validation.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
docs/theming/
├── token-vocabulary.md           # NEW: 25-token vocabulary table (key → property → default → role)
├── consumer-guide.md             # NEW: override / extend / choose-a-path guide
└── acceptance-verification.md    # NEW: parent-plan acceptance-criteria close-out record

packages/react/src/stories/
└── components/theme/
    └── ThemeProvider.stories.tsx # MODIFIED or EXTENDED: add a representative-layout story
                                  # (AppShell under a partial theme) with a browser-executed
                                  # resolution assertion

apps/storybook-react/.storybook/
└── test-runner.js                # MODIFIED: register the rendered color-resolution assertion
                                  # (keyed to the new story id) alongside the existing a11y hook

packages/react/README.md          # MODIFIED: link to docs/theming (canonical guide/vocabulary)
packages/styles/README.md         # MODIFIED: link to docs/theming (canonical guide/vocabulary)
```

**Structure Decision**: Documentation is canonical under `docs/theming/` (constitution XII: the
`docs/` area is the curated reference surface; the Astro site and READMEs link to it). The rendered
proof lives in the React Storybook (`packages/react/src/stories/`, consumed by
`apps/storybook-react`), because real-browser `getComputedStyle` is required to prove resolution and
Storybook is the project's executable catalog (constitution XIV). No `packages/styles` or
`packages/react` runtime source is touched.

## Complexity Tracking

> No constitution violations.

## Design Artifacts

- Data model: `./data-model.md` (domain facts — documentation-surface ownership, validation
  approach, and the parent acceptance-criteria close-out map; the 25-token table itself is
  referenced from the 058/059 SSOT, not re-typed here).
- Interface contracts: `./contracts/token-vocabulary.md`, `./contracts/consumer-guide.md`,
  `./contracts/rendered-validation.md`.
- Research decisions: `./research.md`.
- Validation path: `./quickstart.md`.
- Internal object design (`class-diagram.md`): not applicable — no class/service/adapter structure;
  this is documentation plus a rendered test.
- Service sequences (`contracts/sequences.md`): not applicable — no service boundary, async worker,
  retry, or rollback path.

## Visual fidelity navigation

- Visual validation decisions: `./research.md` (where the rendered test lives, how resolution and
  backward compatibility are measured).
- Rendered validation contract: `./contracts/rendered-validation.md`.
- Visual proof execution: `./quickstart.md`.
