# Context Digest: Integration Verification

## Tasks
- **T023**: Build and verify no warnings/errors
- **T024**: Run linting and format checks
- **T025**: Verify package files listing
- **T026**: Quickstart validation

## Context
- All tasks from S01, S02, S03 should be complete
- `dist/styles.css` should contain all tokens
- `package.json` should have `"files"` field with docs
- SCSS partials should all be in `src/`
- Stylelint config should exist

## Quickstart Validation Paths (from quickstart.md)
1. `cd packages/styles && pnpm build` — outputs `dist/styles.css` and `dist/styles.css.map`
2. Compiled CSS should import cleanly
3. SCSS `@use` should expose variables/maps

## Validation Commands
- `cd packages/styles && pnpm build`
- `cd packages/styles && pnpm lint:styles`
- `cd packages/styles && pnpm pack --dry-run`