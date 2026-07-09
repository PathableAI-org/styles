# Data Model: Typography Tokens

## Entities

### TypographyRole

A named font role in the PathAble brand system, mapping a brand typeface to a usage context.

| Field | Type | Source Token | Values | Description |
|-------|------|-------------|--------|-------------|
| `name` | String | — | `heading`, `alternate-heading`, `subheading`, `body` | Canonical role name |
| `displayName` | String | — | `Heading`, `Alternate Heading`, `Subheading`, `Body Text` | Human-readable label for Storybook |
| `fontFamily` | String | `--pathable-font-heading`, `--pathable-font-alt`, `--pathable-font-subheading`, `--pathable-font-body` | See below | CSS font-family stack |
| `typeface` | String | — | `Fredoka`, `Montserrat`, `Poppins`, `Nunito` | Brand typeface name |
| `weight` | Number | `--pathable-font-weight-normal` (400), `--pathable-font-weight-bold` (700) | `400`, `700` | Standard font weight |
| `weightName` | String | — | `Regular`, `Bold` | Human-readable weight |
| `uswdsRole` | String or null | — | `heading`, `body`, `ui`, `alt`, `null` | USWDS role assignment (null = no USWDS role, e.g., Poppins) |
| `usage` | String | — | See below | Intended usage description |
| `cssToken` | String | `--pathable-font-*` | e.g., `--pathable-font-heading` | Primary CSS custom property |

**Role Instances**:

| name | typeface | weight | weightName | uswdsRole | cssToken | Font Stack |
|------|----------|--------|------------|-----------|----------|------------|
| heading | Fredoka | 400 | Regular | heading | `--pathable-font-heading` | `'Fredoka', system-ui, sans-serif` |
| alternate-heading | Montserrat | 700 | Bold | alt | `--pathable-font-alt` | `'Montserrat', system-ui, sans-serif` |
| subheading | Poppins | 700 | Bold | null | `--pathable-font-subheading` | `'Poppins', system-ui, sans-serif` |
| body | Nunito | 400 | Regular | body, ui | `--pathable-font-body` | `'Nunito', system-ui, sans-serif` |

---

### TypographyScaleToken

A token in the type scale, with associated font, size, line-height, weight, and role.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `name` | String | `$typography-scale` map key | e.g., `display-lg`, `heading-lg`, `body-md` |
| `displayName` | String | — | Human-readable label for Storybook |
| `fontFamily` | String | `$typography-scale[name].font-family` | Font family for this scale token |
| `fontSize` | Number (px) | `$ui-{name}` or `--ui-{name}` | Font size in pixels |
| `lineHeight` | Number (px) | `$typography-scale[name].line-height` | Line height in pixels |
| `fontWeight` | Number | `$typography-scale[name].font-weight` | Font weight |
| `sizeToken` | String | `--pathable-font-size-{name}` | CSS custom property for size |
| `uiToken` | String | `--ui-{name}` | CSS custom property for size (UI namespace) |

**Scale Token Instances**:

| name | displayName | typeface | fontSize | lineHeight | fontWeight | sizeToken |
|------|------------|----------|----------|------------|------------|-----------|
| display-lg | Display Large | Fredoka | 32px | 40px | 400 | `--pathable-font-size-display-lg` |
| heading-lg | Heading Large | Poppins | 24px | 32px | 700 | `--pathable-font-size-heading-lg` |
| heading-md | Heading Medium | Poppins | 20px | 28px | 700 | `--pathable-font-size-heading-md` |
| heading-sm | Heading Small | Poppins | 18px | 24px | 700 | `--pathable-font-size-heading-sm` |
| body-lg | Body Large | Nunito | 18px | 28px | 400 | `--pathable-font-size-body-lg` |
| body-md | Body Medium | Nunito | 16px | 24px | 400 | `--pathable-font-size-body-md` |
| body-sm | Body Small | Nunito | 14px | 20px | 400 | `--pathable-font-size-body-sm` |
| label-md | Label Medium | Nunito | 14px | 20px | 600 | `--pathable-font-size-label-md` |
| label-sm | Label Small | Nunito | 12px | 16px | 600 | `--pathable-font-size-label-sm` |
| caption-md | Caption Medium | Nunito | 12px | 16px | 400 | `--pathable-font-size-caption-md` |

---

### TypographySemanticToken

A role-based CSS custom property that maps a typography concern to a named semantic role.

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| `name` | String | `$typography-tokens` map key | e.g., `font-heading`, `font-size-body-md`, `font-weight-bold` |
| `cssToken` | String | `--pathable-{name}` | Pathable namespace CSS custom property |
| `usaToken` | String or null | `--usa-{name}` | USWDS namespace CSS custom property (null if no USWDS equivalent) |
| `value` | String/Number | `$typography-tokens[name]` | The resolved value |
| `category` | String | — | `font-family`, `font-size`, `font-weight`, `line-height` |

**Relationship**: TypographySemanticToken is the compiled form of the values that define TypographyRole and TypographyScaleToken. Each role and scale token derives its CSS values from one or more semantic tokens.

---

### TypographyViolation

A documented brand rule violation that should not occur in production.

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Short violation name |
| `description` | String | Human-readable explanation of the violation |
| `rule` | String | Reference to the BRAND_RULES.md rule being violated |
| `example` | String | HTML snippet demonstrating the violation |

**Violation Instances**:

| name | description | rule |
|------|-------------|------|
| heading-for-long-text | Using heading typeface (Fredoka) for long passages of text | "Do not use the heading typeface for long sections of text" |
| centered-long-body | Centering body text blocks longer than 3 lines | "Do not center sections of body text longer than 3 lines" |
| body-all-caps | Formatting body text in all caps | "Do not format body text in all caps" |
| crowded-text | Text without adequate spacing or breathing room | "Preserve breathing room around text blocks and UI elements" |