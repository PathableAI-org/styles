# Research: Semantic Color and Tone Model

**Feature**: Semantic Color and Tone Model
**Date**: 2026-08-23
**Purpose**: Resolve all design decisions before Phase 1 contracts and data model

## SCSS Audit Findings (packages/styles)

The plan requires an audit of existing semantic color tokens, tone semantics, and token-to-meaning mappings before formalizing the shared vocabulary. Findings:

### Semantic color tokens (`packages/styles/src/_semantic.scss`)

All tokens are exact brand hex values emitted as `--pathable-*` CSS custom properties under `:root`. The relevant families:

| Token | Value | Role |
|-------|-------|------|
| `--pathable-color-bg` | `#dde2e8` | app background / subtle surface |
| `--pathable-color-surface` | `#ffffff` | standard content surface |
| `--pathable-color-text` | `#00365c` | default body text |
| `--pathable-color-text-muted` | `#015a76` | muted text |
| `--pathable-color-border` | `#dde2e8` | default boundary |
| `--pathable-color-link` | `#4899e8` | links |
| `--pathable-color-accent` | `#1cae96` | accent / brand primary |
| `--pathable-color-focus-ring` | `#4497f5` | focus indicator |
| `--pathable-color-danger` | `#dc3545` | danger text/border/status |
| `--pathable-color-success` | `#1cae96` | success accent/status |
| `--pathable-color-text-success` | `#0d7a63` | text-safe success (added in feature 09) |
| `--pathable-color-action-primary-bg` | `#00365c` | primary action background |
| `--pathable-color-action-primary-text` | `#ffffff` | primary action text |
| `--pathable-color-status-*-bg/-text` | various | status role pairs |
| `--pathable-color-on-accent` | `#001a33` | text on accent/success/warning |

### Text tone contract — VERIFIED (`pathable-component-wrappers/pathable-text.scss`)

Feature 09 created the text tone contract. Confirmed in source:

| Tone | Class | Token |
|------|-------|-------|
| `default` | `.pathable-text--tone-default` | `var(--pathable-color-text)` |
| `muted` | `.pathable-text--tone-muted` | `var(--pathable-color-text-muted)` |
| `danger` | `.pathable-text--tone-danger` | `var(--pathable-color-danger)` |
| `success` | `.pathable-text--tone-success` | `var(--pathable-color-text-success)` |

**Audit conclusion**: The text tone vocabulary is already fully grounded. No SCSS work is required for text tones. The only gap is the *type location*: `TextTone` is declared inline in `packages/react/src/components/Text/Text.tsx` (line 6), not in the internal type layer.

### Surface contract — GAP (`pathable-component-wrappers/pathable-surface.scss`)

A `pathable-surface.scss` contract exists, but its modifiers are **depth/elevation variants**, not tone roles:

`.pathable-surface--base | raised | inset | interactive | brand | inverse`

These express elevation/shadow/interactivity, not the semantic tone roles the plan names (`default`, `subtle`, `primary`). No `pathable-surface--tone-*` modifier exists.

The semantic surface tokens do exist and could support tones:

| Surface tone (candidate) | Candidate token |
|--------------------------|-----------------|
| `default` | `var(--pathable-color-surface)` |
| `subtle` | `var(--pathable-color-bg)` |
| `primary` | `var(--pathable-color-accent)` or `var(--pathable-color-action-primary-bg)` — **ambiguous** |

The `primary` mapping is ambiguous (accent jade vs. brand blue), and reconciling "tone" with the existing "depth variant" model is a design decision that belongs to the `Surface` primitive (feature 12). **Audit conclusion**: surface tone contract is a tracked gap, owned by feature 12.

### Border tone contract — GAP

`--pathable-color-border` (`#dde2e8`) and `--pathable-color-danger` (`#dc3545`) exist as tokens, but there is no `pathable-border--tone-*` or equivalent semantic border-tone contract. The existing `.pathable-border-{n}` utility sets border *width*, not tone. No consuming component or primitive for border tone exists yet. **Audit conclusion**: border tone contract is a tracked gap with no owning feature yet (surfaces/boundaries).

