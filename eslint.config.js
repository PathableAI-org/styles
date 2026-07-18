import js from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/storybook-static/**',
      '**/.vite/**',
      '**/.astro/**',
      '**/.cache/**',
      '**/.pnpm-store/**',
      'specs/**',
      'handoffs/**',
      'patches/**',
      'tmp/**',
      '**/*.ts',
      '**/*.tsx',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'warn',
    },
  },
  {
    files: ['**/scripts/**'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.jsx'],
    ...pluginReact.configs.flat?.recommended,
    ...pluginReact.configs.flat?.['jsx-runtime'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/prop-types': 'off',
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
]
