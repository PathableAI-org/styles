# Research: Surface Primitive

**Feature**: Surface Primitive
**Date**: 2026-08-24
**Purpose**: Resolve all design decisions before Phase 1 contracts and data model

## Precondition Evaluation (spec FR-001/FR-002)

The feature is conditional: it ships only if at least two concrete application
use cases demonstrate repeated, coordinated surface behavior that cannot be
served by `Box` with `className`. Findings:

### The coordinated surface contract already exists and is heavily used

`packages/styles/src/pathable-component-wrappers/pathable-surface.scss` defines
a `pathable-surface` base class plus coordinated depth variants, each resolving
background, border, elevation, and (for `interactive`) focus treatment as a
single modifier — not a raw `background-color`:

| Variant | Background | Border | Elevation | Focus |
|---------|------------|--------|-----------|-------|
| `--base` | transparent | `1px solid --pathable-color-border` | none | — |
| `--raised` | `--pathable-color-surface` | none | `--elevation-md` | — |
| `--inset` | `--pathable-color-bg` | none | inset `--elevation-sm` | — |
| `--interactive` | `--pathable-color-surface` | `2px solid transparent` | `--elevation-sm` | focus-visible/focus-within ring |
| `--brand` | `--pathable-color-accent` | none | `--elevation-md` | — |
| `--inverse` | `--pathable-color-text` | none | `--elevation-md` | — |

### Concrete application use cases (repeated, coordinated)

The coordinated treatment is repeated across many concrete application
compositions (not a single generic utility). Representative evidence, all
expressing "background + border + elevation (+ focus)" as one coordinated
choice via `pathable-surface pathable-surface--{variant}`:

1. **Operational dashboard** — `stories/recipes/OperationalDashboard.stories.ts`
   and `stories/marketing-patterns/OperationalDashboard.stories.ts`: raised
   surfaces for KPI cards, chart panels, and tables (`pathable-surface--raised`),
   repeated across the page.
2. **Multi-step intake wizard** — `stories/recipes/AccommodationsIntakeWizard.stories.ts`:
   raised step panels with nested inset sub-panels (`--raised` + `--inset`),
   repeating the coordinated treatment through every step.
3. **App shell / layout compositions** — `stories/app-shell/AppShell*.stories.ts`,
   `stories/layout-composition/{SidebarLayout,StickyPanel,NestedComposition}.stories.ts`:
   raised panels, inset regions, and interactive focusable surfaces used to
   build the application chrome.

These are concrete, repeated, coordinated usages — a `Box` + ad-hoc `className`
would re-declare the same multi-property contract at every call site and could
drift. A `Surface` primitive that selects the whole treatment through one
semantic `variant` prop (with `elevation`/`borderTone` refinements) is the
justified abstraction.

### Precondition conclusion

**MET.** The feature proceeds. (If the maintainer disputes that these are
"application" vs. "design" use cases, the fallback is cancellation per spec
FR-002 — recorded here as a deliberate gate, not a default.)

## SCSS Audit Findings

### Semantic tokens (verified)

From `packages/styles/src/_semantic.scss`:

| Token | Value | Role |
|-------|-------|------|
| `--pathable-color-surface` | `#ffffff` | standard content surface |
| `--pathable-color-bg` | `#dde2e8` | app background / subtle surface |
| `--pathable-color-text` | `#00365c` | default foreground |
| `--pathable-color-border` | `#dde2e8` | default boundary |
| `--pathable-color-accent` | `#1cae96` | brand accent / brand primary |
| `--pathable-color-on-accent` | `#001a33` | text on accent (WCAG AA) |
| `--pathable-color-action-primary-bg` | `#00365c` | primary *action* background |
| `--pathable-color-danger` | `#dc3545` | danger border/text/status |
| `--pathable-color-focus-ring` | `#4497f5` | focus indicator |

### Elevation tokens (verified)

`packages/styles/src/_elevation.scss` exposes `--elevation-sm | md | lg | xl`
shadow steps. These are the only verified elevation values; no arbitrary
`box-shadow` is part of the contract.

### Tone contract gap (confirmed from feature 11)