### Existing internal color types (`packages/react/src/internal/resolvers/colorTone.ts`)

Feature 01 already defined *utility* color types:

- `BackgroundColor` → `.pathable-bg-{value}` (flat background-color utility)
- `TextColor` → `.pathable-text-{value}` (flat color utility)
- `ColorToneProps { backgroundColor?, textColor? }`

These are flat single-property utility classes (`pathable-bg-danger`, `pathable-text-muted`), **distinct** from the semantic tone roles (`pathable-text--tone-danger`) that the vocabulary formalizes. The two concepts must not be conflated.

## Decision 1: Semantic tone types are a distinct vocabulary from utility color types

**Decision**: `TextTone`, `SurfaceTone`, `BorderTone` are a new, higher-level semantic vocabulary that maps to component-scoped BEM tone modifiers (`pathable-text--tone-*`), separate from the existing flat utility color types (`BackgroundColor`, `TextColor`) in `colorTone.ts`. No change is made to `colorTone.ts`.

**Rationale**: The parent plan distinguishes "color/tone" (palette-meaning utilities) from "semantic tone roles". Feature 09's research already established that text tones use BEM modifiers, not the flat `.pathable-text-*` utilities. Mixing the two in one module would blur the distinction and risk a `TextColor`/`TextTone` naming collision.

**Alternatives considered**: Extending `colorTone.ts` with the tone types — rejected because the mapping targets (BEM modifiers vs. flat utilities) and the public/consumer intent differ.

## Decision 2: Text tone contract verified; migrate `TextTone` into the internal layer

**Decision**: Move the `TextTone` union (`'default' | 'muted' | 'danger' | 'success'`) from inline `Text.tsx` into a new internal module `packages/react/src/internal/resolvers/tone.ts`, re-export it through `types.ts` and `index.ts`, and have `Text.tsx` import it. The rendered class mapping and `TEXT_TONE_CLASS` map stay in `Text.tsx` (or move to a `textToneClass` resolver in `tone.ts`).

**Refinement**: For consistency with the resolver layer's "pure resolver function" pattern, the plan also adds a `textToneClass(value)` resolver in `tone.ts` (mirroring `textColorClass`), with `Text.tsx` consuming it. This keeps the tone→class mapping testable in isolation.

**Rationale**: Satisfies spec FR-011 ("the internal type layer MUST define a TextTone type") and FR-015 ("Text's tone prop MUST consume the shared type") without changing the rendered class output for any supported value.

**Alternatives considered**: Keep `TextTone` inline — rejected; violates FR-011 and leaves no shared source of truth for future components.

## Decision 3: Surface and border tone contracts are tracked gaps (not created here)

**Decision**: `SurfaceTone` (`'default' | 'subtle' | 'primary'`) and `BorderTone` (`'default' | 'danger'`) are **defined as types** in the internal layer (fixing the vocabulary now), but their SCSS contracts are recorded as **tracked gaps** rather than implemented in this feature.

- Surface tones → tracked gap owned by feature 12 (`Surface` primitive). The existing `pathable-surface.scss` depth variants must be reconciled with tone roles there, and the `primary` token mapping (accent vs. action-primary-bg) resolved there.
- Border tones → tracked gap with no owning feature yet (surfaces/boundary work); the `BorderTone` type is forward-declared for vocabulary consistency.

**Rationale**:
1. The spec explicitly excludes the `Surface` component (feature 12) and component-level tone adoption beyond `Text`.
2. The spec's "DONE means" explicitly permits "either a verified SCSS contract exists or a tracked gap is recorded" (FR-007/FR-008).
3. Inventing `pathable-surface--tone-*` / border-tone CSS now would create an orphaned, unexercised API that feature 12 would likely redefine after reconciling tone vs. depth variants.
4. Source-first is preserved: we do not expose wrapper behavior for a contract that does not yet exist.

