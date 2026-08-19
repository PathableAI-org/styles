import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/internal/resolvers/**/*.ts'],
      exclude: ['src/internal/resolvers/__tests__/**'],
      thresholds: {
        functions: 100,
      },
    },
  },
})