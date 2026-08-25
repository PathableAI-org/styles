# Interface Contract: `defaultTheme`

Module: `@pathableai/react` → `packages/react/src/theme/defaultTheme.ts`, forwarded through
`theme/index.ts` and `src/index.ts`.

## Signature

```ts
export const defaultTheme: ThemeConfig
```

## Contract

- `defaultTheme` is a `ThemeConfig` whose `colors` map contains **exactly 25** keys — the full
  `ThemeColorKey` set established in feature 058.
- Every value is a lowercase `#rrggbb` string copied byte-for-byte from the `$semantic-colors`
  map in `packages/styles/src/_semantic.scss` (see `data-model.md` for the full table).
- `defaultTheme` is **never mutated** by any exported function, including `createTheme`.
- `defaultTheme` is pure, plain data: no functions, no runtime references, fully serializable.

## Values (authoritative)

```ts
{
  bg: '#dde2e8',
  surface: '#ffffff',
  text: '#00365c',
  textMuted: '#015a76',
  border: '#dde2e8',
  link: '#4899e8',
  accent: '#1cae96',
  focusRing: '#4497f5',
  danger: '#dc3545',
  success: '#1cae96',
  textSuccess: '#0d7a63',
  actionPrimaryBg: '#00365c',
  actionPrimaryText: '#ffffff',
  actionSecondaryBg: '#1cae96',
  actionSecondaryText: '#001a33',
  statusSuccessBg: '#1cae96',
  statusSuccessText: '#001a33',
  statusWarningBg: '#f5a623',
  statusWarningText: '#001a33',
  statusDangerBg: '#dc3545',
  statusDangerText: '#ffffff',
  workflowActive: '#4899e8',
  workflowComplete: '#1cae96',
  workflowBlocked: '#dc3545',
  onAccent: '#001a33',
}
```

## Verification

`packages/react/src/theme/__tests__/defaultTheme.test.ts` asserts:

- `Object.keys(defaultTheme.colors).length === 25`.
- Each value deep-equals the authoritative table above (SC-001/SC-003).

## Relationship to other contracts

- Key set: [`../data-model.md`](../data-model.md) and feature 058
  [`contracts/theme-types.md`](../../058-theme-token-types/contracts/theme-types.md).
- Merge/validation semantics: [`create-theme.md`](./create-theme.md).
