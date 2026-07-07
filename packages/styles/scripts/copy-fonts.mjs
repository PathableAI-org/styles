/**
 * copy-fonts.mjs
 *
 * Extracts specific .woff2 font files from fontsource npm packages
 * and places them in the `fonts/` directory for distribution alongside
 * the compiled CSS.
 *
 * Fontsource v5 filename convention:
 *   {fontname}-{subset}-{weight}-normal.woff2
 *
 * We only copy the latin subset for the specific weights each font is used at.
 */

import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..')

const fontMappings = [
  {
    package: '@fontsource/fredoka',
    sourceFile: 'fredoka-latin-400-normal.woff2',
    destFile: 'fredoka/Fredoka-Regular.woff2',
  },
  {
    package: '@fontsource/nunito',
    sourceFile: 'nunito-latin-400-normal.woff2',
    destFile: 'nunito/Nunito-Regular.woff2',
  },
  {
    package: '@fontsource/nunito',
    sourceFile: 'nunito-latin-600-normal.woff2',
    destFile: 'nunito/Nunito-SemiBold.woff2',
  },
  {
    package: '@fontsource/poppins',
    sourceFile: 'poppins-latin-700-normal.woff2',
    destFile: 'poppins/Poppins-Bold.woff2',
  },
  {
    package: '@fontsource/montserrat',
    sourceFile: 'montserrat-latin-700-normal.woff2',
    destFile: 'montserrat/Montserrat-Bold.woff2',
  },
]

let copied = 0
let warnings = 0

for (const { package: pkg, sourceFile, destFile } of fontMappings) {
  const sourcePath = join(packageRoot, 'node_modules', pkg, 'files', sourceFile)
  const destPath = join(packageRoot, 'fonts', destFile)

  if (!existsSync(sourcePath)) {
    console.warn(`[copy-fonts] WARNING: source not found: ${sourcePath}`)
    warnings++
    continue
  }

  // Ensure destination directory exists
  mkdirSync(dirname(destPath), { recursive: true })

  copyFileSync(sourcePath, destPath)
  copied++
}

console.log(`[copy-fonts] Copied ${copied} font file(s)`)
if (warnings > 0) {
  console.log(`[copy-fonts] ${warnings} warning(s)`)
}
