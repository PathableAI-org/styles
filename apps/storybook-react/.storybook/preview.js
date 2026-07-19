import '@pathable/styles/dist/styles.css'
import '@pathable/styles/js'

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    a11y: {
      element: '#storybook-root',
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      viewports: {
        mobile1: {
          name: 'Mobile (375px)',
          styles: { width: '375px', height: '812px' },
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop (1280px)',
          styles: { width: '1280px', height: '900px' },
        },
      },
    },
  },
}

export default preview
