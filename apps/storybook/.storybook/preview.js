import '@pathableai/styles/src/index.scss'
import '@pathableai/styles/js'

/** @type { import('@storybook/html-vite').Preview } */
const preview = {
  parameters: {
    options: {
      // The generated pages' sections, in the order they are read: what a
      // consumer sets (tokens), what it applies (utilities), what it uses
      // (components). Anything else follows, in file order.
      storySort: {
        order: ['Design tokens', 'Utilities', 'Component pages', 'Fixtures'],
      },
    },
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
        mobile320: {
          name: 'Mobile compact (320px)',
          styles: { width: '320px', height: '700px' },
        },
        mobile1: {
          name: 'Mobile (375px)',
          styles: { width: '375px', height: '812px' },
        },
        belowTablet: {
          name: 'Below tablet breakpoint (600px)',
          styles: { width: '600px', height: '900px' },
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
        },
        belowDesktopBreakpoint: {
          name: 'Below desktop breakpoint (1023px)',
          styles: { width: '1023px', height: '900px' },
        },
        desktopBreakpoint: {
          name: 'Desktop breakpoint (1024px)',
          styles: { width: '1024px', height: '900px' },
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
