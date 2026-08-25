# Research: ThemeProvider Component

This document resolves every open design question from the plan's Technical Context into a
concrete, implementable decision. Each section follows the Decision / Rationale / Alternatives
structure, matching the convention established in features 058 and 059.

## 1. `theme` prop type — complete `ThemeConfig`, not partial

**Decision**: `ThemeProvider` accepts `theme?: ThemeConfig` (complete, resolved), defaulting to
`defaultTheme`. It does **not** accept a partial theme and does **not** merge partials internally.
Consumers resolve partial overrides to a complete `ThemeConfig` via `createTheme` (feature 059)
*before* passing it in. The provider trusts its input and performs no validation — validation
(completeness + CSS color format) happens at `createTheme` call time, satisfying FR-010's
"validation at theme creation time, not render time" and the spec's edge case that "the provider
itself never receives invalid theme data."

The prop is optional: the spec's edge cases require that wrapping content in a `ThemeProvider`
with no `theme` prop (or an empty-partial theme resolved to defaults) resolves to `defaultTheme`
and renders no wrapper.

**Rationale**: This is the simplest reading that matches the feature doc and parent plan.
`04-theme-provider.md` states "Accept a `theme` prop of type `ThemeConfig`", and its DONE Means
shows `createTheme({ colors: { accent: '#7c3aed' } })` being passed in — i.e., the consumer
resolves, then provides. `docs/plans/react-theming.md` §1 says "Merges with `defaultTheme`
internally; consumers never need to provide a complete theme" in the *narrative*, but that merge
is realized by `createTheme`, not by the provider; the provider receiving an already-resolved
`ThemeConfig` keeps it a thin, single-responsibility control layer and avoids a second merge
implementation that could drift from `createTheme`.

**Alternatives considered**:

- `theme?: DeepPartial<ThemeConfig>` and merge inside the provider — rejected: duplicates the
  `createTheme` merge/validate logic, blurs the validation boundary (FR-010), and contradicts the
  doc's `theme: ThemeConfig` signature and DONE Means.
- Require `theme` (no default) — rejected: the spec explicitly supports omitting the prop.
- Accept `ThemeConfig | DeepPartial<ThemeConfig>` — rejected: overloads the contract and makes the
  runtime behavior ambiguous (does the provider merge or not?), which the spec forbids.

## 2. Token emission — reuse `THEME_COLOR_TOKEN_MAP`

**Decision**: Emission iterates `THEME_COLOR_KEYS` and reads the CSS custom property name from the
existing `THEME_COLOR_TOKEN_MAP` (camelCase → `--pathable-color-*`) from `tokens.ts`. The mapping
is **not** duplicated; the component builds a flat object
`{ [THEME_COLOR_TOKEN_MAP[key]]: theme.colors[key] }` for all 25 keys and passes it as the
wrapper's `style`.

TypeScript note: React's `CSSProperties` does not index arbitrary `--*` keys, so the custom
property keys are asserted with the `--${string}` template-literal key type (or a narrow cast) at
the single point of construction. This is a one-line, documented assertion, not a lint
suppression.

**Rationale**: FR-004 requires "every resolved color token" emitted as a `--pathable-color-*`
property; the mapping already exists in `THEME_COLOR_TOKEN_MAP` (feature 058), so reusing it is
the single source of truth and prevents name drift. Emitting all 25 (not just overridden ones) is
required so the subtree is self-contained — SC-001/FR-003/FR-004 require non-overridden tokens to
fall through to defaults *within the subtree*, which only works if the wrapper declares every
token explicitly (a nested provider's partial emission would otherwise let an outer provider's
value leak through instead of the default).

**Alternatives considered**:

- Recompute a local `camelToKebab` map in the component — rejected: duplicates feature 058's
  mapping and risks divergence.
- Emit only the overridden keys — rejected: violates FR-004 ("every resolved color token") and
  breaks the default fall-through within nested subtrees.
- Generate the style object via `themeColorToken()` — rejected: that function is a one-key lookup
  resolver, not a bulk emitter; iterating the key list directly is clearer and order-stable.

## 3. No-wrapper optimization and `ref` behavior

