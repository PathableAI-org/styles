# Data Model: Theming Documentation and End-to-End Validation

This feature ships **no runtime data entities**. There is no new state, persistence, lifecycle, or
transition to model — the runtime entities (`ThemeColors`, `ThemeConfig`, `defaultTheme`,
`createTheme`, `ThemeProvider`, the tone types, and the stylesheet subpaths) already exist and are
fully specified in the feature 057–061 SSOT artifacts. This feature documents and validates them.

The durable domain facts this feature *adds* are therefore about **documentation-surface ownership**,
the **rendered-validation approach**, and the **parent acceptance-criteria close-out**. They are
recorded here as the feature's Architecture SSOT (constitution "Architecture SSOT Boundary") and are
expressed as contracts in [`contracts/`](./contracts/).

## Domain facts (no new entities)

### 1. Token vocabulary (referenced, not re-typed)

The subject of the vocabulary reference is the existing 25-key `ThemeColors` set. Its authoritative
definition lives in feature 058 ([`contracts/theme-types.md`](../../058-theme-token-types/contracts/theme-types.md))
and feature 059 ([`contracts/default-theme.md`](../../059-default-theme-create-theme/contracts/default-theme.md));
this feature does **not** re-define it. The new fact this feature adds is the **role** (plain-language
description of what each token controls), which is documentation content, not a runtime fact.

| Fact | Canonical source (SSOT) | This feature |
| ---- | ----------------------- | ------------ |
| 25 `ThemeColorKey`s and their camelCase→kebab mapping | `packages/react/src/theme/tokens.ts` + 058 `theme-types.md` | referenced |
| Default hex values | `packages/react/src/theme/defaultTheme.ts` + `_semantic.scss` + 059 `default-theme.md` | referenced |
| Role ("what each token controls") | **new** — `docs/theming/token-vocabulary.md` | added |
| Sync enforcement (no drift) | `pnpm lint:tokens` (058 `token-sync.md`) | relied upon |

### 2. Documentation-surface ownership map

The canonical source for each fact that appears in this feature's docs (constitution XII):

| Fact | Canonical surface | Deriving surfaces |
| ---- | ----------------- | ----------------- |
| Token → CSS property + default + role | `docs/theming/token-vocabulary.md` | `packages/react/README.md`, `packages/styles/README.md` (link) |
| How to override / extend / choose a path | `docs/theming/consumer-guide.md` | package READMEs (link) |
| Parent acceptance-criteria close-out | `docs/theming/acceptance-verification.md` | parent plan (`docs/plans/react-theming.md`) |
| Runtime API contracts (`createTheme`, `ThemeProvider`, subpaths) | features 058–061 `contracts/` | the guide references, does not re-type |

### 3. Rendered-validation approach

| Fact | Value |
| ---- | ----- |
| Test location | `packages/react/src/stories/components/theme/` (story) + `apps/storybook-react/.storybook/test-runner.js` (assertion) |
| Representative layout | React `AppShell` under a partial `ThemeProvider` theme |
| Resolution measure | `getComputedStyle(el).getPropertyValue('--pathable-color-…')` in a real Chromium page |
| Partial theme (fixture) | `createTheme({ colors: { accent, actionPrimaryBg } })` (matches the existing `brand` fixture) |
| Backward-compat evidence | existing stable stories + `pnpm test:visual` + `pnpm test:storybook-react` |

### 4. Parent acceptance-criteria close-out map

The parent plan (`docs/plans/react-theming.md` "Acceptance Criteria") is the authoritative checklist
(spec FR-010). The 11 criteria map to evidence as follows; the verification record
(`docs/theming/acceptance-verification.md`) carries the checked-off list with evidence pointers:

| # | Parent criterion | Evidence |
| - | ---------------- | -------- |
| 1 | Typed partial theme renders with no hand-written CSS | rendered test (FR-006) + 060 `theme-provider.md` |
| 2 | Invalid keys fail at type-check | type-check compile-failure assertion (FR-011) |
| 3 | Overrides scoped to subtree | rendered test scoping assertion (FR-008) |
| 4 | `defaultTheme` exported, complete | `defaultTheme.test.ts` + 059 `default-theme.md` (FR-012) |
| 5 | `createTheme` deep-merges | `createTheme.test.ts` + 059 `create-theme.md` |
| 6 | Tone types importable | `check:types` + 058 `tone-exports.md` (FR-013) |
| 7 | `components`/`utilities` importable without default tokens | `test-next-consumer` + 061 `styles-subpaths.md` (FR-014) |
| 8 | React package no longer imports default tokens | `test-next-consumer` + 061 `react-entry-point.md` |
| 9 | `--pathable-color-*` consolidated into one `:root` block | `pnpm lint:tokens` + 057 `package-exports.md` |
| 10 | No-provider rendering identical | `pnpm test:visual` + `pnpm test:storybook-react` (FR-009) |
| 11 | `ThemeProvider` with `defaultTheme` renders identically | 060 `theme-provider.md` no-wrapper optimization + rendered test |

## State transitions

None — the feature adds documentation and validation; there is no runtime state, mutation, or
lifecycle.

## Validation rules summary

| Rule | Enforcement |
| ---- | ----------- |
| Vocabulary has zero omissions / zero invented tokens (SC-001) | `pnpm lint:tokens` + table-vs-`defaultTheme` spot-check |
| Vocabulary default values match `defaultTheme` (FR-002) | table derived from `defaultTheme`; spot-check in verification record |
| Rendered test asserts overridden + default + scoping (FR-006/007/008) | browser assertion in `test-runner.js` |
| No-provider rendering identical (FR-009) | `pnpm test:visual` + `pnpm test:storybook-react` |
| Invalid keys rejected at type-check (FR-011) | compile-failure assertion |
| No new runtime surface (FR-015) | source diff review — only `docs/` + story/test files change |
