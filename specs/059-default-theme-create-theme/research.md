# Research: Default Theme and createTheme

This document resolves every open design question from the plan's Technical Context
into a concrete, implementable decision. Each section follows the
Decision / Rationale / Alternatives structure.

## 1. Deep-merge strategy for `createTheme`

**Decision**: Merge at the `colors` level only. Given the current `ThemeConfig` shape
(`{ colors: ThemeColors }` where `ThemeColors` is a flat 25-key string map), "deep merge" is
semantically a **shallow merge of the `colors` object**: the result's `colors` is
`{ ...defaultTheme.colors, ...input.colors }`, so unspecified keys fall through to defaults and
specified keys win. The implementation uses a small recursive `deepMerge` helper that:
(1) returns `input` when `default` is not a plain object or `input` is not a plain object, and
(2) otherwise spreads own enumerable keys with recursion for object-valued entries. Because the
only object-valued key today is `colors` (a string map), the recursion bottoms out at the token
values and never mutates either operand. This keeps the factory future-proof (a later
`typography`/`spacing` category would merge correctly) while being exact for today's shape.

**Rationale**: The spec (FR-004) requires "deep merge, not whole-object replacement" — i.e. a
consumer overriding `accent` must not lose the other 24 tokens. For a single nested object that
is a flat string map, object spread already satisfies that; the recursive helper makes the
"deep" guarantee structural rather than accidental and documents intent. Spreading into a fresh
object (never writing into `defaultTheme` or `input`) satisfies FR-011 (no mutation).

**Alternatives considered**:

- `Object.assign({}, defaultTheme, input)` only at the top level — rejected: it would replace
  the entire `colors` object when `input.colors` is present, losing non-overridden tokens and
  violating FR-004.
- A full general-purpose deep-merge library (e.g. `lodash.merge`, `deepmerge`) — rejected: adds
  a runtime dependency for a shape that is one object deep; the constitution favors
  dependency-free framework data layers, and a 10-line helper is sufficient.
- `structuredClone(defaultTheme)` then mutate — rejected: `structuredClone` is a newer global
  (not guaranteed across all consumer runtimes) and a mutate-then-return shape is less obviously
  pure than a pure reduce/spread; the non-mutation guarantee is stronger when the code never
  writes to the operand.

## 2. Source of the `defaultTheme` values

**Decision**: `defaultTheme.colors` is a hand-written constant whose 25 values are copied
verbatim from the `$semantic-colors` map in `packages/styles/src/_semantic.scss`, and unit tests
assert the byte-for-byte match. The authoritative values are:

| Token (camelCase) | Hex (authoritative) |
| ----------------- | ------------------- |
| `bg` | `#dde2e8` |
| `surface` | `#ffffff` |
| `text` | `#00365c` |
| `textMuted` | `#015a76` |
| `border` | `#dde2e8` |
| `link` | `#4899e8` |
| `accent` | `#1cae96` |
| `focusRing` | `#4497f5` |
| `danger` | `#dc3545` |
| `success` | `#1cae96` |
| `textSuccess` | `#0d7a63` |
| `actionPrimaryBg` | `#00365c` |
| `actionPrimaryText` | `#ffffff` |
| `actionSecondaryBg` | `#1cae96` |
| `actionSecondaryText` | `#001a33` |
| `statusSuccessBg` | `#1cae96` |
| `statusSuccessText` | `#001a33` |
| `statusWarningBg` | `#f5a623` |
| `statusWarningText` | `#001a33` |
| `statusDangerBg` | `#dc3545` |
| `statusDangerText` | `#ffffff` |
| `workflowActive` | `#4899e8` |
| `workflowComplete` | `#1cae96` |
| `workflowBlocked` | `#dc3545` |
| `onAccent` | `#001a33` |

**Rationale**: The SCSS map is the constitution-mandated source of truth for token values
(constitution II/III). A hand-written TS constant keeps `defaultTheme` a pure, runtime-visible
data value (not something generated at build time), so consumers get a stable, inspectable,
serializable object. Tests assert equality against a frozen expected map derived from the same
SCSS source, giving SC-001/SC-003 their automated verification.

