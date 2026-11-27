# USWDS build settings

This document is internal. It records how the `@pathableai/styles` build
configures USWDS 3.14.0 to produce the CSS that the
[component pages](../../components/README.md) document: which `$theme-*`
values PathAble sets and why, and which utility modules the build outputs. It
is not a consumer API. Consumers import compiled CSS, and the component pages
state only what that CSS contains. Where a page says "PathAble outputs
`text-semibold` at weight 600", the setting behind that sentence is here.

A setting not listed here is at its USWDS 3.14.0 default. Where this document
and the USWDS source disagree, the source wins; where the USWDS website and the
source disagree, the source wins and the component page says so.

## Colour

Source of the values: the PathAble brand guide
([`BRAND_RULES.md`](../../packages/styles/BRAND_RULES.md)). **Brand** is a
brand-guide colour, **Derived** is a tint or shade of one, and **USWDS
default** is a system token the build leaves alone. A `lighter` grade is the
brand colour at 10% over white, a `light` grade at 40% over white, and `dark`
and `darker` grades are the brand colour mixed with black. A `false` grade has
no class and no token. Component pages:
[Color theme tokens](../../components/tokens-color-theme-tokens.md),
[Color state tokens](../../components/tokens-color-state-tokens.md),
[Color system tokens](../../components/tokens-color-system-tokens.md),
[Color](../../components/tokens-color.md).

### Theme colours

```scss
$theme-color-base-lightest: #f6f8f9,
$theme-color-base-lighter: #eef0f4,
$theme-color-base-light: #e6e9ee,
$theme-color-base: #dde2e8,           // Shilling Silver
$theme-color-base-dark: 'gray-cool-60',
$theme-color-base-darker: #00365c,    // PathAble Blue
$theme-color-base-darkest: #00365c,
$theme-color-base-ink: #00365c,

$theme-color-primary-lightest: false,
$theme-color-primary-lighter: #e6ebef,
$theme-color-primary-light: #99afbe,
$theme-color-primary: #00365c,        // PathAble Blue
$theme-color-primary-vivid: #015a76,  // Tech Teal
$theme-color-primary-dark: #002845,
$theme-color-primary-darker: #001e33,
$theme-color-primary-darkest: false,

$theme-color-secondary-lightest: false,
$theme-color-secondary-lighter: #e8f7f4,
$theme-color-secondary-light: #a4dfd5,
$theme-color-secondary: #1cae96,      // Intelligent Jade
$theme-color-secondary-vivid: #1cae96,
$theme-color-secondary-dark: #0d7a63,
$theme-color-secondary-darker: #0d4e44,
$theme-color-secondary-darkest: false,

$theme-color-accent-warm-lightest: false,
$theme-color-accent-warm-lighter: #fbfff0,
$theme-color-accent-warm-light: #edffc2,
$theme-color-accent-warm: #d3ff66,    // Lived-In Lime
$theme-color-accent-warm-dark: #4a5924,
$theme-color-accent-warm-darker: #354019,
$theme-color-accent-warm-darkest: false,

$theme-color-accent-cool-lightest: false,
$theme-color-accent-cool-lighter: #edf5fd,
$theme-color-accent-cool-light: #b6d6f6,
$theme-color-accent-cool: #4899e8,    // Bright Blue Brooks
$theme-color-accent-cool-dark: #015a76,
$theme-color-accent-cool-darker: #00365c
```

Why these choices:

- `base-dark` stays a neutral system gray (`gray-cool-60`) for borders and tags.
- `primary-vivid` is Tech Teal and `secondary-vivid` equals `secondary`: the
  brand has no vivid jade, and a USWDS default there would introduce a red.
- `secondary-dark` (5.27:1 with white) and `accent-warm-dark` (7.65:1 with
  white) are kept dark so that white text passes. `accent-warm` is never text
  on a light background (1.15:1 on white).
- Only `primary` and `secondary` have a vivid grade in the palette the pages
  document; there is no `accent-warm-vivid` or `accent-cool-vivid`.
- Every grade is set explicitly, so the `$theme-color-<family>-family` settings
  stay at the USWDS defaults (base `gray-cool`, primary `blue`, secondary `red`,
  accent-warm `orange`, accent-cool `blue-cool`, error `red-warm`, warning
  `gold`, success `green-cool`, info `cyan`, disabled `gray`) and change no
  token.

