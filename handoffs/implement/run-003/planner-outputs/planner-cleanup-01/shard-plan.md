# Cleanup Capability — Shard Plan

**Planner**: planner-cleanup-01
**Vertical Capability**: cleanup
**Feature**: 003-wrap-uswds-theme

## Shards

### S07-cleanup-01: Final Verification & Commit
- **Tasks**: T042, T043, T044
- **Description**: Build and verify final `dist/styles.css`, run `pnpm pack --dry-run`, commit all changes
- **Depends on**: S05-integration-05, S06-documentation-01

## Notes
- T044 (commit) is performed by the core agent after T042 and T043 are verified
- The final build must confirm: all `--pathable-*` CSS custom properties present, all `$theme-color-*` tokens configured, no `.usa-` component styles leaked
- `pnpm pack --dry-run` verifies published package contents: `dist/`, `src/`, README, BRAND_RULES, AGENTS