The shared `SurfaceTone` (`default | subtle | primary`) and `BorderTone`
(`default | danger`) types exist in `packages/react/src/internal/resolvers/tone.ts`,
but no `pathable-surface--tone-*` or border-tone BEM contract exists. The
existing `pathable-surface` modifiers are **depth variants** (`base/raised/
inset/interactive/brand/inverse`), not tone roles. Feature 11 recorded both as
tracked gaps owned here.

## Decision 1: Two-axis reconciliation — tone role ≠ depth variant

**Decision**: `Surface` separates three axes that the legacy depth variants
conflate:

- **`variant` (tone role)** → background + foreground + default border.
  Values are the shared `SurfaceTone` union (`default`, `subtle`, `primary`).
- **`elevation` (depth)** → shadow step, values `sm | md | lg | xl`.
- **`borderTone` (boundary meaning)** → border color, values the shared
  `BorderTone` union (`default`, `danger`).

The legacy depth variants (`base/raised/inset/interactive/brand/inverse`)
remain in `pathable-surface.scss` unchanged (they are still consumed directly
by app-shell/recipe SCSS and stories). The React `Surface` primitive formalizes
the *semantic tone* axis and re-expresses depth as `elevation`.

**Rationale**: The shared `SurfaceTone` vocabulary (feature 11) is a semantic
role axis; the legacy variants are a depth/interactivity axis. The plan's
"coordinated foreground, background, border, and focus-ring classes" requires a
tone-keyed contract, not a depth-keyed one. Forcing `variant` onto the depth
names would contradict the shared vocabulary and the spec.

**Alternatives considered**:
- Map `variant` onto the depth variants (`default→base`, `subtle→inset`,
  `primary→brand`) — rejected: depth variants bake elevation into the tone,
  making `elevation` redundant and the `borderTone` prop inexpressible; also
  contradicts `variant = SurfaceTone`.
- Invent a brand-new `pathable-surface` partial instead of extending the
  existing one — rejected: the base class, radius, transition, and
  forced-colors/reduced-motion handling should be reused, not forked.

## Decision 2: New tone-role modifiers on the existing surface contract

**Decision**: Extend `pathable-surface.scss` with tone-role modifiers grounded
in the same semantic tokens (no new tokens, no forked values):

| `variant` | Modifier | Background | Foreground | Default border |
|-----------|----------|------------|------------|----------------|
| `default` | `pathable-surface--tone-default` | `--pathable-color-surface` | `--pathable-color-text` | `--pathable-color-border` |
| `subtle` | `pathable-surface--tone-subtle` | `--pathable-color-bg` | `--pathable-color-text` | `--pathable-color-border` |
| `primary` | `pathable-surface--tone-primary` | `--pathable-color-accent` | `--pathable-color-on-accent` | `--pathable-color-accent` |

**Rationale**: Satisfies the source-first rule — the SCSS contract lands in
`packages/styles` before the React wrapper exposes it. Reusing the existing
tokens (not creating new ones) keeps the tone contract value-identical to the
legacy `--brand` accent and avoids token proliferation.

**Alternatives considered**: Add tone classes to a new partial — rejected for
forking the existing `pathable-surface` base (Decision 1).

## Decision 3: `primary` maps to `--pathable-color-accent` (brand accent)

**Decision**: `primary` resolves background to `--pathable-color-accent`
(`#1cae96`, Intelligent Jade) with foreground `--pathable-color-on-accent`
(`#001a33`). It does **not** use `--pathable-color-action-primary-bg`.

**Rationale**: `--pathable-color-accent` is the established "brand primary" and
is already the surface accent (`--brand` variant). `--pathable-color-action-primary-bg`
(`#00365c`) is action-button-scoped (it pairs with `--pathable-color-action-primary-text`).
The foreground uses the existing `--pathable-color-on-accent` token (~5.5:1 on
jade), preserving the contrast contract already documented in `_semantic.scss`.

**Alternatives considered**:
- `--pathable-color-action-primary-bg` — rejected: action-scoped semantics,
  and would require a different foreground pairing than the accent token.
- `--pathable-color-accent` with `--pathable-color-surface` foreground — rejected:
  white-on-jade fails WCAG AA normal text; `on-accent` is the designed pairing.

## Decision 4: `borderTone` requires a new border-tone contract

