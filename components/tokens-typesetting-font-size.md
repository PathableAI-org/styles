---
name: Font size
slug: tokens-typesetting-font-size
kind: token
summary: The nine named type sizes, 3xs to 3xl, as rem values normalised for each typeface and scaled by the reader's font size.
uswds: https://designsystem.digital.gov/design-tokens/typesetting/font-size/
guarantees:
  - id: sm-body-size
    claim: font-body-sm sets font-size to 1rem.
  - id: scale-values
    claim: font-body-3xs, 2xs, xs, sm, md, lg, xl, 2xl and 3xl set font-size to 0.75rem, 0.88rem, 0.94rem, 1rem, 1.13rem, 1.5rem, 2rem, 2.5rem and 3rem.
  - id: system-keys-not-classes
    claim: No class exists for the system size keys micro or 1 to 20; only the nine named sizes have font-size classes.
  - id: family-normalised
    claim: font-code-sm sets font-size to 0.95rem, smaller than font-body-sm, because the code typeface has a larger optical size.
  - id: respects-user-size
    claim: "Every font-size class is in rem and the root font size is 100%, so text scales with the browser's font size setting."
  - id: responsive-variants
    claim: 'Each font-size class has mobile-lg:, tablet: and desktop: variants and no hover:, focus:, active: or visited: variants.'
---

# Font size

The nine named type sizes, 3xs to 3xl, as rem values normalised for each
typeface and scaled by the reader's font size. A size is always asked for
together with a role, because the same token gives a slightly different rem
value for typefaces with a different optical size.

## When to use

- Setting the size of text by its place in the hierarchy (`sm` for body text,
  `lg` for a section heading) rather than a pixel value.
- Pairing a size with a role: `font-heading-xl` sets only the size, so add
  `font-family-heading` for the face.

Use something else when:

- the text is a fixed-size graphic or icon: use the icon component's size, not a
  type size.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: scale -->

## Values

The theme sizes are the keys the classes use. Each points at a key of
the USWDS system scale (`micro`, then `1` to `20`, in pixels at a 16px root).
Three of the nine are changed from the USWDS default to match the brand type
scale.

| Token | System key | System size | PathAble rem (body, heading, alt, ui) | USWDS default key |
| ----- | ---------- | ----------- | ------------------------------------- | ----------------- |
| `3xs` | `1`        | 12px        | 0.75rem                               | `2` (13px)        |
| `2xs` | `3`        | 14px        | 0.88rem                               | `3`               |
| `xs`  | `4`        | 15px        | 0.94rem                               | `4`               |
| `sm`  | `5`        | 16px        | 1rem                                  | `5`               |
| `md`  | `7`        | 18px        | 1.13rem                               | `6` (17px)        |
| `lg`  | `10`       | 24px        | 1.5rem                                | `9` (22px)        |
| `xl`  | `12`       | 32px        | 2rem                                  | `12`              |
| `2xl` | `14`       | 40px        | 2.5rem                                | `14`              |
| `3xl` | `15`       | 48px        | 3rem                                  | `15`              |

The system scale has no classes of its own, only the nine theme sizes do:
`micro` 10px, then keys `1` to `20` at 12, 13, 14, 15, 16, 17, 18, 20, 22, 24,
28, 32, 36, 40, 48, 56, 64, 80, 120 and 140px.

How USWDS turns a size into rem: it multiplies the pixel size by the ratio of
its base optical size (362px) to the typeface's `cap-height`, then divides by
16 and rounds to two decimals. The four brand typefaces all declare a
`cap-height` of 362px, so they share one column above. The code typeface keeps
the USWDS default for Roboto Mono, so its sizes are smaller: `3xs` 0.71rem,
`2xs` 0.83rem, `xs` 0.89rem, `sm` 0.95rem, `md` 1.07rem, `lg` 1.43rem, `xl`
1.91rem, `2xl` 2.38rem and `3xl` 2.86rem.

Sizes the brand assigns to elements:

| Element | Token | rem     | USWDS default token |
| ------- | ----- | ------- | ------------------- |
| Body    | `sm`  | 1rem    | `sm`                |
| Display | `xl`  | 2rem    | `3xl`               |
| `h1`    | `lg`  | 1.5rem  | `2xl`               |
| `h2`    | `md`  | 1.13rem | `xl`                |
| `h3`    | `md`  | 1.13rem | `lg`                |
| `h4`    | `sm`  | 1rem    | `sm`                |
| `h5`    | `2xs` | 0.88rem | `xs`                |
| `h6`    | `3xs` | 0.75rem | `3xs`               |
| Small   | `2xs` | 0.88rem | `2xs`               |
| Lead    | `lg`  | 1.5rem  | `lg`                |

## Utilities

| Class                  | Property    | Page                                                      |
| ---------------------- | ----------- | --------------------------------------------------------- |
| `font-<family>-<size>` | `font-size` | [Font size and family](utilities-font-size-and-family.md) |

`<family>` is a role or type with a typeface (`body`, `heading`, `ui`, `alt`,
`code`, `sans`, `serif`, `cond`, `mono`) and `<size>` is one of the nine theme
sizes, for example `font-body-sm`, `font-heading-xl`, `font-ui-2xs`. The
classes also exist with the responsive prefixes `mobile-lg:`, `tablet:` and
`desktop:`, such as `tablet:font-heading-2xl`. A size class sets `font-size`
only; it does not set a family, so pair it with `font-family-<family>`.

## States

Each state is complete markup for one use of the tokens. Copy the one closest
to what you need.

<!-- examples -->

## Guarantees

The guarantees are the list in the front matter at the top of this page. Each
states behaviour of the package at PathAble defaults.

The rem values are rounded to two decimals by USWDS, so `2xs` is 0.88rem (14px
at a 16px root, 0.875rem nominal) and `md` is 1.13rem.

## The consumer owns

- Honouring the reader's font size: no pixel `font-size` on `html` or `body`,
  and layouts that survive text at 200 percent.
- Choosing the size by hierarchy, not to fit a box: when text does not fit,
  change the layout.
- Not stacking sizes: a size class sets an absolute rem size, not a size
  relative to its parent.
- Keeping body text at `sm` or larger; `3xs` and `2xs` are for captions and
  secondary labels.
