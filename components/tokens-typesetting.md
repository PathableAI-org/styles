---
name: Typesetting
slug: tokens-typesetting
kind: token
summary: How PathAble sets type, from typeface to role to size, line height and line length, through USWDS typesetting tokens.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/
guarantees:
  - id: heading-role-typeface
    claim: "family('heading') and the class font-family-heading resolve to the stack Fredoka, 'Fredoka', system-ui, sans-serif."
  - id: body-role-typeface
    claim: "family('body'), family('ui') and the classes font-family-body and font-family-ui resolve to the stack Nunito, 'Nunito', system-ui, sans-serif."
  - id: alt-role-typeface
    claim: "family('alt') and the class font-family-alt resolve to the stack Montserrat, 'Montserrat', system-ui, sans-serif."
  - id: rem-output
    claim: "Every size token resolves to a rem value and the compiled root font size is 100%, so text follows the reader's browser font size."
  - id: element-sizes
    claim: The brand size assignments are display xl (2rem), h1 lg (1.5rem), h2 and h3 md (1.13rem), h4 sm (1rem), h5 2xs (0.88rem) and h6 3xs (0.75rem).
  - id: body-defaults
    claim: Body text is set in the body role at size sm (1rem) with line height token 5 (1.6), and headings use line height token 3 (1.4).
  - id: poppins-unassigned
    claim: Poppins is defined as a typeface token but is assigned to no font type or role, so no font-family class or family() call returns it.
---

# Typesetting

How PathAble sets type, from typeface to role to size, line height and line
length, through USWDS typesetting tokens. Each token is a short key you give to
a utility class, a Sass function or a `$theme-*` setting; the compiled value is
a literal, with no CSS custom properties involved.

## When to use

- Choosing the one set of keys (role, size, line height, weight, letter
  spacing, measure) to describe text in markup or Sass, instead of writing
  `font-family`, `font-size` or `line-height` values by hand.
- Finding which typeface a role gives you, so a heading, a body paragraph, a
  button label and a code sample each get the right face.
- Deciding which of the six typesetting token pages to read next.

Use something else when:

- the question is how a whole heading, paragraph or list is styled: that is the
  component and prose pages, which already apply these tokens;
- you need spacing around the text rather than the text itself: use the spacing
  units tokens.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: roles -->

## Tokens

Type is described by a chain: a **role** names a job, a role points at a
**font type**, a type points at a **typeface token**, and the typeface token
holds the stack and the optical size used to normalise sizes. Classes, functions
and settings take the role or type key; the typeface token is never used
directly.

| Role      | Type    | Typeface token | Typeface    | Weights loaded | Notes                                           |
| --------- | ------- | -------------- | ----------- | -------------- | ----------------------------------------------- |
| `heading` | `serif` | `fredoka`      | Fredoka     | 400            | Headings and display text                       |
| `body`    | `sans`  | `nunito`       | Nunito      | 400, 600       | Running text; 600 is for labels                 |
| `ui`      | `sans`  | `nunito`       | Nunito      | 400, 600       | Buttons, form labels and other controls         |
| `alt`     | `cond`  | `montserrat`   | Montserrat  | 700            | Alternate heading, only where Fredoka is absent |
| `code`    | `mono`  | `roboto-mono`  | Roboto Mono | 300, 400, 700  | USWDS default; the brand guide does not name it |

Font types with no brand typeface are `icon` and `lang`, both `false`.
Poppins (Bold, 700) is the brand subheading face. It is defined as the
typeface token `poppins` and its file is shipped, but USWDS has no subheading
role, so no type or role points at it; to use it, write
`font-family: 'Poppins', system-ui, sans-serif` in your own rule.

The other typesetting tokens, each with its own page:

