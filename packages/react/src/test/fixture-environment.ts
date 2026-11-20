import { builtinEnvironments } from 'vitest/runtime'
import type { Environment } from 'vitest/runtime'

/**
 * jsdom, processed by Vite's SSR environment instead of its client one.
 *
 * Vitest walks a jsdom test's imports in Vite's client environment, which
 * records `fixture.html?raw` as `fixture.html?import&raw`, so
 * `vitest --changed` does not see that the test depends on the fixture.
 * The SSR environment records the import as written, so editing a fixture
 * selects the tests that import it. See docs/testing/fixtures.md.
 */
const fixtureEnvironment: Environment = {
  ...builtinEnvironments.jsdom,
  name: 'fixture-jsdom',
  viteEnvironment: 'ssr',
}

export default fixtureEnvironment
