#!/usr/bin/env node
/**
 * Modal open geometry gates (FR-011 / SC-005).
 *
 * Asserts for styles Open (CSS-only harness) and React Open:
 *   1. Overlay covers the viewport
 *   2. Dialog is centered within documented tolerance
 *   3. Overlay dims the page (background not fully transparent)
 *   4. Close control shows a visible focus-visible indicator when focused
 *
 * Documented centering tolerance: dialog center must lie within 8% of each
 * viewport dimension from the viewport center (no intentional-placement escape).
 *
 * Usage:
 *   node packages/styles/scripts/test-modal-open-geometry.mjs
 *   pnpm test:modal-open-geometry
 *
 * Styles target: builds/serves apps/storybook/.storybook-modal-css →
 *   apps/storybook/storybook-static-modal-css
 * React target: requires apps/storybook-react/storybook-static (build first)
 */
import { spawn } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { constants } from 'node:fs'
import { dirname, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '../../..',
)
const isWindows = process.platform === 'win32'
const pnpmCommand = 'pnpm'

/** Dialog center must be within this fraction of viewport size from center. */
export const CENTER_TOLERANCE_RATIO = 0.08

const STYLES_STATIC_DIR = resolve(
  repositoryRoot,
  'apps/storybook/storybook-static-modal-css',
)
const REACT_STATIC_DIR = resolve(
  repositoryRoot,
  'apps/storybook-react/storybook-static',
)

const STYLES_PORT = parseInt(
  process.env.MODAL_GEOMETRY_STYLES_PORT || '6018',
  10,
)
const REACT_PORT = parseInt(process.env.MODAL_GEOMETRY_REACT_PORT || '6019', 10)

const STYLES_STORY_ID = 'components-communication-modal--open'
const REACT_STORY_ID = 'components-communication-modal--open'

const VIEWPORT = { width: 1280, height: 900 }

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
}

function runCommand(
  command,
  args,
  { cwd = repositoryRoot, env = process.env } = {},
) {
  return new Promise((resolveCommand, rejectCommand) => {
    const child = spawn(command, args, {
      cwd,
      env,
      shell: isWindows,
      stdio: 'inherit',
    })

    child.once('error', (error) => {
      rejectCommand(new Error(`Unable to start ${command}: ${error.message}`))
    })

    child.once('close', (code, signal) => {
      if (code === 0) {
        resolveCommand()
        return
      }
      rejectCommand(
        new Error(
          `${command} ${args.join(' ')} failed with ${
            signal ? `signal ${signal}` : `exit code ${code}`
          }`,
        ),
      )
    })
  })
}

function startServer(staticDir, port) {
  const baseUrl = `http://127.0.0.1:${port}`
  return new Promise((resolvePromise, reject) => {
    const server = createServer(async (req, res) => {
      if (!req.url) {
        res.writeHead(400)
        res.end('Bad request')
        return
      }
      const url = new URL(req.url, baseUrl)
      const pathname = url.pathname.slice(1) || 'index.html'
      const filePath = resolve(staticDir, pathname)

      const dir = staticDir + sep
      if (!filePath.startsWith(dir) && filePath !== staticDir) {
        res.writeHead(403)
        res.end('Forbidden')
        return
      }

      try {
        await access(filePath, constants.R_OK)
        const data = await readFile(filePath)
        const ext = extname(filePath).toLowerCase()
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        })
        res.end(data)
      } catch {
        const ext = extname(filePath).toLowerCase()
        if (ext && MIME_TYPES[ext]) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        try {
          const fallback = resolve(staticDir, 'index.html')
          const data = await readFile(fallback)
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(data)
        } catch {
          res.writeHead(404)
          res.end('Not found')
        }
      }
    })

    server.listen(port, '127.0.0.1', () => resolvePromise(server))
    server.on('error', reject)
  })
}

async function stopServer(server) {
  if (!server?.listening) return
  await new Promise((resolveClose, rejectClose) => {
    server.close((error) => {
      if (error) {
        rejectClose(error)
        return
      }
      resolveClose()
    })
    server.closeAllConnections()
  })
}

function parseAlpha(color) {
  if (!color || color === 'transparent') return 0
  const rgba = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i,
  )
  if (rgba) {
    return rgba[4] === undefined ? 1 : Number(rgba[4])
  }
  if (color.startsWith('#')) {
    return 1
  }
  return 0
}

