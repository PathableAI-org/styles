---
name: Font size and family
slug: utilities-font-size-and-family
kind: utility
summary: Utility classes that set the font size from the PathAble type scale and the typeface from a font role or font type.
uswds: https://designsystem.digital.gov/utilities/font-size-and-family/
classes:
  - font-<family>-<size>
  - font-family-<family>
guarantees:
  - id: size-tokens-text-families
    claim: font-body-3xs sets font-size to 0.75rem, font-body-2xs to 0.88rem, font-body-xs to 0.94rem, font-body-sm to 1rem, font-body-md to 1.13rem, font-body-lg to 1.5rem, font-body-xl to 2rem, font-body-2xl to 2.5rem and font-body-3xl to 3rem.
  - id: size-same-across-text-families
    claim: font-heading-md, font-ui-md, font-alt-md, font-sans-md, font-serif-md and font-cond-md all set font-size to 1.13rem.
  - id: size-tokens-mono
    claim: font-code-sm and font-mono-sm set font-size to 0.95rem, font-code-md to 1.07rem and font-code-3xl to 2.86rem, because the monospace typeface has its own cap-height normalisation.
  - id: family-roles
    claim: font-family-heading sets font-family to Fredoka, 'Fredoka', system-ui, sans-serif; font-family-body and font-family-ui set it to Nunito, 'Nunito', system-ui, sans-serif; font-family-alt sets it to Montserrat, 'Montserrat', system-ui, sans-serif.
  - id: family-types
    claim: font-family-serif sets font-family to the Fredoka stack, font-family-sans to the Nunito stack, font-family-cond to the Montserrat stack, and font-family-mono and font-family-code to Roboto Mono Web, Bitstream Vera Sans Mono, Consolas, Courier, monospace.
  - id: no-icon-lang
    claim: The stylesheet has no font-icon-*, font-lang-*, font-family-icon or font-family-lang rule, and no font-<family>-micro or font-<family>-4xl rule.
  - id: responsive-size-only
    claim: 'desktop:font-body-lg sets font-size to 1.5rem inside a min-width 64em media query, and the stylesheet has no desktop:font-family-heading or hover: variant of any font class.'
---

# Font size and family

Utility classes that set the font size from the PathAble type scale and the
typeface from a font role or font type. `font-body-md` sets the size of body
text at the medium step and `font-family-heading` sets the heading typeface
(Fredoka); a class that names a family and a size sets only the size, and a
`font-family-` class sets only the typeface. The classes have no prefix and
need no JavaScript.

## When to use

- Set the size of a one-off line of text, such as a label or a figure, at a
  step of the type scale: `font-body-sm`, `font-heading-lg`.
- Use the heading or alternate heading typeface on text that is not a heading
  element: `font-family-heading`, `font-family-alt`.
- Change a size from a breakpoint up: `font-body-sm desktop:font-body-lg`.

Use something else when:

- the element is a heading, paragraph or list inside prose: the element and
  `pathable-prose` already take their size from the theme, so do not repeat it;
- the element is a component with its own type, such as a button or an alert:
  use the component's own class and variant;
- the change is to weight, style or case rather than size or typeface: use
  [Text styles](utilities-text-styles.md); for line height or line length use
  [Paragraph styles](utilities-paragraph-styles.md).

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: sizes -->

## Classes

| Class pattern          | Property      | Values                                                                                                                                                                    |
| ---------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `font-<family>-<size>` | `font-size`   | Family is a role (`ui`, `heading`, `body`, `code`, `alt`) or a type (`sans`, `serif`, `mono`, `cond`); size is `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` or `3xl` |
| `font-family-<family>` | `font-family` | The same families                                                                                                                                                         |

A size class does not set a family, a line height or a weight, so the element
keeps those from the page.

### Font roles and types at PathAble defaults

A role maps to a type, and a type maps to a typeface token. The brand guide
sets the typefaces; types and roles the guide does not mention keep the USWDS
default.

| Family    | Kind | Maps to | Typeface                                                           |
| --------- | ---- | ------- | ------------------------------------------------------------------ |
| `heading` | role | `serif` | Fredoka                                                            |
| `body`    | role | `sans`  | Nunito                                                             |
| `ui`      | role | `sans`  | Nunito                                                             |
| `alt`     | role | `cond`  | Montserrat (Bold, used for headings when Fredoka is not available) |
| `code`    | role | `mono`  | Roboto Mono (USWDS default)                                        |
| `serif`   | type | none    | Fredoka                                                            |
| `sans`    | type | none    | Nunito                                                             |
| `cond`    | type | none    | Montserrat                                                         |
| `mono`    | type | none    | Roboto Mono (USWDS default)                                        |

