# Resolver API Contracts

**Feature**: `specs/044-semantic-prop-foundation`
**Package**: `packages/react` (internal, non-exported)

## Contract Overview

These contracts define the interface boundaries for the internal resolver layer. All exports are private to `packages/react/src/internal/resolvers/` — they are NOT part of the `@pathableai/react` public API.

## Resolver Function Contract

Every resolver function MUST conform to this contract:

```typescript
// Contract: Resolver<InputType, OutputType>
type Resolver<T extends string, C extends string> = (value?: T | null) => C | undefined
```

### Preconditions

- `value` is typed as `T | undefined | null` where `T` is a string-literal union of verified SCSS values

### Postconditions

| Input | Output | Notes |
|-------|--------|-------|
| Valid member of `T` | `C` (class string) | Deterministic; same input → same output always |
| `undefined` | `undefined` | No default value is assumed |
| `null` | `undefined` | Treated identically to `undefined` |
| Invalid string (not in `T`) | `undefined` | TypeScript prevents this at compile time; runtime safety via fallback |

### Purity Contract

- No reference to `window`, `document`, `navigator`, `localStorage`, or any browser-only global
- No network access, file I/O, or async operations
- No mutable state (no `let`, no module-level non-`const` variables)
- Identical output for identical input across server and client

### Implementation Contract

Every resolver MUST use a statically-declared `Record<T, C>` mapping object with `as const` assertion:

```typescript
const MAP = {
  "value-a": "pathable-prefix-value-a",
  "value-b": "pathable-prefix-value-b",
} as const satisfies Record<ValueType, string>

export function valueClass(value?: ValueType | null): string | undefined {
  if (value == null) return undefined
  return MAP[value]
}
```

## Class-Merge Function Contract

```typescript
// Contract: mergeClasses(...sources: (string | undefined | null)[]): string | undefined
```

### Preconditions

- Accepts any number of sources, each being a string, `undefined`, or `null`

### Postconditions

| Input | Output |
|-------|--------|
| All sources `undefined`/`null` | `undefined` |
| At least one non-empty source | Space-joined string of all non-empty sources in order |
| Source order | `mergeClasses(base, semantic, consumer)` → `"base semantic consumer"` |

### Merge Order Guarantee

1. **Required component classes** (first argument): always appear first
2. **Resolved semantic classes** (subsequent arguments): in the order the resolver calls are made
3. **Consumer `className`** (final argument): always appear last

The merge order is fixed; callers choose what to pass, but the function never reorders.

## Conflict Policy Contract

### Shorthand vs Directional

When both a shorthand and directional prop resolve to classes affecting the same property, the directional prop's class is emitted after the shorthand's class. CSS cascade ensures the later class wins on equal specificity.

Example:
```typescript
// margin="2" marginTop="4"
mergeClasses(base, marginAllClass("2"), marginTopClass("4"), consumer)
// Output: "base-class pathable-margin-2 pathable-margin-top-4 consumer-class"
// Result: margin-top is 4, other margins are 2
```

### Duplicate Classes

If two resolvers produce the same class string, the duplicate is harmless — CSS applies the same declaration twice.

### Consumer Override

If a consumer `className` includes a class that is also produced by a resolver, the consumer's version appears last and wins. This is the intended "escape hatch" behavior.

## Inventory Document Contract

The inventory document at `packages/react/docs/capability-inventory.md` MUST:

1. List every verified utility module from `src/_utilities.scss` with:
   - Module key (SCSS map key)
   - Emitted class prefix
   - CSS property(ies)
   - Complete value enumeration
   - Responsive availability (boolean)
   - State variant availability (list or empty)
   - Owning SCSS source file

2. Include a "Gaps" section enumerating desired semantic capabilities that lack utility classes

3. Be checked into source and versioned alongside the resolver code

## Package Boundary Contract

### Internal Isolation

- `src/internal/resolvers/index.ts` is the internal barrel — it aggregates all resolver modules for internal import
- `src/index.ts` (the public entry point) MUST NOT import or re-export anything from `src/internal/resolvers/`
- A package-content test MUST verify that no resolver type or function appears in the public build output

### Build Verification

```
$ pnpm --filter @pathableai/react build
$ grep -r "widthClass\|mergeClasses\|SizingProps" packages/react/dist/
# Expected: no matches
```