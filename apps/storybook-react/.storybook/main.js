export default {
  framework: '@storybook/react-vite',
  stories: ['../../../packages/react/src/stories/**/*.stories.jsx'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  docs: { autodocs: true },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION' && process.env.STORYBOOK_BUILD === 'true') {
      config.base = '/styles/react/'
    }
    if (configType === 'PRODUCTION' && process.env.STORYBOOK_BUILD === 'true') {
      config.base = '/styles/react/'
    }

    // Configure manualChunks for optimizing large chunks
    config.build = {
      ...config.build,
      rollupOptions: {
        ...config.build?.rollupOptions,
        output: {
          ...config.build?.rollupOptions?.output,
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Split react and react-dom into their own chunks
              if (
                id.includes('react/index.js') ||
                id.includes('react-dom/client.js')
              ) {
                return '@react/react-dom'
              }
              // You can add more manual chunk configurations here for other large libraries
              // For example, splitting common third-party libraries:
              // if (id.includes('node_modules/lodash')) {
              //   return '@lodash/lodash'
              // }
            }
            return null // Return null for default chunking
          },
        },
      },
      // Ensure assets are included in the build
      assetsInclude: [
        '**/*.{png,jpg,jpeg,gif,svg,woff2,ttf,otf,eot,ico,cur,webp}',
      ],
    }

    return config
  },
}
