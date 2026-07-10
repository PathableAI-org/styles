# Quickstart: USWDS Utility Wrappers

**Branch**: `006-uswds-utility-wrappers` | **Date**: 2026-07-07

## Overview

The utility wrappers feature adds `.pathable-*` CSS utility classes and dual `--pathable-*` / `--usa-*` CSS custom properties to `@pathable/styles`. These classes wrap USWDS utility module values, letting developers apply PathAble theme tokens directly in HTML via simple utility class names.

## Setup

### Prerequisites

- `@pathable/styles` installed (already a dependency in `apps/docs` and any consuming project)
- The compiled `dist/styles.css` imported in your project

### Building

After changes to the utility partial, rebuild the styles:

```bash
cd packages/styles
pnpm build
```

The compiled output includes the new utility classes.

## Usage

### Basic Utility Classes

Apply `.pathable-*` utility classes directly in HTML:

```html
<!-- Background color -->
<div class="pathable-bg-primary">Primary background</div>
<div class="pathable-bg-base">Base background</div>
<div class="pathable-bg-surface">Surface background</div>

<!-- Text color -->
<p class="pathable-text-base">Base text color</p>
<p class="pathable-text-primary">Primary text color</p>
<p class="pathable-text-muted">Muted text color</p>

<!-- Padding -->
<div class="pathable-padding-1">4px padding</div>
<div class="pathable-padding-2">8px padding</div>
<div class="pathable-padding-4">16px padding</div>
<div class="pathable-padding-8">32px padding</div>

<!-- Horizontal and vertical padding -->
<div class="pathable-padding-x-4">16px horizontal padding</div>
<div class="pathable-padding-y-2">8px vertical padding</div>

<!-- Margin -->
<div class="pathable-margin-4">16px margin</div>
<div class="pathable-margin-top-2">8px top margin</div>
<div class="pathable-margin-bottom-4">16px bottom margin</div>

<!-- Display -->
<div class="pathable-display-flex">Flex container</div>
<div class="pathable-display-block">Block element</div>
<div class="pathable-display-inline">Inline element</div>

<!-- Font family -->
<p class="pathable-font-family-heading">Heading font (Fredoka)</p>
<p class="pathable-font-family-body">Body font (Nunito)</p>
<p class="pathable-font-family-mono">Monospace font</p>
<p class="pathable-font-family-alt">Alternate font (Montserrat)</p>

<!-- Font weight -->
<p class="pathable-text-bold">Bold text</p>
<p class="pathable-text-normal">Normal weight text</p>

<!-- Border -->
<div class="pathable-border-1">1px border</div>
<div class="pathable-border-2">2px border</div>

<!-- Border radius -->
<div class="pathable-border-radius-sm">Small radius</div>
<div class="pathable-border-radius-md">Medium radius</div>
<div class="pathable-border-radius-lg">Large radius</div>

<!-- Flex and layout -->
<div class="pathable-display-flex pathable-flex-align-center pathable-flex-justify-center">
  Centered content
</div>
<div class="pathable-width-full">Full width</div>
<div class="pathable-maxw-mobile">Mobile max-width</div>

<!-- Text alignment -->
<p class="pathable-text-center">Centered text</p>
<p class="pathable-text-left">Left-aligned text</p>
<p class="pathable-text-right">Right-aligned text</p>
```

### Responsive Utility Classes

Use breakpoint prefixes for responsive variants:

```html
<!-- Desktop: 16px padding, tablet: 8px, mobile: 4px -->
<div class="pathable-padding-1 tablet:pathable-padding-2 desktop:pathable-padding-4">
  Responsive padding
</div>

<!-- Centered on desktop, left-aligned on mobile -->
<p class="pathable-text-left desktop:pathable-text-center">
  Responsive text alignment
</p>
```

Available breakpoints (matching USWDS configuration):

| Breakpoint | Min Width |
| ----------- | ----------- |
| `mobile-lg` | 480px |
| `tablet` | 640px |
| `desktop` | 1024px |

