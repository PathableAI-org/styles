# Integration Capability — Shard Plan

**Planner**: planner-integration-01
**Vertical Capability**: integration
**Feature**: 003-wrap-uswds-theme

## Shards

### S01-integration-01: Setup & Dependency
- **Tasks**: T001, T002, T003
- **Description**: Add USWDS as a dependency, update build script with `--load-path`, install dependencies
- **Depends on**: none

### S02-integration-02: Foundational Theme Settings
- **Tasks**: T005, T006, T007, T008
- **Description**: Create `_uswds-theme.scss` with all theme color family mappings, state tokens, link/focus colors, unused grades set to `false`
- **Depends on**: S01-integration-01

### S03-integration-03: Brand Color & Semantic Token Aliasing
- **Tasks**: T010, T011, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025, T026
- **Description**: Add `@use "uswds-core"` to `_colors.scss` and `_semantic.scss`, replace all hardcoded hex values with `uswds.color(...)` calls, update `index.scss` to forward `uswds-theme`
- **Depends on**: S02-integration-02

### S04-integration-04: Build Verification
- **Tasks**: T004, T009, T027, T028, T029, T030
- **Description**: Build package, verify compilation, verify backward compatibility (`--pathable-*` custom properties), verify tokens-only output (no `.usa-` classes), verify brand-to-USWDS mapping values
- **Depends on**: S03-integration-03

### S05-integration-05: US2 Visual Verification & US3 Documentation
- **Tasks**: T031, T032, T033, T034, T035, T036, T037, T038
- **Description**: Visual review of USWDS state components, focus indicators, hover states, contrast verification; add upgrade documentation comments to `_uswds-theme.scss`
- **Depends on**: S04-integration-04

## Build Configuration
```
sass --load-path=node_modules/@uswds/uswds/packages src/index.scss dist/styles.css
```