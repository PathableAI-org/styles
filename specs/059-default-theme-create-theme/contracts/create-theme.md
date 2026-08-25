# Interface Contract: `createTheme`

Module: `@pathableai/react` → `packages/react/src/theme/createTheme.ts`, forwarded through
`theme/index.ts` and `src/index.ts`.

## Signature

```ts
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export function createTheme(input: DeepPartial<ThemeConfig>): ThemeConfig
```

## Preconditions

- `input` must be a plain object (or `undefined`-equivalent partial). `null`, arrays, strings,
  numbers, booleans, functions, and other non-plain-object values are rejected.
- Every supplied `colors` value, if present, must be a valid CSS color string (see
  [`color-validation.md`](./color-validation.md)).

## Postconditions

On success, `createTheme` returns a **complete** `ThemeConfig`:

- `colors` contains all 25 keys; unspecified keys fall through to `defaultTheme` values.
- Every value is a valid CSS color string.
- The result is a fresh, plain, serializable object containing only strings (no functions, no
  runtime references).
- Neither `input` nor `defaultTheme` is mutated.
- Repeated calls with the same `input` return deep-equal results (deterministic).

On failure, `createTheme` **throws** a plain `Error` at call time with a deterministic message
naming the offending token.

## Error messages

| Condition | Message |
| --------- | ------- |
| Non-object input | `createTheme: expected a plain object, received <type>` |
| Missing token after merge | `createTheme: missing required color token "<key>"` |
| Invalid value | `createTheme: invalid color value for "<key>": <value>` |

## Examples

```ts
import { createTheme } from '@pathableai/react'

// Partial override (Story 2): accent overridden, 24 others at defaults.
const t1 = createTheme({ colors: { accent: '#7c3aed' } })
t1.colors.accent === '#7c3aed'
t1.colors.bg === '#dde2e8'

// Empty partial (edge case): deeply equal to defaultTheme.
const t2 = createTheme({})
// t2.colors deeply equals defaultTheme.colors

// Full-config passthrough (Story 2): matches the provided config.
const full = { colors: { /* all 25 keys */ } }
const t3 = createTheme(full)

// Invalid inputs (Story 3): throw.
createTheme(null)                       // throws "expected a plain object"
createTheme({ colors: { accent: 42 } }) // throws "invalid color value for \"accent\""
createTheme({ colors: { accent: '#12' }}) // throws "invalid color value for \"accent\""
```

## Verification

`packages/react/src/theme/__tests__/createTheme.test.ts` asserts:

- Partial overrides, deep-merge fall-through, and full-config passthrough (Story 2).
- Missing/invalid values throw with the documented messages (Story 3).
- `defaultTheme` and `input` are deep-equal before/after (Story 4).
- Determinism and serializability round-trip (Story 4).

## Relationship to other contracts

- Input type: `DeepPartial<ThemeConfig>` (this file). `ThemeConfig`/`ThemeColors` defined in
  feature 058 [`contracts/theme-types.md`](../../058-theme-token-types/contracts/theme-types.md).
- Defaults: [`default-theme.md`](./default-theme.md).
- Value validity: [`color-validation.md`](./color-validation.md).
