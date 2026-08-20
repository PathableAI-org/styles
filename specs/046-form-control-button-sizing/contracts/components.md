# Component Sizing Contracts

**Feature**: specs/046-form-control-button-sizing
**Date**: 2026-08-20

## Interface Contract: `SizingProps`

Each component in this feature extends the shared `SizingProps` interface defined in `packages/react/src/internal/resolvers/types.ts`.

```typescript
import { SizingProps } from '../../internal/resolvers/types'

// Used as a type intersection with each component's existing props:
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & SizingProps & { /* existing */ }

export type InputProps = InputHTMLAttributes<HTMLInputElement> & SizingProps & { children?: never }

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & SizingProps

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & SizingProps & { children?: never }
```

## Contract: Class Merge Order

Every component in this feature follows the same class-merge contract using `mergeClasses` from `packages/react/src/internal/resolvers/mergeClasses.ts`.

### Fixed Order

```
required component class(es) → resolved semantic classes → consumer className
```

### Per-Component Merge Contract

| Component | Required Classes | Semantic Classes | Consumer |
|---|---|---|---|
| Button | `pathable-button`, variantClass, sizeClass | `widthClass(width)`, `maxWidthClass(maxWidth)` | `className` |
| Input | `pathable-input` | `widthClass(width)`, `maxWidthClass(maxWidth)` | `className` |
| Select | `pathable-select` | `widthClass(width)`, `maxWidthClass(maxWidth)` | `className` |
| Textarea | `pathable-textarea` | `widthClass(width)`, `maxWidthClass(maxWidth)` | `className` |

## Contract: No Wrapper Elements

None of the four components introduces a new DOM element to carry sizing classes. Sizing classes are applied to the existing root element:

| Component | Root Element | Sizing Classes Applied To |
|---|---|---|
| Button | `button type="button"` | The button element itself |
| Input | `input` | The input element itself |
| Select | `select` | The select element itself |
| Textarea | `textarea` | The textarea element itself |

## Contract: SSR Determinism

- All sizing props resolve via pure functions (`widthClass`, `maxWidthClass`) with zero browser-only globals.
- The resolver output is identical during server-side rendering and client-side hydration.
- No `useEffect`, `useLayoutEffect`, or client-only logic is introduced to resolve sizing props.

## Contract: Ref Forwarding

- Components that currently do not use `React.forwardRef` (Button, Input, Select, Textarea) remain unchanged in their ref-forwarding behavior.
- Sizing props do not introduce or require ref forwarding changes.

## Contract: Native Prop Passthrough

- All existing native HTML attributes (`id`, `data-*`, `aria-*`, `disabled`, `placeholder`, `type`, `value`, event handlers) pass through to the root element unchanged.
- Sizing props are extracted by the component and not spread onto the root element as raw HTML attributes.
- The TypeScript interface ensures `width` and `maxWidth` are typed and not passed to the DOM as attributes.