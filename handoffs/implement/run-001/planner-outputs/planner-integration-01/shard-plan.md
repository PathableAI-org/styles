## Shard Plan: Integration Verification

**vertical_capability**: integration
**shard_id**: S04-integration-01
**task_ids**: T023, T024, T025, T026

### Tasks

- **T023**: Run `pnpm build` and verify no warnings/errors
- **T024**: Run linting (`pnpm lint:styles`) and format checks
- **T025**: Verify `"files"` field includes all docs; run `pnpm pack --dry-run`
- **T026**: Quickstart validation — run through CSS import, SCSS import, usage examples

### Write paths
- (none — verification only, no source file changes)

### Read paths
- `packages/styles/package.json`
- `packages/styles/dist/styles.css`
- `packages/styles/src/`
- `specs/001-brand-design-tokens/context-index.json`
- `specs/001-brand-design-tokens/quickstart.md`

### Depends on
- S02-domain-model-01 (token partials)
- S03-domain-model-02 (semantic tokens, SCSS maps)
- S01-documentation-01 (README, package.json, stylelint)