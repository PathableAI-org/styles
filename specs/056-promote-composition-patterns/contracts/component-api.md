# Component API Contracts: Promote Repeated Composition Patterns

**Feature**: 056-promote-composition-patterns
**Date**: 2026-08-24

## Overview

Each contract defines the public TypeScript interface for one promoted composition primitive. All components follow the existing `forwardRef` pattern established by `Container`, `Stack`, `Inline`, `Cluster`, and `Surface`.

---

## CardGrid

```typescript
import type { ElementType, ReactNode, HTMLAttributes } from 'react'

export type CardGridVariant = 'cluster' | 'auto-fit'

export type CardGridClusterGap = 'sm' | 'md' | 'lg' | 'xl'
export type CardGridAutoGap = 'sm' | 'md' | 'lg'

export interface CardGridProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Layout mode. "cluster" uses flex-wrap (Cluster + Surface composition).
   *  "auto-fit" uses CSS Grid auto-fill for fixed-minimum card width. */
  variant?: CardGridVariant

  /** Gap between cards. In cluster mode, maps to pathable-cluster gap scale
   *  (sm=4px, md=8px, lg=16px, xl=24px, default: "md").
   *  In auto-fit mode, maps to pathable-card-grid gap scale
   *  (sm=16px, md=24px, lg=32px, default: "md"). */
  gap?: CardGridClusterGap | CardGridAutoGap

  /** Polymorphic root element override. */
  as?: ElementType

  /** Consumer class name appended after design-system classes. */
  className?: string

  /** Card children. In cluster mode, each child receives pathable-surface
   *  visual treatment. In auto-fit mode, children are rendered directly. */
  children?: ReactNode
}

export const CardGrid: React.ForwardRefExoticComponent<
  CardGridProps & React.RefAttributes<HTMLElement>
>
```

**Underlying element**: `<div>`

**SSR**: Yes — static CSS classes only, no client-side measurement.

---

## Page

```typescript
import type { ElementType, ReactNode, HTMLAttributes } from 'react'

export type PageSize = 'standard' | 'wide' | 'full'
export type PageGap = 'sm' | 'md' | 'lg' | 'xl'

export interface PageProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Page width constraint. Maps to Container sizes:
   *  standard=1024px, wide=1280px, full=100%. Default: "standard". */
  size?: PageSize

  /** Vertical gap between page sections. Maps to pathable-stack gap scale
   *  (sm=8px, md=16px, lg=24px, xl=32px). Default: "md". */
  gap?: PageGap

  /** Polymorphic root element override. Default: "main" (landmark role). */
  as?: ElementType

  /** Consumer class name applied to the Container element. */
  className?: string

  /** Page content sections. Each child is a direct child of the Stack. */
  children?: ReactNode
}

export const Page: React.ForwardRefExoticComponent<
  PageProps & React.RefAttributes<HTMLElement>
>
```

**Underlying element**: `<main>` (default, for landmark semantics)
**Internal composition**: `Container` → `Stack` → children

---

## SidebarLayout

```typescript
import type { ReactNode, HTMLAttributes } from 'react'

export type SidebarRatio = '1-1' | '2-1' | '3-1' | '4-1'

export interface SidebarLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Column width ratio (main:sidebar). Default: "3-1". */
  ratio?: SidebarRatio

  /** When true, sidebar renders before main content in DOM order.
   *  Default: false (main before sidebar). */
  sidebarFirst?: boolean

  /** When true, sidebar is wrapped in a sticky container
   *  (pathable-sticky-panel). Default: false. */
  sidebarSticky?: boolean

  /** Consumer class name appended after design-system classes. */
  className?: string

  /** Two children: first is main content, second is sidebar content.
   *  If sidebarFirst is true, the order is reversed. */
  children: ReactNode
}

export const SidebarLayout: React.ForwardRefExoticComponent<
  SidebarLayoutProps & React.RefAttributes<HTMLDivElement>
>
```

**Underlying element**: `<div>` (with `pathable-sidebar-layout` CSS Grid)
**Internal semantics**: `<main>` for main content, `<aside>` for sidebar
**Responsive**: Collapses to single column at ≤1023px (SCSS-driven)
**Compound sub-components**: N/A — uses direct children slot pattern (first = main, second = sidebar).

---

## SplitLayout

```typescript
import type { ElementType, ReactNode, HTMLAttributes } from 'react'

export type SplitRatio = '1-1' | '1-2' | '2-1' | '1-3'
export type SplitAlign = 'center' | 'start' | 'end' | 'stretch'

export interface SplitLayoutProps
  extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Column ratio (left:right). Default: "1-1". */
  ratio?: SplitRatio

  /** Vertical alignment of columns. Default: "center". */
  align?: SplitAlign

  /** Polymorphic root element override. */
  as?: ElementType

  /** Consumer class name appended after design-system classes. */
  className?: string

  /** Exactly two children: left panel, right panel. */
  children: ReactNode
}

export const SplitLayout: React.ForwardRefExoticComponent<
  SplitLayoutProps & React.RefAttributes<HTMLElement>
>
```

**Underlying element**: `<div>` (with `pathable-split` CSS Grid)
**Responsive**: Collapses to single column at ≤1023px (SCSS-driven)

---

## FormStack

```typescript
import type { ElementType, ReactNode, FormHTMLAttributes } from 'react'

export type FormStackGap = 'sm' | 'md' | 'lg' | 'xl'
export type FormStackMaxWidth = 'tablet' | 'content'

export interface FormStackProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'color'> {
  /** Vertical gap between form fields. Maps to pathable-stack gap scale
   *  (sm=8px, md=16px, lg=24px, xl=32px). Default: "md". */
  gap?: FormStackGap

  /** Optional maximum width for form readability.
   *  tablet = 640px, content = 768px. */
  maxWidth?: FormStackMaxWidth

  /** Polymorphic root element override. Default: "form". */
  as?: ElementType

  /** Consumer class name appended after design-system classes. */
  className?: string

  /** Form field children (typically FormGroup components). */
  children?: ReactNode
}

export const FormStack: React.ForwardRefExoticComponent<
  FormStackProps & React.RefAttributes<HTMLFormElement>
>
```

**Underlying element**: `<form>` (default, for form semantics)
**Internal composition**: Stack for vertical spacing, plus optional `maxWidth` class

---

## Shared Conventions

All five components follow these conventions inherited from existing primitives:

1. **`forwardRef`**: All use `React.forwardRef` with a typed ref.
2. **`mergeClasses`**: All call `mergeClasses` from `internal/resolvers` to assemble the final className string, ordered: base → modifier → resolver → consumer className.
3. **`className` override**: Always appended last, after all design-system classes.
4. **`as` prop**: Polymorphic root element override using `ElementType`, defaulting to the semantically correct HTML element for the primitive's role.
5. **SSR parity**: All classes are computed statically from props — no `useLayoutEffect`, `ResizeObserver`, or client-only state.
6. **No internal layering**: Each primitive adds at most one `<div>` wrapper beyond its composed sub-primitives. The rendered output should be as flat as possible.
7. **Props extend `Omit<HTMLAttributes<HTMLElement>, 'color'>`**: The `color` key is always omitted to avoid conflicts with design-system tone/color props.