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
Applications SHOULD consume semantic tokens like --pathable-color-text instead of directly using brand colors like #00365c.
Brand colors SHOULD be used through this package so changes can be made centrally.

## Accessibility

PathAble styles should prioritize readability, contrast, and usability. When a brand color combination does not provide sufficient contrast, accessibility MUST take priority over visual preference.

## License

Unlicense
