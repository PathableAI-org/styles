export default {
  framework: '@storybook/html-vite',
  stories: ['../../../packages/styles/src/stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
  docs: { autodocs: true },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = '/styles/'
    }
    return config
  },
}
