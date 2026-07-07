import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://pathableai-org.github.io',
  base: '/styles',
  integrations: [
    starlight({
      title: 'Pathable Styles',
      customCss: ['./src/styles/custom.css'],
      head: [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
        { tag: 'link', attrs: { href: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap', rel: 'stylesheet' } },
      ],
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
