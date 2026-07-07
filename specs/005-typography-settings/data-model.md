# Data Model: USWDS Typography Settings

## Entities

### BrandTypeface

Represents one of the PathAble brand typefaces with its USWDS typeface token configuration.

| Field | Type | Description |
|-------|------|-------------|
| name | string | Canonical typeface name (e.g., "Fredoka") |
| role | enum | One of: heading, body, ui, code, alt, subheading |
| weights | array of int | Available font weight values (e.g., [400, 600]) |
| weightNames | map | SCSS-friendly weight name to numeric value (e.g., normal: 400, semibold: 600) |
| uswdsTypefaceToken | string | Custom typeface token name (e.g., "fredoka") |
| fontStack | string | CSS font-family fallback chain (e.g., "'Fredoka', system-ui, sans-serif") |
| displayName | string | Display name for the typeface (e.g., "Fredoka") |
| capHeight | px | Cap height for normalization (default: 364px) |

**Instances**:

| Name | Role | Weights | Typeface Token | Font Stack |
|------|------|---------|---------------|------------|
| Fredoka | heading | [400] | fredoka | 'Fredoka', system-ui, sans-serif |
| Nunito | body, ui | [400, 600] | nunito | 'Nunito', system-ui, sans-serif |
| Poppins | subheading | [700] | poppins | 'Poppins', system-ui, sans-serif |
| Montserrat | alt (alternate heading) | [700] | montserrat | 'Montserrat', system-ui, sans-serif |

### FontFamilyToken

Represents a USWDS type-based font family token (e.g., 'sans', 'serif', 'mono').

| Field | Type | Description |
|-------|------|-------------|
| typeName | enum | One of: cond, icon, lang, mono, sans, serif |
| defaultTypeface | string | Built-in USWDS typeface token (e.g., 'source-sans-pro', 'merriweather', 'roboto-mono') |
| customTypeface | string or null | Custom typeface token name if overridden (e.g., 'fredoka') |
| customSrc | map or null | Custom font source configuration for @font-face generation |
| enabled | boolean | Whether this font type is used (false = disabled) |

**Instances**:

| Type | Default | Custom Override | Enabled |
|------|---------|----------------|---------|
| sans | source-sans-pro | (handled via typeface tokens and manual @font-face) | true |
| serif | merriweather | (none — unused) | false |
| mono | roboto-mono | (none — use default) | true |
| cond | false | — | false |
| icon | false | — | false |
| lang | false | — | false |

### RoleFontToken

Represents a USWDS role-based font token (e.g., 'heading', 'body', 'ui', 'code', 'alt').

| Field | Type | Description |
|-------|------|-------------|
| roleName | enum | One of: heading, body, ui, code, alt |
| typefaceTokenRef | string | Reference to the typeface token (custom or built-in) |
| brandTypeface | Reference to BrandTypeface | Associated PathAble brand typeface |
| defaultAssignment | string | USWDS default role assignment (e.g., 'serif' for heading) |

**Instances**:

| Role | Typeface Token Ref | Brand Typeface | Default |
|------|-------------------|----------------|---------|
| heading | fredoka | Fredoka | serif |
| body | nunito | Nunito | sans |
| ui | nunito | Nunito | sans |
| code | mono | (system monospace) | mono |
| alt | (montserrat or poppins) | Montserrat / Poppins | serif |

### TypeScaleMapping

Represents a mapping from a PathAble typography size to a USWDS type scale token.

| Field | Type | Description |
|-------|------|-------------|
| pathableToken | string | PathAble token name (e.g., "display-lg", "body-md") |
| pathablePx | int | Target pixel size |
| uswdsSystemToken | int | USWDS system token number (e.g., 5, 10, 12) |
| uswdsThemeToken | string or null | USWDS theme token if assigned (e.g., "sm", "lg", "xl") |
| customThemeToken | boolean | Whether the theme token value needs to be customized from default |

**Instances**:

| PathAble Token | Px | USWDS System | USWDS Theme | Custom? |
|----------------|----|-------------|-------------|---------|
| display-lg | 32px | 12 | xl | No (default 12 = 32px) |
| heading-lg | 24px | 10 | lg | Yes (default 9 = 22px) |
| heading-md | 20px | 8 | (none) | N/A — use system token directly |
| heading-sm / body-lg | 18px | 7 | md | Yes (default 6 = 17px) |
| body-md | 16px | 5 | sm | No (default 5 = 16px) |
| body-sm / label-md | 14px | 3 | 2xs | No (default 3 = 14px) |
| label-sm / caption-md | 12px | 1 | 3xs | Yes (default 2 = 13px) |

