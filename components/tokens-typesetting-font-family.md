---
name: Font family
slug: tokens-typesetting-font-family
kind: token
summary: The PathAble typefaces (Fredoka, Nunito, Montserrat, Roboto Mono) and the USWDS roles and types that select them.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/font-family/
guarantees:
  - id: heading-stack
    status: unverified
    claim: "font-family-heading sets font-family to Fredoka, 'Fredoka', system-ui, sans-serif."
  - id: body-ui-stack
    status: unverified
    claim: "font-family-body and font-family-ui set font-family to Nunito, 'Nunito', system-ui, sans-serif."
  - id: alt-stack
    status: unverified
    claim: "font-family-alt sets font-family to Montserrat, 'Montserrat', system-ui, sans-serif."
  - id: code-stack
    status: unverified
    claim: font-family-code sets font-family to Roboto Mono Web, Bitstream Vera Sans Mono, Consolas, Courier, monospace.
  - id: type-aliases
    status: unverified
    claim: font-family-sans equals font-family-body, font-family-serif equals font-family-heading and font-family-cond equals font-family-alt.
  - id: no-poppins-key
    status: unverified
    claim: "family('poppins') is a Sass error, because poppins is a typeface token and not a role or type."
  - id: not-responsive
    status: unverified
    claim: 'The font-family classes have no mobile-lg:, tablet: or desktop: variants and no hover:, focus:, active: or visited: variants.'
---

# Font family

The PathAble typefaces (Fredoka, Nunito, Montserrat, Roboto Mono) and the USWDS
roles and types that select them. You pick a role by purpose (`heading`,
`body`, `ui`, `alt`, `code`) and the role gives you the font stack.

## When to use

- Setting the typeface of a block of text by what it is, such as a heading, a
  paragraph or a code sample, rather than by naming a font.
- Combining a role with a size in one call, with `u-font('heading', 'xl')` or
  the class `font-heading-xl`.

Use something else when:

- you want the brand subheading face, Poppins: no role selects it, so write the
  `font-family` yourself (see Tokens);
- you need to change what a role means for the whole application: change the
  setting, not the call sites.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: roles -->

## Tokens

Roles and types are the keys. A role resolves to a type, and the type resolves
to a typeface token.

| Key       | Kind | Resolves to           | Font stack at PathAble defaults                                           |
| --------- | ---- | --------------------- | ------------------------------------------------------------------------- |
| `heading` | role | `serif` (Fredoka)     | `Fredoka, 'Fredoka', system-ui, sans-serif`                               |
| `body`    | role | `sans` (Nunito)       | `Nunito, 'Nunito', system-ui, sans-serif`                                 |
| `ui`      | role | `sans` (Nunito)       | `Nunito, 'Nunito', system-ui, sans-serif`                                 |
| `alt`     | role | `cond` (Montserrat)   | `Montserrat, 'Montserrat', system-ui, sans-serif`                         |
| `code`    | role | `mono` (Roboto Mono)  | `Roboto Mono Web, Bitstream Vera Sans Mono, Consolas, Courier, monospace` |
| `sans`    | type | `nunito`              | `Nunito, 'Nunito', system-ui, sans-serif`                                 |
| `serif`   | type | `fredoka`             | `Fredoka, 'Fredoka', system-ui, sans-serif`                               |
| `cond`    | type | `montserrat`          | `Montserrat, 'Montserrat', system-ui, sans-serif`                         |
| `mono`    | type | `roboto-mono`         | `Roboto Mono Web, Bitstream Vera Sans Mono, Consolas, Courier, monospace` |
| `icon`    | type | `false` (no typeface) | none; no class is emitted                                                 |
| `lang`    | type | `false` (no typeface) | none; no class is emitted                                                 |

Roles are the preferred keys in markup and Sass because they survive a change
of typeface. The brand's use of each face:

| Typeface    | Brand use                                            | Weights loaded |
| ----------- | ---------------------------------------------------- | -------------- |
| Fredoka     | Headings                                             | 400            |
| Nunito      | Body text, and UI labels at 600                      | 400, 600       |
| Montserrat  | Alternate heading, only where Fredoka is unavailable | 700            |
| Poppins     | Subheadings                                          | 700            |
| Roboto Mono | Code (the USWDS default; the brand guide is silent)  | 300, 400, 700  |

Poppins is defined as the typeface token `poppins` so its optical size is
known, but no type or role points at it. `family('poppins')` is an error and
there is no `font-family-poppins` class. For a subheading in Poppins Bold,
write `font-family: 'Poppins', system-ui, sans-serif; font-weight: 700` in
your own rule.

