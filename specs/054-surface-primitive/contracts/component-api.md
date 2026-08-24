# Component API Contract: Surface

## Exported Component

**Package**: `@pathableai/react`
**Export name**: `Surface`
**Import**: `import { Surface } from '@pathableai/react';`

## Props

```typescript
type SurfaceElevation = 'sm' | 'md' | 'lg' | 'xl';

interface SurfaceProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    SizingProps,
    Omit<SpacingProps, 'padding' | 'paddingX' | 'paddingY'> {
  /** Semantic surface treatment. Selects coordinated foreground, background,
   *  and border. Value type is the shared SurfaceTone union. */
  variant?: SurfaceTone;
  /** Semantic boundary meaning. Refines the border color. */
  borderTone?: BorderTone;
  /** Verified elevation step. Maps to --elevation-*. */
  elevation?: SurfaceElevation;
  /** Polymorphic element override. Defaults to 'div'. */
  as?: ElementType;
  /** Consumer class name. Appended after design-system classes. */
  className?: string;
  /** Surface content. */
  children?: React.ReactNode;
  /** Inline style escape hatch. */
  style?: React.CSSProperties;
}
```

### Excluded Props

- `color`, `background`, `backgroundColor`, `borderColor` — Not supported.
  Use `className` or `style` as the escape hatch.
- `boxShadow` / arbitrary shadow — Not supported. Elevation is limited to the
  verified `sm | md | lg | xl` steps.
- `padding`, `paddingX`, `paddingY` — Not supported (external spacing only).
  Use a nested element, `className`, or `style` for internal spacing.

## Rendered Output

```html
<!-- variant="subtle" -->
<div class="pathable-surface pathable-surface--tone-subtle">Content</div>

<!-- variant="primary" elevation="md" -->
<div class="pathable-surface pathable-surface--tone-primary pathable-surface--elevation-md">Content</div>

<!-- variant="default" borderTone="danger" -->
<div class="pathable-surface pathable-surface--tone-default pathable-surface--border-danger">Content</div>

<!-- as="section" variant="default" width="full" marginX="auto" className="custom" -->
<section class="pathable-surface pathable-surface--tone-default pathable-width-full pathable-margin-x-auto custom">Content</section>
```

## Class Resolution Contract

The class list on the root element is resolved in this deterministic order:

1. `.pathable-surface` — base class (always present)
2. `.pathable-surface--tone-{variant}` — tone modifier (if `variant`)
3. `.pathable-surface--elevation-{n}` — elevation modifier (if `elevation`)
4. `.pathable-surface--border-{tone}` — border-tone modifier (if `borderTone`)
5. resolved sizing/spacing classes (if provided)
6. `className` prop value (if provided)

`mergeClasses()` handles deduplication, whitespace normalization, and falsy
value filtering.

## Ref Forwarding

`Surface` forwards a ref to the rendered element:

```tsx
const ref = useRef<HTMLDivElement>(null);
<Surface variant="subtle" ref={ref}>Panel</Surface>
// ref.current is the <div> element
```

## SCSS Contract

**File**: `packages/styles/src/pathable-component-wrappers/pathable-surface.scss`
**Base class**: `.pathable-surface` (existing — border-radius, transition,
position, forced-colors, reduced-motion)

### New tone-role modifiers (this feature)

| Class | Background | Foreground | Border |
|-------|------------|------------|--------|
| `.pathable-surface--tone-default` | `--pathable-color-surface` | `--pathable-color-text` | `--pathable-color-border` |
| `.pathable-surface--tone-subtle` | `--pathable-color-bg` | `--pathable-color-text` | `--pathable-color-border` |
| `.pathable-surface--tone-primary` | `--pathable-color-accent` | `--pathable-color-on-accent` | `--pathable-color-accent` |

### New elevation modifiers (this feature)

| Class | Box shadow |
|-------|-----------|
| `.pathable-surface--elevation-sm` | `--elevation-sm` |
| `.pathable-surface--elevation-md` | `--elevation-md` |
| `.pathable-surface--elevation-lg` | `--elevation-lg` |
| `.pathable-surface--elevation-xl` | `--elevation-xl` |

### New border-tone modifiers (this feature)

| Class | Border color |
|-------|--------------|
| `.pathable-surface--border-default` | `--pathable-color-border` |
| `.pathable-surface--border-danger` | `--pathable-color-danger` |

All values resolve to `--pathable-*` CSS custom properties. No literal hex,
px, or rem values. No new tokens are introduced.

## Consumer Compatibility

- Consumers import `@pathableai/react` only — no separate `@pathableai/styles`
  import required (the React entry point already imports the compiled styles).
- Server-side rendering (Next.js, Remix) produces byte-identical output to
  client-side rendering; resolvers are pure.
- The legacy depth variants remain available to raw-class consumers unchanged.

## Guarantees

1. **Determinism**: resolvers are pure lookups — no browser globals, no feature
   detection.
2. **Theme independence**: `variant`/`borderTone` express meaning
   (`primary`, `danger`), never palette (`jade`, `red-600`).
3. **Source-first**: every prop value maps to a verified `packages/styles`
   contract; unverified values are not advertised.
4. **No arbitrary values**: raw color/shadow props are not part of the API;
   `className`/`style` remain the escape hatches.