**Alternatives considered**:

- Generate `defaultTheme.ts` from SCSS at build time — rejected: adds a build step and a codegen
  surface for a 25-entry constant that changes rarely; a hand-written constant with a parity test
  is simpler and keeps the value visible for review.
- Import the values from a shared JS artifact exported by `@pathableai/styles` — rejected: the
  styles package publishes CSS/SCSS, not a JS color map; introducing one would expand the styles
  public surface beyond its contract.
- Read `_semantic.scss` at runtime — rejected: would couple a pure data layer to the filesystem
  and violate the no-browser-globals/purity constraints.

## 3. CSS color string validation approach

**Decision**: A dependency-free, environment-independent validator `isValidCssColor(value)` that
accepts, after trimming surrounding whitespace:

1. **Hex** — `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa` (3, 4, 6, or 8 hex digits).
2. **`rgb()` / `rgba()`** — both legacy comma syntax and modern space syntax (numbers, decimals,
   and percentages; optional `/ alpha` or comma alpha).
3. **`hsl()` / `hsla()`** — both comma and space syntax (numbers, `deg`/`rad`/`grad`/`turn`
   units, and percentages; optional alpha).
4. **`hwb()`** — comma and space syntax.
5. **Named colors** — the standard CSS named-color keywords (a frozen lowercase `Set` of the 148
   keywords, including `transparent`).

The validator is a pure function: it reads no DOM, canvas, `getComputedStyle`, or any browser
global; it is deterministic and SSR-safe.

**Explicit validation boundary (documented limitation)**: modern CSS color functions that require
color-space parsing (`lab()`, `lch()`, `oklab()`, `oklch()`, `color()`, `color-mix()`,
`light-dark()`, `contrast-color()`) are **not** accepted. Fully validating their grammar would
require a browser color engine, which the spec's no-DOM/no-browser-globals constraint forbids.
This is a deliberate, recorded tradeoff: the validator is a *heuristic* that rejects anything
outside the well-defined subset above, per the spec's assumption that the theme "stores values as
strings and does not interpret, normalize, or transform them."

**Rationale**: The spec (FR-006/FR-010) requires validation to be a pure, dependency-free check
that rejects non-color values with a descriptive error, and it must run with no browser globals.
A regex + frozen keyword-set validator satisfies all of those. The keyword set is finite and
stable (CSS Color Level 4 named colors), so it can be hard-coded without a dependency.

**Alternatives considered**:

- Use the DOM (`CSS.supports('color', v)` or canvas `fillStyle` round-trip) — rejected: violates
  FR-010's "no browser globals" and breaks SSR; the whole point is environment independence.
- Third-party parser (e.g. `color-string`, `culori`) — rejected: adds a runtime dependency to a
  data layer that the constitution keeps dependency-free; the 25-value surface doesn't justify it.
- Accept only hex — rejected: too restrictive; the spec explicitly names `rgb()`, `hsl()`, and
  named colors as valid.
- Accept *any* non-empty string — rejected: defeats the purpose of FR-006 (a typo like
  `'#1cae9'` or `'not-a-color'` must fail at call time).

## 4. Error message format

**Decision**: `createTheme` throws a plain `Error` (no custom error subclass) whose message is
deterministic and names the offending token. Three message shapes:

- Non-object input → `createTheme: expected a plain object, received <type>`.
- Missing token after merge → `createTheme: missing required color token "<key>"`.
- Invalid value → `createTheme: invalid color value for "<key>": <value>`.