/**
 * @param {import('playwright').Page} page
 * @param {{ label: string, storyId: string, baseUrl: string }} target
 */
async function assertOpenGeometry(page, target) {
  const failures = []
  const { label, storyId, baseUrl } = target

  await page.setViewportSize(VIEWPORT)
  const url = `${baseUrl}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`
  await page.goto(url, { waitUntil: 'networkidle' })

  const overlay = page.locator('.pathable-modal-overlay').first()
  const dialog = page.locator('.pathable-modal[role="dialog"]').first()
  const close = page.getByRole('button', { name: /Close modal/i }).first()

  await overlay.waitFor({ state: 'visible', timeout: 15_000 })
  await dialog.waitFor({ state: 'visible', timeout: 15_000 })

  const overlayBox = await overlay.boundingBox()
  if (!overlayBox) {
    failures.push(`${label}: overlay has no bounding box`)
  } else {
    // Compare against the iframe's layout viewport (not Playwright setViewportSize
    // alone — Storybook chrome / scrollbars can differ by a few dozen px).
    const coverage = await overlay.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      }
    })
    const coversViewport =
      coverage.left <= 1 &&
      coverage.top <= 1 &&
      coverage.right >= coverage.innerWidth - 1 &&
      coverage.bottom >= coverage.innerHeight - 1
    if (!coversViewport) {
      failures.push(
        `${label}: overlay does not cover viewport (rect edges=${JSON.stringify(
          {
            top: coverage.top,
            left: coverage.left,
            right: coverage.right,
            bottom: coverage.bottom,
          },
        )}, inner=${coverage.innerWidth}x${coverage.innerHeight})`,
      )
    }
  }

  const dialogBox = await dialog.boundingBox()
  if (!dialogBox) {
    failures.push(`${label}: dialog has no bounding box`)
  } else {
    const dialogCenterX = dialogBox.x + dialogBox.width / 2
    const dialogCenterY = dialogBox.y + dialogBox.height / 2
    const vpCenterX = VIEWPORT.width / 2
    const vpCenterY = VIEWPORT.height / 2
    const tolX = VIEWPORT.width * CENTER_TOLERANCE_RATIO
    const tolY = VIEWPORT.height * CENTER_TOLERANCE_RATIO
    const dx = Math.abs(dialogCenterX - vpCenterX)
    const dy = Math.abs(dialogCenterY - vpCenterY)
    if (dx > tolX || dy > tolY) {
      failures.push(
        `${label}: dialog not centered within ${CENTER_TOLERANCE_RATIO * 100}% tolerance ` +
          `(dx=${dx.toFixed(1)}>${tolX.toFixed(1)} or dy=${dy.toFixed(1)}>${tolY.toFixed(1)}; ` +
          `dialogCenter=(${dialogCenterX.toFixed(1)}, ${dialogCenterY.toFixed(1)}))`,
      )
    }
  }

  const dimmer = await overlay.evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      backgroundColor: style.backgroundColor,
      opacity: Number(style.opacity),
    }
  })
  const alpha = parseAlpha(dimmer.backgroundColor)
  if (!(alpha > 0) || !(dimmer.opacity > 0)) {
    failures.push(
      `${label}: overlay does not dim the page (backgroundColor=${JSON.stringify(dimmer.backgroundColor)}, opacity=${dimmer.opacity})`,
    )
  }

  await close.waitFor({ state: 'visible', timeout: 10_000 })
  const focusRing = await close.evaluate((el) => {
    el.focus({ focusVisible: true })
    const style = getComputedStyle(el)
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      outlineColor: style.outlineColor,
      boxShadow: style.boxShadow,
    }
  })
  const outlineWidth = Number.parseFloat(focusRing.outlineWidth) || 0
  const hasOutline =
    focusRing.outlineStyle !== 'none' &&
    outlineWidth > 0 &&
    focusRing.outlineColor !== 'rgba(0, 0, 0, 0)' &&
    focusRing.outlineColor !== 'transparent'
  const hasBoxShadow =
    Boolean(focusRing.boxShadow) && focusRing.boxShadow !== 'none'
  if (!hasOutline && !hasBoxShadow) {
    failures.push(
      `${label}: close control has no visible focus-visible indicator when focused ` +
        `(outline=${focusRing.outlineStyle} ${focusRing.outlineWidth} ${focusRing.outlineColor}, boxShadow=${focusRing.boxShadow})`,
    )
  }

  return failures
}