| Token          | Keys                                                     | Page                                                  |
| -------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| Font family    | roles `ui`, `heading`, `body`, `code`, `alt`; types      | [Font family](tokens-typesetting-font-family.md)      |
| Font size      | `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` | [Font size](tokens-typesetting-font-size.md)          |
| Line height    | `1` to `6`                                               | [Line height](tokens-typesetting-line-height.md)      |
| Font weight    | `light`, `normal`, `semibold`, `bold`                    | [Font weight](tokens-typesetting-font-weight.md)      |
| Letter spacing | `ls-neg-3` to `ls-3`, `auto`                             | [Letter spacing](tokens-typesetting-letterspacing.md) |
| Measure        | `1` to `6`, `none`                                       | [Measure](tokens-typesetting-measure.md)              |

Text sizes the brand applies to elements (USWDS defaults in brackets where they
differ):

| Setting                    | Token | Size at 16px root | USWDS default |
| -------------------------- | ----- | ----------------- | ------------- |
| `$theme-body-font-size`    | `sm`  | 1rem              |               |
| `$theme-display-font-size` | `xl`  | 2rem              | `3xl`         |
| `$theme-h1-font-size`      | `lg`  | 1.5rem            | `2xl`         |
| `$theme-h2-font-size`      | `md`  | 1.13rem           | `xl`          |
| `$theme-h3-font-size`      | `md`  | 1.13rem           | `lg`          |
| `$theme-h4-font-size`      | `sm`  | 1rem              |               |
| `$theme-h5-font-size`      | `2xs` | 0.88rem           | `xs`          |
| `$theme-h6-font-size`      | `3xs` | 0.75rem           |               |
| `$theme-small-font-size`   | `2xs` | 0.88rem           |               |

## Sass

`typeset()` sets family, size and line height together from role, size and
line height tokens; `null` falls back to the body defaults. The single-purpose
functions return one value each.

```scss
@use '@pathableai/styles' as *;

.intake-summary__title {
  @include typeset('heading', 'lg', 3); // Fredoka, 1.5rem, 1.4
}

.intake-summary__note {
  font-family: family('body');
  font-size: font-size('body', 'sm');
  line-height: line-height('body', 5);
  max-width: measure(4);
}
```

| Function or mixin                                            | Returns or sets                                       |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| `family($role-or-type)`, `ff()`, `font-family()`             | The font stack                                        |
| `font-size($family, $size)`                                  | The size in rem, normalised for the family            |
| `line-height($family, $key)`, `lh()`                         | Unitless line height, normalised for the family       |
| `font-weight($key)`, `fw()`                                  | The weight                                            |
| `letter-spacing($key)`, `ls()`                               | The letter spacing                                    |
| `measure($key)`                                              | The maximum line length                               |
| `u-font($family, $size)`                                     | `font-family` and `font-size`                         |
| `u-font-family`, `u-font-size`, `u-line-height`              | One property each                                     |
| `u-text(...)`, `u-font-weight(...)`, `u-measure(...)`        | Weight, letter spacing and measure by key             |
| `typeset($family, $size, $line-height)`                      | `font-family`, `font-size` and `line-height`          |
| `typeset-h1` to `typeset-h6`, `typeset-display`, `typeset-p` | The element styles from the `$theme-*` settings below |

## Utilities

| Token          | Classes                      | Page                                                      |
| -------------- | ---------------------------- | --------------------------------------------------------- |
| Font family    | `font-family-<role>`         | [Font size and family](utilities-font-size-and-family.md) |
| Font size      | `font-<family>-<size>`       | [Font size and family](utilities-font-size-and-family.md) |
| Font weight    | `text-<weight>`              | [Text styles](utilities-text-styles.md)                   |
| Letter spacing | `text-ls-<key>`              | [Text styles](utilities-text-styles.md)                   |
| Line height    | `line-height-<family>-<key>` | [Paragraph styles](utilities-paragraph-styles.md)         |
| Measure        | `measure-<key>`              | [Paragraph styles](utilities-paragraph-styles.md)         |

## Settings

