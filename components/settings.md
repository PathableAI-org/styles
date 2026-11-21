---
name: Overview
slug: settings
kind: settings
summary: 'How the PathAble build configures USWDS: a fixed set of Sass settings, applied when the stylesheet is compiled, that match the PathAble brand guide.'
uswds: https://designsystem.digital.gov/documentation/settings/
---

# Overview

How the PathAble build configures USWDS: a fixed set of Sass settings, applied when the stylesheet is compiled, that match the PathAble brand guide. The pages in this section list those settings for people who want to know why a token or class has the value it has. See the
[USWDS settings documentation](https://designsystem.digital.gov/documentation/settings/).

## Not public API

These pages are information only. `@pathableai/styles` ships compiled CSS, so a
consumer cannot set any of these Sass settings, and the settings are not part
of the public API. A setting can change or disappear in any release without
notice. Nothing on these pages is something to depend on, copy into your own
build or override. The pages carry no examples and no fixtures for that
reason.

## What USWDS settings are

USWDS is written in Sass. Its settings are Sass variables, such as
`$theme-color-primary`, that a project sets before the USWDS source is
compiled. Each setting changes what USWDS outputs: a colour grade, a font, a
size on the type scale. USWDS gives every setting a default; a project
overrides only the ones it wants to change.

PathAble overrides a small number of settings in one place in the package
source, and compiles the result once when the package is built. Every value is
chosen to match the PathAble brand guide, and a value is not changed to suit an
individual product. The overrides cover three of the five USWDS settings
groups:

- [General](settings-general.md): the focus colour and compile notifications.
- [Color](settings-color.md): the theme and state colour grades, and the link
  colours.
- [Typography](settings-typography.md): the typefaces, the type scale, and
  the heading and body sizes.

## Getting the same effect as a consumer

To use what a setting produces, use the documented output instead of the
setting:

- Colours: the colour tokens and the classes that read them, on
  [Color](tokens-color.md), with the theme grades on
  [Color theme tokens](tokens-color-theme-tokens.md), the state grades on
  [Color state tokens](tokens-color-state-tokens.md) and the underlying
  palette on [Color system tokens](tokens-color-system-tokens.md).
- Type: the font families, sizes and line heights on
  [Typesetting](tokens-typesetting.md), with
  [Font family](tokens-typesetting-font-family.md),
  [Font size](tokens-typesetting-font-size.md) and
  [Line height](tokens-typesetting-line-height.md) each on its own page.
- Components: the component pages already apply these values, so a component
  has the PathAble colours and type without any setting from you.

If the output you need is not there, ask for it to be added to the package;
do not look for a setting to change.

## Settings left at USWDS defaults

PathAble sets nothing in these USWDS settings groups, so each one is at its
USWDS 3.14.0 default:

- Spacing: the
  [spacing settings](https://designsystem.digital.gov/documentation/settings/#spacing-settings).
- Components: the
  [component settings](https://designsystem.digital.gov/documentation/settings/#component-settings).
- Utilities: the
  [utility settings](https://designsystem.digital.gov/documentation/settings/#utilities-settings).