async function ensureStylesCssOnlyBuild() {
  try {
    await access(resolve(STYLES_STATIC_DIR, 'index.json'), constants.R_OK)
    const index = JSON.parse(
      await readFile(resolve(STYLES_STATIC_DIR, 'index.json'), 'utf8'),
    )
    const entries = index.entries ?? index.stories ?? {}
    if (entries[STYLES_STORY_ID]) {
      console.log(`   Reusing existing CSS-only static at ${STYLES_STATIC_DIR}`)
      return
    }
  } catch {
    // Build below.
  }

  console.log('   Building CSS-only Modal Storybook…')
  await runCommand(pnpmCommand, [
    '--filter',
    '@pathable/storybook-contracts',
    'build',
  ])
  await runCommand(pnpmCommand, ['--filter', '@pathableai/styles', 'build'])
  await runCommand(pnpmCommand, [
    '--filter',
    '@pathable/storybook',
    'exec',
    'storybook',
    'build',
    '-c',
    '.storybook-modal-css',
    '-o',
    'storybook-static-modal-css',
  ])
}

async function ensureReactStatic() {
  try {
    await access(resolve(REACT_STATIC_DIR, 'index.json'), constants.R_OK)
  } catch {
    throw new Error(
      `React Storybook static not found at ${REACT_STATIC_DIR}. ` +
        'Run: pnpm --filter @pathable/storybook-react build-storybook',
    )
  }

  const index = JSON.parse(
    await readFile(resolve(REACT_STATIC_DIR, 'index.json'), 'utf8'),
  )
  const entries = index.entries ?? index.stories ?? {}
  if (!entries[REACT_STORY_ID]) {
    throw new Error(
      `React Storybook static is missing required story ID "${REACT_STORY_ID}"`,
    )
  }
}

async function main() {
  console.log('=== Modal open geometry gates ===\n')
  console.log(
    `Centering tolerance: ${CENTER_TOLERANCE_RATIO * 100}% of viewport per axis\n`,
  )

  await ensureStylesCssOnlyBuild()
  await ensureReactStatic()

  const allFailures = []
  let stylesServer
  let reactServer
  let browser

  try {
    stylesServer = await startServer(STYLES_STATIC_DIR, STYLES_PORT)
    reactServer = await startServer(REACT_STATIC_DIR, REACT_PORT)
    browser = await chromium.launch({ headless: true })

    console.log('\n1. Styles Open (CSS-only harness)')
    {
      const page = await browser.newPage()
      try {
        const failures = await assertOpenGeometry(page, {
          label: 'styles',
          storyId: STYLES_STORY_ID,
          baseUrl: `http://127.0.0.1:${STYLES_PORT}`,
        })
        if (failures.length === 0) {
          console.log('   ✓ styles open geometry passed')
        } else {
          for (const f of failures) console.log(`   ✗ ${f}`)
          allFailures.push(...failures)
        }
      } finally {
        await page.close()
      }
    }

    console.log('\n2. React Open (storybook-react static)')
    {
      const page = await browser.newPage()
      try {
        const failures = await assertOpenGeometry(page, {
          label: 'react',
          storyId: REACT_STORY_ID,
          baseUrl: `http://127.0.0.1:${REACT_PORT}`,
        })
        if (failures.length === 0) {
          console.log('   ✓ react open geometry passed')
        } else {
          for (const f of failures) console.log(`   ✗ ${f}`)
          allFailures.push(...failures)
        }
      } finally {
        await page.close()
      }
    }
  } finally {
    if (browser) await browser.close()
    if (stylesServer) await stopServer(stylesServer)
    if (reactServer) await stopServer(reactServer)
  }

  if (allFailures.length > 0) {
    console.error(`\n✗ ${allFailures.length} modal geometry failure(s)`)
    process.exit(1)
  }

  console.log('\n✓ Modal open geometry gates passed')
}

try {
  await main()
} catch (error) {
  console.error(`\nModal open geometry failed: ${error.message}`)
  process.exit(1)
}
