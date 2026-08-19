# Data Model: Card Sizing and Spacing Props

**Feature**: specs/045-card-sizing-spacing
**Date**: 2026-08-19

## Entities

### Card Component Props

The `Card` component's public API is extended with two capability interfaces. All new props are optional — omitting them preserves current Card behavior.

| Prop | Type | Source Interface | Resolver | Example Class Output |
|---|---|---|---|---|
| `width` | `Width` (`'auto'` \| `'full'`) | `SizingProps` | `widthClass` | `pathable-width-full` |
| `maxWidth` | `MaxWidth` (`'mobile'` \| `'mobile-lg'` \| `'tablet'` \| `'desktop'`) | `SizingProps` | `maxWidthClass` | `pathable-maxw-tablet` |
| `margin` | `SpacingScale \| 'auto'` | `SpacingProps` | `marginAllClass` | `pathable-margin-4` |
| `marginX` | `SpacingScale \| 'auto'` | `SpacingProps` | `marginXClass` | `pathable-margin-x-auto` |
| `marginY` | `SpacingScale` | `SpacingProps` | `marginYClass` | `pathable-margin-y-2` |
| `marginTop` | `SpacingScale` | `SpacingProps` | `marginTopClass` | `pathable-margin-top-0` |
| `marginBottom` | `SpacingScale` | `SpacingProps` | `marginBottomClass` | `pathable-margin-bottom-8` |

### SpacingScale Values

```text
'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '15'
```

Plus `'auto'` for `margin` and `marginX` only.

### Existing Card Props (unmodified)

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Heading content |
| `footer` | `ReactNode` | Footer content |
| `media` | `ReactNode` | Media slot (image, icon) |
| `presentation` | `CardPresentation` | `'base'` \| `'media'` \| `'flag'` \| `'header-first'` \| `'workflow'` |
| `metadata` | `ReactNode` | Workflow metadata |
| `status` | `ReactNode` | Status indicator |
| `actions` | `ReactNode` | Action buttons |
| `className` | `string` | Consumer CSS class |
| `children` | `ReactNode` | Body content |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | Native HTML attributes, event handlers, ref |

## Class Merge Order

Classes on the Card root element follow this fixed order:

```
pathable-card → presentation variant class → resolved semantic classes → consumer className
```

The `mergeClasses` utility enforces this order. The consumer `className` always appears last, giving it the highest effective specificity on equal CSS specificity.

## Conflict Rules

| Scenario | Behavior |
|---|---|
| `margin` + `marginTop` both specified | `marginAllClass` resolves first, `marginTopClass` resolves after — directional class wins on equal CSS specificity |
| `marginX` + `margin` both specified | `marginAllClass` resolves first, `marginXClass` resolves after — `marginX` values override horizontal sides |
| Semantic prop omitted | Resolver returns `undefined`; `mergeClasses` filters it out — no class emitted |
| Unrecognized value | TypeScript rejects at compile time; runtime returns `undefined` (no crash) |

## Invariants

1. Card always renders exactly one root `<div>` element — no extra wrappers
2. Card's internal DOM structure (`pathable-card__header`, `pathable-card__body`, `pathable-card__footer`, `pathable-card__container`, `pathable-card__media`, `pathable-card__meta`, `pathable-card__action`) is unchanged
3. Ref forwarding points to the root `<div>`
4. All native HTML attributes pass through to the root element
5. Server-rendered output is identical to client-rendered output for all prop combinations