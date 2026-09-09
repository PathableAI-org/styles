# USWDS Theme Wrapper Quickstart

## Installation

```bash
pnpm add @pathableai/styles @uswds/uswds
pnpm add -D sass
```

## Build brand-aligned USWDS components

Load the PathAble configuration before USWDS in the same Sass entry point:

```scss
@use '@pathableai/styles/src/index' as pathable;
@use 'uswds';
```

Configure Dart Sass to resolve both installed packages and the USWDS package
modules. For example, compile `src/app.scss` with:

```bash
pnpm exec sass --load-path=node_modules --load-path=node_modules/@uswds/uswds/packages src/app.scss dist/app.css
node -e "require('node:fs').cpSync('node_modules/@pathableai/styles/fonts', 'fonts', { recursive: true })"
```

The copy command matches the source entry's default `../fonts` URLs when the
compiled stylesheet is `dist/app.css`. If your bundler rewrites asset URLs,
configure it to emit the package's published `fonts/` directory instead.

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

After compiling the entry point above, check that USWDS component selectors and
the configured primary and secondary color values are present:

```bash
rg "\\.usa-button" dist/app.css
rg "#162e51" dist/app.css
rg "#1dc2ae" dist/app.css
```

## Important Notes

- **No USWDS component styles** in the precompiled PathAble output. Compile USWDS after the PathAble Sass configuration when you need brand-aligned USWDS components.
- **Future feature**: `--pathable-*` to `--uswds-*` aliasing is not available yet.
- **Color differences**: If brand colors look slightly different from original hexes, see `research.md` for deltaE values.
- **Upgrading USWDS**: Package maintainers update `packages/styles/src/_uswds-theme.scss`, the single settings file per FR-008; consumers should not edit installed package files.
