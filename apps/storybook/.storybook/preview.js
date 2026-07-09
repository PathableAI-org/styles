import '@pathable/styles/src/index.scss'

export const parameters = {
  a11y: {
    element: '#storybook-root',
    config: {
      rules: [
        { id: 'color-contrast', enabled: true },
      ],
    },
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/i,
    },
  },
}