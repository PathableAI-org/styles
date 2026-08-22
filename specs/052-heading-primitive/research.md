# Research: Heading Primitive

## Audit Scope

Audited all heading-related styles, tokens, component usage, and SCSS contracts across `packages/styles/src/` and `packages/react/src/`. Full findings in the audit report below.

## Audit Findings

### Existing Heading Assets

**No heading SCSS contract exists.** `pathable-heading.scss` does not exist. No shared heading base class, modifier pattern, mixin, or Sass partial is available for heading semantics.

**Typography scale heading entries** (`_typography.scss`):

| Scale Entry | Font Family | Font Size | Line Height | Weight |
|-------------|-------------|-----------|-------------|--------|
| `display-lg` | Fredoka (`$pathable-font-heading`) | 32px | 40px | 400 |
| `heading-lg` | Poppins (`$pathable-font-subheading`) | 24px | 32px | 700 |
| `heading-md` | Poppins (`$pathable-font-subheading`) | 20px | 28px | 700 |
| `heading-sm` | Poppins (`$pathable-font-subheading`) | 18px | 24px | 700 |

**CSS custom property tokens emitted** (dual-named `--pathable-*` / `--usa-*`):
- `--pathable-font-heading` (Fredoka)
- `--pathable-font-alt` (Montserrat)
- `--pathable-font-size-heading-lg` (24px)
- `--pathable-font-size-heading-md` (20px)
- `--pathable-font-size-heading-sm` (18px)
- `--pathable-font-line-height-heading` (1.25)

**USWDS theme heading configuration** (`_uswds-theme.scss`):
```
$theme-display-font-size: 'xl'
$theme-h1-font-size: 'lg'
$theme-h2-font-size: 'md'
$theme-h3-font-size: 'md'
$theme-h4-font-size: 'sm'
$theme-h5-font-size: '2xs'
$theme-h6-font-size: '3xs'
```

### Component Heading Usage

13+ component wrappers use headings with inline typography rules patched together manually. Every instance duplicates the same pattern: set `font-family: var(--pathable-font-heading)` (Fredoka), pick a size token, add `font-weight: var(--pathable-font-weight-bold)`, and set `color: var(--pathable-color-text)`. No two components share an abstraction.

**Notable pattern**: All component wrappers use `$pathable-font-heading` (Fredoka) for headings, but the typography scale uses `$pathable-font-subheading` (Poppins) for `heading-lg/md/sm`. This is a contradiction between the design-system scale and actual component usage.

### Bugs and Gaps

- **Missing token**: `--pathable-font-size-heading-xl` is referenced in `pathable-dashboard-header.scss` and `pathable-kpi-grid.scss` but is never defined in the `$typography-tokens` map. It resolves to `initial` at runtime.
- **No heading-xs/heading-2xs tokens**: The scale has entries for h1–h4 scale roles (`display-lg`, `heading-lg`, `heading-md`, `heading-sm`) but no entries for h5–h6 (which USWDS maps to `2xs`/`3xs`).
- **Font-family disagreement**: Scale says Poppins for headings; component usage says Fredoka. The scale is the source of truth per constitution Principle I.

### React Component Status

No `Heading` component exists in `packages/react/src/components/` or anywhere else in the React package.

---

## Design Decisions

### Decision 1: Create a New `pathable-heading` SCSS Contract

**Decision**: Create `packages/styles/src/pathable-component-wrappers/pathable-heading.scss` with a `.pathable-heading` base class and `.pathable-heading--level-{1..6}` modifier classes.

**Rationale**: No heading contract exists today. 13+ component wrappers duplicate heading typography inline. This is the same pattern used by every other layout and text primitive (`pathable-stack`, `pathable-grid`, `pathable-text`, etc.). Per constitution Principle I, the SCSS contract in `packages/styles` must exist before the React wrapper.

**Alternatives considered**:
- Extend USWDS `usa-prose` headings: Rejected — USWDS prose headings are tied to a `.usa-prose` wrapper context and don't provide standalone heading classes suitable for a primitive component.
- Use inline CSS custom properties directly in the React component: Rejected — violates Principles I and IV (styles must own the visual contract; wrapper packages must not define visual semantics).

### Decision 2: Level-to-Scale Mapping

**Decision**: Map heading levels to the existing typography scale entries:

| Level | Scale Entry | Font Family | Font Size | Weight |
|-------|------------|-------------|-----------|--------|
| 1 | `display-lg` | Fredoka | 32px | 400 |
| 2 | `heading-lg` | Poppins | 24px | 700 |
| 3 | `heading-md` | Poppins | 20px | 700 |
| 4 | `heading-sm` | Poppins | 18px | 700 |
| 5 | `body-md` | Nunito | 16px | 700 (bold) |
| 6 | `body-sm` | Nunito | 14px | 700 (bold) |

**Rationale**: The typography scale has 4 named heading/display entries. Level 1 uses `display-lg` (the largest, visually suitable for page titles). Levels 2–4 use the named heading entries. Levels 5 and 6 fall back to body sizes with bold weight to maintain visual hierarchy without creating new scale entries.

