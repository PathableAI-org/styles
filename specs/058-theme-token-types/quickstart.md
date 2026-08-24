# Quickstart: Validating Theme Token Types and Vocabulary

This guide proves the feature works end-to-end. It exercises the public type surface, the
pure mapping function, the tone/elevation re-exports, and the SCSS↔TS sync check. Full
contracts live in [`contracts/`](./contracts/) and the domain model in
[`data-model.md`](./data-model.md).

## Prerequisites

- Repo checked out on branch `058-theme-token-types`.
- `pnpm` (see root `package.json` `packageManager` / `engines.node`).
- Dependencies installed: `pnpm install`.

## 1. Type surface (Story 1, Story 3)

Verify the types compile and reject invalid keys:

```bash
pnpm --filter @pathableai/react typecheck
```

Expected: exit `0`. The following snippet must compile (put it in a scratch
`*.ts`/`.tsx` file or rely on the unit tests below):

```ts
import type {
  ThemeColors,
  ThemeConfig,
  TextTone,
  SurfaceTone,
  BorderTone,
  SurfaceElevation,
} from '@pathableai/react'

const overrides: Partial<ThemeColors> = { accent: '#7c3aed' } // ok
const config: ThemeConfig = { colors: { accent: '#7c3aed' } } // type-checks as partial? see note
const t: TextTone = 'muted'
const s: SurfaceTone = 'subtle'
const b: BorderTone = 'danger'
const e: SurfaceElevation = 'lg'
```

> `ThemeConfig.colors` is a full `ThemeColors` (all 25 keys), so a literal with one key will
> *not* satisfy `ThemeConfig` by itself — use `Partial<ThemeColors>` for overrides. This is the
> documented override shape (see `contracts/theme-types.md`).

Confirm an invalid key is rejected at compile time (Story 1, scenario 2):

```ts
// @ts-expect-error is NOT used — this should genuinely fail to compile:
const bad: Partial<ThemeColors> = { accentColour: '#7c3aed' }
```

## 2. Mapping function (Story 2)

Run the react unit tests:

```bash
pnpm --filter @pathableai/react test:unit
```

Expected: all tests pass, including a mapping-function suite that:

- Asserts the correct property name for every one of the 25 keys (100% coverage).
- Asserts `undefined` for `null`, `undefined`, and an unrecognized string.

Spot-check behavior:

```ts
import { themeColorToken } from '@pathableai/react'

themeColorToken('actionPrimaryBg') === '--pathable-color-action-primary-bg'
themeColorToken('textSuccess') === '--pathable-color-text-success'
themeColorToken('onAccent') === '--pathable-color-on-accent'
themeColorToken('accentColour') === undefined
themeColorToken(null) === undefined
themeColorToken(undefined) === undefined
```

## 3. Token sync check (Story 4)

Run the sync check directly:

```bash
pnpm lint:tokens
```

Expected: exit `0` with the existing token-reference summary (the new
`checkThemeTokenSync()` passes silently because the 25 TS keys match the 25 SCSS tokens).

Negative checks (each should exit non-zero and name the offending token):

```bash
# Temporarily add a token to packages/styles/src/_semantic.scss `$semantic-colors`
# and its `:root` block (e.g. --pathable-color-info), then:
pnpm lint:tokens   # must fail, naming the missing ThemeColors key 'info'
```

```bash
# Temporarily add a stray key to THEME_COLOR_KEYS (e.g. 'accentColour'), then:
pnpm lint:tokens   # must fail, naming the extraneous key 'accentColour'
```

Revert both temporary edits before continuing.

## 4. Full quality gates

Run the complete validation chain for the changed package and the sync check:

```bash
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react test:unit
pnpm --filter @pathableai/react build
pnpm lint:tokens
```

Expected: all exit `0`.

## 5. Publishable-validation spot check

```bash
pnpm --filter @pathableai/react check:types
pnpm --filter @pathableai/react check:package
```

Expected: the new public exports resolve through the package entry point without an
Are The Types Wrong / publint failure.

## Acceptance trace

| Spec scenario | Validated by |
| ------------- | ------------ |
| Story 1: 25 keys, invalid key rejected | `typecheck` + unit tests (§1) |
| Story 2: mapping for all 25 keys + edge cases | `test:unit` (§2) |
| Story 3: four tone/elevation types importable | `typecheck` (§1) |
| Story 4: sync check fails on drift | `pnpm lint:tokens` negative cases (§3) |
