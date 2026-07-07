# USWDS Typography Settings Quickstart

## Installation

USWDS is already a dependency of `@pathable/styles`. If you haven't already installed it:

```bash
pnpm add @pathable/styles @uswds/uswds
```

## Usage (Compiled CSS)

```css
/* App entrypoint */
@import '@pathable/styles/dist/styles.css';
```

USWDS components now use PathAble brand fonts automatically:

```html
<!-- Headings render in Fredoka -->
<h1 class="usa-prose__heading">Page Title</h1>

<!-- Body text renders in Nunito -->
<p class="usa-prose">This paragraph uses Nunito at 16px.</p>

<!-- Buttons and UI elements render in Nunito -->
<button class="usa-button">Submit</button>
```

## Using Dual CSS Custom Properties

### PathAble Naming

```css
.element {
  font-family: var(--pathable-font-heading);   /* Fredoka */
  font-family: var(--pathable-font-body);      /* Nunito */
  font-size: var(--pathable-font-size-body-md); /* 16px */
  font-weight: var(--pathable-font-weight-bold); /* 700 */
}
```

### USWDS Naming

```css
.element {
  font-family: var(--usa-font-heading);   /* Fredoka */
  font-family: var(--usa-font-body);      /* Nunito */
  font-size: var(--usa-font-size-h1);     /* 24px */
  font-weight: var(--usa-font-weight-bold); /* 700 */
}
```

Both naming conventions resolve to the same underlying values.

## Usage (SCSS Customization)

If your project uses SCSS and you want to extend the theme:

```scss
@use '@pathable/styles/src/index' as pathable;

.heading {
  font-family: pathable.$pathable-font-heading;
  font-size: pathable.$ui-heading-lg;
}

.body {
  font-family: pathable.$pathable-font-body;
}
```

## Font File Distribution

Font files (`.woff2`) are bundled with the `@pathable/styles` npm package. They are automatically copied from [Fontsource](https://fontsource.org/) npm packages at build time via the `scripts/copy-fonts.mjs` script.

The font files are published at:
```
fonts/
├── fredoka/
│   └── Fredoka-Regular.woff2
├── nunito/
│   ├── Nunito-Regular.woff2
│   └── Nunito-SemiBold.woff2
├── poppins/
│   └── Poppins-Bold.woff2
└── montserrat/
    └── Montserrat-Bold.woff2
```

The font path is configured via `$theme-font-path` (defaults to `../fonts` relative to the compiled CSS). No additional setup is needed — consuming projects get fonts automatically when they install `@pathable/styles`.

## Verifying Typography Output

After building, verify the typography settings compiled correctly:

```bash
pnpm build

# Check that custom font stacks are present
rg "Fredoka" dist/styles.css
rg "Nunito" dist/styles.css

# Check that dual CSS custom properties are emitted
rg "--pathable-font-heading" dist/styles.css
rg "--usa-font-heading" dist/styles.css

# Check that USWDS role tokens are configured
rg "font-family-heading" dist/styles.css
rg "font-family-body" dist/styles.css
```

## Important Notes

- **Font files are bundled**: The `@font-face` rules in `_fonts.scss` reference local font files in the `fonts/` directory. These are automatically included when you install `@pathable/styles`.
- **Existing `--pathable-font-*` tokens continue to work**: No breaking changes to existing consumers.
- **New `--usa-font-*` tokens**: Added alongside existing `--pathable-font-*` tokens for USWDS-native consumers.
- **No USWDS component styles in output**: Only typography token settings are included. Add `@import 'uswds/dist/css/uswds.css'` separately if you need USWDS components.
- **Type scale differences**: Some PathAble sizes map to slightly different USWDS system tokens. See `research.md` Decision D3 for details.
- **Upgrading USWDS**: Edit `_uswds-theme.scss` — it is the single settings file for all USWDS theme configuration.
- **Font weights**: SemiBold (600) is newly enabled via `$theme-font-weight-semibold: 600`. Ensure Nunito SemiBold font files are available if this weight is used.
- **Accessibility**: `$theme-respect-user-font-size` is `true`, respecting user browser font size preferences.