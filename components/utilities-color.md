---
name: Color
slug: utilities-color
kind: utility
summary: Utility classes that set the background colour and the text colour of an element from the PathAble theme colour tokens.
uswds: https://designsystem.digital.gov/utilities/color/
classes:
  - bg-<token>
  - text-<token>
  - hover:bg-<token>
  - hover:text-<token>
guarantees:
  - id: background-token
    claim: 'bg-primary sets background-color to #00365c, bg-primary-vivid to #015a76, bg-secondary to #1cae96, bg-accent-warm to #d3ff66, bg-accent-cool to #4899e8 and bg-base to #dde2e8.'
  - id: text-token
    claim: 'text-primary sets color to #00365c, text-primary-vivid to #015a76, text-secondary-dark to #0d7a63, text-base-dark to #565c65 and text-white to white.'
  - id: theme-grades
    claim: The stylesheet has bg-<token> and text-<token> for every enabled grade of the base, primary, secondary, accent-warm and accent-cool families, and has no bg-primary-lightest, bg-primary-darkest or bg-accent-warm-vivid.
  - id: system-palette-absent
    claim: The stylesheet has no rule for bg-red-50v, bg-blue-60v, text-blue-60v, bg-gray-20 or bg-gray-cool-30, and has rules for bg-red, bg-gray-10 and bg-gray-90.
  - id: hover-variant
    claim: 'hover:bg-primary-vivid sets background-color to #015a76 only while the element is hovered, and hover:text-primary sets color to #00365c only while it is hovered.'
  - id: no-other-variants
    claim: 'The stylesheet has no mobile-lg:, tablet: or desktop: variant of bg-<token> or text-<token>, and no focus:, active: or visited: variant.'
  - id: brand-contrast
    claim: text-white on bg-primary has a contrast ratio of 12.48:1, text-primary on bg-base-lightest 11.72:1, text-accent-warm on bg-primary 10.86:1, and text-primary-darker on bg-secondary 6.12:1.
---

# Color

Utility classes that set the background colour and the text colour of an
element from the PathAble theme colour tokens. `bg-primary` fills an element
with PathAble Blue and `text-white` sets its text to white; the token after the
prefix is a USWDS theme colour token, so the same names work in every
application that uses the package. The classes are single-property rules with
no prefix and no JavaScript.

## When to use

- Set the surface and text colour of a one-off panel, band or label without
  writing a component class.
- Give a status message a tinted surface and a text colour that meets
  contrast, such as `bg-error-lighter text-error-darker`.
- Change a surface or text colour on hover with `hover:bg-<token>` and
  `hover:text-<token>`.

Use something else when:

- the element is a component that already has a colour, such as a button, an
  alert or a tag: use the component's own class and variant;
- the colour has to change with a theme or with the user's contrast setting:
  put the colour in your own class that reads the theme, instead of fixing it
  in markup;
