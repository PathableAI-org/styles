# Component API Contract: Heading

## Exported Component

**Package**: `@pathableai/react`
**Export name**: `Heading`
**Import**: `import { Heading } from '@pathableai/react';`

## Props

```typescript
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  /** Document outline level. Controls rendered HTML element (h1–h6). Required. */
  level: HeadingLevel;
  /** Optional visual style override. When set, the CSS class uses this level
   *  while the HTML element uses `level`. Defaults to `level`. */
  visualLevel?: HeadingLevel;
  /** Consumer class name. Appended after design-system classes. */
  className?: string;
  /** Heading content. */
  children?: React.ReactNode;
  /** Inline style escape hatch. */
  style?: React.CSSProperties;
}
```

### Excluded Props

- `as` — Not supported. The rendered element is always `h1`–`h6` determined by `level`.
- `tone` — Not supported. Headings use the default text color.
- `variant` — Not supported. The visual style is determined by `level`/`visualLevel`.
- `color`, `fontSize`, `fontWeight`, `lineHeight`, `fontFamily` — Not supported. Use `style` or `className`.

## Rendered Output

```html
<!-- level={1} -->
<h1 class="pathable-heading pathable-heading--level-1">Content</h1>

<!-- level={2} -->
<h2 class="pathable-heading pathable-heading--level-2">Content</h2>

<!-- level={3} visualLevel={2} -->
<h3 class="pathable-heading pathable-heading--level-2">Content</h3>

<!-- level={2} className="custom" -->
<h2 class="pathable-heading pathable-heading--level-2 custom">Content</h2>
```

## Class Resolution Contract

The class list on the root element is resolved in this deterministic order:

1. `.pathable-heading` — base class (always present)
2. `.pathable-heading--level-{visualLevel ?? level}` — visual style modifier
3. `className` prop value (if provided)

`mergeClasses()` handles deduplication, whitespace normalization, and falsy value filtering.

## Ref Forwarding

`Heading` forwards a ref to the rendered heading DOM element:

```tsx
const ref = useRef<HTMLHeadingElement>(null);
<Heading level={2} ref={ref}>Title</Heading>
// ref.current is the <h2> element
```

## SCSS Contract

**File**: `packages/styles/src/pathable-component-wrappers/pathable-heading.scss`
**Forwarded via**: `packages/styles/src/pathable-component-wrappers/pathable-typography.scss`

### Classes

| Class | Description |
|-------|-------------|
| `.pathable-heading` | Base: `color: var(--pathable-color-text); margin: 0;` |
| `.pathable-heading--level-1` | display-lg: Fredoka, 32px, 400 weight |
| `.pathable-heading--level-2` | heading-lg: Poppins, 24px, 700 weight |
| `.pathable-heading--level-3` | heading-md: Poppins, 20px, 700 weight |
| `.pathable-heading--level-4` | heading-sm: Poppins, 18px, 700 weight |
| `.pathable-heading--level-5` | body-md bold: Nunito, 16px, 700 weight |
| `.pathable-heading--level-6` | body-sm bold: Nunito, 14px, 700 weight |

All values resolve to `--pathable-*` CSS custom properties. No literal px, rem, or hex values.

## Consumer Compatibility

- Consumers import `@pathableai/react` only — no separate `@pathableai/styles` import required.
- The `pathable-heading` CSS is bundled in the React package's compiled styles.
- Server-side rendering (Next.js, Remix) produces identical output to client-side rendering.
- Heading elements are natively accessible — screen readers receive correct heading roles and levels.
