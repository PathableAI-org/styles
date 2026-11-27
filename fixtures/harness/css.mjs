/** Locates the compiled stylesheets through the @pathableai/styles dependency. */

import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

/** The absolute path of @pathableai/styles/dist/<file>; throws if unbuilt. */
function distPath(file) {
  const hint = `dist/${file} is missing: run \`pnpm --filter @pathableai/styles build\` first`
  let path
  try {
    path = require.resolve(`@pathableai/styles/dist/${file}`)
  } catch {
    throw new Error(hint)
  }
  if (!existsSync(path)) throw new Error(hint)
  return path
}

/** The absolute path of @pathableai/styles/dist/styles.css; throws if unbuilt. */
export function stylesCssPath() {
  return distPath('styles.css')
}

/** The absolute path of @pathableai/styles/dist/utilities.css; throws if unbuilt. */
export function utilitiesCssPath() {
  return distPath('utilities.css')
}
