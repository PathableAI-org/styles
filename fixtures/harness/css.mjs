/** Locates the compiled stylesheet through the @pathableai/styles dependency. */

import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** The absolute path of @pathableai/styles/dist/styles.css; throws if unbuilt. */
export function stylesCssPath() {
  const path = require.resolve('@pathableai/styles/dist/styles.css')
  if (!existsSync(path)) {
    throw new Error(
      'dist/styles.css is missing: run `pnpm --filter @pathableai/styles build` first',
    )
  }
  return path
}
