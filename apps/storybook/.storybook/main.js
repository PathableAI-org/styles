import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isBuild = process.env.STORYBOOK_BUILD === 'true'
const reactUrl = isBuild ? '/styles/react/' : 'http://localhost:6007'

export default {
  framework: '@storybook/html-vite',
  stories: ['../../../packages/styles/src/stories/**/*.stories.ts'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  docs: { autodocs: true },
  refs: {
    react: {
      title: 'React',
      url: reactUrl,
    },
  },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION' && isBuild) {
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
