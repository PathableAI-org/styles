---
name: Text styles
slug: utilities-text-styles
kind: utility
summary: Utility classes that set the weight, style, decoration, case, letter spacing, numeral style, vertical alignment and wrapping of text.
uswds: https://designsystem.digital.gov/utilities/text-styles/
classes:
  - text-<weight>
  - text-<style>
  - text-ls-<value>
  - text-<feature>
  - text-<decoration>
  - underline-<token>
  - text-<transform>
  - text-<vertical-align>
  - text-<white-space>
guarantees:
  - id: weights
    status: unverified
    claim: text-light sets font-weight to 300, text-normal to normal, text-semibold to 600 and text-bold to 700.
  - id: weights-not-output
    status: unverified
    claim: The stylesheet has no text-thin, text-medium or text-heavy rule, because those theme weights are false.
  - id: font-style
    status: unverified
    claim: text-italic sets font-style to italic and text-no-italic sets it to normal.
  - id: letter-spacing
    status: unverified
    claim: text-ls-neg-3 sets letter-spacing to -0.03em, text-ls-neg-1 to -0.01em, text-ls-1 to 0.025em, text-ls-2 to 0.1em, text-ls-3 to 0.15em and text-ls-auto to initial.
  - id: decoration
    status: unverified
    claim: text-underline sets text-decoration to underline, text-strike to line-through, and text-no-underline and text-no-strike to none.
  - id: decoration-color
    status: unverified
    claim: 'underline-primary sets text-decoration-color to #00365c and underline-accent-cool-dark to #015a76, and neither sets a text-decoration line.'
  - id: transform-and-feature
    status: unverified
    claim: text-uppercase sets text-transform to uppercase, text-lowercase to lowercase, text-no-uppercase and text-no-lowercase to none, text-tabular sets font-feature-settings to "tnum" 1, "kern" 1 and text-no-tabular sets it to "kern" 1.
  - id: vertical-align-and-wrap
    status: unverified
    claim: text-super sets vertical-align to super, text-ttop to text-top, text-tbottom to text-bottom, text-no-wrap sets white-space to nowrap, text-pre-line to pre-line and text-wrap to normal.
  - id: variants
    status: unverified
    claim: tablet:text-bold exists, tablet:text-italic, tablet:text-underline and tablet:text-ls-2 do not, and hover:text-underline and hover:underline-primary exist while hover:text-italic does not.
---

# Text styles

Utility classes that set the weight, style, decoration, case, letter spacing,
numeral style, vertical alignment and wrapping of text. `text-bold` sets the
weight, `text-italic` the style, `text-underline` a line under the text and
`text-uppercase` the case; each class sets one property and any number can be
combined on one element. The classes have no prefix and need no JavaScript.

## When to use

- Emphasise a word or a short run: `text-bold`, or `text-italic` for the
  brand's highlight style.
- Mark a label as a heading-like caption with `text-uppercase text-ls-2`, for
  a few words only.
- Keep figures in a column aligned with `text-tabular`.
- Stop a value breaking across lines (`text-no-wrap`), keep the line breaks of
  an address (`text-pre-line`) or raise a mark (`text-super`).

Use something else when:

- the text is emphasis with meaning in running text: use `<strong>` and `<em>`
  and add a class only to change how they look;
- the text is a link: links take their underline and colour from the link
  component (`pathable-link`);