Typesetting settings are Sass variables. Configure them with `@use '@pathableai/styles' with (...)`; the values below are the PathAble
defaults, so a consumer lists only what it changes.

| Setting                               | PathAble default                                         | USWDS default       |
| ------------------------------------- | -------------------------------------------------------- | ------------------- |
| `$theme-typeface-tokens`              | `fredoka`, `nunito`, `poppins`, `montserrat` (see below) | none                |
| `$theme-font-type-sans`               | `'nunito'`                                               | `'source-sans-pro'` |
| `$theme-font-type-serif`              | `'fredoka'`                                              | `'merriweather'`    |
| `$theme-font-type-cond`               | `'montserrat'`                                           | `false`             |
| `$theme-font-type-mono`               | `'roboto-mono'`                                          | `'roboto-mono'`     |
| `$theme-font-type-icon`, `-lang`      | `false`                                                  | `false`             |
| `$theme-font-role-heading`            | `'serif'`                                                | `'serif'`           |
| `$theme-font-role-body`, `-ui`        | `'sans'`                                                 | `'sans'`            |
| `$theme-font-role-code`               | `'mono'`                                                 | `'mono'`            |
| `$theme-font-role-alt`                | `'cond'`                                                 | `'serif'`           |
| `$theme-type-scale-3xs`               | `1`                                                      | `2`                 |
| `$theme-type-scale-md`                | `7`                                                      | `6`                 |
| `$theme-type-scale-lg`                | `10`                                                     | `9`                 |
| `$theme-body-font-family`             | `'body'`                                                 | `'body'`            |
| `$theme-body-font-size`               | `'sm'`                                                   | `'sm'`              |
| `$theme-body-line-height`             | `5`                                                      | `5`                 |
| `$theme-heading-line-height`          | `3`                                                      | `2`                 |
| `$theme-lead-font-family`, `-size`    | `'heading'`, `'lg'`                                      | `'heading'`, `'lg'` |
| `$theme-lead-line-height`, `-measure` | `6`, `6`                                                 | `6`, `6`            |
| `$theme-text-measure`                 | `4`                                                      | `4`                 |
| `$theme-prose-font-family`            | `'body'`                                                 | `'body'`            |
| `$theme-respect-user-font-size`       | `true`                                                   | `true`              |
| `$theme-style-body-element`           | `false`                                                  | `false`             |
| `$theme-font-path`                    | `'../fonts'`                                             | `'../fonts'`        |
| `$theme-font-browser-compatibility`   | `false`                                                  | `false`             |

`$theme-heading-margin-top` (`1.5em`) and `$theme-paragraph-margin-top` (`1em`)
are the USWDS defaults. The per-token settings (`$theme-h1-font-size` and its
siblings, `$theme-font-weight-*`) are on the token pages above.

The custom typeface definition. Each entry is a typeface token: `display-name`
is the name in the `@font-face` rule, `cap-height` is the optical size USWDS
uses to normalise sizes against its 362px baseline, and `stack` is the fallback
stack that follows the display name.

```scss
@use '@pathableai/styles' with (
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
);
```

The package ships the font files in its `fonts/` folder and declares the
`@font-face` rules against `$theme-font-path`, which is `../fonts` relative to
the compiled stylesheet. Set `$theme-font-path` only if you copy the files
somewhere else.

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

Sizes and line heights are normalised by USWDS and rounded to two decimals in
rem, so the compiled sizes differ slightly from the nominal pixel sizes. The
normalisation assumes every brand typeface has the same optical size, as the
typeface definition above does.

## The consumer owns

- Loading no other typeface for these roles: a second face changes the sizes
  that were normalised for the brand faces.
- Using only the weights that are loaded (see Font weight); a weight with no
  file is drawn by the browser from the nearest one.
- Reading the user's font size: keep `$theme-respect-user-font-size` true and
  never set a pixel `font-size` on `html`.
- Choosing heading levels for document structure, not for size: pick the
  element by outline and the size class by appearance.
