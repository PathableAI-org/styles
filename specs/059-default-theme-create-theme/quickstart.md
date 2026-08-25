# Quickstart: Validating Default Theme and createTheme

This guide proves the feature works end-to-end. It exercises the `defaultTheme` constant, the
`createTheme` factory (partial overrides, deep-merge, full-config passthrough, validation, and
purity/serializability), and the existing token sync check. Full contracts live in
[`contracts/`](./contracts/) and the domain model in [`data-model.md`](./data-model.md).

## Prerequisites

- Repo checked out on branch `059-default-theme-create-theme`.
- `pnpm` (see root `package.json` `packageManager` / `engines.node`).
- Dependencies installed: `pnpm install`.

## 1. Default values (Story 1)

Run the react unit tests:

```bash
pnpm --filter @pathableai/react test:unit
```

Expected: all tests pass, including a `defaultTheme` suite that asserts exactly 25 tokens whose
values match `_semantic.scss` byte-for-byte (e.g. `accent === '#1cae96'`, `bg === '#dde2e8'`,
`text === '#00365c'`).

Spot-check behavior:

```ts
import { defaultTheme } from '@pathableai/react'

Object.keys(defaultTheme.colors).length === 25
defaultTheme.colors.accent === '#1cae96'
defaultTheme.colors.bg === '#dde2e8'
defaultTheme.colors.text === '#00365c'
```

## 2. `createTheme` merge + validation (Stories 2 & 3)

```ts
import { createTheme } from '@pathableai/react'

// Partial override: accent overridden, 24 tokens at defaults.
const t = createTheme({ colors: { accent: '#7c3aed' } })
t.colors.accent === '#7c3aed'
t.colors.bg === '#dde2e8'

// Empty partial → deep-equals defaultTheme.
const empty = createTheme({})

// Invalid inputs throw at call time.
createTheme(null)                         // throws "expected a plain object"
createTheme({ colors: { accent: 42 } })   // throws 'invalid color value for "accent"'
createTheme({ colors: { accent: '#12' }}) // throws 'invalid color value for "accent"'
```

Run the react unit tests again to confirm the validation suite passes (Story 3):

```bash
pnpm --filter @pathableai/react test:unit
```

## 3. Purity, determinism, serializability (Story 4)

Verified by unit tests in `createTheme.test.ts`:

- `defaultTheme` and `input` are deep-equal before/after the call (no mutation).
- Two calls with the same input return deep-equal results (determinism).
- `JSON.parse(JSON.stringify(result))` deep-equals `result` (serializability).

## 4. Token vocabulary unchanged (regression)

Run the sync check from feature 058 to confirm the 25-key vocabulary still matches SCSS:

```bash
pnpm lint:tokens
```

Expected: exit `0`.

## 5. Full quality gates

Run the complete validation chain for the changed package plus the sync check:

```bash
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react test:unit
pnpm --filter @pathableai/react build
pnpm lint:tokens
```

Expected: all exit `0`.

## 6. Publishable-validation spot check

```bash
pnpm --filter @pathableai/react check:types
pnpm --filter @pathableai/react check:package
```

Expected: the new `defaultTheme`, `createTheme`, and `DeepPartial` exports resolve through the
package entry point without an Are The Types Wrong / publint failure.

## Acceptance trace

| Spec scenario | Validated by |
| ------------- | ------------ |
| Story 1: 25 default values match SCSS | `defaultTheme.test.ts` (§1) |
| Story 2: partial override + deep-merge + passthrough | `createTheme.test.ts` (§2) |
| Story 3: missing/invalid values throw | `createTheme.test.ts` (§2) |
| Story 4: purity, determinism, serializability | `createTheme.test.ts` (§3) |
| Vocabulary unchanged | `pnpm lint:tokens` (§4) |
