/**
 * copy-icons.mjs
 *
 * Copies USWDS SVG icons from the compiled @pathable/styles package
 * into the Storybook static output so CSS background-image references
 * like url("../img/usa-icons/navigate_next.svg") resolve correctly.
 *
 * The compiled CSS references icons at ../img/usa-icons/*.svg relative
 * to the CSS file, which in the storybook-static output means they
 * need to be at storybook-static/img/usa-icons/.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const appRoot = join(__dirname, '..')

// Source: icons built by @pathable/styles into dist/img/usa-icons/
const sourceDir = join(
  appRoot,
  '..',
  '..',
  'packages',
  'styles',
  'dist',
  'img',
  'usa-icons',
)

// Dest: storybook-static/img/usa-icons/ (relative to CSS at ../img/...)
const destDir = join(appRoot, 'storybook-static', 'img', 'usa-icons')

if (!existsSync(sourceDir)) {
  console.warn(`[copy-icons] WARNING: source directory not found: ${sourceDir}`)
  console.warn('[copy-icons] Make sure @pathable/styles has been built first.')
  process.exit(0)
}

mkdirSync(destDir, { recursive: true })

const icons = readdirSync(sourceDir).filter((f) => f.endsWith('.svg'))
let copied = 0

for (const icon of icons) {
  const sourcePath = join(sourceDir, icon)
  const destPath = join(destDir, icon)
  copyFileSync(sourcePath, destPath)
  copied++
}

console.log(`[copy-icons] Copied ${copied} icon file(s) to ${destDir}`)
