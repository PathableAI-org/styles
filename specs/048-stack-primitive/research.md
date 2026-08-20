# Research: Stack Layout Primitive

**Feature**: Stack Layout Primitive
**Date**: 2026-08-20

## SCSS Contract Verification

### `.pathable-stack` component wrapper

**File**: `packages/styles/src/pathable-component-wrappers/pathable-stack.scss`

The contract is verified and complete. It provides:

| Concept | Class | Behavior |
|---------|-------|----------|
| Base | `.pathable-stack` | `display: flex; flex-direction: column; gap: var(--pathable-stack-gap, var(--space-16))` |
| Gap: small | `.pathable-stack--gap-sm` | `--pathable-stack-gap: var(--space-8)` → 8px |
| Gap: medium | `.pathable-stack--gap-md` | `--pathable-stack-gap: var(--space-16)` → 16px (default) |
| Gap: large | `.pathable-stack--gap-lg` | `--pathable-stack-gap: var(--space-24)` → 24px |
| Gap: extra large | `.pathable-stack--gap-xl` | `--pathable-stack-gap: var(--space-32)` → 32px |

The contract uses CSS custom properties (`--pathable-stack-gap`) to set the gap, and modifier classes override this property. This means:
- When no gap modifier class is applied, the default `var(--space-16)` value applies (16px gap).
- Modifier classes set the custom property to a different spacing token.
- The `gap` property itself is always active — it's the custom property value that changes.

**Decision**: Use a local `STACK_GAP_CLASS` record in the component, following the same pattern as `Container`'s `CONTAINER_SIZE_CLASS`. No resolver module needed — the gap domain is unique to Stack.

**Rationale**: The gap values are named (`sm`, `md`, `lg`, `xl`) and map one-to-one to modifier class suffixes. A club-type record is the simplest, most maintainable approach. Creating a shared resolver module would introduce unnecessary indirection for a 4-entry map used by a single component.

**Alternatives considered**:
- Shared resolver module (`gap.ts` in `internal/resolvers/`): Over-engineering. The gap concept is unique to Stack and its 4 values won't be reused by other primitives (Inline/Cluster use a different gap contract with their own `--pathable-cluster-gap` custom property names).
- Numeric scale values (`gap="4"`): Rejected. The SCSS contract uses semantic names, not numbers. A numeric-to-name mapping layer would add complexity without benefit.

### `.pathable-flex-align-{value}` utility classes

**File**: `packages/styles/src/_utilities.scss`

The existing `align-items` utility module is verified and complete. It generates these classes:

| Value | Class |
|-------|-------|
| `center` | `.pathable-flex-align-center` |
| `start` | `.pathable-flex-align-start` |
| `end` | `.pathable-flex-align-end` |
| `stretch` | `.pathable-flex-align-stretch` |
| `baseline` | `.pathable-flex-align-baseline` |

These classes are already consumed by the internal resolver `alignItemsClass` in `packages/react/src/internal/resolvers/alignment.ts`.

**Decision**: Use the existing `alignItemsClass` resolver without modification.

**Rationale**: The resolver already maps all 5 values to their correct class names. No new code needed in the resolver layer. The `Stack` component calls `alignItemsClass(align)` and passes the result through `mergeClasses`.

**Alternatives considered**: A local map in the component. Rejected — reusing the existing resolver follows the DRY principle and ensures consistency if alignment utilities are ever extended.

### `.pathable-flex-justify-{value}` utility classes

These exist in the same utility module but are **excluded from Stack's scope**. The spec explicitly excludes `justify` from the initial release. The `justify-content` utilities will be available for future addition if real usage demonstrates a need.

## Resolver Reuse Analysis

### Sizing props (`SizingProps`)

**Resolver files**: `packages/react/src/internal/resolvers/sizing.ts`

Available resolvers and their class patterns:

| Resolver | Prop Type | Example Value → Class |
|----------|-----------|----------------------|
| `widthClass` | `Width` | `"full"` → `pathable-width-full`, `"auto"` → `pathable-width-auto` |
| `maxWidthClass` | `MaxWidth` | `"tablet"` → `pathable-maxw-tablet`, `"desktop"` → `pathable-maxw-desktop` |

Note: The spec says `Stack` accepts `width`, `maxWidth`, and `minWidth` from `SizingProps`. However, looking at the existing `SizingProps` interface:

```typescript
export interface SizingProps {
  width?: Width
  maxWidth?: MaxWidth
}
```

There is no `minWidth` in the current `SizingProps` interface and no `minWidthClass` resolver. The spec's reference to `minWidth` in the prop list is based on the parent plan's vision, but the implementation must work with what exists.

