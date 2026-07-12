# @pathable/styles

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
pnpm add @pathable/styles

Import the SCSS entrypoint:

@use "@pathable/styles";
```

### USWDS Integration

This package wraps USWDS v3.x theme color tokens to match PathAble brand colors. When using USWDS components alongside `@pathable/styles`, USWDS components automatically render with brand-aligned colors.

**Installation with USWDS:**

```bash
pnpm add @pathable/styles @uswds/uswds
```

**Usage with USWDS components:**

```scss
// Import USWDS component styles separately (e.g., usa-button)
@use 'uswds';

// @pathable/styles provides the theme token configuration
// that makes USWDS components render with PathAble brand colors
```

```css
/* When using compiled CSS, import both: */
/* @import '@pathable/styles/dist/styles.css'; */
/* @import '@uswds/uswds/dist/css/uswds.css'; */
```

The compiled `dist/styles.css` includes USWDS theme token configuration but **not** USWDS component styles. Consumers who need USWDS components must add USWDS as their own dependency and import components separately.

For detailed setup instructions, see [quickstart.md](specs/003-wrap-uswds-theme/quickstart.md).

### Token Usage

Use exported tokens instead of hardcoded colors or font names whenever possible.

```css
.example {
  color: var(--pathable-color-text);
  background: var(--pathable-color-surface);
  font-family: var(--pathable-font-body);
}
```

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
