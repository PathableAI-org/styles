import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Isolated CSS-only Modal Storybook (FR-009).
 * Loads styles Modal stories without `@pathableai/styles/js`.
 * Default `.storybook/preview.js` keeps the global JS import for Accordion/Banner.
 */
export default {
  framework: '@storybook/html-vite',
  stories: [
    '../../../packages/styles/src/stories/components/Communication/Modal.stories.ts',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  docs: { autodocs: true },
  async viteFinal(config) {
    config.css = config.css || {}
    config.css.preprocessorOptions = config.css.preprocessorOptions || {}
    config.css.preprocessorOptions.scss = {
      api: 'modern-compiler',
      loadPaths: [
        path.resolve(
          __dirname,
          '../../../packages/styles/node_modules/@uswds/uswds/packages',
        ),
      ],
    }

    return config
  },
}
