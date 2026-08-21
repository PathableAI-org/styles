# Research: Grid Layout Primitive

**Feature**: Grid Layout Primitive
**Date**: 2026-08-21
**Purpose**: Resolve all design decisions before Phase 1 contracts and data model

## Decision 1: SCSS Contract Design — New `pathable-grid.scss`

**Decision**: Create a new `pathable-grid.scss` SCSS file following the established CSS custom property + modifier pattern. The contract provides column templates via modifier classes (not CSS custom properties), gap via CSS custom property with modifier overrides, and alignment via CSS custom property with modifier overrides.

**Rationale**:
- Stack, Inline, and Cluster all use the pattern: base class sets layout properties with CSS custom property defaults, modifier classes override those custom properties for specific named values.
- For Grid, column templates are different in kind from gap — they set `grid-template-columns` which requires specific CSS values (`repeat(2, 1fr)`, not a numeric token). Representing this as a CSS custom property (`--pathable-grid-columns: repeat(2, 1fr)`) would be unusual and hard to override. Instead, each column modifier class directly sets `grid-template-columns`.
- Gap and alignment both map to named spacing/alignment tokens, so CSS custom property overrides are the right pattern for those.

**SCSS Contract Structure**:

```scss
// Base
.pathable-grid {
  display: grid;
  gap: var(--pathable-grid-gap, var(--space-16));
  align-items: var(--pathable-grid-align, stretch);
}

// Column modifiers (2, 3, 4)
.pathable-grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
.pathable-grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
.pathable-grid--cols-4 { grid-template-columns: repeat(4, 1fr); }

// Gap modifiers (sm, md, lg, xl)
.pathable-grid--gap-sm { --pathable-grid-gap: var(--space-8); }
.pathable-grid--gap-md { --pathable-grid-gap: var(--space-16); }
.pathable-grid--gap-lg { --pathable-grid-gap: var(--space-24); }
.pathable-grid--gap-xl { --pathable-grid-gap: var(--space-32); }

// Alignment modifiers (start, center, end, stretch, baseline)
.pathable-grid--align-start    { --pathable-grid-align: start; }
.pathable-grid--align-center   { --pathable-grid-align: center; }
.pathable-grid--align-end      { --pathable-grid-align: end; }
.pathable-grid--align-stretch  { --pathable-grid-align: stretch; }
.pathable-grid--align-baseline { --pathable-grid-align: baseline; }
```

**Alternatives considered**:
- **Gap via utility classes**: The existing `.pathable-flex-align-*` utility classes exist for alignment, but there are no equivalent `.pathable-gap-*` utilities. Creating gap utilities for Grid alone would be inconsistent. Using SCSS modifiers is the established pattern.
- **Column count via CSS custom property**: `--pathable-grid-columns: repeat(2, 1fr)` would be technically possible but confusing as a public API — the value is not a simple token. Modifier classes are clearer and self-documenting.
- **Named grid templates (e.g., "2-1", "1-2-1")**: The spec mentions "named grid templates verified against SCSS" but the design system has no established named grid templates beyond the KPI grid and bento grid (which are specific composition patterns, not a general-purpose Grid primitive). Adding named templates now would over-scope the feature. If named templates are needed, they can be added as additional modifier classes in a follow-up.

## Decision 2: Grid Gap Scale Values

**Decision**: Grid uses the same gap scale as Stack — `var(--space-8)`, `var(--space-16)`, `var(--space-24)`, `var(--space-32)` for sm/md/lg/xl respectively. Default gap is `md` (`var(--space-16)`).

**Rationale**:
- Grid is a page-level layout primitive, like Stack. Both organize content in structured layouts where generous spacing is appropriate.
- Cluster uses a tighter scale (4px/8px/16px/24px) because it's designed for inline groupings of small items (tags, chips, buttons).
- Inline uses the Stack scale because it's the horizontal counterpart to Stack — non-wrapping single-axis layout.
- Grid shares Stack's role as a structural layout tool. Using the same scale creates visual consistency between vertical (Stack) and multi-column (Grid) layouts.

**Alternatives considered**:
- **Use Cluster's tighter scale**: Grid would look cramped for dashboard or form layouts. Overly tight grid spacing is a common design mistake.
- **Custom Grid scale**: Creates a third gap axis to document and reason about. Consistency with Stack is simplest.

## Decision 3: Grid Alignment Strategy — SCSS Modifiers (Like Cluster)

**Decision**: Grid's `align` prop maps to `.pathable-grid--align-{value}` SCSS modifier classes, not utility classes.

