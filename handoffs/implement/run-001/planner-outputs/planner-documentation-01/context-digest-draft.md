# Context Digest: Documentation Cleanup

## Tasks
- **T002**: Add `"files"` field to `packages/styles/package.json`
- **T003**: Fix markdown formatting in `packages/styles/README.md`
- **T004**: Create `.stylelintrc.json` at `packages/styles/`

## Research Context
- README.md has a broken code block (missing closing ```) — confirmed by inspection
- "Guidance", "Accessibility", "License" appear as bare text instead of headings
- BRAND_RULES.md and AGENTS.md have no structural formatting issues
- Package needs `"files"` field to ensure docs are included in published npm package

## Quickstart Validation
- `cd packages/styles && pnpm build` must succeed
- `pnpm pack --dry-run` should list `README.md`, `BRAND_RULES.md`, `AGENTS.md`, `dist/`, `src/`

## Current State (from context-index.json)
- `packages/styles/package.json` exists, has no `"files"` field
- `packages/styles/README.md` needs formatting fixes
- `packages/styles/BRAND_RULES.md` and `AGENTS.md` — no changes needed
- No `.stylelintrc.json` exists yet

## Allowed Write Paths
- `packages/styles/package.json`
- `packages/styles/README.md`
- `packages/styles/.stylelintrc.json`
- `handoffs/implement/run-001/S01-documentation-01/results`