# Data Model: USWDS Theme Wrapper

## Entities

### BrandColor

Represents one of the six PathAble brand colors with its USWDS system token mapping.

| Field | Type | Description |
| ------- | ------ | ------------- |
| name | string | Canonical brand color name (e.g., "PathAble Blue") |
| scssVariable | string | SCSS variable name (e.g., "$pathable-blue") |
| cssCustomProperty | string | CSS custom property name (e.g., "--pathable-blue") |
| hex | string | Original hex value from brand guidelines |
| uswdsSystemToken | string | Closest USWDS v3.x system token (e.g., "blue-warm-80v") |
| themeFamily | enum | One of: primary, secondary, accent-cool, accent-warm, base |
| deltaE | float | Perceptual color distance from original hex to USWDS token |
| mappedHex | string | Hex value of the USWDS system token |
| aliasStatus | enum | MUST (hard requirement) or SHOULD (preferred) |

**Instances**:

| Name | $var | --prop | Hex | USWDS Token | Family | ΔE | Alias |
| ------ | ------ | -------- | ----- | ------------- | -------- | ---- | ------- |
| PathAble Blue | $pathable-blue | --pathable-blue | #00365c | blue-warm-80v | primary | 5.56 | MUST |
| Intelligent Jade | $intelligent-jade | --intelligent-jade | #1cae96 | mint-cool-30v | secondary | 7.84 | MUST |
| Bright Blue Brooks | $bright-blue-brooks | --bright-blue-brooks | #4899e8 | blue-30v | accent-cool | 10.70 | MUST |
| Lived-in Lime | $lived-in-lime | --lived-in-lime | #d3ff66 | green-warm-10v | accent-warm | 18.97 | MUST |
| Shilling Silver | $shilling-silver | --shilling-silver | #dde2e8 | gray-cool-10 | base | 2.79 | MUST |
| Tech Teal | $tech-teal | --tech-teal | #015a76 | cyan-60v | accent-cool-dark | 8.10 | MUST |

### ThemeColorGrade

Represents a single grade within a USWDS theme color family.

| Field | Type | Description |
| ------- | ------ | ------------- |
| family | enum | One of: base, primary, secondary, accent-warm, accent-cool |
| grade | enum | One of: lightest, lighter, light, base (default), vivid, dark, darker, darkest, ink |
| uswdsSystemToken | string or false | USWDS system token name, or false if unused |
| brandColor | Reference to BrandColor (optional) | Associated PathAble brand color, if any |
| purpose | string | Functional role description |

**Complete Grade Table**: See `research.md` Decision D2 for the full 46-grade mapping across all 5 families.

### StateToken

Represents a USWDS state/utility color token.

| Field | Type | Description |
| ------- | ------ | ------------- |
| stateName | string | State name (error, warning, success, info, disabled, visited) |
| baseToken | string | USWDS system token for the base grade |
| darkToken | string | USWDS system token for the dark grade |
| lighterToken | string | USWDS system token for the lighter grade |

**Instances**:

| State | Base | Dark | Lighter |
| ------- | ------ | ------ | --------- |
| error | red-60v | red-70v | red-10 |
| warning | gold-20v | gold-30v | gold-5 |
| success | mint-cool-30v | mint-cool-40v | mint-cool-5 |
| info | blue-30v | blue-40v | blue-5 |
| disabled | gray-cool-20 | gray-30 | (none) |

### SemanticToken

Represents an existing $pathable-color-* semantic token and its alias status.

| Field | Type | Description |
| ------- | ------ | ------------- |
| name | string | SCSS variable name (e.g., "$pathable-color-danger") |
| cssCustomProperty | string | CSS custom property name (e.g., "--pathable-color-danger") |
| currentHex | string | Current hardcoded hex value |
| aliasStatus | enum | MUST reference USWDS token, SHOULD, or MAY remain hardcoded |
| uswdsToken | string or null | USWDS system token to alias, if applicable |

**Instances**:

| Token | Current Hex | Alias Status | USWDS Token |
| ------- | ------------- | ------------- | ------------- |
| $pathable-color-bg | #dde2e8 | SHOULD | gray-cool-10 |
| $pathable-color-surface | #ffffff | MAY remain | (none — pure white) |
| $pathable-color-text | #00365c | MUST | blue-warm-80v |
| $pathable-color-text-muted | #015a76 | MUST | cyan-60v |
| $pathable-color-border | #dde2e8 | SHOULD | gray-cool-10 |
| $pathable-color-link | #4899e8 | MUST | blue-30v |
| $pathable-color-accent | #1cae96 | MUST | mint-cool-30v |
| $pathable-color-focus-ring | #4899e8 | MUST | blue-40v |
| $pathable-color-danger | #dc3545 | MAY remain | (non-brand red, no USWDS mapping) |
| $pathable-color-success | #1cae96 | MUST | mint-cool-30v |

## Validation Rules

1. Every $pathable-color-* with aliasStatus MUST must have its hex value match uswds.color(uswdsToken) after compilation
2. Every --pathable-* CSS custom property must continue to produce the expected hex in compiled output
3. No USWDS component styles may appear in dist/styles.css
4. All 5 theme families must have at least 3 configured grades (not false)
