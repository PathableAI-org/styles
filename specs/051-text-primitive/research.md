# Research: Text Primitive

**Feature**: Text Primitive
**Date**: 2026-08-21
**Purpose**: Resolve all design decisions before Phase 1 contracts and data model

## SCSS Audit Findings (packages/styles)

The plan requires an audit of existing SCSS typography tokens, text utility classes, and semantic roles before exposing the React API. Findings:

### Typography tokens (`packages/styles/src/_typography.scss`)

- Font family tokens exist: `$pathable-font-body`, `$pathable-font-heading`, `$pathable-font-subheading`, `$pathable-font-mono`, `$pathable-font-alternate-heading`, plus `--pathable-font-*` CSS custom properties (all but subheading also emitted as `--usa-font-*`).
- `$typography-scale` defines role entries with font-family, font-size, line-height, and font-weight:
  - `body-lg` (18/28px, 400), `body-md` (16/24px, 400), `body-sm` (14/20px, 400)
  - `label-md` (14/20px, 600), `label-sm` (12/16px, 600)
  - `caption-md` (12/16px, 400)
  - (heading/display roles exist too and are Heading-territory, out of scope)
- CSS custom-property tokens exported: `--pathable-font-size-body-md`, `--pathable-font-size-body-sm`, `--pathable-font-size-caption-md`; `--pathable-font-weight-normal|semibold|bold`; `--pathable-font-line-height-body: 1.5`, `--pathable-font-line-height-heading: 1.25`.
- **Gap**: There is no sitewide, per-role `line-height` token for `body-sm` (20/14 ≈ 1.43) or `caption-md` (16/12 ≈ 1.33). The `$typography-scale` map holds px line-heights but only the `--pathable-font-line-height-*` pair is exported. To keep the new contract token-driven, export these ratios (`--pathable-font-line-height-body` already covers body; add a generic per-role ratio or compute `line-height` from the scale) as an additive `_typography.scss` change during implementation.

**Audit conclusion**: The typography scale needed for `body`, `small`, `caption` exists. Only a small additive token/line-height change is required.

### Semantic color tokens (`packages/styles/src/_semantic.scss`)

- `--pathable-color-text: #00365c` (PathAble Blue — default body text)
- `--pathable-color-text-muted: #015a76` (Tech Teal — muted text)
- `--pathable-color-danger: #dc3545`
- `--pathable-color-success: #1cae96`
- Also `--pathable-color-surface: #ffffff`, `--pathable-color-bg: #dde2e8`, status-role and workflow-role token families.

Contrast ratios against `--pathable-color-surface` (the standard content background):

| Tone token | Value | Contrast vs `#ffffff` | WCAG AA normal text (4.5:1) |
|------------|-------|----------------------|------------------------------|
| `default` (`--pathable-color-text`) | `#00365c` | ≈12.5:1 | PASS |
| `muted` (`--pathable-color-text-muted`) | `#015a76` | ≈7.7:1 | PASS |
| `danger` (`--pathable-color-danger`) | `#dc3545` | ≈4.5:1 | PASS (borderline; re-verify with exact implementation output) |
| `success` (`--pathable-color-success`) | `#1a9ae6` → `#1cae96` | ≈2.8:1 | **FAIL** |

**Finding**: `--pathable-color-success` (Intelligent Jade `#1cae96`) fails WCAG AA for normal text on the default surface. This mirrors the pre-existing KPI-trend contrast exception documented in `apps/storybook-react/.storybook/test-runner.js`. Exposing a `success` tone that fails contrast would violate Constitution Principle X (Accessibility Is a Release Requirement) and SC-006 of this feature's spec.

**Resolution**: add an additive token `--pathable-color-text-success` in `_semantic.scss` with a deeper jade value that passes 4.5:1 on `--surface`. This is a token addition (non-breaking). The `success` tone class resolves to the new token; the raw brand `--pathable-color-success` remains the surface/accent token and is not used for text. Two self-consistency alternatives (reusing `--pathable-color-on-accent`, or documenting a large-text-only success) are rejected below.

### Utility classes (`packages/styles/src/_utilities.scss`)

Existing text-related `.pathable-*` utility classes:

| Utility | Output | Notes |
|---------|--------|-------|
| `text` color | `.pathable-text-{base,primary,muted,accent,link,white}` | No `danger`/`success` values; generic palette utilities, not semantic roles |
| `text-weight` | `.pathable-text-{normal,semibold,bold}` | `font-weight` only |
| `text-align` | `.pathable-text-{center,left,right}` | `text-align` only |
| `font-family` | `.pathable-font-family-{heading,body,mono,alt}` | single property |

