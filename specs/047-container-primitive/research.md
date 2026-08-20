# Research: Container Layout Primitive

**Feature**: Container Layout Primitive  
**Date**: 2026-08-20  
**Status**: Complete

## Research Tasks

### R1: Verify the `.pathable-container` SCSS Contract

**Decision**: The existing `.pathable-container` SCSS contract is verified and sufficient for Container's needs. No SCSS changes are required.

**Findings**:

The SCSS file `packages/styles/src/pathable-component-wrappers/pathable-container.scss` defines:

| Class | max-width | Behavior |
|-------|-----------|----------|
| `.pathable-container` (base) | `var(--pathable-container-max-width, 1024px)` | `width: 100%`, `margin-inline: auto`, `padding-inline: var(--pathable-container-gutter-x, var(--space-24))`, `box-sizing: border-box` |
| `.pathable-container--standard` | 1024px (explicit) | Sets `--pathable-container-max-width: 1024px` |
| `.pathable-container--wide` | 1280px | Sets `--pathable-container-max-width: 1280px` |
| `.pathable-container--full` | 100% | Sets `--pathable-container-max-width: 100%` |

The CSS custom property approach means the base class `.pathable-container` uses `var(--pathable-container-max-width, 1024px)` for its max-width. The modifier classes override the custom property value. When no modifier is applied, the default 1024px prevails.

The base class alone provides: full width, centering (`margin-inline: auto`), gutter padding (`padding-inline` using `--pathable-container-gutter-x`, defaulting to `var(--space-24)`), and border-box sizing.

**Verification**: Read `packages/styles/src/pathable-component-wrappers/pathable-container.scss` and confirmed the class names, CSS properties, and modifier conventions match the feature spec's assumptions.

### R2: Determine the Polymorphic `as` Pattern for Container

**Decision**: Implement a standard React polymorphic component pattern using TypeScript generics, without external polymorphic libraries.

**Rationale**: The `Box` component (slice 04) does not yet exist, so Container must establish the polymorphic `as` pattern that `Box` will later adopt. The pattern should be simple, standard, and avoid adding any new dependencies. A `React.ElementType` generic with `React.ComponentPropsWithoutRef` provides sufficient type safety for restricting void elements and constraining native props per element.

**Alternatives considered**:

1. **Use a polymorphic library (e.g., `@radix-ui/react-slot`, `react-polymorphic-box`)**: Rejected — adds a dependency for a pattern that can be implemented in ~15 lines of TypeScript. Container is simple enough that a library is unnecessary overhead.

2. **Skip `as` prop entirely — always render `<div>`**: Rejected — violates FR-002 and FR-003 from the spec. Container must support semantic HTML landmark elements (`<main>`, `<section>`, `<nav>`) for accessibility and SEO.

3. **Allow `as` but keep typing permissive (`React.ElementType` with no generic constraint)**: Rejected — fails to provide TypeScript safety (no narrowing of accepted props, no void-element prevention). FR-003 requires constraining props to those valid for the selected element.

**Pattern outline**:

```typescript
type ContainerProps<T extends React.ElementType = 'div'> = {
  as?: T
  size?: ContainerSize
  className?: string
  children?: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerOwnProps>
```

The generic `T` defaults to `'div'`, giving proper typing when `as` is omitted. When `as` is specified (e.g., `as="main"`), TypeScript narrows the allowed native props to those valid for `<main>`. Void elements (`input`, `img`, `br`, `hr`) are naturally prevented because `ComponentPropsWithoutRef` for those types does not include `children`.

### R3: Determine the `size` Resolver Approach

**Decision**: Use a local `CONTAINER_SIZE_CLASS` map within the Container component file rather than adding a new shared resolver.

**Rationale**: The `size` prop's value domain (`standard`, `wide`, `full`) maps to BEM modifier classes (`.pathable-container--standard`, etc.). This mapping is unique to Container — no other component shares this contract. The existing shared resolvers in `packages/react/src/internal/resolvers/` map utility classes (`pathable-maxw-desktop`, `pathable-width-full`), not component modifier classes.

Adding a shared resolver for a single-component concern would create an abstraction with no reuse, violating YAGNI. The mapping is a simple const lookup (3 entries), not a complex resolver that benefits from shared infrastructure.

**Pattern**:

```typescript
const CONTAINER_SIZE_CLASS: Record<ContainerSize, string> = {
  standard: 'pathable-container--standard',
  wide: 'pathable-container--wide',
  full: 'pathable-container--full',
}
```

When `size` is `undefined`, no modifier class is applied — only the base `pathable-container` class.

**Alternatives considered**:

1. **Add a shared `containerClass` resolver to the internal resolvers directory**: Rejected — over-abstracted. No other component maps to `.pathable-container--{modifier}` classes. Create a shared resolver only when a second consumer emerges.

2. **Use string interpolation (`pathable-container--${size}`) instead of a lookup map**: Rejected — a const map provides TypeScript exhaustiveness checking. String interpolation would silently produce invalid class names for unknown values.

### R4: Verify the Class Merge Order

**Decision**: Use the existing `mergeClasses` utility from `packages/react/src/internal/resolvers/mergeClasses.ts` with the documented order: base class → size modifier class → consumer `className`.

**Rationale**: The merge order is defined by the semantic-prop foundation (slice 01). `mergeClasses` already implements filtering of null/undefined/empty values and joins with spaces. It is the established pattern used by `Card`, `Button`, `Input`, `Select`, `Textarea`, and other components.

**Class merge order for Container**:

```
pathable-container                     (always, base)
pathable-container--{size}             (if size is defined)
{consumer className}                   (always last)
```

Consumer `className` is listed last so that it wins on equal CSS specificity — the established convention across all `@pathable/react` components.

### R5: Reference Implementation Study

**Decision**: Follow the established patterns from existing components but simplify since Container has no interactive behavior, no complex prop resolution, and no children manipulation.

**Reference components studied**:

- **Card** (`packages/react/src/components/Card/Card.tsx`): Demonstrates `mergeClasses` usage with multiple semantic props. Most complex, best reference for class composition.
- **Button** (`packages/react/src/components/Button/Button.tsx`): Demonstrates `SizingProps` extension and `mergeClasses` adoption from a simpler starting point.
- **Alert** (`packages/react/src/components/Alert/Alert.tsx`): Demonstrates a component with a typed variant prop and simple class mapping — closest analogue to Container's `size` prop.

**Key patterns adopted**:

1. Destructure props with `className` defaulting to empty string
2. Call `mergeClasses` with base class, modifier class, and consumer `className`
3. Spread remaining `{...rest}` native props on the root element after `className`
4. Render `{children}` as direct children with no intermediate wrapper
5. Use `React.forwardRef` for ref forwarding

## Summary

All unknowns are resolved. The implementation path is clear:

1. The SCSS contract is verified — no changes needed
2. A standard React polymorphic pattern (no library) handles `as` and ref forwarding
3. A local const map resolves `size` to modifier classes
4. `mergeClasses` handles class composition in the established order
5. Existing component patterns provide the implementation template

No blocking issues. No further research required.