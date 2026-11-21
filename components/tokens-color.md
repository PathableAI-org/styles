---
name: Color
slug: tokens-color
kind: token
summary: How PathAble colour tokens are organised into theme, state, system, basic and grayscale tokens, and how one token name is the suffix of the colour utility classes.
uswds: https://designsystem.digital.gov/design-tokens/color/overview/
guarantees:
  - id: brand-primary
    claim: The class bg-primary sets background-color to #00365c (PathAble Blue).
  - id: ink-and-white
    claim: The class text-ink sets color to #00365c and the class text-white sets color to white.
  - id: unprefixed-utilities
    claim: The classes bg-primary, text-primary, border-primary, outline-primary and underline-primary exist with no prefix and set background-color, color, border-color, outline-color and text-decoration-color to #00365c.
  - id: default-palettes
    claim: The compiled CSS has colour classes for the theme, state, basic, grayscale and global tokens, and has no class for a system token such as bg-red-50v.
  - id: unset-grades
    claim: No bg-primary-lightest or bg-primary-darkest class exists, because PathAble defines no lightest or darkest grade for primary.
  - id: hover-only-state
    claim: The classes hover:bg-primary, hover:text-primary, hover:border-primary and hover:underline-primary exist, hover:outline-primary does not, and no responsive, focus, active or visited prefix exists for any colour class.
---

# Color

How PathAble colour tokens are organised into theme, state, system, basic and
grayscale tokens, and how one token name is the suffix of the colour
utility classes. A colour token is a name that selects a colour: it is the
suffix of the `bg-`, `text-`, `border-`, `outline-` and `underline-` classes.
The values come from the PathAble brand guide; the design system defines them
and USWDS provides the mechanism. See the
[USWDS colour overview](https://designsystem.digital.gov/design-tokens/color/overview/).

## When to use

- Naming a colour in markup: use a class built from a theme or state token such
  as `bg-primary-dark` or `text-error`, never a hex value, so a brand change
  reaches every use.
- Choosing a background and text pair: start from the pairings below, then
  check the ratio of any other pair.
- Deciding which token page applies: [theme tokens](tokens-color-theme-tokens.md)
  for roles such as `primary` and `base`, [state tokens](tokens-color-state-tokens.md)
  for `error`, `warning`, `success`, `info`, `disabled` and `emergency`, and
  [system tokens](tokens-color-system-tokens.md) for the fixed USWDS palette.

Use something else when:

- the colour belongs to a component: the component's own class sets it, so do
  not repaint it with a utility.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: pairings -->

## Values

There are five kinds of colour token, plus the global tokens. A kind has colour
classes only where the column says so.

| Kind      | Names                                                                                                                                        | In PathAble's CSS  | Notes                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Theme     | `base`, `primary`, `secondary`, `accent-warm`, `accent-cool`, each with grades, and `ink`                                                    | Yes                | PathAble brand values. The brand colours live here. See [theme tokens](tokens-color-theme-tokens.md).          |
| State     | `error`, `warning`, `success`, `info`, `disabled`, `emergency`, each with grades                                                             | Yes                | PathAble brand values for the base, dark and lighter grades. See [state tokens](tokens-color-state-tokens.md). |
| Basic     | `red`, `orange`, `gold`, `yellow`, `green`, `mint`, `cyan`, `blue`, `indigo`, `violet`, `magenta`                                            | Yes (classes only) | Class aliases for one system token each. See [system tokens](tokens-color-system-tokens.md).                   |
| Grayscale | `gray-5`, `gray-10`, `gray-30`, `gray-50`, `gray-70`, `gray-90`                                                                              | Yes                | Fixed system tokens.                                                                                           |
| Global    | `black`, `white`, `transparent`                                                                                                              | Yes                | Fixed.                                                                                                         |
| System    | 25 families (for example `red-50v`, `blue-cool-60`, `gray-cool-60`), each with grades 5 to 90 and vivid `v` grades; gray families add 1 to 4 | No                 | USWDS values, unchanged. Not part of PathAble's CSS: classes such as `bg-red-50v` do not exist.                |

The PathAble brand colours sit in the theme and state tokens:

| Brand colour       | Hex       | Theme and state tokens that carry it                                  |
| ------------------ | --------- | --------------------------------------------------------------------- |
| PathAble Blue      | `#00365c` | `primary`, `accent-cool-darker`, `base-darker`, `base-darkest`, `ink` |
| Intelligent Jade   | `#1cae96` | `secondary`, `secondary-vivid`, `success`                             |
| Bright Blue Brooks | `#4899e8` | `accent-cool`, `info`                                                 |
| Tech Teal          | `#015a76` | `primary-vivid`, `accent-cool-dark`, `info-dark`                      |
| Lived-In Lime      | `#d3ff66` | `accent-warm`                                                         |
| Shilling Silver    | `#dde2e8` | `base`                                                                |

Approved text and background pairings, with the measured WCAG 2.x contrast
ratio. A ratio of 4.5:1 or more is required for text under 18pt (or 14pt bold);
3:1 or more for larger text.

| Background class                 | Text class         | Ratio             | Use                                                 |
| -------------------------------- | ------------------ | ----------------- | --------------------------------------------------- |
| `bg-base`                        | `text-ink`         | 9.58:1            | Preferred high-legibility pairing                   |
| `bg-white`                       | `text-ink`         | 12.48:1           | Body and heading text                               |
| `bg-primary`                     | `text-white`       | 12.48:1           | Primary surfaces                                    |
| `bg-primary`                     | `text-accent-warm` | 10.86:1           | Accent words on PathAble Blue                       |
| `bg-accent-warm`                 | `text-ink`         | 10.86:1           | Accent surfaces                                     |
| `bg-primary-vivid`               | `text-white`       | 7.71:1            | Dark supporting surfaces                            |
| `bg-secondary`                   | `text-black`       | 7.54:1            | Intelligent Jade surfaces; `text-white` is 2.78:1   |
| `bg-accent-cool`                 | `text-black`       | 7.00:1            | Bright Blue Brooks surfaces; `text-white` is 3.00:1 |
| `bg-secondary`, `bg-accent-cool` | `text-ink`         | 4.48:1 and 4.16:1 | Large text only                                     |

`accent-warm` must never be text on a light background (1.15:1 on white).
`secondary` and `accent-cool` must not carry white text.

## Utilities

| Property                | Class               | Page                                    |
| ----------------------- | ------------------- | --------------------------------------- |
| `background-color`      | `bg-<token>`        | [Color](utilities-color.md)             |
| `color`                 | `text-<token>`      | [Color](utilities-color.md)             |
| `border-color`          | `border-<token>`    | [Border](utilities-border.md)           |
| `outline-color`         | `outline-<token>`   | [Outline](utilities-outline.md)         |
| `text-decoration-color` | `underline-<token>` | [Text styles](utilities-text-styles.md) |

The `bg-`, `text-`, `border-` and `underline-` classes accept the `hover:`
prefix and no other state or responsive prefix; for example
`hover:bg-primary-dark`. `outline-<token>` has no `hover:` variant.

## States

Each state is complete markup for one use of colour tokens. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

## The consumer owns

- Checking the contrast of any pair that is not in the pairings table,
  including text on an image or a gradient; a token name does not guarantee a
  readable pair.
- Never using colour alone to carry meaning: pair a colour with text or an
  icon label.
- Choosing a token by role, not by how it looks: `error` for errors, not for
  any red.
- Writing its own rule for a system colour that has no class, using the hex
  value from [system tokens](tokens-color-system-tokens.md).
