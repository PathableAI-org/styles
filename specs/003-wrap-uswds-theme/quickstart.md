# USWDS Theme Wrapper Quickstart

## Installation

```bash
pnpm add @pathableai/styles @uswds/uswds
```

## Build brand-aligned USWDS components

Load the PathAble configuration before USWDS in the same Sass entry point:

```scss
@use '@pathableai/styles/src/index' as pathable;
@use 'uswds';
```

USWDS components and utilities compiled from that entry point use the configured
PathAble-aligned theme tokens:

```html
<button class="usa-button">Primary Action</button>
<div class="bg-primary text-white">Primary brand section</div>
<p class="text-secondary">Secondary brand text</p>
```

Use the package's semantic custom properties:

```css
.element {
  color: var(--pathable-color-text);
  background: var(--pathable-color-surface);
}
```

## Use PathAble Sass variables

The same namespaced import exposes PathAble variables for application styles:

```scss
.element {
  color: pathable.$pathable-blue;
}
```

## Verifying Brand Colors

After installing, build and check:

```bash
pnpm build
# Verify brand colors compiled correctly
rg "blue-warm-80v" dist/styles.css    # Should show PathAble Blue
rg "mint-cool-30v" dist/styles.css    # Should show Intelligent Jade
```

## Important Notes

- **No USWDS component styles** in the precompiled PathAble output. Compile USWDS after the PathAble Sass configuration when you need brand-aligned USWDS components.
- **Future feature**: `--pathable-*` to `--uswds-*` aliasing is not available yet.
- **Color differences**: If brand colors look slightly different from original hexes, see `research.md` for deltaE values.
- **Upgrading USWDS**: Edit `_uswds-theme.scss` — it is the single settings file per FR-008.
