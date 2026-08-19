# Class-Conflict Resolution Policy

**Feature**: `specs/044-semantic-prop-foundation`
**Package**: `packages/react/src/internal/resolvers/`

## Merge Order

Classes are composed in a fixed order:

1. **Required component/primitive classes** (first argument)
2. **Resolved semantic classes** (subsequent arguments, in the order they are resolved)
3. **Consumer `className`** (final argument)

The merge order is fixed by `mergeClasses()`; callers choose what to pass in each position, but the function never reorders.

## Conflict Resolution

### Shorthand vs Directional Props

When both a shorthand prop (e.g., `margin`) and a directional prop (e.g., `marginTop`) are specified, the directional prop's class is emitted **after** the shorthand's class. CSS cascade means the later class wins on equal specificity.

**Example**:

```typescript
// margin="2" marginTop="4"
mergeClasses(
  "pathable-card",         // component base
  marginAllClass("2"),     // pathable-margin-2 (all sides = 2)
  marginTopClass("4"),     // pathable-margin-top-4 (top = 4)
  undefined                // consumer className
)
// Output: "pathable-card pathable-margin-2 pathable-margin-top-4"
// Result: margin-top is 4, other margins are 2
```

### Duplicate Classes

If two resolvers produce the same class string, the duplicate in the output is harmless — CSS applies the same declaration twice with no change in result.

### Consumer Override

If a consumer's `className` includes a class that is also produced by a resolver, the consumer's version appears **last** in the class attribute and wins on equal specificity. This is the intended escape hatch: when a consumer needs behavior not covered by semantic props, they use `className` directly.

### Empty/Missing Values

All empty strings, `undefined`, and `null` values are filtered out by `mergeClasses()`. A value that resolves to `undefined` (e.g., an unrecognized prop value) simply doesn't appear in the output.

## Props vs Classes at Call Time

Conflict resolution is determined by **call order** within `mergeClasses()`. Component authors are responsible for passing directional prop classes after shorthand prop classes when both are supported. The utility itself does not reorder or inspect class names.