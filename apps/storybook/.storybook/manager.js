import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'

const pathableTheme = create({
  brandTitle: 'Pathable Styles',
  brandUrl: 'https://github.com/pathableai-org/styles',
  colorPrimary: '#00365c',
  colorSecondary: '#1cae96',
  base: 'light',
  fontBase: "'Nunito', system-ui, sans-serif",
  fontCode: "'ui-monospace', 'SFMono-Regular', monospace",
  appBg: '#f8f9fa',
  appContentBg: '#ffffff',
  barBg: '#00365c',
  barTextColor: '#ffffff',
  textColor: '#1a1a1a',
  textMutedColor: '#6c757d',
})

addons.setConfig({
  theme: pathableTheme,
  ariaLabel: 'Storybook',
})
