# Research: Theme Token Types and Vocabulary

This document resolves every open design question from the plan's Technical Context
into a concrete, implementable decision. Each section follows the
Decision / Rationale / Alternatives structure.

## 1. File location for the new public types and mapping function

**Decision**: Create a new public module `packages/react/src/theme/` with two files:

- `packages/react/src/theme/tokens.ts` — the `THEME_COLOR_KEYS` constant, the derived
  `ThemeColors` type, and the pure `themeColorToken` mapping function.
- `packages/react/src/theme/index.ts` — barrel re-export for public consumption.

`ThemeConfig` lives in the same `tokens.ts` (it is a two-line wrapper over `ThemeColors`
and does not warrant its own file). `src/index.ts` re-exports `ThemeColors`, `ThemeConfig`,
and `themeColorToken` from `./theme/index.js`.

**Rationale**: This is a *public* vocabulary, so it belongs on the public path, not in
`internal/resolvers/`. Every other public type in `packages/react` lives adjacent to its
owning domain and is forwarded by `src/index.ts`; `theme/` follows that convention. Keeping
the key constant, derived type, and mapping function in one file guarantees a single
co-located source of truth.

**Alternatives considered**:

- `internal/theme/` — rejected: the feature's entire purpose is public discoverability
  (FR-001/FR-003), and an internal module would require an extra forwarding hop for no gain.
- Inline in `src/index.ts` — rejected: the 25-key list plus function would bloat the entry
  point and violate the repo's small-file convention.
- `theme/types.ts` + `theme/colors.ts` split — rejected as over-fragmentation for two types
  and one function.

## 2. Shape of `ThemeColors`: derived mapped type vs. literal `interface`

**Decision**: Define a single runtime constant as the canonical key list and *derive* the
type from it:

```ts
export const THEME_COLOR_KEYS = [
  'bg', 'surface', 'text', 'textMuted', 'border', 'link', 'accent', 'focusRing',
  'danger', 'success', 'textSuccess',
  'actionPrimaryBg', 'actionPrimaryText', 'actionSecondaryBg', 'actionSecondaryText',
  'statusSuccessBg', 'statusSuccessText', 'statusWarningBg', 'statusWarningText',
  'statusDangerBg', 'statusDangerText',
  'workflowActive', 'workflowComplete', 'workflowBlocked', 'onAccent',
] as const

export type ThemeColorKey = (typeof THEME_COLOR_KEYS)[number]
export type ThemeColors = { [K in ThemeColorKey]: string }
```

`ThemeConfig` remains a literal interface:

```ts
export interface ThemeConfig {
  colors: ThemeColors
}
```

**Rationale**: The sync check (a plain Node script with no TypeScript compiler) needs a
reliable, machine-readable list of the 25 keys. A flat `const` array of single-quoted string
literals is trivially and robustly parseable. Deriving `ThemeColors` from `keyof typeof
THEME_COLOR_KEYS` keeps exactly **one** list of keys in the codebase, eliminating the
drift risk that a separate literal interface + constant would introduce. The mapped type
provides identical autocomplete and excess-property checking to a literal interface
(`Partial<ThemeColors> = { accentColour: ... }` still fails to compile, satisfying
SC-002/Story 1). The parent plan (`docs/plans/react-theming.md`) documents `ThemeColors` as
"flat, 25 keys, camelCase"; the mapped type preserves that contract exactly.

**Alternatives considered**:

- Literal `interface ThemeColors { ... }` only — rejected: no runtime key list for the sync
  check; would force regex over interface member lines, which the spec explicitly flags as
  fragile.
- Literal `interface` + a separate `THEME_COLOR_KEYS` array bridged with `satisfies readonly
  (keyof ThemeColors)[]` — viable but rejected: it requires writing all 25 keys *twice*,
  which violates the "two locations" goal in SC-006 and invites drift.
- `interface ThemeColors extends Record<ThemeColorKey, string> {}` — rejected: an empty
  interface body trips `@typescript-eslint/no-empty-object-type`; the mapped type expresses
  the same shape without a lint exception.

## 3. Mapping function algorithm and edge-case behavior

**Decision**: Export `themeColorToken(value?: string | null): string | undefined`.

Algorithm (pure, no DOM, deterministic):

1. Return `undefined` immediately for `value == null` (covers `null` and `undefined`).
2. Validate membership: if `value` is not one of the 25 `THEME_COLOR_KEYS`, return
   `undefined` (covers unrecognized strings and prevents malformed output).
3. Otherwise return `'--pathable-color-' + camelToKebab(value)` where
   `camelToKebab` replaces each uppercase letter with `-` + lowercase
   (`value.replace(/[A-Z]/g, (ch) => '-' + ch.toLowerCase())`).

Implementation detail: a precomputed `Record<ThemeColorKey, string>` map
(`THEME_COLOR_TOKEN_MAP`) is derived once from `THEME_COLOR_KEYS` using the transform above,
so the function is an O(1) validated lookup rather than a transform-on-every-call. The
precomputed map doubles as the documented mapping (FR-005).

**Rationale**: Validation *before* transformation is mandatory — a bare transform would
happily produce `--pathable-color-foo-bar` for an unknown `"fooBar"`, violating FR-004. The
precomputed map guarantees each key maps to exactly one property name (Story 2 scenario 4),
is trivially unit-testable, and shares the exact transform the sync check uses.

**Alternatives considered**:

- Transform-only (no validation) — rejected: violates FR-004.
- A switch/if-chain of 25 cases — rejected: noisier, harder to keep in sync, and no shorter
  than the derived map.

## 4. Tone/elevation re-export and the `TextTone` duplicate