### State Variants

Use state prefixes for hover and focus variants:

```html
<!-- Hover state -->
<button class="pathable-bg-primary hover:pathable-bg-accent">
  Hover to accent
</button>

<!-- Focus state -->
<input class="pathable-border-1 focus:pathable-border-2" />
```

### CSS Custom Properties

All utility token values are also available as CSS custom properties under both namespaces:

```css
.element {
  background-color: var(--pathable-bg-primary);
  /* or */
  background-color: var(--usa-bg-primary);
}

.another {
  padding: var(--pathable-padding-4);
  /* or */
  padding: var(--usa-padding-4);
}
```

## Utility Module Reference

| Module | Class Prefix | Tokens Available |
| -------- | ------------- | ----------------- |
| background-color | `.pathable-bg-` | primary, base, surface, accent, link, focus-ring, danger, success, transparent |
| color | `.pathable-text-` | base, primary, muted, accent, link, white |
| padding | `.pathable-padding-` | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 |
| padding-x | `.pathable-padding-x-` | same as padding |
| padding-y | `.pathable-padding-y-` | same as padding |
| margin | `.pathable-margin-` | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 |
| margin-top | `.pathable-margin-top-` | same as margin |
| margin-bottom | `.pathable-margin-bottom-` | same as margin |
| margin-x | `.pathable-margin-x-` | same as margin |
| margin-y | `.pathable-margin-y-` | same as margin |
| display | `.pathable-display-` | flex, block, inline, inline-block, none |
| font-family | `.pathable-font-family-` | heading, body, mono, alt |
| font-weight | `.pathable-text-` | normal, semibold, bold |
| border | `.pathable-border-` | 0, 1, 2, 3, 4, 5 |
| border-radius | `.pathable-border-radius-` | sm, md, lg |
| flex | `.pathable-flex-` | 1 |
| align-items | `.pathable-flex-align-` | center, start, end, stretch, baseline |
| justify-content | `.pathable-flex-justify-` | center, start, end, between, around |
| width | `.pathable-width-` | full, auto |
| max-width | `.pathable-maxw-` | mobile, mobile-lg, tablet, desktop |
| text-align | `.pathable-text-` | center, left, right |

## Docs Site Refactoring Guide

When replacing ad-hoc CSS with utility classes in `apps/docs`:

1. **Identify** CSS declarations that map to a utility module (padding, margin, color, background, display, etc.)
2. **Replace** the declaration with a utility class in the Astro template
3. **Remove** the now-unnecessary CSS rule from the `<style>` block or `custom.css`

**Before:**

```astro
<div class="card">
  <style>
    .card {
      padding: var(--space-16);
      background-color: var(--pathable-color-surface);
      border-radius: var(--radius-sm);
      font-family: var(--pathable-font-body);
    }
  </style>
</div>
```

**After:**

```astro
<div class="pathable-padding-4 pathable-bg-surface pathable-border-radius-sm pathable-font-family-body">
</div>
```

## Verification

To verify the compiled output:

```bash
# Rebuild styles
cd packages/styles && pnpm build

# Check for utility classes in the output
rg '\.pathable-bg-' dist/styles.css
rg '\.pathable-padding-' dist/styles.css
rg '\.pathable-display-' dist/styles.css

# Preview docs site
cd apps/docs && pnpm dev
```

## Troubleshooting

| Problem | Likely Cause | Solution |
| --------- | ------------- | ---------- |
| Utility class not in compiled CSS | USWDS theme token set to `false` | Check `_uswds-theme.scss` for the token's enabled status |
| Wrong hex value in utility class | USWDS color token misconfigured | Verify color mapping in `_uswds-theme.scss` |
| Responsive variant not working | Breakpoint not enabled in theme | Check `$theme-utility-breakpoints` in config |
| Class name doesn't match convention | Typo in value name | Check the utility module map for correct value names |
