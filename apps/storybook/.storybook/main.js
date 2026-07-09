import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  framework: '@storybook/html-vite',
  stories: ['../../../packages/styles/src/stories/**/*.stories.js'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  docs: { autodocs: true },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = '/styles/'
    }

    // Configure Sass load paths so @use 'uswds-core' resolves correctly
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