**Rationale**:
- The spec (FR-004) explicitly requires "grid alignment modifier classes that map `align-items` values to the design system's alignment tokens."
- Cluster uses the same SCSS modifier approach for alignment (`.pathable-cluster--align-{value}`). Grid is analogous — both are non-Flexbox layout models where self-contained SCSS alignment keeps the contract cohesive.
- Using SCSS modifiers allows a Grid-specific default alignment (`stretch`, the CSS Grid browser default) that differs from Flexbox's default (`stretch` is also Flexbox's default, but Cluster overrides to `center`). The CSS custom property approach lets each layout primitive define its own defaults.
- Stack and Inline use utility classes (`.pathable-flex-align-*`) because they are Flexbox primitives and the utility classes were designed for Flexbox alignment. Reusing the same utility classes for Grid alignment would be semantically misleading — they are named "flex-align" but would apply to a Grid container.

**Supported alignment values**: `start`, `center`, `end`, `stretch`, `baseline` — matching the `AlignItems` type union used by Stack, Inline, and Cluster.

**Default alignment**: `stretch` (the CSS Grid browser default). When no `align` prop is provided, no alignment modifier class is added, and the browser's default `align-items: stretch` applies.

**Alternatives considered**:
- **Use utility classes like Stack/Inline**: The `.pathable-flex-align-*` classes apply `align-items` which works on Grid containers too, but (a) the spec explicitly requires SCSS modifiers, (b) the class name would be misleading on a Grid, and (c) it prevents a Grid-specific default alignment.
- **No alignment prop**: Grid aesthetics without alignment control would limit the primitive's usefulness. Alignment is a core layout concern.

## Decision 4: `columnGap` and `rowGap` — Include as Optional Props

**Decision**: Support `columnGap` and `rowGap` as optional props that map to separate axis gap modifier classes in the SCSS contract, using the same gap scale values as the `gap` prop.

**Rationale**:
- CSS Grid natively supports `column-gap` and `row-gap` as separate properties. Adding SCSS modifier classes and CSS custom properties for each axis is straightforward.
- Grid layouts commonly benefit from different horizontal and vertical spacing (e.g., tighter row gap than column gap in a form grid).
- The spec lists this as FR-009 (MAY requirement, not MUST). Including it now avoids needing an SCSS contract change + React component change later.
- When both `gap` and individual axis gaps are provided, the individual axis props take precedence for their respective axes (following CSS cascade logic).

**SCSS additions**:

```scss
.pathable-grid {
  column-gap: var(--pathable-grid-column-gap, var(--pathable-grid-gap, var(--space-16)));
  row-gap: var(--pathable-grid-row-gap, var(--pathable-grid-gap, var(--space-16)));
}

.pathable-grid--column-gap-sm { --pathable-grid-column-gap: var(--space-8); }
.pathable-grid--column-gap-md { --pathable-grid-column-gap: var(--space-16); }
.pathable-grid--column-gap-lg { --pathable-grid-column-gap: var(--space-24); }
.pathable-grid--column-gap-xl { --pathable-grid-column-gap: var(--space-32); }

.pathable-grid--row-gap-sm { --pathable-grid-row-gap: var(--space-8); }
.pathable-grid--row-gap-md { --pathable-grid-row-gap: var(--space-16); }
.pathable-grid--row-gap-lg { --pathable-grid-row-gap: var(--space-24); }
.pathable-grid--row-gap-xl { --pathable-grid-row-gap: var(--space-32); }
```

When `gap="sm"` is set and `rowGap="xl"` is also set, the column gap is 8px and the row gap is 32px. The `gap` prop acts as a shorthand that sets both axes; individual axis props override their respective axis.

**Alternatives considered**:
- **Defer `columnGap`/`rowGap` to a follow-up**: Removes complexity from this feature but creates a discoverability problem — users who need different row/column gaps must wait for the follow-up or use a wrapper element.
- **Support `gap` as a tuple `"sm lg"`**: Parsing a string tuple is fragile and non-TypeScript-friendly. Separate props are the idiomatic React approach.

## Decision 5: Default Column Behavior — No Column Constraint

**Decision**: When the `cols` prop is omitted, the Grid renders as a CSS Grid container without an explicit `grid-template-columns`. Items flow in a single column (the CSS Grid default). No column modifier class is applied.

**Rationale**:
- This is the most predictable behavior — it matches what CSS Grid does natively.
- It allows consumers to use Grid solely for its gap and alignment features, applying custom column templates via `className` or `style` if needed.
- It avoids making assumptions about what the "right" default column count is.
- The spec edge case handling says: "The component must fall back to a sensible default or the nearest valid column configuration" — not applying a column constraint is the most sensible fallback.

**Alternative considered**:
- **Default to 2 columns**: Would be opinionated and could surprise users who expect a single-column layout. Not all grid use cases need multiple columns.
- **Require `cols`**: Would make the prop mandatory, which contradicts the spec's treatment of `cols` as an optional prop (it appears alongside other optional props like `gap` and `align`).

## Decision 6: No `justify` Prop

