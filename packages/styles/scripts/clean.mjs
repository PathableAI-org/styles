/**
 * Empties the build's output directories before `build` writes them, so the
 * package (whose `files` include them) ships only what the current build
 * produces, never a file left over from an earlier build.
 *
 *   node scripts/clean.mjs    (from packages/styles, first step of `build`)
 */

import { rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Every directory the build writes, relative to the package root. */
const outputDirs = ['dist', 'img', 'fonts', 'components']

for (const dir of outputDirs) {
  rmSync(join(packageRoot, dir), { recursive: true, force: true })
}

console.log(`[clean] Emptied ${outputDirs.join(', ')}`)
