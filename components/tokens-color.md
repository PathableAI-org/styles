---
name: Color
slug: tokens-color
kind: token
summary: How PathAble colour tokens are organised into theme, state, system, basic and grayscale tokens, and how one token name works as a Sass value and as a utility class suffix.
uswds: https://designsystem.digital.gov/design-tokens/color/overview/
guarantees:
  - id: literal-values
    claim: Colour tokens compile to literal colour values, so the compiled stylesheet declares no CSS custom property for any colour token.
  - id: brand-primary
    claim: color('primary') resolves to #00365c (PathAble Blue) and the class bg-primary sets background-color to #00365c.
  - id: ink-and-white
    claim: color('ink') resolves to #00365c, the class text-ink sets color to #00365c and the class text-white sets color to white.
  - id: unprefixed-utilities
    claim: The classes bg-primary, text-primary, border-primary, outline-primary and underline-primary exist with no prefix and set background-color, color, border-color, outline-color and text-decoration-color to #00365c.
  - id: default-palettes
    claim: The default stylesheet has colour classes for the theme, state, basic, grayscale and global tokens, and has no class for a system token such as red-50v.
  - id: unset-grades
    claim: The grades primary-lightest and primary-darkest are false, so color('primary-lightest') is a Sass error and no bg-primary-lightest class exists.
  - id: hover-only-state
    claim: The classes hover:bg-primary, hover:text-primary, hover:border-primary and hover:underline-primary exist, and no responsive, focus or active prefix is emitted for any colour class.
---

# Color

