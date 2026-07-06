# USWDS Theme Wrapper Quickstart

## Installation

```bash
pnpm add @pathable/styles @uswds/uswds
```

## Usage (Compiled CSS)

```css
/* App entrypoint */
@import '@pathable/styles/dist/styles.css';
```

Then use USWDS utility classes. Brand colors map automatically:

```html
<button class="usa-button">Primary Action</button>
<div class="bg-primary text-white">Primary brand section</div>
<p class="text-secondary">Secondary brand text</p>
```

Existing `--pathable-*` tokens continue to work unchanged:

```css
.element {
  color: var(--pathable-blue);
  background: var(--pathable-color-surface);
}
```

Existing `$pathable-*` SCSS variables continue to work unchanged:

```scss
.element {
  color: $pathable-blue;
}
```

## Usage (SCSS Customization)

If your project uses SCSS and you want to extend the theme:

```scss
@use '@pathable/styles/src/index' as pathable;
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

- **No USWDS component styles** in the output. Add `@import 'uswds/dist/css/uswds.css'` separately if you need USWDS components.
- **Future feature**: `--pathable-*` to `--uswds-*` aliasing is not available yet.
- **Color differences**: If brand colors look slightly different from original hexes, see `research.md` for deltaE values.
- **Upgrading USWDS**: Edit `_uswds-theme.scss` — it is the single settings file per FR-008.
