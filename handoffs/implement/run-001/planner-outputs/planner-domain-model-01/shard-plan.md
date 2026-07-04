## Shard Plan: Domain Model — All Token Partials, US1 + US2 + US3

**vertical_capability**: domain-model
**shard_id**: S02-domain-model-01
**task_ids**: T001, T005, T006, T007, T008, T009, T010, T011, T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022

### Tasks (US1 — CSS Custom Properties)

- **T001**: Remove placeholder content from `packages/styles/src/index.scss`
- **T005**: Create modular `packages/styles/src/index.scss` with `@forward` for all six partials
- **T006**: Verify `pnpm build` succeeds
- **T007**: Create `packages/styles/src/_colors.scss` with 6 brand colors (CSS vars + Sass vars)
- **T008**: Create `packages/styles/src/_typography.scss` with font families + typography scale
- **T009**: Create `packages/styles/src/_spacing.scss` with 7 spacing tokens
- **T010**: Create `packages/styles/src/_elevation.scss` with 4 elevation tokens
- **T011**: Create `packages/styles/src/_radius.scss` with 3 border-radius tokens
- **T012**: Build + verify US1 tokens in dist/styles.css

### Tasks (US2 — Semantic Colors)

- **T013**: Create `packages/styles/src/_semantic.scss` with 10 semantic color tokens
- **T014**: Build + verify US2 tokens + WCAG AA contrast

### Tasks (US3 — SCSS Maps)

- **T015**: Add `$brand-colors` Sass map to `_colors.scss`
- **T016**: Add `$typography-scale` Sass map to `_typography.scss`
- **T017**: Add `$spacing-scale` Sass map to `_spacing.scss`
- **T018**: Add `$elevation-levels` Sass map to `_elevation.scss`
- **T019**: Add `$radius-scale` Sass map to `_radius.scss`
- **T020**: Add `$semantic-colors` Sass map to `_semantic.scss`
- **T021**: Verify exports with test import
- **T022**: Build + clean test file

### Write paths

- `packages/styles/src/index.scss`
- `packages/styles/src/_colors.scss`
- `packages/styles/src/_typography.scss`
- `packages/styles/src/_spacing.scss`
- `packages/styles/src/_elevation.scss`
- `packages/styles/src/_radius.scss`
- `packages/styles/src/_semantic.scss`
- `packages/styles/src/_test-import.scss` (temporary)

### Read paths

- `packages/styles/src/index.scss` (existing)
- `packages/styles/package.json`
- `specs/001-brand-design-tokens/context-index.json`
- `specs/001-brand-design-tokens/research.md`
- `specs/001-brand-design-tokens/data-model.md`
- `specs/001-brand-design-tokens/contracts/README.md`
- `specs/001-brand-design-tokens/quickstart.md`
- `specs/001-brand-design-tokens/spec.md`
