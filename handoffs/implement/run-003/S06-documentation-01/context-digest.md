# Context Digest: S06-documentation-01 — Documentation Updates

## Goal
Update three documentation files in `packages/styles/` with USWDS integration information.

## Key Info for Each File

### README.md
- Add installation: `pnpm add @pathable/styles @uswds/uswds`
- Add usage example showing how to import both packages
- Link to `specs/003-wrap-uswds-theme/quickstart.md` for detailed guide
- Mention that USWDS components must be imported separately (tokens-only output)

### BRAND_RULES.md
- Keep existing table of 6 brand colors with hex values
- Add a new column or table showing USWDS system token equivalents
- Include deltaE values from research.md

### AGENTS.md
- Add rule: "Agents MUST use `uswds.color(\"token-name\")` pattern when referencing brand colors in new SCSS"
- Reference the mapping table in BRAND_RULES.md for token lookups