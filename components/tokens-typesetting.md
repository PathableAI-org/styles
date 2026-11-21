---
name: Typesetting
slug: tokens-typesetting
kind: token
summary: How PathAble sets type, from typeface to role to size, line height and line length, through USWDS typesetting tokens.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/
guarantees:
  - id: heading-role-typeface
    claim: "The class font-family-heading sets font-family to Fredoka, 'Fredoka', system-ui, sans-serif."
  - id: body-role-typeface
    claim: "The classes font-family-body and font-family-ui set font-family to Nunito, 'Nunito', system-ui, sans-serif."
  - id: alt-role-typeface
    claim: "The class font-family-alt sets font-family to Montserrat, 'Montserrat', system-ui, sans-serif."
  - id: rem-output
    claim: "Every font-size class sets a rem value and the compiled root font size is 100%, so text follows the reader's browser font size."
  - id: element-sizes
    claim: The classes font-heading-xl, font-heading-lg, font-heading-md, font-body-sm, font-body-2xs and font-body-3xs set font-size to 2rem, 1.5rem, 1.13rem, 1rem, 0.88rem and 0.75rem.
  - id: body-defaults
    claim: The class line-height-body-5 sets line-height to 1.6 and the class line-height-heading-3 sets line-height to 1.4.
  - id: poppins-unassigned
    claim: No font-family-poppins class exists, and no font-family class sets font-family to a Poppins stack.
---

# Typesetting

How PathAble sets type, from typeface to role to size, line height and line
length, through USWDS typesetting tokens. Each token is a short key that forms
the suffix of a utility class, such as `font-heading-lg` or `measure-4`.

## When to use

- Choosing the one set of keys (role, size, line height, weight, letter
  spacing, measure) to describe text in markup, instead of writing
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

## Values

Type is described by a chain: a **role** names a job, a role points at a
**font type**, a type points at a **typeface token**, and the typeface token
holds the stack and the optical size used to normalise sizes. Classes take the
role or type key (`font-family-heading`, `font-family-sans`); the typeface token
is never used directly.

| Role      | Type    | Typeface token | PathAble typeface | Weights loaded | Notes                                           |
| --------- | ------- | -------------- | ----------------- | -------------- | ----------------------------------------------- |
| `heading` | `serif` | `fredoka`      | Fredoka           | 400            | Headings and display text                       |
| `body`    | `sans`  | `nunito`       | Nunito            | 400, 600       | Running text; 600 is for labels                 |
| `ui`      | `sans`  | `nunito`       | Nunito            | 400, 600       | Buttons, form labels and other controls         |
| `alt`     | `cond`  | `montserrat`   | Montserrat        | 700            | Alternate heading, only where Fredoka is absent |
| `code`    | `mono`  | `roboto-mono`  | Roboto Mono       | 300, 400, 700  | USWDS default; the brand guide does not name it |

Font types with no brand typeface are `icon` and `lang`, both `false`.
Poppins (Bold, 700) is the brand subheading face. It is defined as the
typeface token `poppins` and its file is shipped, but USWDS has no subheading
role, so no type or role points at it and there is no `font-family-poppins`
class.

The other typesetting tokens, each with its own page:

| Token          | Keys                                                     | Page                                                  |
| -------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| Font family    | roles `ui`, `heading`, `body`, `code`, `alt`; types      | [Font family](tokens-typesetting-font-family.md)      |
| Font size      | `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` | [Font size](tokens-typesetting-font-size.md)          |
| Line height    | `1` to `6`                                               | [Line height](tokens-typesetting-line-height.md)      |
| Font weight    | `light`, `normal`, `semibold`, `bold`                    | [Font weight](tokens-typesetting-font-weight.md)      |
| Letter spacing | `ls-neg-3` to `ls-3`, `auto`                             | [Letter spacing](tokens-typesetting-letterspacing.md) |
| Measure        | `1` to `6`, `none`                                       | [Measure](tokens-typesetting-measure.md)              |

Text sizes the brand applies to elements (USWDS defaults in the last column
where they differ):

| Element | Size token | Size at 16px root | USWDS default |
| ------- | ---------- | ----------------- | ------------- |
| Body    | `sm`       | 1rem              |               |
| Display | `xl`       | 2rem              | `3xl`         |
| `h1`    | `lg`       | 1.5rem            | `2xl`         |
| `h2`    | `md`       | 1.13rem           | `xl`          |
| `h3`    | `md`       | 1.13rem           | `lg`          |
| `h4`    | `sm`       | 1rem              |               |
| `h5`    | `2xs`      | 0.88rem           | `xs`          |
| `h6`    | `3xs`      | 0.75rem           |               |
| Small   | `2xs`      | 0.88rem           |               |

## Utilities

| Token          | Classes                      | Page                                                      |
| -------------- | ---------------------------- | --------------------------------------------------------- |
| Font family    | `font-family-<role>`         | [Font size and family](utilities-font-size-and-family.md) |
| Font size      | `font-<family>-<size>`       | [Font size and family](utilities-font-size-and-family.md) |
| Font weight    | `text-<weight>`              | [Text styles](utilities-text-styles.md)                   |
| Letter spacing | `text-ls-<key>`              | [Text styles](utilities-text-styles.md)                   |
| Line height    | `line-height-<family>-<key>` | [Paragraph styles](utilities-paragraph-styles.md)         |
| Measure        | `measure-<key>`              | [Paragraph styles](utilities-paragraph-styles.md)         |

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

Sizes and line heights are normalised by USWDS and rounded to two decimals in
rem, so the compiled sizes differ slightly from the nominal pixel sizes. The
normalisation treats the four brand typefaces as having the same optical size.
The `font-<family>-<size>` classes set the size only, not the family.

## The consumer owns

- Loading no other typeface for these roles: a second face changes the sizes
  that were normalised for the brand faces.
- Using only the weights that are loaded (see Font weight); a weight with no
  file is drawn by the browser from the nearest one.
- Respecting the reader's font size: never set a pixel `font-size` on `html`.
- Choosing heading levels for document structure, not for size: pick the
  element by outline and the size class by appearance.
