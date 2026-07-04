# Data Model: Brand Design Tokens

**Phase**: 1 — Design & Contracts
**Feature**: Brand Design Tokens (`001-brand-design-tokens`)

## Entity: BrandColor

A named color from the PathAble brand palette with a canonical hex value.

| Field | Type | Description |
|-------|------|-------------|
| slug | string | Machine name used in CSS custom property (e.g., `pathable-blue`) |
| displayName | string | Human-readable name (e.g., "PathAble Blue") |
| hex | string | Hex color value (e.g., `#00365c`) |
| category | enum | `primary` or `supporting` |

**Instances:**

| slug | displayName | hex | Category |
|------|-------------|-----|----------|
| `pathable-blue` | PathAble Blue | `#00365c` | primary |
| `intelligent-jade` | Intelligent Jade | `#1cae96` | primary |
| `bright-blue-brooks` | Bright Blue Brooks | `#4899e8` | primary |
| `tech-teal` | Tech Teal | `#015a76` | supporting |
| `lived-in-lime` | Lived-In Lime | `#d3ff66` | supporting |
| `shilling-silver` | Shilling Silver | `#dde2e8` | supporting |

## Entity: SemanticToken

A CSS custom property mapping a functional UI role to a brand color value.

| Field | Type | Description |
|-------|------|-------------|
| cssVar | string | CSS custom property name (e.g., `--pathable-color-bg`) |
| role | string | Functional role description |
| lightValue | BrandColor ref | Brand color assigned in light mode |

**Instances:**

| cssVar | role | lightValue |
|--------|------|------------|
| `--pathable-color-bg` | Default page background | Shilling Silver or White |
| `--pathable-color-surface` | Card/surface background | White |
| `--pathable-color-text` | Primary text color | PathAble Blue |
| `--pathable-color-text-muted` | Secondary/muted text | Tech Teal |
| `--pathable-color-border` | Default border color | Shilling Silver |
| `--pathable-color-link` | Link text color | Bright Blue Brooks |
| `--pathable-color-accent` | Accent/highlight color | Intelligent Jade |
| `--pathable-color-focus-ring` | Focus indicator ring | Bright Blue Brooks |
| `--pathable-color-danger` | Destructive/error feedback | Red (to be determined during implementation) |
| `--pathable-color-success` | Success/positive feedback | Intelligent Jade |

Note: Specific brand-color-to-semantic-role mappings for `--pathable-color-bg`, `--pathable-color-danger`, and `--pathable-color-focus-ring` need to be finalized during implementation based on accessibility contrast requirements.

## Entity: FontFamilyToken

A CSS custom property for a font family role with fallbacks.

| Field | Type | Description |
|-------|------|-------------|
| cssVar | string | CSS custom property name (e.g., `--pathable-font-heading`) |
| fontName | string | Primary font name |
| weight | string | Font weight name |
| fallbacks | string[] | Web-safe fallback font stack |

**Instances:**

| cssVar | fontName | Weight | Fallbacks |
|--------|----------|--------|-----------|
| `--pathable-font-heading` | Fredoka | Regular | system-ui, sans-serif |
| `--pathable-font-alternate-heading` | Montserrat | Bold | system-ui, sans-serif |
| `--pathable-font-subheading` | Poppins | Bold | system-ui, sans-serif |
| `--pathable-font-body` | Nunito | Regular | system-ui, serif |

## Entity: TypographyScaleToken

A CSS custom property for a specific typography role with exact sizing.

| Field | Type | Description |
|-------|------|-------------|
| cssVar | string | CSS custom property name (e.g., `--ui-heading-lg`) |
| fontRef | FontFamilyToken ref | Which font family to use |
| fontSize | string | Font size with unit (e.g., `24px`) |
| lineHeight | string | Line height with unit (e.g., `32px`) |
| fontWeight | number | Numeric font weight (400, 600, 700) |

**Instances:** See research.md Section 3 for complete table.

## Entity: SpacingToken

A CSS custom property for a fixed spacing value.

| Field | Type | Description |
|-------|------|-------------|
| cssVar | string | CSS custom property name (e.g., `--space-16`) |
| value | string | Pixel value (e.g., `16px`) |

**Instances:** 4px, 8px, 12px, 16px, 24px, 32px, 48px

## Entity: ElevationToken

A CSS custom property for a box-shadow level.

| Field | Type | Description |
|-------|------|-------------|
| cssVar | string | CSS custom property name (e.g., `--elevation-md`) |
| value | string | Box-shadow value |

**Instances:** See research.md Section 4 for complete values.

## Entity: RadiusToken

A CSS custom property for a border-radius value.

| Field | Type | Description |
|-------|------|-------------|
| cssVar | string | CSS custom property name (e.g., `--radius-md`) |
| value | string | Pixel value (e.g., `8px`) |

**Instances:**
- `--radius-sm`: `4px`
- `--radius-md`: `8px`
- `--radius-lg`: `12px`