import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import storybook from 'eslint-plugin-storybook'
import globals from 'globals'

export default defineConfig([
  globalIgnores([
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
  ]),

  // JS/JSX files (non-TS)
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': 'warn',
    },
  },

  // TS/TSX files
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-unused-vars': 'off',
    },
  },

  // React hooks + a11y for JSX/TSX files
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs?.recommended?.rules,
    },
  },

  // Story files
  {
    files: ['**/*.stories.{ts,tsx,js,jsx}'],
    extends: [...storybook.configs['flat/recommended']],
    rules: {
      'storybook/no-renderer-packages': 'off',
    },
  },

  // Config/scripts files (Node context, no-console allowed)
  {
    files: ['**/scripts/**', '**/*.config.{js,mjs,cjs,ts}', '**/.storybook/**'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },

  // Root config files that need node context
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
])
