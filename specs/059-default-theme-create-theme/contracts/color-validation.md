# Interface Contract: CSS Color Validation

Enforcement point: `isValidCssColor` in `packages/react/src/theme/color.ts`. This is an
**internal** helper — it is unit-tested directly but is **not** part of the public
`@pathableai/react` API (the public surface is only `createTheme`, `defaultTheme`, and the
`DeepPartial` type).

## Signature

```ts
export function isValidCssColor(value: unknown): value is string
```

## Accepted inputs

`value` is accepted only if, after trimming surrounding whitespace, it matches one of:

1. **Hex** — `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa` (3, 4, 6, or 8 hex digits).
2. **`rgb()` / `rgba()`** — legacy comma syntax and modern space syntax (numbers, decimals, and
   percentages; optional alpha via comma or `/ alpha`).
3. **`hsl()` / `hsla()`** — comma and space syntax (numbers, `deg`/`rad`/`grad`/`turn` units,
   and percentages; optional alpha).
4. **`hwb()`** — comma and space syntax.
5. **Named colors** — the standard CSS named-color keywords (a frozen lowercase `Set` of the 148
   keywords, including `transparent`).

## Rejected inputs

- Any non-string (`null`, `undefined`, numbers, booleans, objects, arrays, functions).
- Empty/whitespace-only strings.
- Syntactically invalid colors (e.g. `'#12'`, `'#gggggg'`, `'rgb(1,2)'`, `'not-a-color'`).
- Modern color functions requiring color-space parsing — `lab()`, `lch()`, `oklab()`, `oklch()`,
  `color()`, `color-mix()`, `light-dark()`, `contrast-color()` — are **not** accepted. This is a
  deliberate, documented boundary: fully validating these would require a browser color engine,
  which violates the feature's no-DOM/no-browser-globals constraint (see `research.md` §3).

## Properties

- **Pure**: no DOM, canvas, `getComputedStyle`, or any browser/runtime global.
- **Deterministic**: same input always produces the same result.
- **Environment-independent**: SSR-safe; safe to run at module evaluation or call time.

## Verification

`packages/react/src/theme/__tests__/createTheme.test.ts` (or a dedicated
`color.test.ts`) asserts:

- Valid examples return `true`: `'#1cae96'`, `'#fff'`, `'#001a33ff'`, `'rgb(0, 54, 92)'`,
  `'rgba(0,54,92,0.5)'`, `'hsl(210, 100%, 29%)'`, `'rebeccapurple'`, `'transparent'`.
- Invalid examples return `false`: `'#12'`, `'#gggggg'`, `'not-a-color'`, `''`, `42`, `null`,
  `'lab(50% 0 0)'`.

## Relationship to other contracts

- Consumer: [`create-theme.md`](./create-theme.md).
- Boundary rationale: [`../research.md`](../research.md) §3.