**Decision**: When `theme.colors` deep-equals `defaultTheme.colors` (or `theme` is omitted, which
defaults to `defaultTheme`), the component returns its `children` as-is (via a fragment) with **no**
wrapper element. Equality is a pure, order-independent comparison over `THEME_COLOR_KEYS`
(`THEME_COLOR_KEYS.every((k) => a[k] === b[k])`), not `JSON.stringify`, so a consumer-built
`ThemeConfig` with differently-ordered keys still triggers the optimization.

In the no-wrapper path the forwarded `ref` is intentionally **not attached** — there is no element
to bind. Consumers needing a ref on the themed subtree must either wrap it themselves or pass a
non-default theme. The `ref` is only forwarded to the wrapper element when one is rendered
(FR-006/SC-003).

**Rationale**: FR-006 and the edge case require no additional DOM node when the resolved theme
matches the default; returning `children` directly is the minimal, correct expression of that. A
key-by-key comparison over the canonical key list is robust to object key ordering and value
identity (string equality is exact). Dropping the ref in the no-wrapper case is unavoidable — a
fragment cannot accept a ref — and is documented rather than silently mis-forwarded.

**Alternatives considered**:

- `JSON.stringify(a) === JSON.stringify(b)` — rejected: order-dependent and allocates large
  strings per render; a consumer-authored `ThemeConfig` could be semantically equal but
  stringify differently.
- Always render a wrapper and hide it with CSS — rejected: violates the literal "no additional DOM
  node" requirement (SC-003) and can still affect layout/semantics.
- Attach `ref` to a `span` even in the no-wrapper path — rejected: reintroduces a wrapper node,
  defeating the optimization.
- Deep-equality library — rejected: 25 string comparisons need no dependency.

## 4. Polymorphic `as` prop, ref forwarding, and native props

**Decision**: `ThemeProvider` mirrors the existing `Container` convention:
`forwardRef<HTMLElement, ThemeProviderProps>` with `as?: ElementType` defaulting to `'div'`.
`ThemeProviderProps` extends `Omit<React.HTMLAttributes<HTMLElement>, 'color'>` and adds
`theme?`, `colorScheme?`, `as?`, and `children?`. Extra native props (`id`, `data-*`, `aria-*`,
etc.) and `className` are forwarded to the wrapper via rest spread; `as`, `theme`, and
`colorScheme` are destructured out so they are never leaked to the DOM.

The wrapper is `const Component = as ?? 'div'` and rendered as
`<Component ref={ref} className={className} style={style} {...rest}>`.

**Rationale**: Matching the repo's existing polymorphic-component shape (`Container.tsx`) keeps the
API consistent and familiar (constitution IV — framework-native ergonomics over the shared
contract). Omitting `color` mirrors `Container` and avoids any ambiguity with the theme's color
vocabulary. Forwarding native props satisfies FR-005's "configure the wrapper element" and the
doc's "forward any extra native props".

**Alternatives considered**:

- A dedicated `Box`/`Polymorphic` base component — rejected: no such abstraction exists in the repo
  yet, and introducing one for a single component is premature.
- Hard-coded `div` only — rejected: FR-005 and the doc require a configurable element type.
- React 19 `ref`-as-prop instead of `forwardRef` — rejected for consistency: the repo's existing
  components use `forwardRef`; introducing a second convention for one component would fragment the
  codebase.

## 5. `colorScheme` — documented no-op hook

**Decision**: `ThemeProvider` accepts `colorScheme?: 'light' | 'dark'` (exposed as a `ColorScheme`
type) and treats it as a forward-compatible no-op in this release: it is accepted without error,
does not alter rendered output, and is documented as the hook for future dark-token selection.
Because dark tokens are not modeled in the design system (spec Assumption), there is no dark token
set to select. The implementation destructures the prop and does not forward it to the DOM
(forwarding it would emit a `color-scheme` CSS property, which is a different concept).

Lint note: because the prop is intentionally unused, the implementation uses the repo-sanctioned
`_`-prefix binding convention (`@typescript-eslint/no-unused-vars` with `varsIgnorePattern: '^_'`)
with an explanatory comment — this is an allowed, intentional-unused-binding convention, not a
lint suppression, and does not disable any rule.

**Rationale**: FR-008 and the feature doc define `colorScheme` as a forward-compatible hook whose
`"dark"` value is a documented no-op. Modeling it as a real but inert prop lets consumers adopt the
API today without a future breaking change.

**Alternatives considered**:

- Emit `color-scheme: dark` on the wrapper — rejected: that is the CSS `color-scheme` property
  (UA dark rendering), unrelated to selecting a dark token set, and would be a visible behavior
  the spec does not ask for.