**Decision**: Add a consolidated type re-export block to `src/index.ts`:

```ts
export type { TextTone, SurfaceTone, BorderTone } from './internal/resolvers/tone.js'
export type { SurfaceElevation } from './internal/resolvers/surface.js'
```

and remove `TextTone` from the existing `Text` component barrel line
(`export type { TextProps, TextTone, TextVariant } from './components/Text/Text.js'`).

**Rationale**: `TextTone` is already public today via the `Text` component barrel, so a
second `export type { TextTone }` in `src/index.ts` would raise a duplicate-export
TypeScript error. FR-006 requires the re-export to come from
`internal/resolvers/tone.ts`, so the plan moves `TextTone`'s public provenance to that
module and drops the redundant forwarding from the `Text` barrel. `Text.tsx` keeps its own
`export type { TextTone }` (line 6) — that local re-export stays valid and unchanged; the
public entry no longer relies on it. `SurfaceTone`, `BorderTone`, and `SurfaceElevation`
are not currently public and are added here for the first time.

**Alternatives considered**:

- Keep `TextTone` on the `Text` barrel and only add the other three — rejected: it would
  leave `TextTone`'s public provenance inconsistent with FR-006's explicit source.
- Re-export via the `resolvers/index.ts` barrel — rejected: that barrel is explicitly marked
  internal and not re-exported from the public entry; forwarding through it would bury the
  public contract one extra hop.

## 5. Token sync check: extend `lint-tokens.mjs` vs. a new script

**Decision**: **Extend** the existing `packages/styles/scripts/lint-tokens.mjs` with a new
`checkThemeTokenSync()` function (mirroring the existing `checkColorTokenConsolidation()`),
run under the existing root `lint:tokens` script. No new script file, no new package script,
no root `package.json` change.

How it works:

1. Reuse `parseScssMap(semantic, 'semantic-colors')` to obtain the 25 kebab-case SCSS tokens
   (source of truth).
2. Read the react theme file at `resolve(STYLES_ROOT, '../react/src/theme/tokens.ts')` and
   extract the key list.
3. Apply the same `camelToKebab` transform to each extracted TS key.
4. Diff the sets, reporting **missing** SCSS tokens (kebab names) and **extraneous** TS keys
   (camelCase names) by name, exiting non-zero on any mismatch (FR-007/FR-008).

**Rationale**: The `$semantic-colors`/`:root` parsing already lives in `lint-tokens.mjs`
(`parseScssMap`), and the root `lint` command chains `pnpm lint:tokens`, so extending the
existing script wires the check into local and CI lint with zero new surface. The additive
check preserves the script's existing behavior. The script already operates at monorepo scope
(it scans `src/stories/*.stories.js`), so reaching a react sibling file is a modest, consistent
extension. The react theme file is located relative to `STYLES_ROOT` (not `process.cwd()`), so
the check works whether invoked from the repo root or from within `packages/styles`.

**Alternatives considered**:

- New `packages/react/scripts/lint-theme-tokens.mjs` + new root `lint:tokens:react` script —
  rejected: it would re-implement the SCSS parser (duplication) and require touching the root
  `lint` chain; more surface for the same invariant.
- Put the check in the react `package.json` `lint` script — rejected: `eslint` is the react
  lint; a custom script would need to read SCSS, inverting the "SCSS is source of truth"
  direction and coupling react to styles source.

## 6. How the sync check reads the TS key list

**Decision**: Targeted regex over the `THEME_COLOR_KEYS` const array — extract single-quoted
string literals between `THEME_COLOR_KEYS = [` and the closing `] as const`.

**Rationale**: The array is flat, canonical, and its literals are single-quoted (enforced by
eslint/prettier). Extracting from a *named const array of literals* is far more reliable than
parsing interface member lines, which the spec explicitly warns against. The derived type
(§2) means the array is the single source of truth, so nothing else needs parsing.

**Alternatives considered**:

- Regex over the `interface ThemeColors` member lines — rejected: fragile under reformatting.
- Import the built JS output — rejected: the check must run before/without a build; no `.d.ts`
  is guaranteed present at lint time.
- Use the TypeScript compiler API — rejected: introduces a TS runtime dependency into the
  otherwise dependency-free `.mjs` script for marginal benefit.

## 7. Naming of the public mapping function

**Decision**: `themeColorToken`.

**Rationale**: Reads as "the `--pathable-color-*` token name for a theme color key" and is
consistent with the surrounding `*Class` resolver naming without implying class output. The
return value is documented as the full `--pathable-color-*` CSS custom property name (e.g.
`themeColorToken('actionPrimaryBg') === '--pathable-color-action-primary-bg'`).

**Alternatives considered**: `colorTokenVar`, `themeColorVariable`, `toColorTokenVar` — all
rejected as more verbose without adding clarity.

## Consolidated decision summary

| Question | Decision |
| -------- | -------- |
| Types/function location | `packages/react/src/theme/{tokens,index}.ts` |
| `ThemeColors` shape | Derived mapped type from `THEME_COLOR_KEYS` (`as const`) |
| `ThemeConfig` shape | Literal `interface { colors: ThemeColors }` |
| Mapping algorithm | Validated `camelToKebab` over a precomputed key map; `undefined` for nullish/unknown |
| Re-export dedup | Add tone/elevation block to `src/index.ts`; drop `TextTone` from the `Text` barrel line |
| Sync check home | Extend `lint-tokens.mjs` with `checkThemeTokenSync()` |
| TS key extraction | Regex over the `THEME_COLOR_KEYS` const array |
| Function name | `themeColorToken` |
