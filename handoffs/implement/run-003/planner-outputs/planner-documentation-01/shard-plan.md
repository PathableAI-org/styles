# Documentation Capability — Shard Plan

**Planner**: planner-documentation-01
**Vertical Capability**: documentation
**Feature**: 003-wrap-uswds-theme

## Shards

### S06-documentation-01: Documentation Updates
- **Tasks**: T039, T040, T041
- **Description**: Update README.md with USWDS integration documentation, update BRAND_RULES.md with USWDS system token references, update AGENTS.md with USWDS token usage rules
- **Depends on**: S04-integration-04

## Context
All documentation changes are scoped to `packages/styles/`. The USWDS theme wrapper must be already built and verified before documentation is updated, so the docs can reference actual file paths and token names.