# Quickstart: Brand Design Tokens

**Phase**: 1 — Design & Contracts
**Feature**: Brand Design Tokens (`001-brand-design-tokens`)

## Install

```bash
pnpm add @pathable/styles
```

## CSS Import

Import the compiled CSS in your HTML or root CSS file:

```html
<link rel="stylesheet" href="/node_modules/@pathable/styles/dist/styles.css" />
```

Or in CSS:

```css
@import '@pathable/styles/dist/styles.css';
```

## SCSS Import

For SCSS consumers who want access to variables and maps:

```scss
@use '@pathable/styles' as tokens;
```

## Usage Examples

### Colors

```css
.header {
  background-color: var(--pathable-blue);
  color: white;
}

.card {
  background: var(--pathable-color-surface);
  border: 1px solid var(--pathable-color-border);
  color: var(--pathable-color-text);
}

.link {
  color: var(--pathable-color-link);
}

.error-banner {
  background: var(--pathable-color-danger);
  color: white;
}
```

### Typography

```css
h1 {
  font-family: var(--pathable-font-heading);
  font-size: var(--ui-display-lg);
}

body {
  font-family: var(--pathable-font-body);
  font-size: var(--ui-body-md);
}
```

### Spacing, Elevation, Radius

```css
.card {
  padding: var(--space-16);
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-sm);
}

.modal {
  padding: var(--space-24);
  border-radius: var(--radius-lg);
  box-shadow: var(--elevation-xl);
}
```

## Build

```bash
cd packages/styles && pnpm build
```

Outputs `dist/styles.css` and `dist/styles.css.map`.

## References

- [Full Specification](spec.md)
- [Brand Rules](BRAND_RULES.md)
- [Agent Instructions](AGENTS.md)