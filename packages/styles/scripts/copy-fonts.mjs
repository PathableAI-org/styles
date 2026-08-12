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

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import {
  dirname,
  isAbsolute,
  join,
  normalize,
  relative,
  resolve,
  sep,
} from 'node:path'
import { fileURLToPath } from 'node:url'

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
const missing = []

for (const { package: pkg, sourceFile, destFile } of fontMappings) {
  const sourcePath = join(packageRoot, 'node_modules', pkg, 'files', sourceFile)
  const destPath = join(packageRoot, 'fonts', destFile)

  if (!existsSync(sourcePath)) {
    missing.push(sourcePath)
    continue
  }

  // Ensure destination directory exists
  mkdirSync(dirname(destPath), { recursive: true })

  copyFileSync(sourcePath, destPath)
  copied++
}

const stylesheetPath = join(packageRoot, 'dist', 'styles.css')
if (!existsSync(stylesheetPath)) {
  throw new Error(
    `[copy-fonts] Compiled stylesheet not found: ${stylesheetPath}`,
  )
}

const css = readFileSync(stylesheetPath, 'utf8')
const urlPattern = /url\(\s*(['"]?)(.*?)\1\s*\)/gu
const uswdsFontPaths = new Set()
const uswdsFontRoot = join(
  packageRoot,
  'node_modules',
  '@uswds/uswds',
  'dist',
  'fonts',
)

for (const match of css.matchAll(urlPattern)) {
  const url = match[2].trim().split(/[?#]/u, 1)[0]
  if (!url.startsWith('../fonts/roboto-mono/')) continue

  const fontPath = normalize(url.slice('../fonts/'.length))
  const sourcePath = resolve(uswdsFontRoot, fontPath)
  const sourceRelativePath = relative(uswdsFontRoot, sourcePath)
  if (
    isAbsolute(fontPath) ||
    sourceRelativePath === '' ||
    sourceRelativePath === '..' ||
    sourceRelativePath.startsWith(`..${sep}`) ||
    isAbsolute(sourceRelativePath)
  ) {
    throw new Error(`[copy-fonts] Unsafe stylesheet font path: ${url}`)
  }
  uswdsFontPaths.add(fontPath)
}

for (const fontPath of [...uswdsFontPaths].sort()) {
  const sourcePath = resolve(uswdsFontRoot, fontPath)
  const destinationPath = resolve(packageRoot, 'fonts', fontPath)

  if (!existsSync(sourcePath)) {
    missing.push(sourcePath)
    continue
  }

  mkdirSync(dirname(destinationPath), { recursive: true })
  copyFileSync(sourcePath, destinationPath)
  copied += 1
}

if (missing.length > 0) {
  throw new Error(
    `[copy-fonts] Missing ${missing.length} source font(s):\n${missing.join('\n')}`,
  )
}

console.log(
  `[copy-fonts] Copied ${copied} font file(s), including ${uswdsFontPaths.size} stylesheet-referenced Roboto Mono file(s)`,
)