**Decision**: Accept `width` and `maxWidth` from the existing `SizingProps`. If `minWidth` is needed, it would require extending `SizingProps` and adding a `minWidthClass` resolver — which is out of scope for this feature.

**Rationale**: Follow what exists. The `width` and `maxWidth` resolvers are ready. Adding `minWidth` would require changes to both `internal/resolvers/sizing.ts` and `internal/resolvers/types.ts` — that work belongs in a separate feature to extend the capability system.

### Spacing props (`SpacingProps`)

**Resolver files**: `packages/react/src/internal/resolvers/spacing.ts`

Available resolvers: `marginAllClass`, `marginXClass`, `marginYClass`, `marginTopClass`, `marginBottomClass`.

All use the numeric `SpacingScale` values (`'0'`–`'10'`, `'15'`), with margin resolvers also accepting `'auto'`.

**Decision**: Accept all external margin props from the existing `SpacingProps` interface.

**Rationale**: External spacing (margin) is safe to share because it describes how a component participates in surrounding layout. Internal spacing (padding) is excluded per the spec — padding changes internal geometry and is not needed for Stack's contract.

### Alignment props (`AlignmentProps`)

The existing `AlignmentProps` interface includes `alignItems` and `justifyContent`. The spec only requires `alignItems` (exposed as the `align` prop). `justifyContent` is explicitly excluded.

**Decision**: Use `alignItemsClass` directly rather than consuming the full `AlignmentProps` interface. This avoids exposing `justifyContent` through the component API.

**Rationale**: Explicit prop declaration (not interface extension) gives us fine-grained control over which alignment properties Stack exposes.

## Polymorphic Pattern (Established by Container)

Container established the polymorphic `as` pattern in `packages/react/src/components/Container/Container.tsx`. The pattern is:

1. `as?: ElementType` prop
2. `ContainerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>`
3. `forwardRef<HTMLElement, ContainerProps>`
4. Internal function component with `ref: React.ForwardedRef<HTMLElement>`
5. `const Component = as ?? 'div'` to resolve the element

**Decision**: Follow this exact pattern. No shared polymorphic helper exists yet — and creating one would be premature abstraction for the second component using the pattern. If a third component (`Box`) also needs it, extracting a helper becomes worthwhile.

**Rationale**: Container's pattern is working, tested, and understood. Copying the pattern (not the code — just the structure) is appropriate at this stage. The spec already notes this dependency (FR-026).

## Class Merge Order

The documented class merge order for Stack is:

1. `.pathable-stack` (base class)
2. `.pathable-stack--gap-{size}` (gap modifier, if applicable)
3. `.pathable-flex-align-{value}` (alignment utility, if applicable)
4. Resolved sizing utility classes (`pathable-width-*`, `pathable-maxw-*`)
5. Resolved spacing utility classes (`pathable-margin-*`, `pathable-margin-x-*`, etc.)
6. Consumer `className` (last, for intentional overrides)

**Decision**: Follow this order exactly. Use `mergeClasses` with all sources passed in order.

**Rationale**: This order matches the general principle: base → modifiers → utilities → consumer. Sizing/spacing utilities come after alignment because they are less specific to the component's core semantics. Consumer `className` is always last.

## No Shared Type Helper for Stack Props

`StackProps` will be a standalone interface because:
- It combines 3 capability domains (local gap, alignment resolver, `SizingProps`/`SpacingProps`)
- It should not accidentally inherit `justifyContent` from `AlignmentProps`
- Explicit type definition makes the component's contract clear

**Decision**: Define `StackProps` as a standalone interface that extends `Omit<React.HTMLAttributes<HTMLElement>, 'color'>` and includes `SizingProps` and `SpacingProps` via intersection.

## Testing Strategy

Tests follow the Container test pattern with Stack-specific coverage:

1. **Gap class mapping**: Test each `gap` value → correct modifier class
2. **Align class mapping**: Test each `align` value → correct utility class
3. **No wrapper**: Assert exactly one root element exists
4. **Class merge order**: Verify consumer `className` appears last
5. **No gap, no align**: Omitted props produce no extra classes
6. **Sizing props**: `width`, `maxWidth` → correct utility classes
7. **Spacing props**: `margin*` → correct utility classes
8. **Ref forwarding**: `ref.current` is the root DOM element
9. **as prop**: Element tag changes, children render inside
10. **Native props**: `id`, `data-*`, `aria-*` passthrough
11. **SSR parity**: Server-rendered output matches client
12. **Immediate-child contract**: A wrapper between Stack and children breaks gap relationship (component test, not unit test)