The token key is always interpolated, satisfying FR-005/FR-006/FR-007 ("names the offending
token"). A custom `ThemeValidationError` class is intentionally **not** introduced.

**Rationale**: A plain `Error` keeps the public API minimal (the spec asks for "a descriptive
error", not an error taxonomy) and avoids a new exported symbol that consumers would need to
learn. Deterministic, token-naming messages are directly assertable in unit tests (SC-004).

**Alternatives considered**:

- Custom `ThemeValidationError extends Error` — rejected: adds public API surface and a
  versioning/durability concern for zero functional gain at this stage; a consumer can still
  `instanceof Error` / match on message.
- Error codes + message — rejected: over-engineering for a 3-case validation surface.
- Silent fallback to defaults on missing/invalid — rejected: directly contradicts FR-005/FR-006.

## 5. `DeepPartial` placement and definition

**Decision**: Define `DeepPartial` in `packages/react/src/theme/createTheme.ts` (co-located with
its only consumer) and export it publicly via `theme/index.ts` and `src/index.ts`:

```ts
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
```

**Rationale**: The repository has no existing `DeepPartial` (confirmed by search), and the type
appears in `createTheme`'s public signature, so it must be exported for the generated `.d.ts` to
be self-contained and consumer-usable. Co-locating it with `createTheme` follows the repo's
small-file convention (no standalone `types.ts` for a single utility type). `DeepPartial`
(rather than a flat `Partial<ThemeColors>`) is the spec-mandated input shape and future-proofs
against non-`colors` categories.

**Alternatives considered**:

- `Partial<ThemeColors>` as the parameter — rejected: the spec and parent plan explicitly
  specify `DeepPartial<ThemeConfig>`, and `Partial<ThemeColors>` would not express a partial
  `colors` object for future categories.
- A generic `types.ts` in `theme/` — rejected as over-fragmentation for one type.
- Inline recursive type in the signature — rejected: less readable and not reusable.

## 6. Serializability guarantee

**Decision**: The returned theme is a freshly-built plain object containing only string values —
no functions, no `undefined`, no `Date`/`RegExp`/`Map`/class instances, no `__proto__` tricks.
Unit tests assert `JSON.parse(JSON.stringify(result))` deep-equals `result` (SC-006/FR-009). No
special serialization code is needed.

**Rationale**: Because `createTheme` constructs the result from `defaultTheme.colors` (strings)
and validated input values (strings, validated by `isValidCssColor` which only passes strings),
plain-data-ness is a structural consequence of the design rather than a runtime enforcement. The
round-trip test is the verification, per FR-009.

**Alternatives considered**:

- Explicit `JSON.stringify` at the end of `createTheme` — rejected: unnecessary and would
  silently coerce/throw on undefined; construction already guarantees serializability.
- A deep `structuredClone` on return — rejected: returns a fresh object already; adds a newer
  global dependency.

## 7. Purity and non-mutation enforcement

**Decision**: `createTheme` never writes to `defaultTheme` or `input`. It reads
`defaultTheme.colors`, spreads into a new object for the merged result, and validates by reading
only. Unit tests assert deep-equality of `defaultTheme` and `input` before/after the call, and
determinism via two calls returning deep-equal results (SC-005, FR-010, FR-011).

**Rationale**: Object spread + pure validation are inherently non-mutating. Tests provide the
regression guarantee that a future edit does not introduce an in-place write.

**Alternatives considered**:

- Freeze `defaultTheme` with `Object.freeze` — considered as belt-and-suspenders but rejected as
  unnecessary: freezing is not required by the spec and the tests already prove non-mutation;
  `as const`/readonly typing is the TypeScript-level guard that matters for consumers.

## Consolidated decision summary

| Question | Decision |
| -------- | -------- |
| Deep-merge | Recursive helper; effectively `{ ...defaultTheme.colors, ...input.colors }` for today's shape |
| `defaultTheme` values | Hand-written constant copied from `_semantic.scss`; parity enforced by tests |
| Color validation | Pure regex + frozen named-color Set; hex/rgb/rgba/hsl/hsla/hwb/named; no DOM |
| Validation boundary | Modern color functions (`lab`/`lch`/`oklch`/`color()`/…) intentionally rejected |
| Error type/message | Plain `Error`; deterministic messages naming the token |
| `DeepPartial` | Defined in `createTheme.ts`, exported publicly |
| Serializability | Structural (strings only) + round-trip test; no runtime enforcement code |
| Purity/non-mutation | Spread-only construction + before/after deep-equality tests |
