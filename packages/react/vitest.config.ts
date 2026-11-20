import { defineConfig } from 'vitest/config'

const testFiles = ['src/**/*.test.ts', 'src/**/*.test.tsx']

// Fixture tests compare rendered markup with the HTML fixtures in
// `@pathableai/fixtures`. They run as their own project so CI can select them
// alone; see docs/testing/fixtures.md.
const fixtureTestFiles = [
  'src/**/*.fixtures.test.tsx',
  'src/test/__tests__/*.test.{ts,tsx}',
]

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/internal/resolvers/**/*.ts'],
      exclude: ['src/internal/resolvers/__tests__/**'],
      thresholds: {
        functions: 100,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: testFiles,
          exclude: fixtureTestFiles,
        },
      },
      {
        extends: true,
        test: {
          name: 'fixtures',
          include: fixtureTestFiles,
          environment: './src/test/fixture-environment.ts',
        },
      },
    ],
  },
})