- the change is a size or a typeface: use
  [Font size and family](utilities-font-size-and-family.md); for alignment,
  line height or line length use
  [Paragraph styles](utilities-paragraph-styles.md); for the text colour use
  [Color](utilities-color.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: weight-and-style -->

## Classes

`text-` is the prefix of the colour classes of [Color](utilities-color.md) and
the alignment classes of [Paragraph styles](utilities-paragraph-styles.md) as
well. The word after the prefix decides which property is set.

| Class pattern                                             | Property                | Values                                                                                                |
| --------------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------- |
| `text-light`, `text-normal`, `text-semibold`, `text-bold` | `font-weight`           | `300`, `normal`, `600`, `700`                                                                         |
| `text-italic`, `text-no-italic`                           | `font-style`            | `italic`, `normal`                                                                                    |
| `text-ls-<value>`                                         | `letter-spacing`        | `auto`, `neg-3`, `neg-2`, `neg-1`, `1`, `2`, `3`                                                      |
| `text-tabular`, `text-no-tabular`                         | `font-feature-settings` | `"tnum" 1, "kern" 1`, `"kern" 1`                                                                      |
| `text-underline`, `text-no-underline`                     | `text-decoration`       | `underline`, `none`                                                                                   |
| `text-strike`, `text-no-strike`                           | `text-decoration`       | `line-through`, `none`                                                                                |
| `underline-<token>`                                       | `text-decoration-color` | A colour token, such as `primary`, `accent-cool-dark` or `error-dark`                                 |
| `text-uppercase`, `text-no-uppercase`                     | `text-transform`        | `uppercase`, `none`                                                                                   |
| `text-lowercase`, `text-no-lowercase`                     | `text-transform`        | `lowercase`, `none`                                                                                   |
| `text-<vertical-align>`                                   | `vertical-align`        | `baseline`, `bottom`, `middle`, `sub`, `super`, `top`, `tbottom` (`text-bottom`), `ttop` (`text-top`) |
| `text-<white-space>`                                      | `white-space`           | `wrap` (`normal`), `no-wrap` (`nowrap`), `pre`, `pre-line`, `pre-wrap`                                |

### Weights at PathAble defaults

The theme sets only the weights the brand guide uses; a weight that is `false`
has no class.

| Class           | `$theme-font-weight-*` | Output                |
| --------------- | ---------------------- | --------------------- |
| `text-light`    | `300`                  | `font-weight: 300`    |
| `text-normal`   | keyword `normal`       | `font-weight: normal` |
| `text-semibold` | `600`                  | `font-weight: 600`    |
| `text-bold`     | `700`                  | `font-weight: 700`    |
| `text-thin`     | `false`                | Not output            |
| `text-medium`   | `false`                | Not output            |
| `text-heavy`    | `false`                | Not output            |

Nunito SemiBold (600) is the brand's weight for interface labels, so
`$theme-font-weight-semibold` is `600` by default (USWDS leaves it `false`) and
`text-semibold` is output. See [Font weight](tokens-typesetting-font-weight.md).

### Letter spacing tokens

| Token   | `letter-spacing` |
| ------- | ---------------- |
| `auto`  | `initial`        |
| `neg-3` | `-0.03em`        |
| `neg-2` | `-0.02em`        |
| `neg-1` | `-0.01em`        |
| `1`     | `0.025em`        |
| `2`     | `0.1em`          |
| `3`     | `0.15em`         |

### Underline colour tokens

`underline-<token>` takes the colour tokens of [Color](utilities-color.md): the
theme tokens (`underline-primary`, `underline-accent-cool-dark`), the state
tokens, `black`, `white`, `transparent`, and the basic and grayscale colours.
The USWDS system palette (`underline-red-50v`) is not output by default; see
[System palette classes not output by default](utilities-color.md#system-palette-classes-not-output-by-default).

The values these classes take are defined by the design tokens: [Font weight](tokens-typesetting-font-weight.md), [Letter spacing](tokens-typesetting-letterspacing.md) and [Color tokens](tokens-color.md).

## Variants

| Prefix                              | Output for                                                                                  | Not output for                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------ |
| `mobile-lg:`, `tablet:`, `desktop:` | `text-light`, `text-normal`, `text-semibold`, `text-bold`                                   | Every other class on this page |
| `hover:`                            | `text-underline`, `text-no-underline`, `text-strike`, `text-no-strike`, `underline-<token>` | Every other class on this page |
| `focus:`, `active:`, `visited:`     | None                                                                                        | Every class                    |

The breakpoints are `min-width` media queries in `em`: `mobile-lg` 30em
(480px), `tablet` 40em (640px) and `desktop` 64em (1024px). For example,
`text-normal tablet:text-bold` is normal on a phone and bold from 640px up.

## Sass

`u-text()` sets any of the weight, style, letter spacing, numeral style,
decoration, case, vertical alignment and white space tokens above and, for a
colour token, the text colour. It takes several arguments in one call.
`u-underline()` sets the decoration colour, and `u-font-weight()`,
`u-text-decoration()`, `u-vertical-align()` and `u-white-space()` set one
property each.

```scss
@use '@pathableai/styles' as *;

.referral-label {
  @include u-text('bold', 'uppercase', 'ls-2', 'primary');
}

.referral-link {
  @include u-text('underline');
  @include u-underline('primary-vivid');

  &:hover {
    @include u-text('no-underline');
  }
}

.referral-count {
  @include u-text('tabular', 'no-wrap');
}
```

Letter spacing tokens are written with the prefix, as `'ls-2'` and
`'ls-neg-1'`. Quote tokens with single quotes. Add `!important` as the last
argument to output `!important`.

## Settings

| Setting                                                                                                                                                                                                            | PathAble default                                      | What it does                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$theme-font-weight-thin`, `-light`, `-normal`, `-medium`, `-semibold`, `-bold`, `-heavy`                                                                                                                          | `false`, `300`, `400`, `false`, `600`, `700`, `false` | The weights that have a class; a number turns a class on, `false` turns it off                                                                                                                                           |
| `$theme-generate-all-weights`                                                                                                                                                                                      | `false`                                               | When `true`, outputs every weight from 100 to 900 as a class                                                                                                                                                             |
| `$output-these-utilities`                                                                                                                                                                                          | `default` (every module)                              | A list of module names to output; this page's modules are `font-style`, `font-weight`, `font-feature`, `letter-spacing`, `text-decoration`, `text-decoration-color`, `text-transform`, `vertical-align` and `whitespace` |
| `$font-weight-settings`                                                                                                                                                                                            | `responsive: true`, no states                         | Which prefixes the weight module outputs                                                                                                                                                                                 |
| `$text-decoration-settings`, `$text-decoration-color-settings`                                                                                                                                                     | `responsive: false`, `hover: true`                    | Which prefixes the decoration modules output                                                                                                                                                                             |
| `$font-style-settings`, `$font-feature-settings`, `$letter-spacing-settings`, `$text-transform-settings`, `$vertical-align-settings`, `$whitespace-settings`                                                       | `responsive: false`, no states                        | Which prefixes each module outputs                                                                                                                                                                                       |
| `$font-style-palettes`, `$font-weight-palettes`, `$font-feature-palettes`, `$letter-spacing-palettes`, `$text-decoration-palettes`, `$text-transform-palettes`, `$vertical-align-palettes`, `$whitespace-palettes` | The `default` palette of each                         | The value sets                                                                                                                                                                                                           |
| `$global-color-palettes`, `$text-decoration-color-palettes`                                                                                                                                                        | `('palette-color-default')`, `()`                     | The colour tokens that have an `underline-<token>` class                                                                                                                                                                 |
| `$utilities-use-important`                                                                                                                                                                                         | `false`                                               | Appends `!important` to every utility rule                                                                                                                                                                               |

Pass settings in the `with (...)` clause of the first `@use '@pathableai/styles'`
in your build, for example:

```scss
@use '@pathableai/styles' with (
  $theme-font-weight-light: false,
  $text-decoration-settings: (
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
is expected behaviour at PathAble defaults. One marked `status: unverified` was
read from the package source and no test checks it yet.

Where two classes on one element set the same property, the one later in the
stylesheet wins, not the one later in the `class` attribute.

## The consumer owns

- Loading the weights. `text-light`, `text-semibold` and `text-bold` ask for weights
  300, 600 and 700; the application loads font files that have them, or the browser
  synthesises a weight.
- Meaning. Bold, italic and underline carry no meaning for assistive
  technology; use `<strong>`, `<em>` and a text description where meaning
  matters.
- Underlines on things that are not links. A person reads an underline as a
  link, so use `text-underline` on non-link text only for a reason, and never
  remove the underline from a link that sits inside running text.
- Case. The brand guide asks for no body text in all caps: use
  `text-uppercase` on a few words, with `text-ls-2`, never on a sentence.
- Highlights. Use italic body text sparingly, as the brand guide asks.
