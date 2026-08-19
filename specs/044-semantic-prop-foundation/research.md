# Research: Semantic Utility Type System and Class Resolvers

**Feature**: `specs/044-semantic-prop-foundation`
**Date**: 2026-08-19

## Decision 1: Test Runner

### Decision
Add **Vitest** as a devDependency to `packages/react` for unit-testing the resolver layer.

### Rationale

- **Consistent with build tooling**: The package already uses Vite as its bundler. Vitest is Vite-native, sharing the same config, transforms, and module resolution. No second config to maintain.
- **ESM-native**: Vitest supports ESM out of the box. The package is `"type": "module"` and all source uses `.js` extensions in imports.
- **TypeScript support**: Vitest runs TypeScript directly via Vite's transform pipeline. No separate TypeScript compiler configuration needed.
- **Watch mode**: Vitest has fast watch mode for development, which matters because the resolver layer will grow incrementally as downstream component features adopt semantic props.
- **Minimal overhead**: Vitest can run tests in Node without a browser (critical: resolvers are pure functions with zero DOM dependencies).

### Alternatives Considered

| Alternative | Assessment |
|-------------|------------|
| **Node `--test`** (native) | No extra dependency, but less ecosystem support for coverage reporting, watch mode, and IDE integration. Would need an additional coverage tool (c8/nyc). |
| **Jest** | Mature but slower than Vitest (no native ESM, requires transform config). Adds ts-jest or babel dependency. Redundant with existing Vite in the devDependency chain. |
| **Embedded assertions in build** | Would work for pure functions but gives no test-reporting story, no coverage tracking, and mixes test code with source. Violates spec requirement for "unit tests." |
| **Storybook-only testing** | Already exists in the repo, but resolvers produce no visual output. Running pure string transformations through Playwright+browser would be wasteful and slow. |

### Implementation Notes

- `vitest.config.ts` at `packages/react/vitest.config.ts` extending or mirroring the existing `vite.config.ts`
- Test files colocated with source in `src/internal/resolvers/__tests__/`
- Coverage target: 100% of resolver functions and class-merging function
- CI integration: new `test:unit` script in `packages/react/package.json`

---

## Decision 2: Internal Directory Structure

### Decision
Place all resolver code in `packages/react/src/internal/resolvers/`.

### Rationale

- Follows the existing `src/internal/date-picker/` precedent
- Colocated with the source it serves: resolvers are imported directly by components that adopt semantic props
- TypeScript includes all of `src/`, so internal code is type-checked and linted
- Not barrel-exported from `src/index.ts` — only reaches consumers through component usage
- Excluded from npm publish by the `"files": ["dist"]` field

### File Layout

```
packages/react/src/internal/resolvers/
├── index.ts              # Aggregates and re-exports all resolvers
├── types.ts              # All shared value types and capability interfaces
├── sizing.ts             # {width,minWidth,maxWidth} -> class mappings
├── spacing.ts            # {margin*, padding*} -> class mappings
├── display.ts            # {display} -> class mappings
├── alignment.ts          # {alignItems,justifyContent,textAlign} -> class mappings
├── visibility.ts         # (placeholder — no current Utilities; records gap)
├── flexGrid.ts           # {flex} -> class mappings
├── typography.ts         # {fontFamily,fontWeight,textColor,textAlign} -> class mappings
├── colorTone.ts          # {backgroundColor,textColor} -> class mappings
├── mergeClasses.ts       # Class-merging utility
├── conflictPolicy.md     # Conflict resolution documentation
└── __tests__/            # Unit tests (colocated)
    ├── sizing.test.ts
    ├── spacing.test.ts
    ├── display.test.ts
    ├── alignment.test.ts
    ├── flexGrid.test.ts
    ├── typography.test.ts
    ├── colorTone.test.ts
    └── mergeClasses.test.ts
```

---

## Decision 3: Resolver Naming Convention

### Decision
Resolvers named `{semanticPropName}Class()` where `semanticPropName` is the camelCase interface property name (e.g., `widthClass`, `marginTopClass`, `displayClass`).

### Rationale

- Directly reflects the prop name component authors will use
- Self-documenting: `widthClass('full')` needs no explanation
- Resolves the `pathable-text` prefix collision: three resolvers (`textColorClass`, `fontWeightClass`, `textAlignClass`) share the same class prefix but have unambiguous names by CSS property

### Alternatives Considered

| Alternative | Assessment |
|-------------|------------|
| `resolveWidth()` prefix | Verbose; `widthClass` is shorter and equally clear |
| Single `classResolver('width', 'full')` hub | Loses type safety; would need runtime dispatch; harder to test individually |
| `textClass()` for all text utilities | Ambiguous — `textClass('center')` could be text alignment or text color "center" (if one existed) |

