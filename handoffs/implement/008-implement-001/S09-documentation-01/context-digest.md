# Context Digest — S09-documentation-01 (Polish & Verification)

## Tasks
- **T050**: Build styles — `cd packages/styles && pnpm build` — should produce `dist/styles.css`
- **T051**: Start Storybook — `cd packages/styles && pnpm storybook` — should serve at localhost:6006
- **T052**: FR-009 compliance — check main.js has ONLY addon-docs, no test addons; check package.json for test deps
- **T053**: FR-012 compliance — grep all .stories.js for .usa-* references (should be 0); verify JS-driven stories have USWDS note

## JS-Driven Components That Must Have USWDS JS Note
- Accordion, Banner, ComboBox, DatePicker, DateRangePicker, Header, Modal, SiteAlert

## Key Files to Check
- `packages/styles/.storybook/main.js` — addons should be ['@storybook/addon-docs'] only
- `packages/styles/package.json` — no @storybook/addon-interactions, @storybook/test, etc.
- All `packages/styles/src/stories/**/*.stories.js` — no `.usa-` class references; only `pathable-` prefixed

## This shard does NOT modify any source files — read-only verification