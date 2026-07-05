import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Pathable Styles',
      customCss: ['./src/styles/custom.css'],
      components: {
        PageFrame: './src/components/PageFrame.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' },
        },
        { label: 'Foundations', autogenerate: { directory: 'foundations' } },
        { label: 'For Agents', autogenerate: { directory: 'for-agents' } },
        { label: 'Roadmap', autogenerate: { directory: 'roadmap' } },
      ],
    }),
  ],
})
