# Contracts: Brand Design Tokens

**Phase**: 1 — Design & Contracts
**Feature**: Brand Design Tokens (`001-brand-design-tokens`)

## CSS Custom Property Contract

The `@pathable/styles` package publishes its tokens as CSS custom properties on the `:root` pseudo-class. Consumers MUST import the compiled CSS file and reference tokens via `var()`.

### Naming Convention

| Category | Prefix | Example |
|----------|--------|---------|
| Brand Colors | `--pathable-` + lowercase-kebab name | `--pathable-blue` |
| Semantic Colors | `--pathable-color-` + role name | `--pathable-color-bg` |
| Font Families | `--pathable-font-` + role name | `--pathable-font-heading` |
| Typography Scale | `--ui-` + role + size | `--ui-heading-lg` |
| Spacing | `--space-` + value in px | `--space-16` |
| Elevation | `--elevation-` + level | `--elevation-md` |
| Radius | `--radius-` + size name | `--radius-md` |

### Import Paths

**CSS (in HTML or CSS file):**
```html
<link rel="stylesheet" href="node_modules/@pathable/styles/dist/styles.css" />
```
```css
@import '@pathable/styles/dist/styles.css';
```

**SCSS:**
```scss
@use '@pathable/styles' as tokens;
```

## SCSS API

The package exposes its SCSS source for advanced consumers. All Sass variables and maps are available via `@use`.

```scss
@use '@pathable/styles' as tokens;

// Access individual variables
.example {
  color: tokens.$pathable-blue;
}

// Access maps
@each $name, $value in tokens.$brand-colors { ... }
```

## Compliance

- All tokens MUST be defined on `:root` for global availability
- Semantic tokens MUST reference brand color values so they update automatically when brand colors change
- Every Sass variable MUST have a matching CSS custom property output
- The compiled CSS MUST NOT contain Sass-specific syntax or dependencies