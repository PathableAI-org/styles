---
name: Components
slug: settings-components
kind: settings
summary: 'The one USWDS component setting PathAble sets: the colour of the breadcrumb separators.'
uswds: https://designsystem.digital.gov/documentation/settings/#component-settings
---

# Components

The one USWDS component setting PathAble sets: the colour of the breadcrumb separators. Every other component setting is at its USWDS default. See the
[USWDS component settings](https://designsystem.digital.gov/documentation/settings/#component-settings).

## Not public API

This page is information only. `@pathableai/styles` ships compiled CSS, so a
consumer cannot set these Sass settings, and the settings are not part of the
public API. To get the effect, use the documented tokens and classes; see the
[Overview](settings.md).

## Values

Colour tokens in the PathAble value column are theme colour names, and the hex
beside each is the colour it resolves to. The theme colours are listed on
[Color](settings-color.md).

| Setting                             | USWDS default                                                             | PathAble value         | Notes                                                                                                                                                                                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `$theme-breadcrumb-separator-color` | `base` (theme colour name; here that grade is Shilling Silver, `#dde2e8`) | `base-dark`, `#565c65` | The colour of the [breadcrumb](breadcrumb.md)'s chevron separators and the back arrow before the parent link on narrow screens. `base-dark` is gray-cool-60, 6.7:1 on the breadcrumb's white background, where the default base grade would be Shilling Silver at 1.3:1. |