### FontWeightMapping

Represents a mapping from a PathAble font weight to a USWDS font weight token.

| Field | Type | Description |
|-------|------|-------------|
| pathableWeightName | string | PathAble weight name (e.g., "normal", "semibold", "bold") |
| pathableWeightValue | int | Numeric weight value (e.g., 400, 600, 700) |
| uswdsWeightToken | string | USWDS weight token name (e.g., "$theme-font-weight-normal") |
| customValue | boolean | Whether the USWDS token needs a custom value |

**Instances**:

| PathAble Name | Value | USWDS Token | Custom? |
|---------------|-------|-------------|---------|
| thin | (unused) | $theme-font-weight-thin | false (default) |
| light | (unused) | $theme-font-weight-light | 300 (default) |
| normal | 400 | $theme-font-weight-normal | 400 (default) |
| medium | (unused) | $theme-font-weight-medium | false (default) |
| semibold | 600 | $theme-font-weight-semibold | Yes — set to 600 |
| bold | 700 | $theme-font-weight-bold | 700 (default) |
| heavy | (unused) | $theme-font-weight-heavy | false (default) |

### LineHeightMapping

Represents a mapping from a PathAble line-height to a USWDS line-height token.

| Field | Type | Description |
|-------|------|-------------|
| pathableContext | string | PathAble context (e.g., "body-md", "heading-lg") |
| pathableLineHeight | px | PathAble line-height in pixels |
| pathableRatio | float | PathAble line-height ratio (unitless) |
| closestUsWdsToken | int | Closest USWDS line-height token number |
| uswdsTarget | float | USWDS target ratio for that token |

**Instances**:

| Context | Px | Ratio | USWDS Token | USWDS Target |
|---------|-----|-------|-------------|--------------|
| display (32px) | 40px | 1.25 | 3 | 1.35 |
| heading-lg (24px) | 32px | 1.333 | 3 | 1.35 |
| heading-md (20px) | 28px | 1.4 | 3 | 1.35 |
| heading-sm (18px) | 24px | 1.333 | 3 | 1.35 |
| body-lg (18px) | 28px | 1.555 | 5 | 1.62 |
| body-md (16px) | 24px | 1.5 | 4 | 1.5 |
| body-sm (14px) | 20px | 1.428 | 4 | 1.5 |

### TypographyCustomProperty

Represents a dual-named CSS custom property that exposes a typography value.

| Field | Type | Description |
|-------|------|-------------|
| pathableName | string | CSS custom property name under --pathable-* namespace |
| usaName | string | CSS custom property name under --usa-* namespace |
| value | string | Resolved value (font family, size, weight, line-height) |
| sourceToken | string | SCSS variable or token that provides the value |
| category | enum | One of: font-family, font-size, font-weight, line-height, font-scale |

**Instances**:

| --pathable-* | --usa-* | Value | Source | Category |
|-------------|---------|-------|--------|----------|
| --pathable-font-heading | --usa-font-heading | Fredoka font stack | $pathable-font-heading | font-family |
| --pathable-font-body | --usa-font-body | Nunito font stack | $pathable-font-body | font-family |
| --pathable-font-mono | --usa-font-mono | mono font stack | $pathable-font-mono | font-family |
| --pathable-font-alternate-heading | --usa-font-alt | Montserrat font stack | $pathable-font-alternate-heading | font-family |
| --pathable-font-subheading | --usa-font-alt | Poppins font stack | $pathable-font-subheading | font-family |
| --pathable-font-size-body-md | --usa-font-size-sm | 16px | $theme-body-font-size | font-size |
| --pathable-font-size-display-lg | --usa-font-size-xl | 32px | $theme-display-font-size | font-size |
| --pathable-font-weight-normal | --usa-font-weight-normal | 400 | $theme-font-weight-normal | font-weight |
| --pathable-font-weight-bold | --usa-font-weight-bold | 700 | $theme-font-weight-bold | font-weight |
| --pathable-font-line-height-body | --usa-font-line-height-body | 1.62 | $theme-body-line-height | line-height |

## Validation Rules

1. Every `$pathable-font-*` SCSS variable must continue to produce the same value after USWDS typography settings are applied
2. Every `--pathable-font-*` CSS custom property must have a matching `--usa-*` equivalent with the same value
3. All custom typeface tokens must have a corresponding `@font-face` rule (either via USWDS custom-src or manual `_fonts.scss`)
4. No USWDS typography settings may conflict with existing `$pathable-font-*` values
5. All 4 brand typefaces must be assigned to at least one USWDS role-based font token
6. The `$theme-respect-user-font-size` setting must remain `true`