**Decision**: Add `pathable-surface--border-{default|danger}` modifiers mapping
to `--pathable-color-border` and `--pathable-color-danger` respectively. No
border-tone contract exists today (feature 11 recorded the gap).

| `borderTone` | Modifier | Border color |
|--------------|----------|--------------|
| `default` | `pathable-surface--border-default` | `--pathable-color-border` |
| `danger` | `pathable-surface--border-danger` | `--pathable-color-danger` |

**Rationale**: The `BorderTone` type already exists; grounding it is the only
way the `borderTone` prop can ship without violating source-first. `danger`
signals an invalid/error boundary without a raw color value.

## Decision 5: `elevation` maps to the verified `--elevation-*` steps

**Decision**: Add `pathable-surface--elevation-{sm|md|lg|xl}` modifiers
resolving to the existing `--elevation-*` tokens. The `elevation` prop accepts
only these verified steps; arbitrary `box-shadow` is rejected by the type system.

**Rationale**: The elevation tokens are the single verified shadow source.
Constraining the prop to them prevents shadow drift and satisfies the spec's
"verified elevation/shadow utility classes" requirement.

**Alternatives considered**: Reuse the legacy depth modifiers for elevation —
rejected: they also set background/border, conflating axes (Decision 1).

## Decision 6: `Surface` follows the polymorphic primitive pattern

**Decision**: `Surface` follows the `Stack`/`Container`/`Card` pattern:
default element `div`, an `as` prop (`ElementType`), ref forwarding, native
attribute passthrough, `mergeClasses` composition, and no wrapper DOM nodes.
It consumes `SizingProps` (`width`, `maxWidth`) and the external `SpacingProps`
(`margin`, `marginX`, `marginY`, `marginTop`, `marginBottom`), and **does not**
accept internal padding (external spacing only, per spec FR-015 — consistent
with `Stack`'s exclusion of padding).

**Rationale**: Reuses the shared capability interfaces (feature 01) rather than
redefining sizing/spacing. Excluding padding keeps `Surface`'s contract
focused on the treatment, not content spacing.

## Decision 7: Class merge order

**Decision**: `pathable-surface` (base) → `pathable-surface--tone-{variant}` →
`pathable-surface--elevation-{n}` → `pathable-surface--border-{tone}` →
resolved sizing/spacing classes → consumer `className`.

**Rationale**: Matches feature 01's documented order (required primitive
classes → resolved semantic classes → consumer `className`) with the tone/
elevation/border modifiers ordered so a later refinement cannot be overridden
by an earlier one within the resolved set; `className` always wins for
consumer overrides.

## Decision 8: Contrast and forced-colors evidence

**Decision**: Record per-variant contrast and forced-colors evidence; carry the
legacy `pathable-surface` `@media (forced-colors: active)` outline fallbacks
into the new tone/elevation/border modifiers, and honor
`prefers-reduced-motion` for any transition.

Contrast (normal text, WCAG AA 4.5:1):

| Variant | Foreground on background | Ratio | Status |
|---------|--------------------------|-------|--------|
| `default` | `--pathable-color-text` on `--pathable-color-surface` | 12.48:1 | PASS (recorded in feature 11) |
| `subtle` | `--pathable-color-text` on `--pathable-color-bg` | ~9.6:1 | PASS (Shilling Silver + PathAble Blue) |
| `primary` | `--pathable-color-on-accent` on `--pathable-color-accent` | ~5.5:1 | PASS (recorded in `_semantic.scss`) |

Exact ratios for `subtle` are confirmed during implementation and recorded in
the branch (spec FR-025). Forced-colors: the tone/border/elevation modifiers
resolve to semantic tokens; meaning is carried by structure and the outline
fallback, never color alone.

## Unknowns resolved

- **Precondition met?** → yes, three named concrete application composition
  families repeat the coordinated treatment (Decision 0 / Precondition).
- **Tone vs. depth reconciliation** → two-axis model (Decision 1).
- **`primary` token mapping** → `--pathable-color-accent` + `on-accent` (Decision 3).
- **Border-tone contract existence** → does not exist; create it (Decision 4).
- **Elevation prop source** → `--elevation-*` steps (Decision 5).
- **Component pattern** → polymorphic primitive, no padding (Decision 6).
