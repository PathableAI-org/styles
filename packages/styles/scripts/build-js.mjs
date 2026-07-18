import esbuild from 'esbuild'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageRoot = join(__dirname, '..')
const distDir = join(packageRoot, 'dist')
const srcJsDir = join(packageRoot, 'src', 'js')

async function main() {
  // Ensure dist directory exists
  mkdirSync(distDir, { recursive: true })

  // Build the main JS bundle from patched USWDS source
  // The patch changes all class prefixes from "usa" to "pathable"
  await esbuild.build({
    entryPoints: [
      join(
        packageRoot,
        'node_modules',
        '@uswds',
        'uswds',
        'packages',
        'uswds-core',
        'src',
        'js',
        'start.js',
      ),
    ],
    bundle: true,
    minify: true,
    outfile: join(distDir, 'pathable.js'),
    format: 'iife',
  })

  console.log('[build-js] Built dist/pathable.js')

  // Build the FOUC init script from TypeScript source
  await esbuild.build({
    entryPoints: [join(srcJsDir, 'pathable-init.ts')],
    bundle: false,
    minify: false,
    outfile: join(distDir, 'pathable-init.js'),
    format: 'iife',
  })
  console.log('[build-js] Built dist/pathable-init.js')
}

main().catch((err) => {
  console.error('[build-js] Failed:', err)
  process.exit(1)
})
