---
name: Color
slug: settings-color
kind: settings
summary: 'The USWDS color settings PathAble sets: the theme and state colour grades, which are the brand colours and tints and shades of them, and the link colours.'
uswds: https://designsystem.digital.gov/documentation/settings/#color-settings
---

# Color

The USWDS color settings PathAble sets: the theme and state colour grades, which are the brand colours and tints and shades of them, and the link colours. See the
[USWDS color settings](https://designsystem.digital.gov/documentation/settings/#color-settings).

## Not public API

This page is information only. `@pathableai/styles` ships compiled CSS, so a
consumer cannot set these Sass settings, and the settings are not part of the
public API. To get the effect, use the colour tokens and classes on
[Color](tokens-color.md); see the [Overview](settings.md).

## Values

Each table lists every setting PathAble sets in one colour family. A USWDS
default is a system colour token with the hex it resolves to. A PathAble value
is a hex value, or a token that PathAble keeps (marked "Same as default"). A
grade set to `false` has no token and no class; PathAble sets it to `false`
explicitly, which is the USWDS default. The brand colours are on
[Color theme tokens](tokens-color-theme-tokens.md).

How the grades relate to the brand colours:

- a `lighter` grade is the brand colour at 10% over white and a `light` grade
  the brand colour at 40% over white;
- a `dark` or `darker` grade is the brand colour mixed with black, or another
  brand colour where one fits the role;
- every value is a precomputed hex rounded to whole RGB channels, so USWDS can
  compute contrast from it.

### Base

Shilling Silver for the light grades, with PathAble Blue as the ink and the
dark grades, so default text is on brand. The `base-dark` grade stays a
neutral cool grey.

| Setting                      | USWDS default             | PathAble value            | Notes                                  |
| ---------------------------- | ------------------------- | ------------------------- | -------------------------------------- |
| `$theme-color-base-lightest` | `gray-5`, `#f0f0f0`       | `#f6f8f9`                 | Shilling Silver 25% over white         |
| `$theme-color-base-lighter`  | `gray-cool-10`, `#dfe1e2` | `#eef0f4`                 | Shilling Silver 50% over white         |
| `$theme-color-base-light`    | `gray-cool-30`, `#a9aeb1` | `#e6e9ee`                 | Shilling Silver 75% over white         |
| `$theme-color-base`          | `gray-cool-50`, `#71767a` | `#dde2e8`                 | Shilling Silver                        |
| `$theme-color-base-dark`     | `gray-cool-60`, `#565c65` | `gray-cool-60`, `#565c65` | Same as default                        |
| `$theme-color-base-darker`   | `gray-cool-70`, `#3d4551` | `#00365c`                 | PathAble Blue                          |
| `$theme-color-base-darkest`  | `gray-90`, `#1b1b1b`      | `#00365c`                 | PathAble Blue                          |
| `$theme-color-base-ink`      | `gray-90`, `#1b1b1b`      | `#00365c`                 | PathAble Blue, the default text colour |

### Primary

PathAble Blue.

| Setting                         | USWDS default              | PathAble value | Notes                        |
| ------------------------------- | -------------------------- | -------------- | ---------------------------- |
| `$theme-color-primary-lightest` | `false`                    | `false`        | Same as default              |
| `$theme-color-primary-lighter`  | `blue-10`, `#d9e8f6`       | `#e6ebef`      | PathAble Blue 10% over white |
| `$theme-color-primary-light`    | `blue-30`, `#73b3e7`       | `#99afbe`      | PathAble Blue 40% over white |
| `$theme-color-primary`          | `blue-60v`, `#005ea2`      | `#00365c`      | PathAble Blue                |
| `$theme-color-primary-vivid`    | `blue-warm-60v`, `#0050d8` | `#015a76`      | Tech Teal                    |
| `$theme-color-primary-dark`     | `blue-warm-70v`, `#1a4480` | `#002845`      | PathAble Blue 75% with black |
| `$theme-color-primary-darker`   | `blue-warm-80v`, `#162e51` | `#001e33`      | PathAble Blue 55% with black |
| `$theme-color-primary-darkest`  | `false`                    | `false`        | Same as default              |

### Secondary

Intelligent Jade.

| Setting                           | USWDS default             | PathAble value | Notes                              |
| --------------------------------- | ------------------------- | -------------- | ---------------------------------- |
| `$theme-color-secondary-lightest` | `false`                   | `false`        | Same as default                    |
| `$theme-color-secondary-lighter`  | `red-cool-10`, `#f3e1e4`  | `#e8f7f4`      | Intelligent Jade 10% over white    |
| `$theme-color-secondary-light`    | `red-30`, `#f2938c`       | `#a4dfd5`      | Intelligent Jade 40% over white    |
| `$theme-color-secondary`          | `red-50`, `#d83933`       | `#1cae96`      | Intelligent Jade                   |
| `$theme-color-secondary-vivid`    | `red-cool-50v`, `#e41d3d` | `#1cae96`      | Intelligent Jade                   |
| `$theme-color-secondary-dark`     | `red-60v`, `#b50909`      | `#0d7a63`      | Deep jade for text, 5.3:1 on white |
| `$theme-color-secondary-darker`   | `red-70v`, `#8b0a03`      | `#0d4e44`      | Intelligent Jade 45% with black    |
| `$theme-color-secondary-darkest`  | `false`                   | `false`        | Same as default                    |

### Accent warm

Lived-In Lime.

| Setting                             | USWDS default           | PathAble value | Notes                                                                                                    |
| ----------------------------------- | ----------------------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| `$theme-color-accent-warm-lightest` | `false`                 | `false`        | Same as default                                                                                          |
| `$theme-color-accent-warm-lighter`  | `orange-10`, `#f2e4d4`  | `#fbfff0`      | Lived-In Lime 10% over white                                                                             |
| `$theme-color-accent-warm-light`    | `orange-20v`, `#ffbc78` | `#edffc2`      | Lived-In Lime 40% over white                                                                             |
| `$theme-color-accent-warm`          | `orange-30v`, `#fa9441` | `#d3ff66`      | Lived-In Lime                                                                                            |
| `$theme-color-accent-warm-dark`     | `orange-50v`, `#c05600` | `#4a5924`      | Lived-In Lime 35% with black, 7.7:1 with white. USWDS pairs this grade with white text, so it stays dark |
| `$theme-color-accent-warm-darker`   | `orange-60`, `#775540`  | `#354019`      | Lived-In Lime 25% with black                                                                             |
| `$theme-color-accent-warm-darkest`  | `false`                 | `false`        | Same as default                                                                                          |

### Accent cool

Bright Blue Brooks, with Tech Teal and PathAble Blue for the dark grades.

| Setting                             | USWDS default              | PathAble value | Notes                             |
| ----------------------------------- | -------------------------- | -------------- | --------------------------------- |
| `$theme-color-accent-cool-lightest` | `false`                    | `false`        | Same as default                   |
| `$theme-color-accent-cool-lighter`  | `blue-cool-5v`, `#e1f3f8`  | `#edf5fd`      | Bright Blue Brooks 10% over white |
| `$theme-color-accent-cool-light`    | `blue-cool-20v`, `#97d4ea` | `#b6d6f6`      | Bright Blue Brooks 40% over white |
| `$theme-color-accent-cool`          | `cyan-30v`, `#00bde3`      | `#4899e8`      | Bright Blue Brooks                |
| `$theme-color-accent-cool-dark`     | `blue-cool-40v`, `#28a0cb` | `#015a76`      | Tech Teal                         |
| `$theme-color-accent-cool-darker`   | `blue-cool-60v`, `#07648d` | `#00365c`      | PathAble Blue                     |
| `$theme-color-accent-cool-darkest`  | `false`                    | `false`        | Same as default                   |

### State

The brand guide defines no red or amber, so error and warning use the same
semantic danger and warning colours as the rest of the package. Success is
Intelligent Jade and info is Bright Blue Brooks. Disabled is a neutral cool
grey.

| Setting                        | USWDS default               | PathAble value            | Notes                              |
| ------------------------------ | --------------------------- | ------------------------- | ---------------------------------- |
| `$theme-color-error-lighter`   | `red-warm-10`, `#f4e3db`    | `#fcebec`                 | Danger 10% over white              |
| `$theme-color-error`           | `red-warm-50v`, `#d54309`   | `#dc3545`                 | Danger                             |
| `$theme-color-error-dark`      | `red-60v`, `#b50909`        | `#a52834`                 | Danger 75% with black              |
| `$theme-color-warning-lighter` | `yellow-5`, `#faf3d1`       | `#fef6e9`                 | Warning 10% over white             |
| `$theme-color-warning`         | `gold-20v`, `#ffbe2e`       | `#f5a623`                 | Warning                            |
| `$theme-color-warning-dark`    | `gold-30v`, `#e5a000`       | `#c4851c`                 | Warning 80% with black             |
| `$theme-color-success-lighter` | `green-cool-5`, `#ecf3ec`   | `#e8f7f4`                 | Intelligent Jade 10% over white    |
| `$theme-color-success`         | `green-cool-40v`, `#00a91c` | `#1cae96`                 | Intelligent Jade                   |
| `$theme-color-success-dark`    | `green-cool-50v`, `#008817` | `#0d7a63`                 | Deep jade for text, 5.3:1 on white |
| `$theme-color-info-lighter`    | `cyan-5`, `#e7f6f8`         | `#edf5fd`                 | Bright Blue Brooks 10% over white  |
| `$theme-color-info`            | `cyan-30v`, `#00bde3`       | `#4899e8`                 | Bright Blue Brooks                 |
| `$theme-color-info-dark`       | `cyan-40v`, `#009ec1`       | `#015a76`                 | Tech Teal                          |
| `$theme-color-disabled`        | `gray-50`, `#757575`        | `gray-cool-20`, `#c6cace` | Neutral cool grey                  |
| `$theme-color-disabled-dark`   | `gray-70`, `#454545`        | `gray-cool-30`, `#a9aeb1` | Neutral cool grey                  |

### Links

USWDS takes theme colour names for link colours, not hex values. Here
`accent-cool-dark` is Tech Teal (7.7:1 on white, 5.9:1 on Shilling Silver),
`primary` is PathAble Blue and `primary-dark` is the darker PathAble Blue from
the primary family above. Bright Blue Brooks is only 3.0:1 on white, so it is
not used for link text.

| Setting                     | USWDS default               | PathAble value                | Notes                                         |
| --------------------------- | --------------------------- | ----------------------------- | --------------------------------------------- |
| `$theme-link-color`         | `primary`, `#005ea2`        | `accent-cool-dark`, `#015a76` | Tech Teal                                     |
| `$theme-link-visited-color` | `violet-70v`, `#54278f`     | `accent-cool-dark`, `#015a76` | Tech Teal: a visited link looks like any link |
| `$theme-link-hover-color`   | `primary-dark`, `#1a4480`   | `primary`, `#00365c`          | PathAble Blue                                 |
| `$theme-link-active-color`  | `primary-darker`, `#162e51` | `primary-dark`, `#002845`     | PathAble Blue 75% with black                  |