- the border or outline needs a colour: use the colour utilities of
  [Border](utilities-border.md) and [Outline](utilities-outline.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: brand-surfaces -->

## Classes

Each class sets one property. A token is a USWDS colour token name with no
`#` and no quotes.

| Class pattern  | Property           | Values                                                            |
| -------------- | ------------------ | ----------------------------------------------------------------- |
| `bg-<token>`   | `background-color` | Every token in the tables below, plus `transparent`               |
| `text-<token>` | `color`            | The same tokens, so `text-primary` and `bg-primary` use one value |

`text-` is also the prefix of the text style classes of
[Text styles](utilities-text-styles.md) and of the alignment classes of
[Paragraph styles](utilities-paragraph-styles.md), such as `text-bold` and
`text-center`. The token after the prefix decides which property is set, and
no token is shared between them.

### Theme colour tokens at PathAble defaults

The brand hex values come from the PathAble brand guide and are set as USWDS
theme colour settings. A token that is not in the guide has the USWDS default
value, marked "USWDS default".

| Family        | Token                                         | Value at PathAble defaults                       |
| ------------- | --------------------------------------------- | ------------------------------------------------ |
| `base`        | `base-lightest`, `base-lighter`, `base-light` | `#f6f8f9`, `#eef0f4`, `#e6e9ee`                  |
| `base`        | `base` (Shilling Silver)                      | `#dde2e8`                                        |
| `base`        | `base-dark`                                   | `#565c65` (USWDS `gray-cool-60`)                 |
| `base`        | `base-darker`, `base-darkest`, `ink`          | `#00365c` (PathAble Blue)                        |
| `primary`     | `primary-lighter`, `primary-light`            | `#e6ebef`, `#99afbe`                             |
| `primary`     | `primary`, `primary-vivid`                    | `#00365c` (PathAble Blue), `#015a76` (Tech Teal) |
| `primary`     | `primary-dark`, `primary-darker`              | `#002845`, `#001e33`                             |
| `secondary`   | `secondary-lighter`, `secondary-light`        | `#e8f7f4`, `#a4dfd5`                             |
| `secondary`   | `secondary`, `secondary-vivid`                | `#1cae96` (Intelligent Jade)                     |
| `secondary`   | `secondary-dark`, `secondary-darker`          | `#0d7a63`, `#0d4e44`                             |
| `accent-cool` | `accent-cool-lighter`, `accent-cool-light`    | `#edf5fd`, `#b6d6f6`                             |
| `accent-cool` | `accent-cool` (Bright Blue Brooks)            | `#4899e8`                                        |
| `accent-cool` | `accent-cool-dark`, `accent-cool-darker`      | `#015a76` (Tech Teal), `#00365c` (PathAble Blue) |
| `accent-warm` | `accent-warm-lighter`, `accent-warm-light`    | `#fbfff0`, `#edffc2`                             |
| `accent-warm` | `accent-warm` (Lived-In Lime)                 | `#d3ff66`                                        |
| `accent-warm` | `accent-warm-dark`, `accent-warm-darker`      | `#4a5924`, `#354019`                             |

The `primary`, `secondary`, `accent-cool` and `accent-warm` families have no
`-lightest` or `-darkest` grade (both settings are `false`), and `accent-warm`
and `accent-cool` have no `-vivid` grade, so those classes do not exist.

### State colour tokens at PathAble defaults

| Family      | Token                                            | Value at PathAble defaults                      |
| ----------- | ------------------------------------------------ | ----------------------------------------------- |
| `error`     | `error-lighter`, `error`, `error-dark`           | `#fcebec`, `#dc3545`, `#a52834`                 |
| `error`     | `error-light`, `error-darker`                    | `#f39268`, `#6f3331` (USWDS default)            |
| `warning`   | `warning-lighter`, `warning`, `warning-dark`     | `#fef6e9`, `#f5a623`, `#c4851c`                 |
| `warning`   | `warning-light`, `warning-darker`                | `#fee685`, `#936f38` (USWDS default)            |
| `success`   | `success-lighter`, `success`, `success-dark`     | `#e8f7f4`, `#1cae96`, `#0d7a63`                 |
| `success`   | `success-light`, `success-darker`                | `#70e17b`, `#216e1f` (USWDS default)            |
| `info`      | `info-lighter`, `info`, `info-dark`              | `#edf5fd`, `#4899e8`, `#015a76`                 |
| `info`      | `info-light`, `info-darker`                      | `#99deea`, `#2e6276` (USWDS default)            |
| `disabled`  | `disabled-lighter`, `disabled-light`, `disabled` | `#c9c9c9`, `#919191`, `#757575` (USWDS default) |
| `disabled`  | `disabled-dark`, `disabled-darker`               | `#454545`, `#1b1b1b` (USWDS default)            |
| `emergency` | `emergency`, `emergency-dark`                    | `#9c3d10`, `#332d29` (USWDS default)            |

`#dc3545` (error) and `#f5a623` (warning) are the design system's functional
status colours, for status only; see
[State color tokens](tokens-color-state-tokens.md).

### Other tokens output by default

| Tokens                                                                                            | Value                                                                                                                   |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `black`, `white`, `transparent`                                                                   | `black`, `white`, `transparent`                                                                                         |
| `gray-5`, `gray-10`, `gray-30`, `gray-50`, `gray-70`, `gray-90`                                   | `#f0f0f0`, `#e6e6e6`, `#adadad`, `#757575`, `#454545`, `#1b1b1b`                                                        |
| `red`, `orange`, `gold`, `yellow`, `green`, `mint`, `cyan`, `blue`, `indigo`, `violet`, `magenta` | `#e52207`, `#e66f0e`, `#ffbe2e`, `#fee685`, `#538200`, `#04c585`, `#009ec1`, `#0076d6`, `#676cc8`, `#8168b3`, `#d72d79` |

These are USWDS defaults. None is a brand colour, and the brand guide asks for
no colour outside its palette, so prefer a theme token.

### System palette classes not output by default

Only the `default` colour palette is output: the tokens in the three tables
above. The rest of the USWDS system colour palette has no class, for example
`bg-red-50v`, `bg-blue-60v`, `text-blue-60v`, `bg-gray-20`, `bg-gray-cool-30`,
`bg-gray-warm-10`, `bg-gold-20v` and `bg-black-transparent-50`. That is every
graded family (`red-cool`, `red`, `red-warm`, `orange-warm`, `orange`, `gold`,
`yellow`, `green-warm`, `green`, `green-cool`, `mint`, `mint-cool`, `cyan`,
`blue-cool`, `blue`, `blue-warm`, `indigo-cool`, `indigo`, `indigo-warm`,
`violet`, `violet-warm`, `magenta`), the grades of `gray-cool` and
`gray-warm`, the grays `gray-1` to `gray-4`, `gray-20`, `gray-40`, `gray-60`,
`gray-80` and `gray-100`, and `black-transparent-*` and `white-transparent-*`.
Output them with `$global-color-palettes` or a module palette (see
[Settings](#settings)); that adds a class for every token to every module that
reads the palette, which makes the stylesheet much larger.

The values these classes take are defined by the design tokens: [Color tokens](tokens-color.md), [Theme color tokens](tokens-color-theme-tokens.md), [State color tokens](tokens-color-state-tokens.md) and [System color tokens](tokens-color-system-tokens.md).

## Variants

| Prefix                              | `bg-<token>`, `text-<token>` | Notes                                                                       |
| ----------------------------------- | ---------------------------- | --------------------------------------------------------------------------- |
| `mobile-lg:`, `tablet:`, `desktop:` | Not output                   | `$color-settings` and `$background-color-settings` have `responsive: false` |
| `hover:`                            | Output                       | `hover:bg-primary-vivid`, `hover:text-primary`: the rule ends in `:hover`   |
| `focus:`, `active:`, `visited:`     | Not output                   | Set the key to `true` in the module settings to output it                   |

The breakpoints are `min-width` media queries in `em`: `mobile-lg` 30em
(480px), `tablet` 40em (640px) and `desktop` 64em (1024px). A hover rule gives
no cue to keyboard or touch users, so it never carries meaning alone.

## Sass

`u-bg()` sets `background-color` and `u-text()` sets `color` from a theme or
other colour token. `u-bg()` and `u-color()` take a token string; both accept
more than one argument and `!important`. `color()` returns the value of a
token for any other property.

```scss
@use '@pathableai/styles' as *;

.support-plan-summary {
  @include u-bg('primary-lighter');
  @include u-text('primary-dark');

  &:hover {
    @include u-bg('primary-light');
  }
}

.support-plan-summary__rule {
  border-color: color('primary-vivid');
}
```

`u-text()` also accepts the text style tokens of
[Text styles](utilities-text-styles.md), so
`u-text('primary', 'bold')` sets a colour and a weight in one call. Quote
tokens with single quotes. A token that is not output as a class is still
valid in a mixin or in `color()`, because the Sass colour functions read the
full system palette.

## Settings

| Setting                                                   | PathAble default                                                         | What it does                                                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `$theme-color-<family>-<grade>`                           | The brand values in the tables above                                     | The value of each theme colour token; set to a hex value or a system token name, or to `false` to remove a grade |
| `$output-these-utilities`                                 | `default` (every module)                                                 | A list of module names to output; `background-color` and `color` are the modules of this page                    |
| `$global-color-palettes`                                  | `('palette-color-default')`                                              | The palettes added to `background-color`, `border-color`, `color` and `text-decoration-color`                    |
| `$background-color-palettes`, `$color-palettes`           | `()`                                                                     | Palettes added to only that module, for example `('palette-color-system')`                                       |
| `$background-color-manual-values`, `$color-manual-values` | `()`                                                                     | A map of extra tokens, such as `('region-banner': #eef0f4)`, which outputs `bg-region-banner`                    |
| `$background-color-settings`, `$color-settings`           | `output: true`, `responsive: false`, `hover: true`, other states `false` | Set `responsive`, `hover`, `focus`, `active` and `visited` per module                                            |
| `$utilities-use-important`                                | `false`                                                                  | Appends `!important` to every utility rule, responsive and state rules included                                  |
| `$theme-utility-breakpoints`                              | `mobile-lg`, `tablet` and `desktop` on                                   | Which responsive prefixes exist                                                                                  |

The palette names are `palette-color-default`, `palette-color-basic`,
`palette-color-grayscale`, `palette-color-theme`, `palette-color-state` and
`palette-color-system`. Pass settings in the `with (...)` clause of the first
`@use '@pathableai/styles'`:

```scss
@use '@pathableai/styles' with (
  $global-color-palettes: (
    'palette-color-default',
    'palette-color-system',
  ),
  $color-settings: (
    hover: false,
  )
);
```

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

The contrast ratios are those of the token values, computed with the WCAG
formula. Text of 18pt, or bold 14pt, needs 3:1 and smaller text needs 4.5:1.

Pairs that fail 4.5:1 for small text, so do not use them for it:

| Text                  | Surface              | Ratio           |
| --------------------- | -------------------- | --------------- |
| `text-white`          | `bg-secondary`       | 2.78:1          |
| `text-white`          | `bg-accent-cool`     | 3.00:1          |
| `text-primary`        | `bg-secondary`       | 4.48:1          |
| `text-primary`        | `bg-accent-cool`     | 4.16:1          |
| `text-warning-darker` | `bg-warning-lighter` | 4.28:1          |
| `text-accent-warm`    | any light surface    | 1.15:1 on white |

On `bg-secondary` and `bg-accent-cool` use `text-primary-darker` (6.12:1 and
5.67:1).

## The consumer owns

- Contrast. The classes do not check the pair you choose; keep text at 4.5:1
  (3:1 for large text) against its surface, and check the pair again when a
  token changes.
- Meaning that does not rely on colour. A status surface carries its status in
  text or an icon as well.
- Whether `text-<token>` and `bg-<token>` suit the element. A heading, a
  link, a button and a form control each take their colour from their
  component, and a colour class on top can hide a focus indicator or a state.
- Surfaces nested inside a coloured surface, which do not reset the text colour
  for you: set the text colour on the surface or on each child.
- Any palette added with the Settings above, and the larger stylesheet it
  produces.
