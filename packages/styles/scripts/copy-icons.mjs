/**
 * copy-icons.mjs
 *
 * Copies USWDS SVG icons from node_modules to dist/img/usa-icons/
 * so the compiled CSS can reference them via url("../img/usa-icons/*.svg").
 */

import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..')

// Icons referenced by the compiled CSS
const requiredIcons = [
  'add.svg', 'arrow_back.svg', 'calendar_today.svg', 'check_circle.svg',
  'close.svg', 'error.svg', 'expand_less.svg', 'expand_more.svg',
  'info.svg', 'navigate_before.svg', 'navigate_far_before.svg',
  'navigate_far_next.svg', 'navigate_next.svg', 'remove.svg',
  'search.svg', 'unfold_more.svg', 'warning.svg',
]

const sourceDir = join(packageRoot, 'node_modules', '@uswds/uswds', 'dist', 'img', 'usa-icons')
const destDir = join(packageRoot, 'dist', 'img', 'usa-icons')

let copied = 0
let warnings = 0

mkdirSync(destDir, { recursive: true })

for (const icon of requiredIcons) {
  const sourcePath = join(sourceDir, icon)
  const destPath = join(destDir, icon)
  if (!existsSync(sourcePath)) {
    console.warn(`[copy-icons] WARNING: source not found: ${sourcePath}`)
    warnings++
    continue
  }
  copyFileSync(sourcePath, destPath)
  copied++
}

console.log(`[copy-icons] Copied ${copied} icon file(s)`)
if (warnings > 0) console.log(`[copy-icons] ${warnings} warning(s)`)