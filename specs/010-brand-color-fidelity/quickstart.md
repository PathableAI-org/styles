# Quickstart: Brand Color Fidelity & Token Architecture

## Prerequisites

- Node.js 23+
- pnpm (latest)
- Repository cloned with `pnpm install` completed

## Build Verification

After implementing the token changes, verify the build output:

```bash
cd packages/styles
pnpm build
```

This compiles `src/index.scss` to `dist/styles.css`. Verify the output contains the new tokens:

```bash
rg '--pathable-brand-' dist/styles.css
rg '--pathable-color-action-' dist/styles.css
rg '--pathable-color-status-' dist/styles.css
rg '--pathable-color-workflow-' dist/styles.css
```

## Local Development

### Viewing the Brand / Color Usage Page

```bash
# From repository root
pnpm docs
```

This starts the Storybook dev server at `localhost:6006`. Navigate to the "Brand" section and select "Color Usage".

### Modifying Token Values

1. Edit `packages/styles/src/_colors.scss` for brand fidelity tokens
2. Edit `packages/styles/src/_semantic.scss` for semantic tokens
3. Run `pnpm build` in `packages/styles`
4. Verify the compiled CSS output contains the new values
5. Verify no existing tokens changed (grep for old values)

### Verifying Backward Compatibility

```bash
# Check that all existing tokens still exist
rg '--pathable-color-bg' dist/styles.css
rg '--pathable-color-surface' dist/styles.css
rg '--pathable-color-text' dist/styles.css
rg '--pathable-color-text-muted' dist/styles.css
rg '--pathable-color-border' dist/styles.css
rg '--pathable-color-link' dist/styles.css
rg '--pathable-color-accent' dist/styles.css
rg '--pathable-color-focus-ring' dist/styles.css
rg '--pathable-color-danger' dist/styles.css
rg '--pathable-color-success' dist/styles.css
```

All existing tokens must remain with their original values.

## Storybook Brand Section

The Brand / Color Usage page is at:

```
packages/styles/src/stories/brand/ColorUsage.stories.js
```

It follows the same pattern as other utility stories (e.g., `BackgroundColors.stories.js`).

## Contrast Verification

After changing any token color value, verify contrast ratios meet WCAG AA minimum (4.5:1 for normal text):

```bash
cd specs/010-brand-color-fidelity
# Use the contrast calculation script in research.md
```

## Token Value Reference

For a complete reference of all new token values, see:

- [research.md](./research.md) — token value decisions and contrast calculations
- [data-model.md](./data-model.md) — token data model with validation rules
- [contracts/contracts.md](./contracts/contracts.md) — contract guarantees and approved pairings
