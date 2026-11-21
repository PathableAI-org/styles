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
    claim: "Every font-size class and size() result is in rem and the root font size is 100%, so text scales with the browser's font size setting."
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
- Pairing a size with a role in one class, such as `font-heading-xl`, or in one
  call, such as `font-size('heading', 'xl')`.

Use something else when:

- you want to change which size an element gets everywhere (all `h2` headings,
  say): change the `$theme-h2-font-size` setting, not the call sites;
- the text is a fixed-size graphic or icon: use the icon component's size, not a
  type size.

## Example

Load the stylesheet once in the application; no JavaScript is needed:

```css
@import '@pathableai/styles';
```

<!-- example: scale -->

## Tokens

The theme sizes are the keys classes and settings use. Each points at a key of
the USWDS system scale (`micro`, then `1` to `20`, in pixels at a 16px root).
Three of the nine are changed from the USWDS default to match the brand type
scale.

| Token | System key | System size | rem at PathAble defaults (body, heading, alt, ui) | USWDS default key |
| ----- | ---------- | ----------- | ------------------------------------------------- | ----------------- |
| `3xs` | `1`        | 12px        | 0.75rem                                           | `2` (13px)        |
| `2xs` | `3`        | 14px        | 0.88rem                                           | `3`               |
| `xs`  | `4`        | 15px        | 0.94rem                                           | `4`               |
| `sm`  | `5`        | 16px        | 1rem                                              | `5`               |
| `md`  | `7`        | 18px        | 1.13rem                                           | `6` (17px)        |
| `lg`  | `10`       | 24px        | 1.5rem                                            | `9` (22px)        |
| `xl`  | `12`       | 32px        | 2rem                                              | `12`              |
| `2xl` | `14`       | 40px        | 2.5rem                                            | `14`              |
| `3xl` | `15`       | 48px        | 3rem                                              | `15`              |

The system scale, usable as a size argument to Sass functions but with no
class: `micro` 10px, then keys `1` to `20` at 12, 13, 14, 15, 16, 17, 18, 20,
22, 24, 28, 32, 36, 40, 48, 56, 64, 80, 120 and 140px. For example
`font-size('body', 8)` is 1.25rem (20px).

How USWDS turns a size into rem: it multiplies the pixel size by the ratio of
its base optical size (362px) to the typeface's `cap-height`, then divides by
16 and rounds to two decimals. The four brand typefaces all declare a
`cap-height` of 362px, so they share one column above. The code typeface keeps
the USWDS default for Roboto Mono, so its sizes are smaller: `3xs` 0.71rem,
`2xs` 0.83rem, `xs` 0.89rem, `sm` 0.95rem, `md` 1.07rem, `lg` 1.43rem, `xl`
1.91rem, `2xl` 2.38rem and `3xl` 2.86rem.

Sizes the brand assigns to elements:

| Element | Token | rem     | Setting                    |
| ------- | ----- | ------- | -------------------------- |
| Body    | `sm`  | 1rem    | `$theme-body-font-size`    |
| Display | `xl`  | 2rem    | `$theme-display-font-size` |
| `h1`    | `lg`  | 1.5rem  | `$theme-h1-font-size`      |
| `h2`    | `md`  | 1.13rem | `$theme-h2-font-size`      |
| `h3`    | `md`  | 1.13rem | `$theme-h3-font-size`      |
| `h4`    | `sm`  | 1rem    | `$theme-h4-font-size`      |
| `h5`    | `2xs` | 0.88rem | `$theme-h5-font-size`      |
| `h6`    | `3xs` | 0.75rem | `$theme-h6-font-size`      |
| Small   | `2xs` | 0.88rem | `$theme-small-font-size`   |
| Lead    | `lg`  | 1.5rem  | `$theme-lead-font-size`    |

## Sass

```scss
@use '@pathableai/styles' as *;

.plan-card__title {
  @include u-font('heading', 'lg'); // Fredoka at 1.5rem
}

.plan-card__meta {
  font-size: font-size('body', '2xs'); // 0.88rem
}

.plan-card__headline {
  @include typeset('heading', 'xl', 3); // family, size and line height
}
```

`font-size($family, $size)`, `fs()` and `size()` are the same function and return
the rem value for the family. The mixins are `u-font-size($family, $size)` (size only),
`u-font($family, $size)` (family and size) and `typeset($family, $size,
$line-height)`. Quote the theme sizes (`'2xs'`, `'3xl'`) because they begin
with a digit.

## Utilities

| Class                  | Property    | Page                                                      |
| ---------------------- | ----------- | --------------------------------------------------------- |
| `font-<family>-<size>` | `font-size` | [Font size and family](utilities-font-size-and-family.md) |

`<family>` is a role or type with a typeface (`body`, `heading`, `ui`, `alt`,
`code`, `sans`, `serif`, `cond`, `mono`) and `<size>` is one of the nine theme
sizes, for example `font-body-sm`, `font-heading-xl`, `font-ui-2xs`. The
classes also exist with the responsive prefixes `mobile-lg:`, `tablet:` and
`desktop:`, such as `tablet:font-heading-2xl`.

## Settings

| Setting                         | PathAble default                         | USWDS default |
| ------------------------------- | ---------------------------------------- | ------------- |
| `$theme-type-scale-3xs`         | `1`                                      | `2`           |
| `$theme-type-scale-2xs`         | `3`                                      | `3`           |
| `$theme-type-scale-xs`          | `4`                                      | `4`           |
| `$theme-type-scale-sm`          | `5`                                      | `5`           |
| `$theme-type-scale-md`          | `7`                                      | `6`           |
| `$theme-type-scale-lg`          | `10`                                     | `9`           |
| `$theme-type-scale-xl`          | `12`                                     | `12`          |
| `$theme-type-scale-2xl`         | `14`                                     | `14`          |
| `$theme-type-scale-3xl`         | `15`                                     | `15`          |
| `$theme-body-font-size`         | `'sm'`                                   | `'sm'`        |
| `$theme-display-font-size`      | `'xl'`                                   | `'3xl'`       |
| `$theme-h1-font-size`           | `'lg'`                                   | `'2xl'`       |
| `$theme-h2-font-size`           | `'md'`                                   | `'xl'`        |
| `$theme-h3-font-size`           | `'md'`                                   | `'lg'`        |
| `$theme-h4-font-size`           | `'sm'`                                   | `'sm'`        |
| `$theme-h5-font-size`           | `'2xs'`                                  | `'xs'`        |
| `$theme-h6-font-size`           | `'3xs'`                                  | `'3xs'`       |
| `$theme-small-font-size`        | `'2xs'`                                  | `'2xs'`       |
| `$theme-lead-font-size`         | `'lg'`                                   | `'lg'`        |
| `$theme-respect-user-font-size` | `true`                                   | `true`        |
| `$theme-root-font-size`         | `10px`                                   | `10px`        |
| `$font-settings`                | `()` (output, responsive on; states off) | same          |

`$theme-respect-user-font-size: true` makes the root font size 100% and media
queries `em`-based, so one rem is the reader's browser font size. With `false`,
`$theme-root-font-size` becomes the root size in pixels; do not do this, since
it overrides the reader's setting. `$theme-root-font-size` is ignored while the
respect setting is true.

```scss
@use '@pathableai/styles' with (
  $theme-type-scale-md: 7,
  $theme-type-scale-lg: 10,
  $theme-h2-font-size: 'md'
);
```

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
