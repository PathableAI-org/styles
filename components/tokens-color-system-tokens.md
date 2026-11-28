---
name: Color system tokens
slug: tokens-color-system-tokens
kind: token
summary: The fixed USWDS colour palette of 25 families with numbered grades and vivid variants, which the theme and state tokens are built from and which stays at its USWDS values in PathAble.
uswds: https://designsystem.digital.gov/design-tokens/color/system-tokens/
guarantees:
  - id: system-values
    claim: 'The classes bg-red and bg-blue set background-color to #e52207 and #0076d6, the USWDS values of the system tokens red-50v and blue-50v, because PathAble does not change system tokens.'
  - id: default-grayscale
    claim: 'The classes bg-gray-5, bg-gray-10, bg-gray-30, bg-gray-50, bg-gray-70 and bg-gray-90 set background-color to #f0f0f0, #e6e6e6, #adadad, #757575, #454545 and #1b1b1b.'
  - id: basic-aliases
    claim: 'The classes bg-red, bg-orange, bg-gold, bg-yellow, bg-green, bg-mint, bg-cyan, bg-blue, bg-indigo, bg-violet and bg-magenta set background-color to #e52207, #e66f0e, #ffbe2e, #fee685, #538200, #04c585, #009ec1, #0076d6, #676cc8, #8168b3 and #d72d79.'
  - id: grades-not-classes
    claim: The compiled CSS has no class for a numbered system token, so bg-red-50v and bg-gray-cool-60 do not exist.
  - id: global-tokens
    claim: The classes bg-black, bg-white and bg-transparent set background-color to black, white and transparent.
  - id: text-pairs
    claim: Every swatch in the states of this page pairs its background with a text colour that has a contrast ratio of at least 4.5:1.
---

# Color system tokens

The fixed USWDS colour palette of 25 families with numbered grades and vivid
variants, which the theme and state tokens are built from and which stays at
its USWDS values in PathAble. A system token is named by family and grade,
such as `red-50v` or `gray-cool-60`; the number is the grade and a `v` suffix
marks the more saturated vivid variant. See the
[USWDS system tokens](https://designsystem.digital.gov/design-tokens/color/system-tokens/).

## When to use

- Looking up the value of a colour the brand does not define, such as a chart
  series colour or a status the theme tokens do not cover, to write your own
  rule with it.
- Finding the hex value behind a theme grade that is a neutral system colour,
  such as `base-dark` (`gray-cool-60`, `#565c65`).
- Picking two grades of one family for a text and background pair: a grade
  difference of 50 or more is expected to reach 4.5:1, 40 or more 3:1.

Use something else when:

- the colour has a role: use a [theme token](tokens-color-theme-tokens.md) or
  a [state token](tokens-color-state-tokens.md) so the brand reaches it;
- a brand surface needs a colour: system tokens are not brand colours.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: grayscale -->

## Values

PathAble does not change system tokens; the values are those of USWDS 3.14.0.
Only the global, grayscale and basic tokens have classes in PathAble's CSS.

| Group                | Tokens                                                                                                                                                                                                                                                        | In PathAble's CSS                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Chromatic families   | `red-cool`, `red`, `red-warm`, `orange-warm`, `orange`, `gold`, `yellow`, `green-warm`, `green`, `green-cool`, `mint`, `mint-cool`, `cyan`, `blue-cool`, `blue`, `blue-warm`, `indigo-cool`, `indigo`, `indigo-warm`, `violet`, `violet-warm`, `magenta` (22) | No                                        |
| Gray families        | `gray-cool`, `gray`, `gray-warm` (3)                                                                                                                                                                                                                          | No, except the six grayscale tokens below |
| Grades               | `5`, `10`, `20`, `30`, `40`, `50`, `60`, `70`, `80`, `90` on every family, as `<family>-<grade>`, for example `blue-cool-60`; gray families also have `1` to `4`, and `gray` also has `100`                                                                   | No                                        |
| Vivid grades         | `5v` to `80v` on the 22 chromatic families, as `<family>-<grade>v`, for example `red-50v`; there is no `90v`, and the gray families have no vivid grades                                                                                                      | No                                        |
| Transparent families | `black-transparent-<grade>`, `white-transparent-<grade>`                                                                                                                                                                                                      | No                                        |
| Global               | `black`, `white`, `transparent`                                                                                                                                                                                                                               | Yes                                       |
| Grayscale            | `gray-5`, `gray-10`, `gray-30`, `gray-50`, `gray-70`, `gray-90`                                                                                                                                                                                               | Yes                                       |
| Basic                | `red`, `orange`, `gold`, `yellow`, `green`, `mint`, `cyan`, `blue`, `indigo`, `violet`, `magenta`                                                                                                                                                             | Yes                                       |

The six grayscale tokens and their values:

| Token     | Value     |
| --------- | --------- |
| `gray-5`  | `#f0f0f0` |
| `gray-10` | `#e6e6e6` |
| `gray-30` | `#adadad` |
| `gray-50` | `#757575` |
| `gray-70` | `#454545` |
| `gray-90` | `#1b1b1b` |

Each basic name is a class alias for one system token:

| Basic name | System token  | Value     |
| ---------- | ------------- | --------- |
| `red`      | `red-50v`     | `#e52207` |
| `orange`   | `orange-40v`  | `#e66f0e` |
| `gold`     | `gold-20v`    | `#ffbe2e` |
| `yellow`   | `yellow-10v`  | `#fee685` |
| `green`    | `green-50v`   | `#538200` |
| `mint`     | `mint-30v`    | `#04c585` |
| `cyan`     | `cyan-40v`    | `#009ec1` |
| `blue`     | `blue-50v`    | `#0076d6` |
| `indigo`   | `indigo-50`   | `#676cc8` |
| `violet`   | `violet-50`   | `#8168b3` |
| `magenta`  | `magenta-50v` | `#d72d79` |

A grade is a luminance step: grade 0 is white and 100 is black. For text on a
background, two grades of one family that differ by 40 or more give at least
3:1, by 50 or more at least 4.5:1 and by 70 or more at least 7:1. This applies
to system tokens only; the theme and state tokens set to brand hex values do
not follow it, so check the ratio.

## Utilities

PathAble's CSS has `bg-`, `text-`, `border-`, `outline-` and `underline-`
classes for the grayscale, basic and global tokens only (`bg-gray-30`,
`text-blue`, `border-black`). The numbered system classes, such as
`bg-red-50v` and `text-gray-cool-60`, are not part of PathAble's CSS; use the
value in the tables above in your own rule when a design needs one.

The classes are documented in [Color](utilities-color.md),
[Border](utilities-border.md), [Outline](utilities-outline.md) and
[Text styles](utilities-text-styles.md). The `bg-`, `text-`, `border-` and
`underline-` classes accept the `hover:` prefix; `outline-` classes do not.

## States

Each state is one group of system tokens that the default stylesheet emits,
with the text class that keeps the pair at 4.5:1 or better.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Using system tokens only where the brand does not decide: a brand surface,
  button or heading takes a theme token.
- Checking contrast between any system colour and the colour next to it;
  `text-white` on `bg-orange`, `bg-gold`, `bg-yellow`, `bg-mint` or `bg-cyan`
  fails.
- Not relying on hue alone to separate series in a chart or status in a list.
