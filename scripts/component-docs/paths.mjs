/** Repository paths the component docs read from and write to. */

import { join, resolve } from 'node:path'

export const repoRoot = resolve(import.meta.dirname, '../..')
export const fixturesDir = join(repoRoot, 'fixtures')
export const reactSourceDir = join(repoRoot, 'packages/react/src')
export const reactComponentsDir = join(reactSourceDir, 'components')
export const fixtureManifestPath = join(
  reactSourceDir,
  'test/fixture-manifest.ts',
)
/** The CSS module manifest the styles build writes (build-css-modules.mjs). */
export const cssManifestPath = join(
  repoRoot,
  'packages/styles/dist/css/manifest.json',
)