### State colours

The build sets the base, dark and lighter grades of four families (danger and
amber are functional colours the design system adds; the brand guide defines
neither):

```scss
$theme-color-error-lighter: #fcebec,
$theme-color-error: #dc3545,
$theme-color-error-dark: #a52834,
$theme-color-warning-lighter: #fef6e9,
$theme-color-warning: #f5a623,
$theme-color-warning-dark: #c4851c,
$theme-color-success-lighter: #e8f7f4,
$theme-color-success: #1cae96,
$theme-color-success-dark: #0d7a63,
$theme-color-info-lighter: #edf5fd,
$theme-color-info: #4899e8,
$theme-color-info-dark: #015a76
```

At the USWDS default: `error-light` (`'red-warm-30v'`), `error-darker`
(`'red-70'`), `warning-light` (`'yellow-10v'`), `warning-darker`
(`'gold-50v'`), `success-light` (`'green-cool-20v'`), `success-darker`
(`'green-cool-60v'`), `info-light` (`'cyan-20'`), `info-darker`
(`'blue-cool-60'`), all five `disabled` grades (`'gray-20'`, `'gray-40'`,
`'gray-50'`, `'gray-70'`, `'gray-90'`), `$theme-color-emergency`
(`'red-warm-60v'`) and `$theme-color-emergency-dark` (`'red-warm-80'`).

### Document colours

| Setting                                                                    | PathAble value                                                  | Why                                       |
| -------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------- |
| `$theme-body-background-color`                                             | `'white'`                                                       | Page background                           |
| `$theme-text-color`                                                        | `'ink'` (PathAble Blue)                                         | Body text                                 |
| `$theme-link-color`, `$theme-link-hover-color`, `$theme-link-active-color` | `'accent-cool-dark'` (Tech Teal), `'primary'`, `'primary-dark'` | Link colours                              |
| `$theme-link-visited-color`                                                | `'accent-cool-dark'` (Tech Teal)                                | Visited link, same as `$theme-link-color` |
| `$theme-focus-color`                                                       | `'accent-cool'` (Bright Blue Brooks)                            | Focus outline                             |

### Colour utility output