These are flat single-property utilities. None expresses a coherent semantic typography role (font + size + line-height + weight together). **No existing `pathable-text` base or role/tone modifier classes exist.**

### Typography component wrappers

`pathable-typography.scss` bundle forwards `pathable-content`, `pathable-dark-background`, `pathable-display`, `pathable-intro`, `pathable-link`, `pathable-list`, `pathable-paragraph`, `pathable-prose`. These are USWDS wrapper classes (e.g., `.pathable-paragraph` extends `.usa-paragraph`), not a semantic role vocabulary for the `Text` primitive.

## Decision 1: SCSS Contract — New `pathable-text.scss`

**Decision**: Create `packages/styles/src/pathable-component-wrappers/pathable-text.scss` defining:

- `.pathable-text` base class — sets `font-family: var(--pathable-font-body)`, `color: var(--color-text-default, var(--pathable-color-text))`, and token-driven `font-size`/`line-height`/`font-weight` via custom properties.
- Variant modifiers: `.pathable-text--body`, `.pathable-text--small`, `.pathable-text--caption`.
- Tone modifiers: `.pathable-text--tone-default`, `.pathable-text--tone-muted`, `.pathable-text--tone-danger`, `.pathable-text--tone-success`.

**Why BEM modifier naming**: `pathable-text--small`/`pathable-text--tone-*` cannot collide with the existing `.pathable-text-{value}` utility classes (those use a single dash after `pathable-text`), and the base `.pathable-text` class is currently unused. The `--tone-` prefix keeps tones unambiguous versus variants.

**Strategic choice — variant values resolve to token-driven classes**:

```scss
.pathable-text { font-family: var(--pathable-font-body); }
.pathable-text--body    { --pathable-text-font-size: var(--pathable-font-size-body-md);    --pathable-text-line-height: var(--pathable-font-line-height-body); }
.pathable-text--small   { --pathable-text-font-size: var(--pathable-font-size-body-sm);   --pathable-text-line-height: <ratio token from _typography>; }
.pathable-text--caption { --pathable-text-font-size: var(--pathable-font-size-caption-md); --pathable-text-line-height: <ratio token from _typography>; }
```

No literal `px` values appear in the contract; font sizes and line ratios come from `--pathable-font-*` tokens.

**Export**: forward from the typography bundle `pathable-typography.scss` (the owning typography entrypoint), not `pathable-layout-composition.scss`. `Text` is a typography primitive; keeping it with the other typography wrappers is the cohesive home and satisfies FR-004 ("or the appropriate shared entrypoint").

**Alternatives considered**:
- Forward via `pathable-layout-composition.scss` (like Grid): Text is not a layout composition primitive; that bundle owns Stack/Grid/Surface. Rejected.
- Semantic classes in `_typography.scss` partial rather than a wrapper file: `pathable-component-wrappers/` is the established home for semantics fallback package behavior owned by styles; the small custom-property contract reads like the layout primitives. Keep a dedicated `pathable-text.scss`.

## Decision 2 — Variant → typography scale mapping

**Decision**:
- `body` → `body-md` scale (16px/24px, weight 400, Nunito) — the default paragraph role.
- `small` → `body-sm` scale (14px/20px, weight 400).
- `caption` → `caption-md` scale (12px/16px, weight 400).

**Rationale**: The bare names (`body`, `small`, `caption`) map directly onto the design system's existing scale names; the plan names these roles explicitly. `label-md/sm` (weight 600) are form-label roles, conceptually tied to the `Label`/`Hint` controls, not generic text roles — out of scope.

**Alternatives**:
- Map `small` → `label-sm`: would inject a semibold weight into a role the plan describes as a plain smaller text size. Rejected.
- `caption` → `label-sm`: same weight issue. Rejected.

## Decision 4: Tone → token mapping

| Tone | Token | Notes |
|------|-------|-------|
| `default` | `var(--pathable-color-text)` | also the base color |
| `muted` | `var(--pathable-color-text-muted)` | 7.7:1 on surface |
| `danger` | `var(--pathable-color-danger)` | 4.5:1 on surface — verify in implementation; document implied surface |
| `success` | `var(--pathable-color-text-success)` **NEW token** | needed to pass AA (see audit) |

