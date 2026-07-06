# Context Digest — Integration Capability (Draft)

## Feature
003-wrap-uswds-theme: Wrap USWDS v3.x as a dependency, configure theme color tokens to PathAble brand colors

## Key Design Decisions
- D1: Brand color → USWDS system token mapping (research.md)
- D2: Full grade mapping per family (research.md)
- D3: Separate `_uswds-theme.scss` partial with `@use "uswds-core" with (...)` (scss-interface.md)
- D4: State token configuration (research.md)
- D5: Unused grades set to `false` (research.md)

## Critical Constraints
- FR-006: No USWDS component styles in output (tokens only)
- FR-007: Public API unchanged ($pathable-*, --pathable-*)
- FR-008: All overrides in single settings file
- Build requires `--load-path=node_modules/@uswds/uswds/packages`
- Use `uswds.color("token")` NOT `$theme-color-*` to get hex values