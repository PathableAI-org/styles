import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
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
