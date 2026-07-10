import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  framework: '@storybook/react-vite',
  stories: ['../../../packages/react/src/stories/**/*.stories.jsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  docs: { autodocs: true },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = '/react/'
    }
    return config
  },
}