How PathAble colour tokens are organised into theme, state, system, basic and
grayscale tokens, and how one token name works as a Sass value and as a
utility class suffix. A colour token is a name that selects a colour; the same
name is the argument of `color()` in Sass and the suffix of `bg-`, `text-`,
`border-`, `outline-` and `underline-` classes. The values come from the
PathAble brand guide and are set through `$theme-color-*` settings; the
design system defines them, USWDS provides the mechanism. See the
[USWDS colour overview](https://designsystem.digital.gov/design-tokens/color/overview/).

## When to use

- Naming a colour in application CSS or SCSS: use a theme or state token such
  as `primary-dark` or `error`, never a hex value, so a theme override or a
  future brand change reaches every use.
- Choosing a background and text pair: start from the pairings below, then
  check the ratio of any other pair.
- Deciding which token page applies: [theme tokens](tokens-color-theme-tokens.md)
  for roles such as `primary` and `base`, [state tokens](tokens-color-state-tokens.md)
  for `error`, `warning`, `success`, `info`, `disabled` and `emergency`, and
  [system tokens](tokens-color-system-tokens.md) for the fixed USWDS palette.

Use something else when:

- the colour belongs to a component: the component's own class sets it, so do
  not repaint it with a utility;
- the colour must follow a runtime theme value: tokens are resolved when Sass
  compiles and are not CSS custom properties, so use the consumer's own
  properties for values that change at runtime.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: pairings -->

## Tokens

There are five kinds of colour token. Every kind is read by `color()` and, for
the kinds that the default palettes include, by the colour utility classes.

| Kind      | Names                                                                                                                                        | Class suffix emitted by default | Notes                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Theme     | `base`, `primary`, `secondary`, `accent-warm`, `accent-cool`, each with grades, and `ink`                                                    | Yes                             | Set by `$theme-color-*`. The brand colours live here. See [theme tokens](tokens-color-theme-tokens.md).                        |
| State     | `error`, `warning`, `success`, `info`, `disabled`, `emergency`, each with grades                                                             | Yes                             | Set by `$theme-color-*`. See [state tokens](tokens-color-state-tokens.md).                                                     |
| Basic     | `red`, `orange`, `gold`, `yellow`, `green`, `mint`, `cyan`, `blue`, `indigo`, `violet`, `magenta`                                            | Yes (classes only)              | Fixed aliases for one system token each. Not valid arguments of `color()`. See [system tokens](tokens-color-system-tokens.md). |
| Grayscale | `gray-5`, `gray-10`, `gray-30`, `gray-50`, `gray-70`, `gray-90`                                                                              | Yes                             | Fixed system tokens.                                                                                                           |
| Global    | `black`, `white`, `transparent`                                                                                                              | Yes                             | Fixed.                                                                                                                         |
| System    | 25 families (for example `red-50v`, `blue-cool-60`, `gray-cool-60`), each with grades 5 to 90 and vivid `v` grades; gray families add 1 to 4 | No                              | Valid in Sass with `color()`. Emitted as classes only after adding `'palette-color-system'` to `$global-color-palettes`.       |

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

## Sass

`color()` returns the colour for a token. Use the mixins `u-bg()`, `u-text()`,
`u-border-color()`, `u-outline-color()` and `u-underline()` to set one colour
property from a token:

```scss
@use '@pathableai/styles' as *;

.plan-summary {
  @include u-bg('base-lighter');
  @include u-text('ink');
  @include u-border-color('primary');
  box-shadow: 0 0 0 1px color('accent-cool');
}
```

`color()` accepts theme, state, system and global tokens, and a token set to
`false` is an error. It does not accept the basic names such as `'red'`; use
`color('red-50v')`.

## Utilities

| Property                | Class               | Page                                    |
| ----------------------- | ------------------- | --------------------------------------- |
| `background-color`      | `bg-<token>`        | [Color](utilities-color.md)             |
| `color`                 | `text-<token>`      | [Color](utilities-color.md)             |
| `border-color`          | `border-<token>`    | [Border](utilities-border.md)           |
| `outline-color`         | `outline-<token>`   | [Outline](utilities-outline.md)         |
| `text-decoration-color` | `underline-<token>` | [Text styles](utilities-text-styles.md) |

Each class accepts the `hover:` prefix and no other state or responsive
prefix; for example `hover:bg-primary-dark`. `outline-<token>` has no hover
variant by default.

## Settings

| Setting                                                                    | PathAble default                                                                                                                                                                                       | Controls                                                                                                             |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `$theme-color-<family>-<grade>`                                            | Brand values on the theme and state pages                                                                                                                                                              | One colour token                                                                                                     |
| `$theme-color-<family>-family`                                             | USWDS defaults: base `gray-cool`, primary `blue`, secondary `red`, accent-warm `orange`, accent-cool `blue-cool`, error `red-warm`, warning `gold`, success `green-cool`, info `cyan`, disabled `gray` | The system family each theme family belongs to; every grade is set explicitly, so the family does not change a token |
| `$theme-body-background-color`                                             | `'white'`                                                                                                                                                                                              | Page background                                                                                                      |
| `$theme-text-color`                                                        | `'ink'` (PathAble Blue)                                                                                                                                                                                | Body text                                                                                                            |
| `$theme-link-color`, `$theme-link-hover-color`, `$theme-link-active-color` | `'accent-cool-dark'` (Tech Teal), `'primary'`, `'primary-dark'`                                                                                                                                        | Link colours                                                                                                         |
| `$theme-link-visited-color`                                                | `'violet-70v'` (USWDS default)                                                                                                                                                                         | Visited link                                                                                                         |
| `$theme-focus-color`                                                       | `'accent-cool'` (Bright Blue Brooks)                                                                                                                                                                   | Focus outline                                                                                                        |
| `$global-color-palettes`                                                   | `('palette-color-default')`                                                                                                                                                                            | Palettes added to `bg-`, `border-`, `text-` and `underline-` classes                                                 |

```scss
@use '@pathableai/styles' with (
  $global-color-palettes: (
    'palette-color-default',
    'palette-color-system',
  )
);
```

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
- Adding `'palette-color-system'` only when system tokens are needed as
  classes, because it enlarges the stylesheet.
