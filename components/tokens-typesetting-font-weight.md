---
name: Font weight
slug: tokens-typesetting-font-weight
kind: token
summary: Four font-weight tokens (light, normal, semibold, bold) matched to the brand's loaded font files.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/font-weight/
guarantees:
  - id: bold-weight
    claim: text-bold sets font-weight to 700.
  - id: semibold-weight
    claim: text-semibold sets font-weight to 600.
  - id: normal-keyword
    claim: text-normal sets font-weight to normal, and text-light sets font-weight to 300.
  - id: disabled-weights
    claim: No class exists for text-thin, text-medium or text-heavy, because their settings are false.
  - id: numeric-keys
    claim: font-weight(600) and font-weight(700) return 600 and 700, because the numeric keys 100 to 900 are always valid in Sass.
  - id: responsive-variants
    claim: 'Each font-weight class has mobile-lg:, tablet: and desktop: variants and no hover:, focus:, active: or visited: variants.'
---

# Font weight

Four font-weight tokens (light, normal, semibold, bold) matched to the brand's
loaded font files. A weight is enabled by giving it a number in a setting; a
weight set to `false` has no token and no class.

## When to use

- Emphasising a word or label with a token instead of a number: `text-bold`
  for strong emphasis, `text-semibold` for a UI label.
- Resetting a weight, such as a heading inside a card, with `text-normal`.

Use something else when:

- you want italic: that is font style, on the [Text styles](utilities-text-styles.md)
  page;
- the element is a heading or button the components already style: they set
  their own weight.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: weights -->

## Tokens

| Token      | Value at PathAble defaults | Setting                       | Font file loaded                     | Notes                                                 |
| ---------- | -------------------------- | ----------------------------- | ------------------------------------ | ----------------------------------------------------- |
| `thin`     | `false` (off)              | `$theme-font-weight-thin`     | none                                 | No class or token                                     |
| `light`    | 300                        | `$theme-font-weight-light`    | Roboto Mono only                     | Brand faces have no 300 file; drawn from the nearest  |
| `normal`   | the keyword `normal`       | `$theme-font-weight-normal`   | Fredoka, Nunito 400                  | Setting is 400, the weight of `@font-face` generation |
| `medium`   | `false` (off)              | `$theme-font-weight-medium`   | none                                 | No class or token                                     |
| `semibold` | 600                        | `$theme-font-weight-semibold` | Nunito 600                           | The brand's UI-label weight; USWDS default is off     |
| `bold`     | 700                        | `$theme-font-weight-bold`     | Montserrat, Poppins, Roboto Mono 700 | Fredoka and Nunito have no 700 file                   |
| `heavy`    | `false` (off)              | `$theme-font-weight-heavy`    | none                                 | No class or token                                     |

The numeric keys `100` to `900` are always valid as Sass arguments
(`font-weight(600)`) but have no classes.

The brand guide specifies Fredoka Regular, Nunito Regular and SemiBold (600, a
design-system addition for UI labels), and Montserrat and Poppins Bold. Other
weights are drawn by the browser from the nearest loaded file. USWDS generates
a `@font-face` rule only for the weights set to a number; the package declares
its own rules for the brand files.

## Sass

```scss
@use '@pathableai/styles' as *;

.plan-card__label {
  @include u-text('semibold'); // font-weight: 600
}

.plan-card__total {
  font-weight: font-weight('bold'); // 700
}
```

`font-weight($key)` and `fw($key)` return the weight. `u-text(...)` and
`u-font-weight(...)` set the property from a key, and `u-text` also accepts
letter-spacing, colour and other text keys. A key whose setting is `false`
is a Sass error.

## Utilities

| Class           | Property      | Page                                    |
| --------------- | ------------- | --------------------------------------- |
| `text-<weight>` | `font-weight` | [Text styles](utilities-text-styles.md) |

`<weight>` is `light`, `normal`, `semibold` or `bold` at the PathAble defaults.
The responsive prefixes `mobile-lg:`, `tablet:` and `desktop:` also work, for
example `tablet:text-bold`. Colours share the `text-` prefix (`text-primary`);
the value after it tells them apart.

## Settings

| Setting                       | PathAble default                            | USWDS default |
| ----------------------------- | ------------------------------------------- | ------------- |
| `$theme-font-weight-thin`     | `false`                                     | `false`       |
| `$theme-font-weight-light`    | `300`                                       | `300`         |
| `$theme-font-weight-normal`   | `400`                                       | `400`         |
| `$theme-font-weight-medium`   | `false`                                     | `false`       |
| `$theme-font-weight-semibold` | `600`                                       | `false`       |
| `$theme-font-weight-bold`     | `700`                                       | `700`         |
| `$theme-font-weight-heavy`    | `false`                                     | `false`       |
| `$theme-generate-all-weights` | `false`                                     | `false`       |
| `$font-weight-settings`       | `()` (output and responsive on; states off) | same          |

`$theme-generate-all-weights` only affects the `@font-face` rules USWDS writes
for its own faces.

```scss
@use '@pathableai/styles' with (
  $theme-font-weight-semibold: 600
);
```

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

`text-normal` emits the keyword `normal`, which is the same as 400.

## The consumer owns

- Not relying on weight alone to carry meaning; pair it with text, an icon or
  a position.
- Not using `text-bold` on Fredoka or Nunito headings and labels expecting a
  true bold: those faces have no 700 file, so the browser synthesises it. Use
  `text-semibold` for Nunito emphasis.
- Not enabling `thin`, `medium` or `heavy` without also shipping a font file
  for that weight.
