# Research: Brand Design Token Sources and Decisions

**Phase**: 0 — Outline & Research
**Feature**: Brand Design Tokens (`001-brand-design-tokens`)

## 1. Brand Color Data Source

| Decision                                                                        | Rationale                                                                             | Alternatives Considered                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Use Brand Book PDF (March 2026, CTRL STUDIO) hex values as the canonical source | The PDF is the official brand guide with full color spec including Pantone references | Figma swatches confirmed matching hex values; no discrepancy found |

**Confirmed colors:**

- `--pathable-blue`: `#00365c`
- `--intelligent-jade`: `#1cae96`
- `--bright-blue-brooks`: `#4899e8`
- `--tech-teal`: `#015a76`
- `--lived-in-lime`: `#d3ff66`
- `--shilling-silver`: `#dde2e8`

## 2. Font-to-Role Mapping

| Decision                                                                                             | Rationale                                           | Alternatives Considered                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Follow COLOR_AND_TYPOGRAPHY_RULES.md: Alternate Heading = Montserrat Bold, Subheading = Poppins Bold | The rules file is marked as authoritative over spec | Original spec had these swapped (Poppins Bold for alternate, Montserrat Bold for subheading). Figma showed ui/heading/* using Poppins Bold which maps to Subheading role. |

**Confirmed mapping:**

- Heading: Fredoka Regular
- Alternate Heading: Montserrat Bold
- Subheading: Poppins Bold
- Body Text: Nunito Regular

## 3. Typography Scale Values

| Decision                                               | Rationale                                      | Alternatives Considered                                                           |
| ------------------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Use exact values from Figma text layer node properties | Figma is the source of truth for visual sizing | Reasonable defaults were considered but Figma inspection yielded all exact values |

**Confirmed scale:**

| Role          | Font            | Size | Line-Height | Weight |
| ------------- | --------------- | ---- | ----------- | ------ |
| ui/display/lg | Fredoka Regular | 32px | 40px        | 400    |
| ui/heading/lg | Poppins Bold    | 24px | 32px        | 700    |
| ui/heading/md | Poppins Bold    | 20px | 28px        | 700    |
| ui/heading/sm | Poppins Bold    | 18px | 24px        | 700    |
| ui/body/lg    | Nunito Regular  | 18px | 28px        | 400    |
| ui/body/md    | Nunito Regular  | 16px | 24px        | 400    |
| ui/body/sm    | Nunito Regular  | 14px | 20px        | 400    |
| ui/label/md   | Nunito SemiBold | 14px | 20px        | 600    |
| ui/label/sm   | Nunito SemiBold | 12px | 16px        | 600    |
| ui/caption/md | Nunito Regular  | 12px | 16px        | 400    |

## 4. Elevation Box-Shadow Values

| Decision                                                  | Rationale                                             | Alternatives Considered                                                                                                  |
| --------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Use exact values from Figma drop-shadow effect properties | Figma is the source of truth for visual effect values | Standard Material Design elevations were considered but Figma uses PathAble Blue-tinted shadows which are brand-specific |

**Confirmed levels:**

| Level | Box-Shadow                                 |
| ----- | ------------------------------------------ |
| sm    | `0px 1px 2px 0px rgba(0, 54, 92, 0.12)`    |
| md    | `0px 4px 8px 0px rgba(0, 54, 92, 0.16)`    |
| lg    | `0px 8px 16px -2px rgba(0, 54, 92, 0.20)`  |
| xl    | `0px 12px 24px -4px rgba(0, 54, 92, 0.24)` |

## 5. Semantic Token Naming Convention

| Decision                                         | Rationale                                                                                                                                       | Alternatives Considered                                                                                                                                           |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Use `--pathable-` prefix for all semantic tokens | README.md, BRAND_RULES.md, and AGENTS.md consistently use `--pathable-color-*` naming. These are the authoritative package documentation files. | Unprefixed names like `--color-bg` were initially chosen in the spec, but the package files override this. The `--pathable-` prefix provides namespace isolation. |

## 6. README.md Markdown Issues

**Decision**: Fix structural/formatting issues in README.md without changing content.

**Confirmed issues:**

- Missing closing code fence delimiter (```) after the Usage code block (line ~45-46)
- "Guidance" appears as bare text (should be a section heading)
- "Accessibility" appears as bare text (should be a section heading)
- "License" appears as bare text (should be a section heading)

**BRAND_RULES.md and AGENTS.md**: No structural formatting issues found. Content is clean.

## 7. Package Distribution

**Decision**: Add a `"files"` field to `packages/styles/package.json` to ensure README.md, BRAND_RULES.md, and AGENTS.md are included in the published npm package alongside `dist/` and `src/`.

**Rationale**: npm by default includes README.md, package.json, and files matched by the `"files"` field. Without an explicit `"files"` field, `src/`, BRAND_RULES.md, and AGENTS.md may not be included.