## Sass

```scss
@use '@pathableai/styles' as *;

.plan-card__title {
  font-family: family('heading');
}

.plan-card__meta {
  @include u-font-family('ui');
}

.plan-card__reference {
  @include u-font('code', '2xs'); // family and size together
}
```

`family()`, `ff()` and `font-family()` are the same function. The mixins
`u-font-family($family)` and `u-font($family, $size)` set the properties.
`typeset($family, $size, $line-height)` sets family, size and line height; `null`
for any argument uses the body default.

## Utilities

| Class               | Property      | Page                                                      |
| ------------------- | ------------- | --------------------------------------------------------- |
| `font-family-<key>` | `font-family` | [Font size and family](utilities-font-size-and-family.md) |
| `font-<key>-<size>` | `font-size`   | [Font size and family](utilities-font-size-and-family.md) |

`<key>` is any role or type above that has a typeface: `ui`, `heading`, `body`,
`code`, `alt`, `cond`, `mono`, `sans`, `serif`. Font weight and letter spacing
for the same text are on the [Text styles](utilities-text-styles.md) page.

## Settings

| Setting                             | PathAble default                             | USWDS default              |
| ----------------------------------- | -------------------------------------------- | -------------------------- |
| `$theme-typeface-tokens`            | `fredoka`, `nunito`, `poppins`, `montserrat` | none (built-in faces only) |
| `$theme-font-type-sans`             | `'nunito'`                                   | `'source-sans-pro'`        |
| `$theme-font-type-serif`            | `'fredoka'`                                  | `'merriweather'`           |
| `$theme-font-type-cond`             | `'montserrat'`                               | `false`                    |
| `$theme-font-type-mono`             | `'roboto-mono'`                              | `'roboto-mono'`            |
| `$theme-font-type-icon`             | `false`                                      | `false`                    |
| `$theme-font-type-lang`             | `false`                                      | `false`                    |
| `$theme-font-role-heading`          | `'serif'`                                    | `'serif'`                  |
| `$theme-font-role-body`             | `'sans'`                                     | `'sans'`                   |
| `$theme-font-role-ui`               | `'sans'`                                     | `'sans'`                   |
| `$theme-font-role-code`             | `'mono'`                                     | `'mono'`                   |
| `$theme-font-role-alt`              | `'cond'`                                     | `'serif'`                  |
| `$theme-prose-font-family`          | `'body'`                                     | `'body'`                   |
| `$theme-lead-font-family`           | `'heading'`                                  | `'heading'`                |
| `$theme-font-path`                  | `'../fonts'`                                 | `'../fonts'`               |
| `$theme-font-browser-compatibility` | `false`                                      | `false`                    |
| `$theme-font-<type>-custom-stack`   | `false` for every type                       | `false`                    |
| `$theme-font-<type>-custom-src`     | `false` for every type                       | `false`                    |

`$theme-font-role-alt` points at `cond` because USWDS has one `alt` role and the
brand's alternate heading face needs its own type to be selected independently
of `sans`.

Each entry in `$theme-typeface-tokens` has three keys: `display-name` (the
`@font-face` family name), `cap-height` (the optical size USWDS uses to
normalise sizes; `362px` for the four brand faces) and `stack` (the fallback
list that follows the display name):

```scss
@use '@pathableai/styles' with (
  $theme-typeface-tokens: (
    'nunito': (
      'display-name': 'Nunito',
      'cap-height': 362px,
      'stack': "'Nunito', system-ui, sans-serif",
    ),
  ),
  $theme-font-type-sans: 'nunito',
  $theme-font-role-body: 'sans'
);
```

The package ships the font files in its `fonts/` folder and declares one
`@font-face` rule per loaded weight, with `font-display: swap`, against
`$theme-font-path`.

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
was read from the Sass source and a compiled sample; none is checked by a test
yet (`status: unverified`).

The stacks are the compiled output: USWDS writes the display name unquoted,
then repeats it quoted, then the fallback list.

## The consumer owns

- Loading the faces: the stylesheet declares the `@font-face` rules, but the
  application must serve the `fonts/` folder at `$theme-font-path`, relative to
  the stylesheet.
- Using the brand weights only: Fredoka has Regular, Nunito Regular and
  SemiBold, Montserrat and Poppins Bold. Any other weight is drawn by the
  browser from the nearest loaded file.
- Keeping Montserrat for the cases the brand allows, when Fredoka is
  unavailable.
- Language support: the shipped files are the Latin subset, so text in other
  scripts falls back to the system font in the stack.
