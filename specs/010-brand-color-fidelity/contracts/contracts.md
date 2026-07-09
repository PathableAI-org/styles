# Contracts: Brand Color Fidelity & Token Architecture

## CSS Custom Property Contract

The `@pathable/styles` package exposes the following new CSS custom properties in its compiled output (`dist/styles.css`). All consumers of the package can rely on these tokens being available.

### Contract: Brand Fidelity Tokens

```css
/* Exact brand hex values for reference and documentation */
--pathable-brand-pathable-blue: #00365c;
--pathable-brand-intelligent-jade: #1cae96;
--pathable-brand-bright-blue-brooks: #4899e8;
--pathable-brand-tech-teal: #015a76;
--pathable-brand-lived-in-lime: #d3ff66;
--pathable-brand-shilling-silver: #dde2e8;
```

**Contract guarantee**: These tokens will always contain the exact hex values from the brand book. Breaking changes (removal or rename) require a major version bump.

### Contract: Action Role Tokens

```css
/* Primary action button */
--pathable-color-action-primary-bg: #162e51;
--pathable-color-action-primary-text: #ffffff;

/* Secondary action button */
--pathable-color-action-secondary-bg: #1dc2ae;
--pathable-color-action-secondary-text: #162e51;
```

**Contract guarantee**: These tokens provide accessible pairings for action buttons. Primary action uses high-contrast PathAble Blue on white (13.60:1). Secondary action uses Intelligent Jade with PathAble Blue text (6.08:1).

### Contract: Status Role Tokens

```css
/* Success status */
--pathable-color-status-success-bg: #1dc2ae;
--pathable-color-status-success-text: #162e51;

/* Warning status */
--pathable-color-status-warning-bg: #f5a623;
--pathable-color-status-warning-text: #162e51;

/* Danger/error status */
--pathable-color-status-danger-bg: #dc3545;
--pathable-color-status-danger-text: #ffffff;
```

**Contract guarantee**: Each status token pair has been verified for WCAG AA contrast compliance (>= 4.5:1). Success: 6.08:1. Warning: 6.71:1. Danger: 4.53:1.

### Contract: Workflow State Tokens

```css
/* Workflow state indicators */
--pathable-color-workflow-active: #58b4ff;
--pathable-color-workflow-complete: #1dc2ae;
--pathable-color-workflow-blocked: #dc3545;
```

**Contract guarantee**: These are visual indicator tokens, not text-background pairs. They should be used with appropriate backgrounds that provide sufficient contrast.

## Contrast Compliance Documentation

### Approved Pairings (WCAG AA Compliant)

| Foreground | Background | Ratio | Level |
|-----------|-----------|-------|-------|
| White (`#ffffff`) | PathAble Blue (`#162e51`) | 13.60:1 | AAA |
| White (`#ffffff`) | Tech Teal (`#00687d`) | 6.41:1 | AA |
| PathAble Blue (`#162e51`) | Intelligent Jade (`#1dc2ae`) | 6.08:1 | AA |
| PathAble Blue (`#162e51`) | Gold warning (`#f5a623`) | 6.71:1 | AA |
| White (`#ffffff`) | Danger (`#dc3545`) | 4.53:1 | AA |
| Shilling Silver (`#dfe1e2`) | PathAble Blue (`#162e51`) | 9.58:1 | AAA |

### Failed Pairings (Do Not Use for Small Text)

| Foreground | Background | Ratio | Issue |
|-----------|-----------|-------|-------|
| White (`#ffffff`) | Intelligent Jade (`#1dc2ae`) | 2.24:1 | Fails AA (needs 4.5:1) |
| White (`#ffffff`) | Bright Blue Brooks (`#58b4ff`) | 2.24:1 | Fails AA (needs 4.5:1) |
| Lived-In Lime (`#e7f434`) | White (`#ffffff`) | 1.21:1 | Fails all thresholds |
| Bright Blue Brooks (`#58b4ff`) | White (`#ffffff`) | 2.24:1 | Link color issue (pre-existing) |

## SCSS Source Contract

### `_colors.scss` Changes

The `_colors.scss` file will be updated to add:

1. A new `$brand-exact-colors` map with exact hex values
2. CSS custom properties in the `--pathable-brand-*` namespace
3. All existing mappings (`$pathable-blue`, `$brand-colors`, etc.) remain unchanged

### `_semantic.scss` Changes

The `_semantic.scss` file will be updated to add:

1. Six new `$pathable-color-*` SCSS variables for action, status, and workflow tokens
2. Corresponding entries in the `$semantic-colors` map
3. New CSS custom properties in the `:root` block
4. Comment documentation for each new token's intended role

All existing variables and tokens remain unchanged (backward compatible).