| Setting                                                   | PathAble value                                                           | Effect                                                                                                                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$global-color-palettes`                                  | `('palette-color-default')`                                              | Theme, state, basic, grayscale and global tokens get classes. The system palette (`palette-color-system`) is not added, so no `bg-red-50v`-style class exists. |
| `$background-color-palettes`, `$color-palettes`           | `()`                                                                     | No extra palettes on one module                                                                                                                                |
| `$background-color-manual-values`, `$color-manual-values` | `()`                                                                     | No extra tokens                                                                                                                                                |
| `$background-color-settings`, `$color-settings`           | `output: true`, `responsive: false`, `hover: true`, other states `false` | `bg-` and `text-` classes get a `hover:` variant only                                                                                                          |
| `$border-color-palettes`                                  | `()`                                                                     | Border colour uses the global palettes                                                                                                                         |
| `$outline-color-palettes`                                 | `('palette-outline-color-default')`                                      | Added to the global palettes                                                                                                                                   |
| `$outline-color-settings`                                 | `output: true`, `responsive: false`, every state `false`                 | USWDS sets `hover: false` for outline colour; `outline-<token>` has no `hover:` variant                                                                        |
| `$text-decoration-color-palettes`                         | `()`                                                                     | `underline-<token>` uses the global palettes                                                                                                                   |
| `$text-decoration-color-settings`                         | `responsive: false`, `hover: true`                                       | `underline-<token>` has a `hover:` variant                                                                                                                     |

## Typography

Source of the values: the brand guide for typefaces and roles; the USWDS
defaults for everything else unless a row says otherwise. Component pages:
[Typesetting](../../components/tokens-typesetting.md),
[Font family](../../components/tokens-typesetting-font-family.md),
[Font size](../../components/tokens-typesetting-font-size.md),
[Font weight](../../components/tokens-typesetting-font-weight.md),
[Line height](../../components/tokens-typesetting-line-height.md),
[Letter spacing](../../components/tokens-typesetting-letterspacing.md),
[Measure](../../components/tokens-typesetting-measure.md).

### Typefaces and roles

```scss
$theme-typeface-tokens: (
  'fredoka': (
    'display-name': 'Fredoka',
    'cap-height': 362px,
    'stack': "'Fredoka', system-ui, sans-serif",
  ),
  'nunito': (
    'display-name': 'Nunito',
    'cap-height': 362px,
    'stack': "'Nunito', system-ui, sans-serif",
  ),
  'poppins': (
    'display-name': 'Poppins',
    'cap-height': 362px,
    'stack': "'Poppins', system-ui, sans-serif",
  ),
  'montserrat': (
    'display-name': 'Montserrat',
    'cap-height': 362px,
    'stack': "'Montserrat', system-ui, sans-serif",
  ),
),
$theme-font-type-sans: 'nunito',
$theme-font-type-serif: 'fredoka',
$theme-font-type-cond: 'montserrat',
$theme-font-role-alt: 'cond'
```

| Setting                                               | PathAble value                                   | USWDS default       |
| ----------------------------------------------------- | ------------------------------------------------ | ------------------- |
| `$theme-font-type-sans`                               | `'nunito'`                                       | `'source-sans-pro'` |
| `$theme-font-type-serif`                              | `'fredoka'`                                      | `'merriweather'`    |
| `$theme-font-type-cond`                               | `'montserrat'`                                   | `false`             |
| `$theme-font-type-mono`                               | `'roboto-mono'`                                  | `'roboto-mono'`     |
| `$theme-font-type-icon`, `-lang`                      | `false`                                          | `false`             |
| `$theme-font-role-heading`                            | `'serif'`                                        | `'serif'`           |
| `$theme-font-role-body`, `-ui`                        | `'sans'`                                         | `'sans'`            |
| `$theme-font-role-code`                               | `'mono'`                                         | `'mono'`            |
| `$theme-font-role-alt`                                | `'cond'`                                         | `'serif'`           |
| `$theme-body-font-family`, `$theme-prose-font-family` | `'body'`                                         | `'body'`            |
| `$theme-lead-font-family`                             | `'heading'`                                      | `'heading'`         |
| `$theme-font-path`                                    | `'../fonts'`                                     | `'../fonts'`        |
| `$theme-font-browser-compatibility`                   | `false`                                          | `false`             |
| `$theme-font-<type>-custom-stack`, `-custom-src`      | `false` for every type                           | `false`             |
| `$theme-respect-user-font-size`                       | `true`                                           | `true`              |
| `$theme-root-font-size`                               | `10px` (ignored while the setting above is true) | `10px`              |
| `$theme-style-body-element`                           | `false`                                          | `false`             |

Why these choices:

- Each `cap-height` is `362px`, the USWDS base optical size, so the four brand
  typefaces share one column of normalised sizes and line heights.
- `font-family-cond` and the `-cond` size classes exist because the build sets
  the `cond` type to Montserrat; USWDS leaves it `false`, which outputs no
  condensed classes.
- `$theme-font-role-alt` points at `cond` so the alternate heading face can be
  selected independently of `sans`.
- Poppins is a typeface token so its optical size is known, but no type or role
  points at it, so no `font-family` class selects it.
- The package declares one `@font-face` rule per loaded brand file, with
  `font-display: swap`, against `$theme-font-path`; Roboto Mono is loaded at
  300, 400 and 700.

### Sizes and element styles

| Setting                                                      | PathAble value                  | USWDS default |
| ------------------------------------------------------------ | ------------------------------- | ------------- |
| `$theme-type-scale-3xs`                                      | `1`                             | `2`           |
| `$theme-type-scale-md`                                       | `7`                             | `6`           |
| `$theme-type-scale-lg`                                       | `10`                            | `9`           |
| `$theme-type-scale-2xs`, `-xs`, `-sm`, `-xl`, `-2xl`, `-3xl` | `3`, `4`, `5`, `12`, `14`, `15` | same          |
| `$theme-body-font-size`                                      | `'sm'`                          | `'sm'`        |
| `$theme-display-font-size`                                   | `'xl'`                          | `'3xl'`       |
| `$theme-h1-font-size`                                        | `'lg'`                          | `'2xl'`       |
| `$theme-h2-font-size`                                        | `'md'`                          | `'xl'`        |
| `$theme-h3-font-size`                                        | `'md'`                          | `'lg'`        |
| `$theme-h4-font-size`                                        | `'sm'`                          | `'sm'`        |
| `$theme-h5-font-size`                                        | `'2xs'`                         | `'xs'`        |
| `$theme-h6-font-size`                                        | `'3xs'`                         | `'3xs'`       |
| `$theme-small-font-size`                                     | `'2xs'`                         | `'2xs'`       |
| `$theme-lead-font-size`                                      | `'lg'`                          | `'lg'`        |

The scale changes (`3xs`, `md`, `lg`) match the brand type scale: 12px, 18px
and 24px.

### Line height, measure, weight and letter spacing

| Setting                                                                                                | PathAble value                                                               | USWDS default                  |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------ |
| `$theme-body-line-height`                                                                              | `5`                                                                          | `5`                            |
| `$theme-heading-line-height`                                                                           | `3`                                                                          | `2`                            |
| `$theme-lead-line-height`                                                                              | `6`                                                                          | `6`                            |
| `$theme-text-measure-narrow`, `$theme-text-measure`, `$theme-text-measure-wide`, `$theme-lead-measure` | `1`, `4`, `6`, `6`                                                           | same                           |
| `$theme-font-weight-thin`, `-light`, `-normal`, `-medium`                                              | `false`, `300`, `400`, `false`                                               | `false`, `300`, `400`, `false` |
| `$theme-font-weight-semibold`                                                                          | `600`                                                                        | `false`                        |
| `$theme-font-weight-bold`, `-heavy`                                                                    | `700`, `false`                                                               | `700`, `false`                 |
| `$theme-generate-all-weights`                                                                          | `false` (affects only the `@font-face` rules USWDS writes for its own faces) | `false`                        |

Why these choices:

- `semibold` is on at 600 so `text-semibold` exists: Nunito SemiBold is a
  design-system addition for UI labels. Fredoka and Nunito ship no 300 or 700
  file, so `text-light` and `text-bold` on them are drawn from the nearest
  loaded file.
- `thin`, `medium` and `heavy` stay off because no brand face ships those
  files; turning one on without a font file only produces a synthesised weight.
- The heading line height is token `3`, which normalises to 1.4; body text is
  token `5`, which normalises to 1.6.
- Letter spacing and measure have no PathAble settings: the USWDS defaults are
  used.
- `$theme-heading-margin-top` (`1.5em`), `$theme-paragraph-margin-top` (`1em`)
  and the component line-height settings such as `$theme-input-line-height`
  stay at the USWDS defaults.

## Spacing

The spacing tokens are fixed by USWDS and not configurable. The settings below
are at the USWDS defaults; the brand does not override them. Component pages:
[Spacing units](../../components/tokens-spacing-units.md),
[Layout grid](../../components/utilities-layout-grid.md).

| Setting                                                         | Value                                                                                                         | Effect                                                   |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `$theme-respect-user-font-size`                                 | `true`                                                                                                        | `rem` against a 100% root                                |
| `$theme-utility-breakpoints`                                    | `mobile-lg`, `tablet`, `desktop` on; `card`, `card-lg`, `mobile`, `tablet-lg`, `desktop-lg`, `widescreen` off | Which named tokens produce responsive prefixes           |
| `$theme-grid-container-max-width`                               | `'desktop'`                                                                                                   | `max-width` of `grid-container` (64rem)                  |
| `$theme-site-margins-width`, `$theme-site-margins-mobile-width` | `4`, `2`                                                                                                      | Container side padding (2rem, 1rem)                      |
| `$theme-site-margins-breakpoint`                                | `'desktop'`                                                                                                   | Where the container switches to the wider padding        |
| `$theme-column-gap-mobile`, `-desktop`                          | `2`, `4`                                                                                                      | Bare `grid-gap` gutter below and above 64em (16px, 32px) |
| `$theme-column-gap-sm`, `-md`, `-lg`                            | `2px`, `2`, `3`                                                                                               | `grid-gap-sm`, `-md`, `-lg` (`grid-gap-lg` is 24px)      |
| `$theme-layout-grid-use-important`                              | `false`                                                                                                       | Grid classes without `!important`                        |

The layout grid is not a utilities module, so `$output-these-utilities` and the
`$<module>-settings` maps do not control it.

## Box sizing

| Setting                           | Value   | Effect                                                                                                                     |
| --------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| `$theme-global-border-box-sizing` | `false` | USWDS's `border-box-sizing` and `this-border-box-sizing` mixins emit `box-sizing: border-box` on the components themselves |

The build does not include `uswds-elements`, so it emits no global sizing
reset (`html { box-sizing: border-box }` and `*, *::before, *::after
{ box-sizing: inherit }`) and does not change elements it does not own. With
the setting off, each USWDS component that calls `border-box-sizing` is
border-box and its descendants and pseudo-elements inherit that, so content a
consumer places inside a form, fieldset, alert body, table, prose table,
summary box, search, side navigation, footer, tag, button, hint, input group,
checkbox label or radio label is border-box too. A footer's social links are
border-box by inheriting from the footer, so a social link outside a footer
stays content-box. `this-border-box-sizing` sets only the element itself: it
makes `grid-container` border-box (its `max-width` then includes its padding),
and also `grid-row` and the direct children of a `grid-gap` row (their gap
padding is then inside their width). The `grid-col` classes are border-box
whatever the setting, because the layout grid declares it on them directly. The card container is the exception: it takes USWDS's declarations
without the mixin, so card content keeps the sizing it has outside a card, and
only the card's own parts are border-box. Elements no mixin covers, such as the
pagination overflow item, the step indicator counter and the process list
marker, set `box-sizing` in their wrappers.

## Utilities output

Every utility module is output (`$output-these-utilities: default`) without
`!important` (`$utilities-use-important: false`), and the responsive prefixes
are `mobile-lg`, `tablet` and `desktop` (`$theme-utility-breakpoints`). Each
module also takes `active`, `focus`, `hover` and `visited` keys; unless a row
says otherwise they are `false`. The USWDS default is used for every value
below unless the "Brand choice" column says so. A `$<module>-manual-values`
map is `()` everywhere, so no extra token has a class.

| Page                                                                       | Modules                                                                                                                                                     | Output                                                                                                                                                                                | Brand choice                                                                                                                                                  |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Border](../../components/utilities-border.md)                             | `border`, `border-width`, `border-style`, `border-color`, `border-radius`                                                                                   | `border`, `border-color`: `responsive: true`, `hover: true`. `border-radius`: `responsive: true`, `hover: false`. `border-style`, `border-width`: `responsive: false`, `hover: false` | None. Radius tokens `$theme-border-radius-sm`, `-md`, `-lg` are `2px`, `0.5` units (0.25rem) and `1` unit (0.5rem), USWDS defaults not set by the brand guide |
| [Clearfix](../../components/utilities-clearfix.md)                         | `clearfix`                                                                                                                                                  | `output: true`, `responsive: false`                                                                                                                                                   | None                                                                                                                                                          |
| [Color](../../components/utilities-color.md)                               | `background-color`, `color`                                                                                                                                 | See Colour utility output above                                                                                                                                                       | Brand colours; system palette not output                                                                                                                      |
| [Display](../../components/utilities-display.md)                           | `display`, `opacity`, `overflow`, `position`, `top`, `right`, `bottom`, `left`, `pin`, `z-index`                                                            | `display`: `responsive: true`; the others `responsive: false`                                                                                                                         | None                                                                                                                                                          |
| [Flex](../../components/utilities-flex.md)                                 | `flex`, `flex-direction`, `flex-wrap`, `align-items`, `align-self`, `justify-content`, `order`                                                              | `justify-content`, `order`: `responsive: true`; the others `responsive: false`                                                                                                        | None                                                                                                                                                          |
| [Float](../../components/utilities-float.md)                               | `float`                                                                                                                                                     | `output: true`, `responsive: false`                                                                                                                                                   | None                                                                                                                                                          |
| [Font size and family](../../components/utilities-font-size-and-family.md) | `font`, `font-family`                                                                                                                                       | `font`: `responsive: true`; `font-family`: `responsive: false`; no states                                                                                                             | Brand typefaces, roles and type scale (see Typography)                                                                                                        |
| [Height and width](../../components/utilities-height-and-width.md)         | `height`, `width`, `max-height`, `max-width`, `min-height`, `min-width`, `add-aspect`, `circle`, `square`                                                   | `width`: `responsive: true`; the others `responsive: false`                                                                                                                           | None                                                                                                                                                          |
| [Layout grid](../../components/utilities-layout-grid.md)                   | Not a module; see Spacing                                                                                                                                   | Container and gutter settings at USWDS defaults                                                                                                                                       | None                                                                                                                                                          |
| [List reset](../../components/utilities-list-reset.md)                     | `add-list-reset`                                                                                                                                            | `output: true`, `responsive: false`                                                                                                                                                   | None                                                                                                                                                          |
| [Margin and padding](../../components/utilities-margin-and-padding.md)     | `margin` (including the horizontal and vertical variants), `padding`                                                                                        | `responsive: true`                                                                                                                                                                    | None                                                                                                                                                          |
| [Outline](../../components/utilities-outline.md)                           | `outline`, `outline-color`                                                                                                                                  | `output: true`, `responsive: false`, every state `false`. `$outline-palettes: ('palette-outline-default')`                                                                            | None                                                                                                                                                          |
| [Paragraph styles](../../components/utilities-paragraph-styles.md)         | `line-height`, `measure`, `text-align`, `text-indent`                                                                                                       | `line-height`, `measure`: `responsive: true`, no states. `text-align`, `text-indent`: `responsive: false`, no states                                                                  | Line heights 5, 3 and 6 for body, heading and lead (see Typography)                                                                                           |
| [Shadow](../../components/utilities-shadow.md)                             | `box-shadow`                                                                                                                                                | `output: true`, `responsive: false`, `hover: true`, other states `false`. `$box-shadow-palettes: ('palette-box-shadow-default')`                                                      | None                                                                                                                                                          |
| [Text styles](../../components/utilities-text-styles.md)                   | `font-style`, `font-weight`, `font-feature`, `letter-spacing`, `text-decoration`, `text-decoration-color`, `text-transform`, `vertical-align`, `whitespace` | `font-weight`: `responsive: true`, no states. `text-decoration`, `text-decoration-color`: `responsive: false`, `hover: true`. The others: `responsive: false`, no states.             | `semibold` weight on at 600 (see Typography)                                                                                                                  |

While the styles refactor catches up
([target state](../engineering/target-state.md)), `_uswds-theme.scss` turns
the `responsive` and `hover` variants off for every module whose table row says
otherwise, except where a `tokens-*` or `utilities-*` fixture uses one: `order`,
`display`, `font`, `line-height`, `measure`, `margin`, `padding`, `border` and
`border-radius` keep `mobile-lg:`, `tablet:` and `desktop:` (for example
`tablet:order-first`, `tablet:display-none`, `tablet:padding-4`), and
`box-shadow`, `color` and `background-color` keep `hover:` (`hover:shadow-4`,
`hover:bg-primary`). A variant joins the build when a fixture needs it. The
build outputs every USWDS utility module except `cursor`, which no page uses;
`_uswds-utility-classes.scss` lists them in USWDS's order.

The value sets are the `default` palette of each module (for example
`$font-weight-palettes`, `$measure-palettes`, `$box-shadow-palettes`). The
token pages that name a utility class
([Flex](../../components/tokens-flex.md),
[Opacity](../../components/tokens-opacity.md),
[Order](../../components/tokens-order.md),
[Shadow](../../components/tokens-shadow.md),
[Z-index](../../components/tokens-z-index.md)) are served by the same default
palettes (`palette-flex-default`, `palette-opacity-default`,
`palette-order-default`, `palette-box-shadow-default`,
`palette-z-index-default`). Letter spacing uses `palette-letter-spacing-default`.

## Changing a setting

A change here changes the compiled CSS, and so a documented guarantee. Change
the setting, rebuild, update the affected component page and its fixtures, and
add a changeset (see [`.changeset/README.md`](../../.changeset/README.md)).
