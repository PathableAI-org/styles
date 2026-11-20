/** Locates the compiled stylesheet through the @pathableai/styles dependency. */

import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const BUILD_HINT =
  'dist/styles.css is missing: run `pnpm --filter @pathableai/styles build` first'

/** The absolute path of @pathableai/styles/dist/styles.css; throws if unbuilt. */
export function stylesCssPath() {
  let path
  try {
    path = require.resolve('@pathableai/styles/dist/styles.css')
  } catch {
    throw new Error(BUILD_HINT)
  }
  if (!existsSync(path)) throw new Error(BUILD_HINT)
  return path
}
