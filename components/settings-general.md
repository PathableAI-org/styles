---
name: General
slug: settings-general
kind: settings
summary: 'The two USWDS general settings PathAble sets: the focus colour and the compile notifications.'
uswds: https://designsystem.digital.gov/documentation/settings/#general-settings
---

# General

The two USWDS general settings PathAble sets: the focus colour and the compile notifications. Every other general setting is at its USWDS default. See the
[USWDS general settings](https://designsystem.digital.gov/documentation/settings/#general-settings).

## Not public API

This page is information only. `@pathableai/styles` ships compiled CSS, so a
consumer cannot set these Sass settings, and the settings are not part of the
public API. To get the effect, use the documented tokens and classes; see the
[Overview](settings.md).

## Values

Colour tokens in the PathAble value column are theme colour names, and the hex
beside each is the colour it resolves to. The theme colours are listed on
[Color](settings-color.md).

| Setting                     | USWDS default         | PathAble value           | Notes                                                                                                                    |
| --------------------------- | --------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `$theme-focus-color`        | `blue-40v`, `#2491ff` | `accent-cool`, `#4899e8` | Bright Blue Brooks, the brand colour of the focus ring. USWDS takes a theme or system colour name here, not a hex value. |
| `$theme-show-notifications` | `true`                | `false`                  | Hides USWDS update notices while the stylesheet is compiled.                                                             |
