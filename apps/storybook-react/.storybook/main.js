export default {
  framework: '@storybook/react-vite',
  stories: ['../../../packages/react/src/stories/**/*.stories.jsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  docs: { autodocs: true },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') {
      config.base = '/styles/react/'
    }
    return config
  },
}