**Decision**: add `--pathable-color-text-success` to `_semantic.scss` as a deep intentional jade text color validated to pass 4.5:1 on `--surface`. Keep the brand `--pathable-color-success` token untouched (it remains the accent/status role token).

**Alternatives considered**:
- Reuse `--pathable-color-on-accent` (`#001a33`) for success — that token is designed for text on accent/success *backgrounds* and is dark navy; using it for success text on a light surface makes success indistinguishable from default. Rejected.
- Keep `--pathable-color-success` and rely on large-text (3:1) — the primitive has no large/normal switch, and caption/small text is small text. Rejected (violates SC-06).

## Decision 5: React polymorphic typing — generic per-element props

**Decision**: `Text` uses a generic polymorphic type parameter constrained to a text-content element, so native props are restricted to the selected element (FR-012), rather than the loose `as?: ElementType` + `Omit<HTMLAttributes<HTMLElement>>` pattern used by the layout primitives (which accepts props invalid for the selected element).

```ts
export type TextOwnProps = {
  variant?: TextVariant
  tone?: TextTone
  children?: ReactNode
  className?: string
}
export type TextProps<C extends keyof React.JSX.IntrinsicElements = 'p'> =
  TextOwnProps & Omit<React.ComponentPropsWithRef<C>, keyof TextOwnProps | 'color'>
```

Implementation note: a generic `forwardRef` signature for `Ref`-agnostic rendering is straightforward in React 19 types; the renderer casts the ref type to `Element`.

**Rationale**: The spec FR-012 is explicit ("MUST NOT accept props invalid for the selected element"). The extra type complexity is small and localized.

**Alternatives**:
- Loose `ElementType` props (Stack/Inline/Cluster/Grid pattern) — accepts props invalid for the selected text element. Rejected for FR-012 conformance. This contrasts with the layout primitives' established pattern, but the plan explicitly calls polymorphic native-prop restriction a requirement specific to `Text` among the text primitives.
- `asChild` / render-prop composition — explicitly out of scope per the architecture plan.

## Decision 6: Tone and variant classes are modifiers, not layout

**Decision**: `Text` carries NO `SizingProps`/`SpacingProps` (unlike the layout primitives). The spec FR-019 excludes sizing, padding, margin, display. The primitive's props are `as`, `variant`, `tone`, `children`, `className`, and valid native props. `style` remains available via native props.

**Rationale**: Typography primitives should not mutate the text-flow geometry of their container; margin/padding/width belong to layout primitives per the architecture and the spec's explicit exclusion list.

## Class Merge Order

**Decision** (documented in contracts):

1. `pathable-text` (base, always)
2. `pathable-text--{variant}` (if variant)
3. `pathable-text--tone-{tone}` (if tone)
4. consumer `className` (last)

No sizing/spacing utilities are possible. When `tone="default"` is provided it yields the class `pathable-text--tone-default` (explicit default, same visual outcome as omitting tone — deterministic semantics, no special-casing).

## Decision 8: SCSS registration

**Decision**: `pathable-text.scss` is `@forward`ed from `packages/styles/src/pathable-component-wrappers/pathable-typography.scss`, which is itself forwarded by `pathable-all.scss`→`_index.scss`→`index.scss`. Consumers importing `@pathableai/styles` (the react entry `import '@pathableai/styles'`) receive the compiled classes automatically (Constitution IV).

## SCSS and token change summary

| File | Change | Rationale |
|------|--------|-----------|
| `packages/styles/src/pathable-component-wrappers/pathable-text.scss` | **CREATE** | new role/tone contract |
| `packages/styles/src/pathable-component-wrappers/pathable-typography.scss` | **MODIFY** | add `@forward 'pathable-text'` |
| `packages/styles/src/_typography.scss` | **MODIFY (additive)** | export per-role line-height tokens used by `small`/`caption` (no new typographic values; formalize the scale ratios) |
| `packages/styles/src/_semantic.scss` | **MODIFY (additive)** | add `--pathable-color-text-success` (deep jade passing AA) |

## Verification commands for build/test

See `quickstart.md`. Package names are `@pathableai/styles`/`@pathableai/react`; unit runner is `vitest` via the package's `test:unit` script.

## Unknowns resolved

- **Per-role line-height tokens**: resolved (additive `_typography` change exposing the existing scale ratios).
- **Success tone contrast**: resolved via new `--pathable-color-text-success` token.
- **Polymorphic native-prop typing**: resolved via generic per-element props (FR-012) rather than the loose `ElementType` shortcut.