# Context Digest: USWDS Typography Token Documentation

## Tasks

- **T013**: Update `packages/styles/AGENTS.md` with USWDS typography token usage rules
  - Add section documenting the dual `--pathable-font-*` / `--usa-font-*` naming convention
  - Add rules for referencing typography tokens in SCSS
- **T014**: Update `packages/styles/BRAND_RULES.md` with USWDS typography token references
  - Add "USWDS Typography Token Mapping" table showing each brand typeface's USWDS role assignment and custom typeface token
  - Document the type scale mapping table

## Dependency

Both T013 and T014 depend on SCSS implementation (T001-T012) being complete. The documentation must reflect the actual implemented tokens, not design intent.

## Context: What to Add to AGENTS.md (T013)

### New Section: USWDS Typography Token Usage

Based on research.md Decision D6 and the SCSS interface contract, add a new section after the existing "USWDS Token Usage" section (which covers color). The new section should document:

**Dual Naming Convention (from research.md D6, scss-interface.md "Dual Naming Convention")**
- All typography CSS custom properties are emitted in two namespaces: `--pathable-font-*` and `--usa-font-*`, both resolving to identical values
- The `--pathable-font-*` namespace is the source of truth; `--usa-font-*` is derived from it
- New tokens are added by editing a single entry in the `$typography-tokens` map in `_typography.scss`

**CSS custom property categories (from scss-interface.md "Public API" section):**
- Font role: `--pathable-font-heading`, `--pathable-font-body`, `--pathable-font-mono`, `--pathable-font-alt` (and `--usa-font-*` equivalents)
- Font size: `--pathable-font-size-display-lg`, `--pathable-font-size-heading-lg`, `--pathable-font-size-body-md`, etc. (and `--usa-font-size-h1`, `--usa-font-size-h2`, etc.)
- Font weight: `--pathable-font-weight-normal`, `--pathable-font-weight-semibold`, `--pathable-font-weight-bold` (and `--usa-font-*` equivalents)
- Line height: `--pathable-font-line-height-body` (and `--usa-font-line-height-body`, `--usa-font-line-height-heading`)

**SCSS typography token reference rules (from research.md D7, D2):**
- Agents MUST use `uswds-core` functions to reference typography theme tokens in SCSS (e.g., `uswds.family('heading')`, `uswds.type-scale('lg')`)
- Agents MUST NOT use `$theme-font-*` variables directly — those are USWDS internal configuration values, not resolved CSS values
- Agents MUST NOT edit `_uswds-theme.scss` to add new typography overrides without explicit instructions
- Agents MUST keep all USWDS theme typography overrides scoped within `_uswds-theme.scss` per FR-011
- Agents MAY reference the `--pathable-font-*` or `--usa-font-*` CSS custom properties from CSS
- For SCSS consumers, the correct pattern is: `@use 'uswds-core' as uswds;` then `uswds.family('heading')` or `uswds.type-scale('body')`
- For CSS consumers, the compiled output contains resolved values via `--pathable-font-*` and `--usa-font-*` custom properties

**Custom typeface tokens (from research.md D2, data-model.md BrandTypeface):**
- Fredoka → custom typeface token `"fredoka"`, assigned to `$theme-font-role-heading`
- Nunito → custom typeface token `"nunito"`, assigned to `$theme-font-role-body` and `$theme-font-role-ui`
- Poppins → custom typeface token `"poppins"`, assigned to `$theme-font-role-alt` (subheading)
- Montserrat → custom typeface token `"montserrat"`, assigned to `$theme-font-role-alt` (alternate heading)

## Context: What to Add to BRAND_RULES.md (T014)

### New Section: USWDS Typography Token Mapping

Add after the existing "Typography" section, before "Typography Hierarchy". Include:

**Brand Typeface → USWDS Role Mapping Table (from data-model.md RoleFontToken instances, research.md D1):**

| Brand Font | Weight | USWDS Role | Custom Typeface Token | Font Stack |
|---|---|---|---|---|
| Fredoka | Regular (400) | heading | `fredoka` | `'Fredoka', system-ui, sans-serif` |
| Nunito | Regular (400), SemiBold (600) | body, ui | `nunito` | `'Nunito', system-ui, sans-serif` |
| Poppins | Bold (700) | alt (subheading) | `poppins` | `'Poppins', system-ui, sans-serif` |
| Montserrat | Bold (700) | alt (alternate heading) | `montserrat` | `'Montserrat', system-ui, sans-serif` |

**Type Scale Mapping Table (from research.md D3, data-model.md TypeScaleMapping instances):**

| PathAble Token | Size | USWDS System Token | USWDS Theme Token | Notes |
|---|---|---|---|---|
| display-lg | 32px | 12 | xl | Default — unchanged |
| heading-lg | 24px | 10 | lg | Customized from default 9 (22px) |
| heading-md | 20px | 8 | (none) | No theme token — use system token 8 directly |
| heading-sm / body-lg | 18px | 7 | md | Customized from default 6 (17px) |
| body-md | 16px | 5 | sm | Default — unchanged |
| body-sm / label-md | 14px | 3 | 2xs | Default — unchanged |
| label-sm / caption-md | 12px | 1 | 3xs | Customized from default 2 (13px) |

**Heading size assignments (from research.md D3):**

| Element | USWDS Theme Token | Size |
|---|---|---|
| Display | xl | 32px |
| h1 | lg | 24px |
| h2 | md | 18px |
| h3 | md | 18px |
| h4 | sm | 16px |
| h5 | 2xs | 14px |
| h6 | 3xs | 12px |
| Body | sm | 16px |

**Line-height settings (from research.md D4):** `$theme-body-line-height: 5` (1.62), `$theme-heading-line-height: 3` (1.35), `$theme-lead-line-height: 6` (1.75).

## Current State (from context-index.json)

- `packages/styles/AGENTS.md` — has "Typography Tokens" section with font role table, and "USWDS Token Usage" section covering color only. No USWDS typography documentation exists yet.
- `packages/styles/BRAND_RULES.md` — has "Typography" section with font role table, and "Typography Hierarchy" and "Typography Violations" sections. No USWDS typography token mapping exists yet.
- `packages/styles/src/_typography.scss` — contains `$pathable-font-*` variables, `$typography-scale` map, `$ui-*` variables, and `--pathable-font-*` / `--ui-*` CSS custom properties. After T001-T012, it will also contain the `$typography-tokens` map and dual `@each` loop emitting `--usa-font-*` properties.

## Allowed Write Paths

- `packages/styles/AGENTS.md`
- `packages/styles/BRAND_RULES.md`

## Validation Commands

- `rg '--pathable-font-' packages/styles/AGENTS.md` — must match (verifies dual naming convention is documented)
- `rg '--usa-font-' packages/styles/AGENTS.md` — must match (verifies USWDS namespace is documented)
- `rg 'Fredoka' packages/styles/BRAND_RULES.md` — must match in the new mapping table
- `rg 'Type Scale' packages/styles/BRAND_RULES.md` — must match the new type scale mapping table section