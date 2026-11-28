# @pathableai/styles

PathAble's shared style package provides brand-aligned compiled CSS, tokens, typography and colour values, and usage guidance for building consistent PathAble interfaces.

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
theme, component and utility files automatically.

The root import and all three subpath imports resolve to corresponding files
under `dist/`:

| Import                          | Resolves to              |
| ------------------------------- | ------------------------ |
| `@pathableai/styles`            | `dist/styles.css`        |
| `@pathableai/styles/components` | `dist/components.css`    |
| `@pathableai/styles/utilities`  | `dist/utilities.css`     |
| `@pathableai/styles/theme`      | `dist/theme-default.css` |
| `@pathableai/styles/css/<file>` | `dist/css/<file>`        |

The `components` and `utilities` entry points read their colours, fonts and
other values from the `theme` entry point; import `@pathableai/styles` (all three) unless
you import `theme` as well.

### Component imports

To load only the CSS a component needs instead of the whole bundle, import
the files from `@pathableai/styles/css/<file>`, which resolves to
`dist/css/<file>`. Each styles component page in the package
(`components/<slug>.md`) lists the files that component needs.

- `base.css` holds the tokens and font faces. Every component needs it.
- `utilities.css` is needed for any utility class. Every page lists it because
  its examples may use utilities.
- Every file starts with the same
  `@layer pathable.base, pathable.components, pathable.utilities;` statement,
  so the base, component and utility files can load in any order relative to
  one another.
- List the component files in the order a page gives, which is the order of
  the bundle, because rules in the same layer cascade by source order.
- To use several components, import the union of their lists, each file once,
  in the order of `dist/css/manifest.json`.

### Cascade layers

Every rule in the compiled CSS sits in one of three cascade layers, declared in
this order, lowest priority first:

1. `pathable.base`: tokens (custom properties) and font faces.
2. `pathable.components`: the `pathable-*` component classes.
3. `pathable.utilities`: the USWDS utility classes, under their USWDS names,
   and the USWDS layout grid.

Each of the four files starts with the same
`@layer pathable.base, pathable.components, pathable.utilities;` statement, so
a utility beats a component class whatever order the files load in.

CSS in your app that is not in a layer beats every package rule, whatever its
specificity. Overrides no longer need extra specificity, and an unlayered app
rule can override a package rule unintentionally. To place your own CSS in the
order, declare your layer order before the package loads, for example
`@layer pathable.base, pathable.components, pathable.utilities, app;` to put
`app` above the package, or `@layer app, pathable.base, pathable.components,
pathable.utilities;` to put it below.

For `!important` declarations the order is reversed: an `!important` in
`pathable.base` or `pathable.components` beats one in a later layer, and beats
an unlayered `!important` in your app.

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
See `components/index.md` in the installed package for the component pages: one page per component with its markup, variants, composition and guarantees, plus the token and utility pages. In this repository the package build writes the pages and the index from the source pages in the top-level [components/](https://github.com/PathableAI-org/styles/tree/main/components) directory, taking each converted page's examples from the HTML fixtures.
Applications SHOULD use the documented token classes and `pathable-*` component classes instead of directly using brand hex values like #00365c.
Brand colors SHOULD be used through this package so changes can be made centrally.

## Accessibility

PathAble styles should prioritize readability, contrast, and usability. When a brand color combination does not provide sufficient contrast, accessibility MUST take priority over visual preference.

## License

Unlicense