**Decision**: Exclude `justify` (which maps to CSS Grid's `justify-items` or `justify-content`) from the initial scope.

**Rationale**:
- The spec explicitly excludes "full CSS Grid language" and names only `align` (align-items) as the alignment surface.
- Inline-axis justification in CSS Grid has two separate properties: `justify-items` (cell-level) and `justify-content` (track-level). This distinction doesn't exist in Flexbox and would require careful API design.
- Grid layouts that need horizontal alignment typically control it via child content alignment or explicit column sizing. Adding `justify` would invite misuse.
- If justified grid layouts are needed, they can be added in a follow-up with proper API design.

## Decision 7: Gap Prop Typing — Local Type Per Component

**Decision**: Define `GridGap` as a local type within the Grid component file, following the pattern established by Stack, Inline, and Cluster.

```typescript
type GridGap = 'sm' | 'md' | 'lg' | 'xl'
```

**Rationale**:
- Each layout primitive defines its own gap type locally, even though the union values are identical. This follows the established convention.
- The gap class mappings differ per component (`.pathable-grid--gap-*` vs `.pathable-stack--gap-*`), making a shared type misleading.

## Decision 8: Alignment Prop Typing

**Decision**: Use the same `AlignItems` type union from `internal/resolvers/alignment.ts` for the `align` prop: `'start' | 'center' | 'end' | 'stretch' | 'baseline'`.

**Rationale**:
- This type is already defined and used by Stack, Inline, and Cluster.
- The alignment values are the same across all layout primitives, even though the class resolution differs (utility classes for Stack/Inline, SCSS modifiers for Cluster/Grid).

**Decision for class mapping**: Use a local `GRID_ALIGN_CLASS` record in the component, not the `alignItemsClass` resolver. The resolver produces `.pathable-flex-align-{value}` utility classes, but Grid needs `.pathable-grid--align-{value}` SCSS modifier classes.

## Decision 9: SCSS Registration and Forwarding

**Decision**: Add `@forward 'pathable-grid'` to `pathable-layout-composition.scss`, which already forwards `pathable-stack`, `pathable-cluster`, `pathable-inline`, and `pathable-split`.

**Rationale**:
- Grid is a layout composition primitive — it belongs in the layout composition bundle.
- The bundle is forwarded from `pathable-all.scss` → `_index.scss`, so consumers importing the all-in-one entrypoint receive Grid automatically.

## Decision 10: Component File Organization

**Decision**: Create `Grid/Grid.tsx` with its own `__tests__/Grid.test.tsx`, following the one-component-per-directory convention. No shared code extraction with other layout primitives.

**Rationale**:
- The gap, alignment, and column class mappings are all Grid-specific. No meaningful logic is shared with Stack, Inline, or Cluster at the component level.
- Each layout primitive uses the same patterns (local records, `mergeClasses`, `forwardRef`, polymorphic `as`), but the patterns are simple and copying them is less overhead than creating a shared abstraction.

## Decision 11: `SizingProps` and `SpacingProps` Reuse

**Decision**: Include `SizingProps` (`width`, `maxWidth`) and `SpacingProps` (margin props) via interface intersection, following the established pattern. Exclude `padding` from `SpacingProps` by marking it as `never`.

**Rationale**:
- These are the production-proven capability interfaces used by all other layout primitives.
- External spacing (margin) is appropriate for layout primitives — it describes how the component participates in surrounding layout.
- Internal spacing (padding) is not part of Grid's contract — padding should be controlled by the content placed inside the grid.
- `minWidth` is not in the current `SizingProps` interface, so it is not available to include. Adding it would require extending the capability system, which is out of scope.

## Decision 12: Class Merge Order

**Decision**: Classes are applied to the root element in this order:

1. `pathable-grid` (base class, always present)
2. `pathable-grid--cols-{n}` (column modifier, if `cols` prop is set)
3. `pathable-grid--gap-{size}` (gap modifier, if `gap` prop is set)
4. `pathable-grid--column-gap-{size}` (column gap, if `columnGap` is set)
5. `pathable-grid--row-gap-{size}` (row gap, if `rowGap` is set)
6. `pathable-grid--align-{value}` (alignment modifier, if `align` prop is set)
7. Sizing utility classes (`pathable-width-*`, `pathable-maxw-*`)
8. Spacing utility classes (`pathable-margin-*`, `pathable-margin-x-*`, etc.)
9. Consumer `className` (last, for intentional overrides)

**Rationale**:
- Base → columns → gap → alignment → sizing → spacing → consumer. Structural modifiers come before presentation utilities. Consumer `className` is always last.
- Column-gap and row-gap come after gap so individual axis overrides take visual precedence (though CSS cascade on separate custom properties handles the actual precedence).

## Summary of SCSS Changes Required

| File | Change | Rationale |
|------|--------|-----------|
| `pathable-grid.scss` | **CREATE** | New SCSS contract: `display: grid`, column templates via modifier classes, gap via CSS custom property with modifier overrides, alignment via CSS custom property with modifier overrides, separate axis gap support |
| `pathable-layout-composition.scss` | **MODIFY** | Add `@forward 'pathable-grid'` |

No other SCSS changes needed. No changes to `_utilities.scss`, any existing component wrappers, or the existing resolver infrastructure.