---

## Decision 4: Class-Merging Order

### Decision
Order: `required component classes` → `resolved semantic classes` → `consumer className`.

### Rationale

1. **Component classes first**: The component owns its base identity. If a component applies `pathable-card`, semantic props add modifiers and a consumer can override.
2. **Semantic classes after base**: Semantic props are intentional, component-level choices — more specific than the base but less specific than a direct consumer override.
3. **Consumer `className` last**: CSS cascade means the last class in the `class` attribute wins on specificity-equivalent properties. The consumer must have the final say.

### Conflict Policy

When two semantic props target the same CSS property space (e.g., `margin` shorthand and `marginTop` directional):

- **Directional wins over shorthand** for the axis it controls
- Example: `margin="2" marginTop="4"` → shorthand `margin-2` sets all sides, then `marginTop-4` overrides the top edge through CSS cascade order
- If two props resolve to the exact same class string, the duplicate has no effect (harmless)

---

## Decision 5: Value Type Enum Sourcing

### Decision
Value type enums are derived from the actual SCSS `$pathable-utilities` map values, NOT from visual inspection of built CSS or assumptions.

### Rationale

- Single source of truth: the SCSS config map is the authoritative definition
- Value sets change only when SCSS changes, which is a deliberate reviewable event
- Avoids the class of bug where a CSS class exists in the SCSS source but the resolver doesn't know about it (or vice versa)

### Process

1. For each module in `$pathable-utilities`, extract the map keys from `values`
2. Map SCSS-value names to TypeScript string-literal-union members
3. Record any SCSS values that don't follow the expected pattern in a gap document

---

## Decision 6: TypeScript Strictness

### Decision
Use TypeScript exhaustive checks for resolvers. Every resolver MUST use a `Record` or `switch` with a `never` fallback to catch missing cases at compile time.

### Rationale

- `tsconfig.json` already has `"strict": true`
- If a new value is added to the value type union, any resolver that doesn't handle it will fail typecheck → CI blocks merge
- This is the cheapest way to enforce the "resolver must handle all values" requirement without runtime tests

### Pattern

```typescript
const WIDTH_MAP: Record<Width, string> = {
  "auto": "pathable-width-auto",
  "full": "pathable-width-full",
} as const;

export function widthClass(value?: Width | null): string | undefined {
  if (value == null) return undefined;
  return WIDTH_MAP[value] ?? undefined;
}
```

The `as const` on the map and `Record<Width, string>` ensures TypeScript will error if the map is missing any union member.

---

## Decision 7: Responsive Variant Handling

### Decision
Responsive variants are NOT supported in the initial resolver layer. Resolvers map semantic values to base class strings only.

### Rationale

- The spec does not mention responsive variants
- Responsive props introduce additional complexity (breakpoint-aware types, compound class generation) that is better served by a dedicated follow-up feature
- Component authors who need responsive behavior can use the `className` escape hatch or compose multiple components with appropriate breakpoint overrides
- Adding responsive support later is a pure extension: the base resolver API doesn't change; only new resolver functions or optional parameters are added

---

## Decision 8: Gap Handling for Missing Utilities

### Decision
Gaps (desired semantic roles without matching utility classes) are documented but no stubs or placeholder resolvers are created.

### Rationale

- Spec FR-002 requires gap documentation, not gap filling
- A resolver that returns `undefined` for every value defeats the purpose
- The inventory document serves as the gap tracker; when SCSS utilities are added, corresponding resolvers are added in a follow-up feature
- This keeps the feature scope tightly bounded and avoids dead code

### Known Gaps (from inventory)

| Desired Capability | Gap |
|-------------------|-----|
| min-width | No utility class exists |
| Visibility (visibility, opacity, z-index) | No utility classes exist |
| Font size, line-height, letter-spacing, text-transform, text-decoration | No utility classes exist |
| Grid (grid-template, grid-column, grid-row, place-*, gap) | No utility classes exist |
| Individual flex properties (grow, shrink, basis) | Only `flex-1` and `flex-fill` shorthand exists |
| Padding/margin directional (left, right, bottom for padding; left, right for margin) | Only padding-x, padding-y, margin-x, margin-y, margin-top, margin-bottom exist |

---

## Decision 9: No `pathable` Class Prefix in Resolver Output Tests

### Decision
Resolver tests assert exact class strings (e.g., `"pathable-width-full"`). No pattern-based matching (e.g., `/pathable-width-/`) is used.

### Rationale

- Exact assertions catch prefix changes, value renames, and SCSS reorgs immediately
- Pattern matching could silently pass if the prefix changes without updating the resolver
- The overhead of updating exact strings when CSS classes change is deliberate: it forces conscious review