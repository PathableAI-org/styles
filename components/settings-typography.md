---
name: Typography
slug: settings-typography
kind: settings
summary: 'The USWDS typography settings PathAble sets: four custom typefaces, the font roles built on them, a re-tuned type scale and the heading and body sizes.'
uswds: https://designsystem.digital.gov/documentation/settings/#typography-settings
---

# Typography

The USWDS typography settings PathAble sets: four custom typefaces, the font roles built on them, a re-tuned type scale and the heading and body sizes. See the
[USWDS typography settings](https://designsystem.digital.gov/documentation/settings/#typography-settings).

## Not public API

This page is information only. `@pathableai/styles` ships compiled CSS, so a
consumer cannot set these Sass settings, and the settings are not part of the
public API. To get the effect, use the type tokens and classes on
[Typesetting](tokens-typesetting.md); see the [Overview](settings.md).

## Values

USWDS builds type in a chain: a **role** (heading, body, and so on) names a
**font type** (sans, serif, and so on), and a font type names a **typeface
token**. Each table below is one link of that chain, from the typefaces up to
the heading and body sizes. A setting that PathAble sets to the USWDS default
value is marked "Same as default". Settings not listed, such as the font
weights, are at their USWDS defaults.

### Typeface tokens

`$theme-typeface-tokens` replaces the USWDS example map with four typefaces.
Each entry has a display name, a cap height of `364px` and a font stack that
ends in `system-ui, sans-serif`. USWDS's own tokens, such as `roboto-mono`,
stay available.

| Token        | Display name | Font stack                            | Used as                              |
| ------------ | ------------ | ------------------------------------- | ------------------------------------ |
| `fredoka`    | Fredoka      | `'Fredoka', system-ui, sans-serif`    | The serif font type                  |
| `nunito`     | Nunito       | `'Nunito', system-ui, sans-serif`     | The sans font type                   |
| `poppins`    | Poppins      | `'Poppins', system-ui, sans-serif`    | Defined, not assigned to a font type |
| `montserrat` | Montserrat   | `'Montserrat', system-ui, sans-serif` | The condensed font type              |

### Font types

| Setting                  | USWDS default     | PathAble value | Notes                                                                            |
| ------------------------ | ----------------- | -------------- | -------------------------------------------------------------------------------- |
| `$theme-font-type-sans`  | `source-sans-pro` | `nunito`       | Body and interface text                                                          |
| `$theme-font-type-serif` | `merriweather`    | `fredoka`      | Headings                                                                         |
| `$theme-font-type-cond`  | `false`           | `montserrat`   | USWDS's condensed slot, used here to carry the Montserrat alternate heading font |
| `$theme-font-type-mono`  | `roboto-mono`     | `roboto-mono`  | Same as default                                                                  |
| `$theme-font-type-icon`  | `false`           | `false`        | Same as default                                                                  |
| `$theme-font-type-lang`  | `false`           | `false`        | Same as default                                                                  |

### Font roles

| Setting                    | USWDS default | PathAble value | Notes                                                |
| -------------------------- | ------------- | -------------- | ---------------------------------------------------- |
| `$theme-font-role-heading` | `serif`       | `serif`        | Same as default; resolves to Fredoka                 |
| `$theme-font-role-body`    | `sans`        | `sans`         | Same as default; resolves to Nunito                  |
| `$theme-font-role-ui`      | `sans`        | `sans`         | Same as default; resolves to Nunito                  |
| `$theme-font-role-code`    | `mono`        | `mono`         | Same as default; resolves to Roboto Mono             |
| `$theme-font-role-alt`     | `serif`       | `cond`         | Resolves to Montserrat, independent of the sans font |

### Type scale

A scale token names a step of the USWDS system type scale (1 is 12px, 5 is
16px, 12 is 32px, 15 is 48px). PathAble moves three of the nine tokens.

| Setting                 | USWDS default | PathAble value | Notes           |
| ----------------------- | ------------- | -------------- | --------------- |
| `$theme-type-scale-3xs` | `2`, 13px     | `1`, 12px      |                 |
| `$theme-type-scale-2xs` | `3`, 14px     | `3`, 14px      | Same as default |
| `$theme-type-scale-xs`  | `4`, 15px     | `4`, 15px      | Same as default |
| `$theme-type-scale-sm`  | `5`, 16px     | `5`, 16px      | Same as default |
| `$theme-type-scale-md`  | `6`, 17px     | `7`, 18px      |                 |
| `$theme-type-scale-lg`  | `9`, 22px     | `10`, 24px     |                 |
| `$theme-type-scale-xl`  | `12`, 32px    | `12`, 32px     | Same as default |
| `$theme-type-scale-2xl` | `14`, 40px    | `14`, 40px     | Same as default |
| `$theme-type-scale-3xl` | `15`, 48px    | `15`, 48px     | Same as default |

### Headings

Sizes are scale tokens, and the pixel size is what the token is on each
scale. The heading line height is a USWDS line height token (`2` is 1.15, `3`
is 1.35).

| Setting                      | USWDS default | PathAble value | Notes                                              |
| ---------------------------- | ------------- | -------------- | -------------------------------------------------- |
| `$theme-display-font-size`   | `3xl`, 48px   | `xl`, 32px     | Display text                                       |
| `$theme-h1-font-size`        | `2xl`, 40px   | `lg`, 24px     |                                                    |
| `$theme-h2-font-size`        | `xl`, 32px    | `md`, 18px     |                                                    |
| `$theme-h3-font-size`        | `lg`, 22px    | `md`, 18px     | The same size as `h2`                              |
| `$theme-h4-font-size`        | `sm`, 16px    | `sm`, 16px     | Same as default                                    |
| `$theme-h5-font-size`        | `xs`, 15px    | `2xs`, 14px    |                                                    |
| `$theme-h6-font-size`        | `3xs`, 13px   | `3xs`, 12px    | Same token as default; smaller because `3xs` moved |
| `$theme-heading-line-height` | `2`, 1.15     | `3`, 1.35      |                                                    |
| `$theme-heading-margin-top`  | `1.5em`       | `1.5em`        | Same as default                                    |

### Body and prose

| Setting                         | USWDS default | PathAble value | Notes                                                                  |
| ------------------------------- | ------------- | -------------- | ---------------------------------------------------------------------- |
| `$theme-body-font-family`       | `body`        | `body`         | Same as default                                                        |
| `$theme-body-font-size`         | `sm`, 16px    | `sm`, 16px     | Same as default                                                        |
| `$theme-body-line-height`       | `5`, 1.62     | `5`, 1.62      | Same as default                                                        |
| `$theme-style-body-element`     | `false`       | `false`        | Same as default                                                        |
| `$theme-respect-user-font-size` | `true`        | `true`         | Same as default; the root font size follows the user's browser setting |
| `$theme-small-font-size`        | `2xs`, 14px   | `2xs`, 14px    | Same as default                                                        |
| `$theme-prose-font-family`      | `body`        | `body`         | Same as default                                                        |
| `$theme-paragraph-margin-top`   | `1em`         | `1em`          | Same as default                                                        |
| `$theme-lead-font-family`       | `heading`     | `heading`      | Same as default                                                        |
| `$theme-lead-font-size`         | `lg`, 22px    | `lg`, 24px     | Same token as default; larger because `lg` moved                       |
| `$theme-lead-line-height`       | `6`, 1.75     | `6`, 1.75      | Same as default                                                        |
| `$theme-lead-measure`           | `6`, 88ex     | `6`, 88ex      | Same as default                                                        |