**Alternatives considered**:
- Create surface/border tone contracts now — rejected (orphaned API, unresolved `primary` semantics, no consuming component).
- Omit `SurfaceTone`/`BorderTone` types entirely — rejected; spec FR-012/FR-013 require them, and fixing the vocabulary now prevents drift.

## Decision 4: Type placement — new `tone.ts` module in `internal/resolvers/`

**Decision**: Create `packages/react/src/internal/resolvers/tone.ts` containing the three tone type unions, the `textToneClass` resolver, and doc-comment vocabulary mappings. Re-export through `types.ts` (types) and `index.ts` (types + resolver).

**Rationale**: Matches the existing one-module-per-capability layout; keeps semantic tone types out of the utility `colorTone.ts`; gives a single discoverable home for the vocabulary.

## Decision 5: Contrast and forced-colors evidence

**Decision**: Re-record text tone contrast evidence from feature 09 in the vocabulary document; defer surface/border contrast obligations to their tracked gaps (no contract → no rendered output to regress).

Text tone contrast vs. `--pathable-color-surface` (`#ffffff`):

| Tone | Token | Ratio | WCAG AA normal text (4.5:1) |
|------|-------|-------|------------------------------|
| `default` | `--pathable-color-text` | 12.48:1 | PASS |
| `muted` | `--pathable-color-text-muted` | 7.71:1 | PASS |
| `danger` | `--pathable-color-danger` | 4.53:1 | PASS |
| `success` | `--pathable-color-text-success` | 5.27:1 | PASS |

Forced-colors: text tone classes resolve to semantic tokens; in forced-colors mode the browser maps these through system color keywords, and meaning is carried by element semantics/typography, never color alone (feature 09 verified). The `pathable-surface` contract already carries `@media (forced-colors: active)` outline fallbacks for its depth variants; when surface/border *tone* contracts are implemented (feature 12), they must add equivalent forced-colors handling.

## Tone Vocabulary (canonical record)

### Text tones — VERIFIED

| Tone | Type | SCSS source | Resolved class | Token |
|------|------|-------------|----------------|-------|
| `default` | `TextTone` | `pathable-text.scss` | `pathable-text--tone-default` | `--pathable-color-text` |
| `muted` | `TextTone` | `pathable-text.scss` | `pathable-text--tone-muted` | `--pathable-color-text-muted` |
| `danger` | `TextTone` | `pathable-text.scss` | `pathable-text--tone-danger` | `--pathable-color-danger` |
| `success` | `TextTone` | `pathable-text.scss` | `pathable-text--tone-success` | `--pathable-color-text-success` |

### Surface tones — TRACKED GAP (owner: feature 12 `Surface`)

| Tone | Type | SCSS source | Resolved class | Token |
|------|------|-------------|----------------|-------|
| `default` | `SurfaceTone` | GAP | (TBD) | `--pathable-color-surface` |
| `subtle` | `SurfaceTone` | GAP | (TBD) | `--pathable-color-bg` |
| `primary` | `SurfaceTone` | GAP | (TBD) | `--pathable-color-accent` or `--pathable-color-action-primary-bg` (unresolved) |

### Border tones — TRACKED GAP (no owning feature yet)

| Tone | Type | SCSS source | Resolved class | Token |
|------|------|-------------|----------------|-------|
| `default` | `BorderTone` | GAP | (TBD) | `--pathable-color-border` |
| `danger` | `BorderTone` | GAP | (TBD) | `--pathable-color-danger` |

## Unknowns resolved

- **Text tone contract existence** → exists; only type relocation needed (Decision 2).
- **Surface tone contract existence** → does not exist as a tone role; tracked gap owned by feature 12 (Decision 3).
- **Border tone contract existence** → does not exist; tracked gap, no owner yet (Decision 3).
- **Type placement** → new `tone.ts` module (Decision 4).
- **Contrast/forced-colors evidence** → text verified in feature 09; surface/border deferred with gaps (Decision 5).
