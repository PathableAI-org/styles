# Context Digest: S05-integration-05 — US3 Documentation in Settings File

## Goal
Add documentation comments and upgrade instructions to `_uswds-theme.scss`.

## Key Requirements
- T036: Add comments explaining each theme family mapping (which brand color → which family → which USWDS system token)
- T037: Add upgrade instruction block at the top of the file
- T038: Verify FR-008 — no USWDS theme color overrides exist outside _uswds-theme.scss

## Example Comment Style
```scss
// ==========================================
// USWDS Theme Color Configuration
// ==========================================
//
// Primary family (blue-warm): PathAble Blue (#00365c)
//   - Default: blue-warm-80v (ΔE 5.56 from original)
//   - Dark: blue-warm-80
//   - Darker: blue-warm-90
// ...
//
// Upgrade Instructions:
// To upgrade USWDS: bump version in package.json, rebuild,
// verify no unexpected color changes. Only this file needs review.
```