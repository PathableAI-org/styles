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
    claim: No class exists for text-thin, text-medium, text-heavy or any numeric weight such as text-500; PathAble outputs only text-light, text-normal, text-semibold and text-bold.
  - id: responsive-variants
    claim: 'Each font-weight class has mobile-lg:, tablet: and desktop: variants and no hover:, focus:, active: or visited: variants.'
---

# Font weight

Four font-weight tokens (light, normal, semibold, bold) matched to the brand's
loaded font files. A weight that PathAble does not output has no token and no
class.

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

## Values

| Token      | PathAble value       | USWDS default | Font file loaded                     | Notes                                                                |
| ---------- | -------------------- | ------------- | ------------------------------------ | -------------------------------------------------------------------- |
| `thin`     | not output           | not output    | none                                 | No class                                                             |
| `light`    | 300                  | 300           | Roboto Mono only                     | Fredoka and Nunito have no 300 file: drawn from the nearest weight   |
| `normal`   | the keyword `normal` | `normal`      | Fredoka, Nunito 400                  | The same as 400                                                      |
| `medium`   | not output           | not output    | none                                 | No class                                                             |
| `semibold` | 600                  | not output    | Nunito 600                           | PathAble outputs `text-semibold` at 600, the brand's UI-label weight |
| `bold`     | 700                  | 700           | Montserrat, Poppins, Roboto Mono 700 | Fredoka and Nunito have no 700 file                                  |
| `heavy`    | not output           | not output    | none                                 | No class                                                             |

Numeric weights such as 600 have no class of their own: write `text-semibold`.

The brand guide specifies Fredoka Regular, Nunito Regular and SemiBold (600, a
design-system addition for UI labels), and Montserrat and Poppins Bold. For any
other weight and face, the browser uses the nearest loaded file and may
synthesise the weight, which draws letterforms differently from a real weight.
Use the class on a face that ships the file: `text-light`, `text-normal` and
`text-bold` on Roboto Mono, `text-semibold` on Nunito, `text-bold` on
Montserrat.

## Utilities

| Class           | Property      | Page                                    |
| --------------- | ------------- | --------------------------------------- |
| `text-<weight>` | `font-weight` | [Text styles](utilities-text-styles.md) |

`<weight>` is `light`, `normal`, `semibold` or `bold` at the PathAble defaults.
The responsive prefixes `mobile-lg:`, `tablet:` and `desktop:` also work, for
example `tablet:text-bold`. Colours share the `text-` prefix (`text-primary`);
the value after it tells them apart.

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
  true bold: those faces have no 700 file, so the browser draws it from the
  nearest loaded file and may synthesise it. Use `text-semibold` for Nunito
  emphasis.
- Not using `text-light` on Fredoka or Nunito expecting a lighter face: there
  is no 300 file, so the text renders at the regular weight.
