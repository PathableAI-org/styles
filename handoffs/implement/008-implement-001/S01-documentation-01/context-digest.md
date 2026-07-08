# Context Digest — S01-documentation-01 (Setup)

## Tasks
- **T001**: Install Storybook deps (`storybook`, `@storybook/html-vite`, `@storybook/addon-docs`, `@storybook/manager-api`, `@storybook/theming`) as devDependencies in `packages/styles/package.json`
- **T002**: Create `packages/styles/.storybook/` directory
- **T003**: Create `packages/styles/src/stories/components/Basic/`, `FormControls/`, `Navigation/`, `Communication/`, `Layout/`
- **T004**: Create `packages/styles/src/stories/utilities/` directory

## Key Context
- Package: `@pathable/styles` at `packages/styles/`
- Use pnpm, not npm or yarn
- All deps are devDependencies only
- No test-related packages allowed (FR-009 prohibits @storybook/addon-interactions, @storybook/test, etc.)
- Current scripts in package.json: build, watch, lint:styles
- Storybook scripts will be added in T007 (separate shard)

## Constraints
- FR-009: No test runners, interaction tests, or test-related addons
- FR-011: All changes scoped to packages/styles/
- All directories must exist before story files can be created

## Current package.json devDependencies
- @fontsource/fredoka, @fontsource/montserrat, @fontsource/nunito, @fontsource/poppins, sass