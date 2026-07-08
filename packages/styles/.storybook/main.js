export default {
  framework: '@storybook/html-vite',
  stories: ['../src/stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
  docs: { autodocs: true },
};