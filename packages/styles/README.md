# @pathableai/styles

PathAble's shared style package provides brand-aligned SCSS tokens, typography defaults, color values, and usage guidance for building consistent PathAble interfaces.

This package is the implementation source for PathAble visual design foundations. It should be used by applications, documentation sites, prototypes, and agent-generated UI work that needs to follow the PathAble brand.

## What This Package Includes

- Brand color tokens
- Typography tokens
- Semantic color tokens
- Light theme defaults
- Dark and high-contrast theme foundations
- Brand usage rules for humans and coding agents

## Brand Colors

| Name               |       Hex |
| ------------------ | --------: |
| Intelligent Jade   | `#1cae96` |
| PathAble Blue      | `#00365c` |
| Bright Blue Brooks | `#4899e8` |
| Tech Teal          | `#015a76` |
| Lived-In Lime      | `#d3ff66` |
| Shilling Silver    | `#dde2e8` |

## Typography

| Use               | Font         | Weight    |
| ----------------- | ------------ | --------- |
| Heading           | `Fredoka`    | `Regular` |
| Alternate Heading | `Montserrat` | `Bold`    |
| Subheading        | `Poppins`    | `Bold`    |
| Body Text         | `Nunito`     | `Regular` |

## Usage

Install the package:

```bash
pnpm add @pathableai/styles
```

Import the compiled CSS entry point to get all default styles, tokens, and utilities:

```css
/* Full import — components, utilities, and default theme tokens */
@import '@pathableai/styles';
```

CSS-only consumers that supply a complete set of application-owned theme tokens
can import only the component and utility layers to avoid loading the package's
default token declarations:

```css
/* Component styles and utilities only — no default :root theme tokens */
@import '@pathableai/styles/components';
@import '@pathableai/styles/utilities';
/* Define the complete application-owned token set after these imports. */
```

React consumers should import only `@pathableai/react`, which loads these
stylesheet layers automatically, and use `ThemeProvider` for scoped overrides.

All three subpath imports resolve to the corresponding file under `dist/`:

| Import                          | Resolves to              |
| ------------------------------- | ------------------------ |
| `@pathableai/styles`            | `dist/styles.css`        |
| `@pathableai/styles/components` | `dist/components.css`    |
| `@pathableai/styles/utilities`  | `dist/utilities.css`     |
| `@pathableai/styles/theme`      | `dist/theme-default.css` |

### SCSS (`@use`)

```scss
@use '@pathableai/styles';
```

### USWDS Integration

This package configures USWDS v3.x theme tokens to match PathAble brand colors.
Compile the PathAble source before USWDS in the same Sass build to apply that
configuration to USWDS components.

**Installation with USWDS:**

```bash
pnpm add @pathableai/styles @uswds/uswds
pnpm add -D sass
```

**Usage with USWDS components:**

```scss
@use '@pathableai/styles/src/index' as pathable;
@use 'uswds';
```

Configure Dart Sass to resolve both installed packages and the USWDS package
modules. For the command-line compiler:

```bash
pnpm exec sass --load-path=node_modules --load-path=node_modules/@uswds/uswds/packages src/app.scss dist/app.css
```

The compiled PathAble CSS does **not** include USWDS component styles. Importing
the stock precompiled USWDS CSS adds stock components; it does not apply the
PathAble Sass configuration. Use the combined Sass build above for brand-aligned
USWDS components.

For detailed setup instructions, see the
[USWDS theme quickstart](https://github.com/PathableAI-org/styles/blob/main/specs/003-wrap-uswds-theme/quickstart.md).

### Token Usage

Use exported tokens instead of hardcoded colors or font names whenever possible.

```css
.example {
  color: var(--pathable-color-text);
  background: var(--pathable-color-surface);
  font-family: var(--pathable-font-body);
}
```

## Theming

Override semantic color tokens with the typed theming API in
`@pathableai/react` instead of redeclaring `--pathable-color-*` on `:root`.
The canonical theming documentation lives under `docs/theming/`:

- [Consumer guide on GitHub](https://github.com/PathableAI-org/styles/blob/main/docs/theming/consumer-guide.md) — override with
  `createTheme` + `ThemeProvider`, extend `defaultTheme`, and understand
  automatic React styles versus CSS-only imports.
- [Token vocabulary on GitHub](https://github.com/PathableAI-org/styles/blob/main/docs/theming/token-vocabulary.md) — every overridable
  color token with its CSS custom property, default value, and role.

## Guidance

See BRAND_RULES.md for full color and typography guidance.
See AGENTS.md for short operational rules intended for coding agents.
See STORY_AUTHORING.md for the story authoring checklist and PR requirements.
Applications SHOULD consume semantic tokens like --pathable-color-text instead of directly using brand colors like #00365c.
Brand colors SHOULD be used through this package so changes can be made centrally.

## Accessibility

PathAble styles should prioritize readability, contrast, and usability. When a brand color combination does not provide sufficient contrast, accessibility MUST take priority over visual preference.

## License

Unlicense