**Alternatives considered**:
- Add new `heading-xs` and `heading-2xs` scale entries: This would be more semantically correct but requires defining new font sizes, line heights, and weights that have no design-system precedent. Deferred to a follow-up typography refinement task if needed.
- Collapse h5/h6 into the same style as h4: Rejected — all six HTML levels must be visually distinguishable per SC-004.

### Decision 3: Font-Family Resolution

**Decision**: The SCSS contract respects the typography scale's font-family assignments. Level 1 uses Fredoka (the scale's `display-lg` font). Levels 2–4 use Poppins (the scale's `heading-*` font). Levels 5–6 use Nunito (the scale's body font, with bold weight).

**Rationale**: The `_typography.scss` scale is the authoritative source of font-family assignments per constitution Principle I. The component wrappers' use of Fredoka for all headings is inconsistent with the scale and represents drift rather than intentional design.

**Alternatives considered**:
- Override all headings to Fredoka: Rejected — would contradict the typography scale. If the design team wants Fredoka for all headings, the scale should be updated first in a separate token-change feature.
- Use a single `--pathable-heading-font-family` token for all levels: Rejected — the existing scale already differentiates between display (Fredoka) and heading (Poppins) font roles.

### Decision 4: `level` Prop Is Required

**Decision**: The `level` prop is required with no default value. TypeScript enforces this at compile time.

**Rationale**: The spec's assumption section already states this. It aligns with the Heading primitive's philosophy of intentional choice — developers must explicitly choose a heading level. This matches the source plan's constraint: "No `as` override that would produce a non-heading element — `Heading` is always a heading."

**Alternatives considered**:
- Default to `h2`: Rejected — while convenient, it enables accidental incorrect heading levels.
- Default to `h1`: Rejected — every page should have exactly one h1; defaulting to h1 would encourage misuse.

### Decision 5: `visualLevel` Is Optional and Constrained

**Decision**: `visualLevel` is an optional prop constrained to `1 | 2 | 3 | 4 | 5 | 6`. When omitted, the visual style class matches `level`. When provided, it determines only the CSS modifier class; the HTML element is always controlled by `level`.

**Rationale**: Matches the spec's explicit inclusion of this feature. The prop name `visualLevel` (rather than e.g. `appearance`) is chosen to mirror the `level` naming and make the relationship explicit: "this heading is semantically level X but visually level Y."

**Alternatives considered**:
- Omit `visualLevel` entirely: Rejected — the source plan explicitly includes it as an optional feature with documented rationale and accessibility guidance.
- Name it `displayLevel` or `appearance`: Rejected — `visualLevel` more clearly communicates the relationship to `level`.

### Decision 6: No `as` Prop on Heading

**Decision**: Heading does not accept an `as` prop. The rendered element is always `h1`–`h6`, determined by `level`.

**Rationale**: The spec and source plan both explicitly exclude this. The semantic integrity of headings depends on them being actual heading elements. Unlike `Text` which supports `as` for text-content elements, Heading has no legitimate use case for rendering as a non-heading element.

### Decision 7: Shared Native Heading Props

**Decision**: Use `HTMLAttributes<HTMLHeadingElement>` for native props while
mapping `level` to the exact `h1`–`h6` intrinsic element at render time. Heading
does not use a generic polymorphic `as` pattern.

**Rationale**: Unlike `Text`, Heading's element is determined by `level`. All six
heading elements share the `HTMLHeadingElement` interface and the same native
attribute set, so a discriminated union would duplicate identical prop types
without increasing safety. Invalid non-heading props such as `href` and `as`
remain compile-time errors.

**Alternatives considered**:
- Generic polymorphic like `Text`: Over-engineered — Heading has no `as` prop, and the element is always known from `level`.
- Per-level discriminated unions: Rejected — `h1` through `h6` do not expose
  different native React attribute interfaces, so the union adds complexity
  without narrowing accepted props.

### Decision 8: SCSS Contract Structure

**Decision**: The SCSS contract follows the same pattern as `pathable-text.scss`:

```scss
.pathable-heading {
  // Base: reset margin, set default color
  color: var(--pathable-color-text);
  margin: 0;
}

.pathable-heading--level-1 { /* display-lg properties */ }
.pathable-heading--level-2 { /* heading-lg properties */ }
// ...through level-6
```

Each modifier uses `@include` of the existing typography scale mixin or references CSS custom properties directly. No new Sass variables — all values resolve to `--pathable-*` tokens.

**Rationale**: Consistent with all other primitive SCSS contracts (`pathable-text`, `pathable-stack`, etc.). Simpler than creating mixins since each level modifier is a one-time-use declaration.

### Decision 9: No Tone or Color Props

**Decision**: Heading does not accept `tone`, `color`, or any color-related props. All headings use `--pathable-color-text` (default text color).

**Rationale**: The spec and source plan explicitly exclude tone/color props. These belong to the `Text` primitive. Headings can be styled with custom colors via `className` if needed.
