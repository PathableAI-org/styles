# Context Digest — S02-documentation-01 (Foundational)

## Tasks
- **T005**: Create `.storybook/main.js` with @storybook/html-vite framework, addon-docs addon, stories glob, autodocs
- **T006**: Create `.storybook/preview.js` importing dist/styles.css, control matchers
- **T007**: Add "storybook" and "build-storybook" scripts to package.json

## Key Context
- Framework: `@storybook/html-vite` (HTML-only, no React/Vue)
- Addons: ONLY `@storybook/addon-docs` — NO test addons (FR-009)
- autodocs: true globally, stories can opt out with tags: ['!autodocs']
- Stories glob: `../src/stories/**/*.stories.js`
- CSS loaded via import in preview.js: `import '../dist/styles.css'`
- Build must be run before storybook: `pnpm build` then `pnpm storybook`
- Keep existing scripts intact, only add new ones

## main.js structure
```js
export default {
  framework: '@storybook/html-vite',
  stories: ['../src/stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
  docs: { autodocs: true },
};
```

## preview.js structure
```js
import '../dist/styles.css';
export const parameters = {
  controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
};
```