PathAble outputs no `icon` or `lang` type, so there is no `font-icon-*`,
`font-lang-*`, `font-family-icon` or `font-family-lang` class. Poppins
(subheadings in the brand guide) has no role or type, so it has no class.

`font-family-<family>` outputs the display name followed by a stack:
Fredoka, Nunito and Montserrat use `system-ui, sans-serif` after their name
(`Nunito, 'Nunito', system-ui, sans-serif`), and the monospace stack is
`Roboto Mono Web, Bitstream Vera Sans Mono, Consolas, Courier, monospace`.

`font-family-cond` and the `-cond` size classes (Montserrat) are a PathAble
brand choice: USWDS defines no condensed type by default, so a stock USWDS
stylesheet has none of these classes.

### Size tokens at PathAble defaults

Each size is a step on the USWDS system type scale. The class value is
normalised by the typeface's cap height; the four brand typefaces declare the
USWDS base cap height of 362px, so their sizes are the brand guide's exact rem
values, and the value is in `rem`, so it follows the user's default font size.

| Size  | System step | Nominal size | `font-body-*`, `font-heading-*`, `font-ui-*`, `font-alt-*`, `font-sans-*`, `font-serif-*`, `font-cond-*` | `font-code-*`, `font-mono-*` |
| ----- | ----------- | ------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `3xs` | 1           | 12px         | `0.75rem`                                                                                                | `0.71rem`                    |
| `2xs` | 3           | 14px         | `0.88rem`                                                                                                | `0.83rem`                    |
| `xs`  | 4           | 15px         | `0.94rem`                                                                                                | `0.89rem`                    |
| `sm`  | 5           | 16px         | `1rem`                                                                                                   | `0.95rem`                    |
| `md`  | 7           | 18px         | `1.13rem`                                                                                                | `1.07rem`                    |
| `lg`  | 10          | 24px         | `1.5rem`                                                                                                 | `1.43rem`                    |
| `xl`  | 12          | 32px         | `2rem`                                                                                                   | `1.91rem`                    |
| `2xl` | 14          | 40px         | `2.5rem`                                                                                                 | `2.38rem`                    |
| `3xl` | 15          | 48px         | `3rem`                                                                                                   | `2.86rem`                    |

Only the nine theme sizes have classes. The system steps `micro` and 1 to 20
do not, so there is no `font-body-micro` and no `font-body-4xl`. The brand
guide's heading-md size (20px, system step 8) has no theme size and so no
class.

The values these classes take are defined by the design tokens: [Font size](tokens-typesetting-font-size.md) and [Font family](tokens-typesetting-font-family.md).

## Variants

| Prefix                                    | `font-<family>-<size>` | `font-family-<family>` |
| ----------------------------------------- | ---------------------- | ---------------------- |
| `mobile-lg:`, `tablet:`, `desktop:`       | Output                 | Not output             |
| `hover:`, `focus:`, `active:`, `visited:` | Not output             | Not output             |

The breakpoints are `min-width` media queries in `em`: `mobile-lg` 30em
(480px), `tablet` 40em (640px) and `desktop` 64em (1024px). For example,
`font-body-sm tablet:font-body-lg` is `1rem` on a phone and `1.5rem` from
640px up.

## States

Each state is complete markup for one use of the utilities. Copy the one
closest to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states the CSS a class compiles to at PathAble defaults.

The classes set `font-size` and `font-family` only. They never set
`line-height`, so a larger size on its own can leave the line height too tight:
pair it with a line height class from
[Paragraph styles](utilities-paragraph-styles.md).

## The consumer owns

- Loading the fonts. The classes name Fredoka, Nunito and Montserrat but do not
  load them; the application supplies the font files and `@font-face` rules,
  or the stack falls back to `system-ui`.
- Weight. Fredoka and Nunito are used at Regular in the brand guide, and Nunito
  SemiBold for interface labels; set a weight with
  [Text styles](utilities-text-styles.md) and load the files for it.
- Reading order and structure. A size class does not make text a heading: use
  `<h2>` and the like for headings and a size class only for the look.
- Long runs of text. The brand guide keeps the heading typeface for short
  statements, not for paragraphs.
