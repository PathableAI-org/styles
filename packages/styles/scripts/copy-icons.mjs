/**
 * Copies each USWDS image referenced by compiled CSS to the package-root path
 * that `dist/styles.css` resolves through `../img/...`.
 *
 * The `dist/img` mirror remains available for the existing Storybook asset
 * copier and other distribution-path consumers.
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

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const stylesheetPath = join(packageRoot, 'dist', 'styles.css')
const sourceRoot = join(
  packageRoot,
  'node_modules',
  '@uswds/uswds',
  'dist',
  'img',
)
const destinations = [
  join(packageRoot, 'img'),
  join(packageRoot, 'dist', 'img'),
]

if (!existsSync(stylesheetPath)) {
  throw new Error(
    `[copy-icons] Compiled stylesheet not found: ${stylesheetPath}`,
  )
}

const css = readFileSync(stylesheetPath, 'utf8')
const imagePaths = new Set()
const urlPattern = /url\(\s*(['"]?)(.*?)\1\s*\)/gu

for (const match of css.matchAll(urlPattern)) {
  const url = match[2].trim().split(/[?#]/u, 1)[0]
  if (!url.startsWith('../img/')) continue

  const imagePath = normalize(url.slice('../img/'.length))
  const sourcePath = resolve(sourceRoot, imagePath)
  const sourceRelativePath = relative(sourceRoot, sourcePath)
  if (
    isAbsolute(imagePath) ||
    sourceRelativePath === '' ||
    sourceRelativePath === '..' ||
    sourceRelativePath.startsWith(`..${sep}`) ||
    isAbsolute(sourceRelativePath)
  ) {
    throw new Error(`[copy-icons] Unsafe stylesheet image path: ${url}`)
  }
  imagePaths.add(imagePath)
}

const missing = []
let copied = 0

for (const imagePath of [...imagePaths].sort()) {
  const sourcePath = resolve(sourceRoot, imagePath)
  if (!existsSync(sourcePath)) {
    missing.push(relative(packageRoot, sourcePath))
    continue
  }

  for (const destinationRoot of destinations) {
    const destinationPath = resolve(destinationRoot, imagePath)
    mkdirSync(dirname(destinationPath), { recursive: true })
    copyFileSync(sourcePath, destinationPath)
    copied += 1
  }
}

if (missing.length > 0) {
  throw new Error(
    `[copy-icons] Missing ${missing.length} USWDS source image(s):\n${missing.join('\n')}`,
  )
}

console.log(
  `[copy-icons] Copied ${imagePaths.size} referenced image(s) to ${destinations.length} package location(s) (${copied} files)`,
)