- Omit the prop entirely — rejected: contradicts FR-008 and removes the forward-compatible surface.
- Store `dark` tokens on `ThemeConfig` now — rejected: dark tokens are not modeled in the styles
  package (out of scope), and inventing them would violate the source-first rule (constitution I).

## 6. SSR-safety and determinism

**Decision**: The component performs no browser-global access, no effects (no `useEffect` and
explicitly no `useLayoutEffect`), and reads only `props`, `defaultTheme`, `THEME_COLOR_KEYS`, and
`THEME_COLOR_TOKEN_MAP`. The emitted inline `style` object contains only string values, so the
rendered HTML is fully serializable and identical server-side and client-side (FR-009, SC-005).
Output depends only on input props and module constants, so concurrent rendering is deterministic
(the spec's "Concurrent rendering" edge case is satisfied structurally).

**Rationale**: The whole mechanism is "compute a plain style object during render" — it is pure by
construction. No `useMemo` is required (the object is tiny and the equality guard is cheap), but
a `useMemo` on `theme` is acceptable if profiling ever warranted it; the plan does not require it.

**Alternatives considered**:

- `useEffect`/`useLayoutEffect` to set styles after mount — rejected: breaks SSR and introduces a
  hydration flash.
- Reading `window`/`document`/`getComputedStyle` — rejected: violates the no-browser-globals and
  determinism constraints.

## 7. Nesting precedence

**Decision**: Nesting is achieved entirely by the CSS cascade — each provider emits its inline
`style` on its own wrapper element, and the innermost wrapper's declarations win for the tokens it
sets. Because every provider emits **all 25** tokens (see §2), an inner provider fully shields its
subtree from outer providers and `:root` for every token it does not intentionally inherit. No
React context, event handling, or manual resolution is involved (FR-007).

**Rationale**: This is the free-by-architecture property documented in the parent plan; the
component does nothing extra. Emitting the full token set (not just overrides) is what makes the
innermost-wins rule exact — if a provider only emitted overrides, an inner provider with fewer
overrides would incorrectly inherit an outer provider's value for the tokens it did not set,
rather than falling through to the design-system default.

**Alternatives considered**:

- React context to propagate resolved themes — rejected: the CSS cascade already does this without
  re-rendering the tree or coupling components to a context read (components resolve tokens via
  `var(--pathable-*)`, not context).

## 8. Location, exports, tests, and stories

**Decision**:

- Component: `packages/react/src/theme/ThemeProvider.tsx` (exports `ThemeProvider` and the
  `ColorScheme` type).
- Re-exports: `packages/react/src/theme/index.ts` and `packages/react/src/index.ts`.
- Tests: `packages/react/src/theme/__tests__/ThemeProvider.test.tsx` (vitest +
  `@testing-library/react` + `jest-dom`).
- Stories: `packages/react/src/stories/components/theme/ThemeProvider.stories.tsx` with named
  deterministic stories `Default`, `PartialOverride`, and `NestedBrandedSection`.

**Rationale**: The component belongs in the `theme/` module beside the vocabulary and data layer
it consumes (co-location, matching 058/059). Stories follow the existing per-component
`src/stories/components/<Category>/<Component>.stories.tsx` convention.

## Consolidated decision summary

| Question | Decision |
| -------- | -------- |
| `theme` prop type | Optional `ThemeConfig` (complete); default `defaultTheme`; no internal merge/validation |
| Emission | Iterate `THEME_COLOR_KEYS` + reuse `THEME_COLOR_TOKEN_MAP`; emit all 25 as `--pathable-color-*` |
| No-wrapper | Return `children` via fragment when `theme.colors` key-wise equals `defaultTheme.colors`; `ref` not attached |
| Polymorphism | `forwardRef<HTMLElement, Props>` + `as?: ElementType` (default `div`) + native-prop spread, matching `Container` |
| `colorScheme` | `'light' \| 'dark'` no-op hook; accepted, not forwarded, documented |
| SSR/determinism | Inline `style` only; no effects/globals; pure function of props + constants |
| Nesting | CSS cascade; full 25-token emission makes innermost-wins exact |
| Files | `ThemeProvider.tsx` + re-exports + `ThemeProvider.test.tsx` + `ThemeProvider.stories.tsx` |
