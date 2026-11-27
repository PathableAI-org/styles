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
/* Full import — theme, components and utilities */
@import '@pathableai/styles';
```

React consumers should import only `@pathableai/react`, which loads the
theme, component and utility layers automatically.

The root import and all three subpath imports resolve to corresponding files
under `dist/`:

| Import                          | Resolves to              |
| ------------------------------- | ------------------------ |
| `@pathableai/styles`            | `dist/styles.css`        |
| `@pathableai/styles/components` | `dist/components.css`    |
| `@pathableai/styles/utilities`  | `dist/utilities.css`     |
| `@pathableai/styles/theme`      | `dist/theme-default.css` |

The `components` and `utilities` layers read their colours, fonts and other
values from the `theme` layer; import `@pathableai/styles` (all three) unless
you import `theme` as well.

### SCSS (`@use`)

Install Dart Sass and USWDS, then use the published source subpath with a stable
namespace:

```bash
pnpm add @pathableai/styles @uswds/uswds
pnpm add -D sass
```

```scss
@use '@pathableai/styles/src/index' as pathable;
```

When using the command-line compiler, include the package and USWDS module load
paths shown below. The source entry emits font URLs relative to the compiled CSS;
ensure your bundler copies those assets, or use the copy command below.

### USWDS Integration

This package configures the USWDS v3.x theme color families with the exact PathAble brand hex values.
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
node -e "require('node:fs').cpSync('node_modules/@pathableai/styles/fonts', 'fonts', { recursive: true })"
```

The compiled PathAble CSS already includes the USWDS component styles that the
`.pathable-*` wrappers use, compiled with the PathAble theme. Importing the stock
precompiled USWDS CSS adds stock, unbranded components; it does not apply the
PathAble Sass configuration. Use the combined Sass build above for any other
brand-aligned USWDS components.

The example above is the supported source-build path. Consumers that only need
the PathAble contract should import the package's compiled CSS instead.

## Tokens

A token is the suffix of a class, such as `primary` in `bg-primary` or `2` in
`padding-2`, with a value fixed when the package is built. The token pages in the installed package's
`components/` directory list them, for example `components/tokens-color.md`,
`components/tokens-spacing-units.md` and `components/tokens-typesetting.md`;
`components/index.md` lists the rest. The utility class pages,
`components/utilities-*.md`, show the classes that use them. Use those classes
and the `pathable-*` component classes instead of hardcoded colors or font
names.

## Guidance

See BRAND_RULES.md for full color and typography guidance.
See AGENTS.md for short operational rules intended for coding agents.
See `components/index.md` in the installed package for the component pages: one page per component with its markup, variants, tokens and guarantees. Few components have a page yet. In this repository the package build writes the pages and the index from the source pages in the top-level [components/](https://github.com/PathableAI-org/styles/tree/main/components) directory, taking each converted page's examples from the HTML fixtures.
See the [story authoring guide on GitHub](https://github.com/PathableAI-org/styles/blob/main/packages/styles/STORY_AUTHORING.md) for its checklist and PR requirements.
Applications SHOULD use the documented token classes and `pathable-*` component classes instead of directly using brand hex values like #00365c.
Brand colors SHOULD be used through this package so changes can be made centrally.

## Accessibility

PathAble styles should prioritize readability, contrast, and usability. When a brand color combination does not provide sufficient contrast, accessibility MUST take priority over visual preference.

## License

Unlicense
