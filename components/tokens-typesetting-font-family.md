---
name: Font family
slug: tokens-typesetting-font-family
kind: token
summary: The PathAble typefaces (Fredoka, Nunito, Montserrat, Roboto Mono) and the USWDS roles and types that select them.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/font-family/
guarantees:
  - id: heading-stack
    claim: "font-family-heading sets font-family to Fredoka, 'Fredoka', system-ui, sans-serif."
  - id: body-ui-stack
    claim: "font-family-body and font-family-ui set font-family to Nunito, 'Nunito', system-ui, sans-serif."
  - id: alt-stack
    claim: "font-family-alt sets font-family to Montserrat, 'Montserrat', system-ui, sans-serif."
  - id: code-stack
    claim: font-family-code sets font-family to Roboto Mono Web, Bitstream Vera Sans Mono, Consolas, Courier, monospace.
  - id: type-aliases
    claim: font-family-sans equals font-family-body, font-family-serif equals font-family-heading and font-family-cond equals font-family-alt.
  - id: no-poppins-class
    claim: No font-family-poppins class exists, because poppins is a typeface and not a role or type.
  - id: not-responsive
    claim: 'The font-family classes have no mobile-lg:, tablet: or desktop: variants and no hover:, focus:, active: or visited: variants.'
---

# Font family

The PathAble typefaces (Fredoka, Nunito, Montserrat, Roboto Mono) and the USWDS
roles and types that select them. You pick a role by purpose (`heading`,
`body`, `ui`, `alt`, `code`) and the role gives you the font stack.

## When to use

- Setting the typeface of a block of text by what it is, such as a heading, a
  paragraph or a code sample, rather than by naming a font.
- Pairing a role with a size: `font-family-heading` for the face and
  `font-heading-xl` for the size, because a size class sets only the size.

Use something else when:

- you want the brand subheading face, Poppins: no role selects it, so write the
  `font-family` yourself (see Values).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: roles -->

## Values

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

Roles are the preferred keys in markup because they survive a change
of typeface. The brand's use of each face:

| Typeface    | Brand use                                            | Weights loaded |
| ----------- | ---------------------------------------------------- | -------------- |
| Fredoka     | Headings                                             | 400            |
| Nunito      | Body text, and UI labels at 600                      | 400, 600       |
| Montserrat  | Alternate heading, only where Fredoka is unavailable | 700            |
| Poppins     | Subheadings                                          | 700            |
| Roboto Mono | Code (the USWDS default; the brand guide is silent)  | 300, 400, 700  |

Poppins is shipped as a typeface, but no type or role points at it, so there is
no `font-family-poppins` class. PathAble outputs `font-family-cond`
(Montserrat); a stock USWDS build has no condensed class. For a subheading in
Poppins Bold, write `font-family: 'Poppins', system-ui, sans-serif;
font-weight: 700` in your own rule.

## Utilities

| Class               | Property      | Page                                                      |
| ------------------- | ------------- | --------------------------------------------------------- |
| `font-family-<key>` | `font-family` | [Font size and family](utilities-font-size-and-family.md) |
| `font-<key>-<size>` | `font-size`   | [Font size and family](utilities-font-size-and-family.md) |

`<key>` is any role or type above that has a typeface: `ui`, `heading`, `body`,
`code`, `alt`, `cond`, `mono`, `sans`, `serif`. The `font-<key>-<size>` classes
set the size only, never the family. Font weight and letter spacing
for the same text are on the [Text styles](utilities-text-styles.md) page.

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

The stacks are the compiled output: USWDS writes the display name unquoted,
then repeats it quoted, then the fallback list.

## The consumer owns

- Loading the faces: the stylesheet declares the `@font-face` rules, but the
  application must serve the package's `fonts/` folder at `../fonts`, relative
  to the stylesheet.
- Using the brand weights only: Fredoka has Regular, Nunito Regular and
  SemiBold, Montserrat and Poppins Bold. Any other weight is drawn by the
  browser from the nearest loaded file.
- Keeping Montserrat for the cases the brand allows, when Fredoka is
  unavailable.
- Language support: the shipped files are the Latin subset, so text in other
  scripts falls back to the system font in the stack.
