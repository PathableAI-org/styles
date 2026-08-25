# Implementation Plan: ThemeProvider Component

**Branch**: `060-theme-provider` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/060-theme-provider/spec.md`

## Summary

Implement `ThemeProvider`, a React component exported from `@pathableai/react` that accepts a
**resolved** `ThemeConfig` (produced by `createTheme`) and emits all 25 resolved color tokens as
`--pathable-color-*` CSS custom properties on a wrapper element's inline `style`, scoping the
theme to its subtree via the CSS cascade. When the passed theme deep-equals `defaultTheme`, the
component renders its children with **no wrapper element**, preserving the existing DOM. It is
polymorphic (`as`, default `div`) with native-prop/ref forwarding, accepts a documented no-op
`colorScheme` (`'light' | 'dark'`) forward-compatible hook, and is fully server-renderable. It
builds directly on the `ThemeColors`/`ThemeConfig` vocabulary and `THEME_COLOR_TOKEN_MAP` from
feature 058 and the `defaultTheme`/`createTheme` data layer from feature 059, which it reuses
rather than redefines.

## Technical Context

**Language/Version**: TypeScript 5.7 + React 19 (`packages/react`; peer `^18.0.0 || ^19.0.0`),
Node.js ESM for build/lint scripts.

**Primary Dependencies**: `react` (peer), `@pathableai/styles` (`workspace:*`, runtime dependency
whose CSS/SCSS is the source of truth for token names/values); dev: `vitest`,
`@testing-library/react`, `@testing-library/jest-dom` (jsdom), `eslint` + `eslint-plugin-jsx-a11y`.

**Storage**: N/A — stateless component; no persistence, no context, no runtime state.

**Testing**: `vitest` + `@testing-library/react` (`packages/react/src/**/__tests__/*.test.tsx`),
`tsc` typecheck, `eslint` (`--max-warnings=0`), `pnpm lint:tokens` (guards the 25-key vocabulary),
and the `@pathable/storybook-contracts`/storybook-react gates for the stories.

**Target Platform**: Published npm package `@pathableai/react`; runs in the browser and during
server rendering (Next.js App Router). One new public component export plus one `ColorScheme` type.

**Project Type**: Library (React wrapper package within a pnpm monorepo).

**Performance Goals**: Trivial — one 25-entry style object built per render; the default-theme
guard is 25 string comparisons via `THEME_COLOR_KEYS.every(...)`. No context, no memoization
required (output is a pure function of props + `defaultTheme`).

**Constraints**: SSR-safe — inline `style` only, no browser globals, no `useLayoutEffect`
(`useMemo`/`useCallback` at most); no token name/value/count changes (reuses `THEME_COLOR_KEYS` and
`THEME_COLOR_TOKEN_MAP`, does not duplicate them); no token categories beyond `colors`; no runtime
CSS-in-JS engine; no dark-mode token generation (`colorScheme` is a documented no-op); pure and
deterministic output (concurrent-rendering safe); no lint/type-check suppression.

**Scale/Scope**: 1 component (`ThemeProvider.tsx`), 1 `ColorScheme` type, 1 unit-test file, and
Storybook stories (default/partial/nested). Re-exports in `theme/index.ts` and `src/index.ts`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Source and Package Scope

- Changes are confined to `packages/react` source (`src/theme/ThemeProvider.tsx`,
  `src/theme/index.ts`, `src/index.ts`) plus tests and stories. No `packages/styles` source,
  asset, token, or CSS change.
- The owning `packages/styles` contract — the `--pathable-color-*` custom properties declared by
  `_semantic.scss` and consumed by component classes — is **not** modified. This feature emits
  those same property names at a subtree scope; it changes only what `var(--pathable-color-*)`
  resolves to within the wrapper, not the property vocabulary itself (constitution II/IV).
- `ThemeProvider` is not a `packages/styles` component (there is no `pathable-theme-provider`
  class/component in the styles package); it is a framework-native control layer, so the
  CamelCase-parity naming rule does not apply to it. It preserves the shared package's semantic
  HTML and class contracts by not introducing any of its own classes or styles (constitution IV).
- The wrapper element carries only inline custom properties, forwarded native props, and (when
  present) a consumer `className`. It adds no wrapper-only visual semantics.

### Consumer and Publishable Validation

- Consumers import `ThemeProvider` from `@pathableai/react`; the `@pathableai/styles` CSS is
  already imported at the package entry point, so no separate client import is required
  (constitution V).
- Public declarations are type-safe: `ThemeProviderProps`, `ThemeConfig` (reused), and `ColorScheme`
  are exported; `tsc` typecheck plus `check:types` (`attw`) / `check:package` (`publint`) validate
  publishability. The plan does not rely on a successful monorepo build alone as proof of
  publishability.
- No breaking change: the new component and type are additive; existing `ThemeColors`,
  `ThemeConfig`, `themeColorToken`, `defaultTheme`, and `createTheme` exports are untouched.

### Validation Gates

- Applicable gates: `packages/react` `lint` (eslint + jsx-a11y, `--max-warnings=0`), `typecheck`,
  `test:unit` (vitest), `build`, `pnpm lint:tokens`, and the storybook-react contract/story gates.
  No lint, type-check, or test check is disabled, weakened, skipped, or removed.
- No file is excluded from its validator to make CI pass; `specs/**` is already covered by the
  repo-wide eslint ignore as a documentation directory, which is an intentional, pre-existing
  exclusion — not one introduced by this feature.
- No warning-only configuration is introduced.

### Story and Interaction Requirements

- `ThemeProvider` is **not** interactive (no keyboard activation, focus management, or ARIA
  semantics of its own), so no interaction-test harness is required. Stories are deterministic
  named stories with no dates, random values, or network calls.
- Deterministic, named stories required: (1) `Default` — no provider, (2) `PartialOverride` —
  `accent` + `actionPrimaryBg`, (3) `NestedBrandedSection` — inner provider within a default outer.
- Story metadata documents semantic intent, usage guidance (resolve partials via `createTheme`),
  misuse warnings (a `div` wrapper is added whenever the theme differs from the default), and the
  no-wrapper optimization. Unit tests use accessible queries (`getByRole`, `getByText`) and
  observable outcomes (rendered `style` properties, absence/presence of the wrapper) rather than
  `data-testid` selectors.

### Accessibility

- The default wrapper is a semantically neutral `div`; the component introduces no roles,
  keyboard behavior, or focus changes, and therefore introduces no new accessibility violations.
- The no-wrapper path preserves the existing DOM structure (no stray element for assistive tech).
- When consumers set `as` to a semantic element (`main`/`section`/`nav`), the component forwards
  that element verbatim and must not inject attributes that would corrupt landmark semantics.
- Static JSX linting (jsx-a11y) and rendered testing are both represented; the latter asserts the
  rendered DOM shape, which is the observable surface here.

### Responsive and Resilient States

- The wrapper is a plain element with no intrinsic sizing, display, or layout behavior; responsive
  and long-content behavior is delegated to children. The no-wrapper optimization guarantees no
  layout change for the default path. No combinatorial responsive states are introduced.
- There are no loading/empty/error/disabled states in this component's contract.

### Visual Regression

- The deterministic stories (`Default`, `PartialOverride`, `NestedBrandedSection`) serve as
  visual-regression fixtures: the override stories demonstrate that the accent and action-button
  colors actually change inside the subtree while the outer default remains, protecting the
  color-token contract. Visual checks protect color tokens without relying on serialized DOM
  snapshots alone (Storybook screenshotting is the primary evidence).

### Documentation Surface Ownership

- Canonical source for the component's public contract is
  `packages/react/src/theme/ThemeProvider.tsx` and `contracts/theme-provider.md` in this spec.
- The parent plan (`docs/plans/react-theming/04-theme-provider.md`) remains the consumer-facing
  narrative; Storybook is the executable catalog; no Astro docs-site change is required for this
  feature (the component is covered by Storybook). This avoids contradictory sources of truth
  (constitution XII).

### Cross-Framework Impact

- No `packages/styles` source or shared CSS contract changes, so the styles Storybook is
  unaffected. The react Storybook must still build and test independently in its own framework
  context (constitution XVI), which the storybook-react gate enforces.

### Complexity Tracking

- No constitution violations. No entry needed.

## Project Structure

### Documentation (this feature)

```text
specs/060-theme-provider/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── theme-provider.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/react/
├── src/
│   ├── index.ts                    # MODIFIED: export ThemeProvider + ColorScheme type
│   └── theme/                      # public theme module (features 058, 059)
│       ├── tokens.ts               # unchanged (THEME_COLOR_KEYS, THEME_COLOR_TOKEN_MAP)
│       ├── defaultTheme.ts         # unchanged (canonical defaultTheme)
│       ├── createTheme.ts          # unchanged (partial → resolved ThemeConfig)
│       ├── ThemeProvider.tsx       # NEW: ThemeProvider component + ColorScheme type
│       ├── index.ts                # MODIFIED: re-export ThemeProvider, ColorScheme
│       └── __tests__/
│           ├── tokens.test.ts      # unchanged (feature 058)
│           ├── defaultTheme.test.ts# unchanged (feature 059)
│           ├── createTheme.test.ts # unchanged (feature 059)
│           └── ThemeProvider.test.tsx  # NEW: emission/scoping/no-wrapper/nesting/as+ref
└── src/stories/
    └── components/theme/ThemeProvider.stories.tsx   # NEW: Default, PartialOverride,
                                                     #       NestedBrandedSection
```

**Structure Decision**: `ThemeProvider.tsx` is added to the existing `packages/react/src/theme/`
module (established in 058, populated in 059), co-located with the vocabulary and data layer it
consumes. It reuses `THEME_COLOR_KEYS` and `THEME_COLOR_TOKEN_MAP` for emission and
`defaultTheme` for the no-wrapper identity check — no duplication. `theme/index.ts` and
`src/index.ts` forward the component and the `ColorScheme` type. Tests live in
`theme/__tests__/ThemeProvider.test.tsx`; stories follow the existing per-component story
directory convention under `src/stories/`.

## Complexity Tracking

> No constitution violations.

## Design Artifacts

- Data model: `./data-model.md`
- Interface contracts: `./contracts/theme-provider.md`
- Research decisions: `./research.md`
- Validation path: `./quickstart.md`
- Internal object design (`class-diagram.md`): not applicable — this is a single stateless React
  component with no class/service/adapter structure; its shape is fully described in
  `data-model.md` and `contracts/theme-provider.md`.
- Service sequences (`contracts/sequences.md`): not applicable — no service boundary, API,
  command, event, async worker, retry, or rollback path exists; rendering is a synchronous pure
  function of props and `defaultTheme` (documented in `research.md`).
