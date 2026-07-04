## Shard Plan: Documentation Cleanup

**vertical_capability**: documentation
**shard_id**: S01-documentation-01
**task_ids**: T002, T003, T004

### Tasks

- **T002**: Add `"files"` field to `packages/styles/package.json` — include `README.md`, `BRAND_RULES.md`, `AGENTS.md`, `dist/`, `src/`
- **T003**: Fix markdown formatting in `packages/styles/README.md` — close unclosed code block, format Guidance/Accessibility/License as section headings
- **T004**: Create `.stylelintrc.json` at `packages/styles/` with SCSS linting rules

### Write paths

- `packages/styles/package.json`
- `packages/styles/README.md`
- `packages/styles/.stylelintrc.json`

### Read paths

- `packages/styles/package.json`
- `packages/styles/README.md`
- `specs/001-brand-design-tokens/context-index.json`
- `specs/001-brand-design-tokens/research.md`
- `specs/001-brand-design-tokens/quickstart.md`
