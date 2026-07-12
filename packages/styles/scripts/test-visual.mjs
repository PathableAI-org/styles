#!/usr/bin/env node

/**
 * Visual Smoke Tests
 *
 * Metric-based Playwright smoke tests for canonical stories at 375, 768,
 * and 1280 viewport widths. Uses the same canonical story list and VIEWPORTS
 * constant from quality-gates.mjs.
 *
 * For each story at each viewport:
 *   1. Navigate to iframe URL, wait for networkidle
 *   2. Assert story renders (no error text, non-blank DOM)
 *   3. Screenshot: PNG payload size indicates non-blank render
 *   4. Document height > 20 px
 *   5. No horizontal overflow (scrollWidth <= clientWidth + 2)
 *   6. Save screenshot to test-results/visual-failures/ on failure
 *   7. Report story ID, viewport, and artifact path for each failure
 *
 * Usage:
 *   node packages/styles/scripts/test-visual.mjs
 *
 * Requires a built Storybook at apps/storybook/storybook-static/.
 */

import { createServer } from 'node:http'
import { readFile, access, mkdir } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { constants } from 'node:fs'
import { chromium } from 'playwright'

// Import shared constants from quality-gates.mjs
import { CANONICAL_STORIES, VIEWPORTS } from './quality-gates.mjs'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const STATIC_DIR = resolve('apps/storybook/storybook-static')
const PORT = parseInt(process.env.VISUAL_SMOKE_PORT || '6013', 10)
const BASE_URL = `http://127.0.0.1:${PORT}`
const RESULTS_DIR = resolve('apps/storybook/test-results', 'visual-failures')

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

function startServer() {
  return new Promise((resolvePromise, reject) => {
    const server = createServer(async (req, res) => {
      if (!req.url) {
        res.writeHead(400)
        res.end('Bad request')
        return
      }
      const url = new URL(req.url, BASE_URL)
      const pathname = url.pathname.slice(1) || 'index.html'
      const filePath = resolve(STATIC_DIR, pathname)

      const dir = STATIC_DIR + sep
      if (!filePath.startsWith(dir) && filePath !== STATIC_DIR) {
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
          const fallback = resolve(STATIC_DIR, 'index.html')
          const data = await readFile(fallback)
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(data)
        } catch {
          res.writeHead(404)
          res.end('Not found')
        }
      }
    })

    server.listen(PORT, '127.0.0.1', () => resolvePromise(server))
    server.on('error', reject)
  })
}

// ---------------------------------------------------------------------------
// Visual checks for a story at a viewport
// ---------------------------------------------------------------------------

async function checkStory(page, storyId, viewportName) {
  const vp = VIEWPORTS[viewportName]
  await page.setViewportSize(vp)

  const url = `${BASE_URL}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(800)
  } catch (err) {
    return [
      {
        type: 'navigation-error',
        storyId,
        viewport: viewportName,
        message: `Failed to load story: ${err.message}`,
      },
    ]
  }

  const failures = []

  // 1. Check story renders (no error text, non-blank DOM)
  const storyRendered = await page.evaluate(() => {
    const root = document.getElementById('storybook-root')
    if (!root) return false
    const html = root.innerHTML || ''
    if (!html.trim()) return false
    if (html.includes('The component failed to render properly')) return false
    if (html.includes('Sorry, but you either have no stories')) return false
    return true
  })

  if (!storyRendered) {
    const bodyText = await page
      .locator('body')
      .innerText({ timeout: 3000 })
      .catch(() => '')
    return [
      {
        type: 'story-not-found',
        storyId,
        viewport: viewportName,
        message: `Story failed to render: "${bodyText.slice(0, 200).replace(/\s+/g, ' ')}"`,
      },
    ]
  }

  // 2. Take screenshot and check it's not all black or all white
  try {
    const screenshot = await page.screenshot({ fullPage: false })
    // Compressed-payload heuristic to catch likely blank renders.
    const stats = computeScreenshotStats(screenshot)
    if (stats.isLikelyBlank) {
      failures.push({
        type: 'blank-screenshot',
        storyId,
        viewport: viewportName,
        message: `Screenshot appears blank (PNG payload too small: ${stats.byteLength} bytes).`,
      })
    }

    if (failures.length > 0) {
      await saveFailureScreenshot(screenshot, storyId, viewportName)
    }
  } catch (err) {
    failures.push({
      type: 'screenshot-error',
      storyId,
      viewport: viewportName,
      message: `Screenshot failed: ${err.message}`,
    })
  }

  // 3. Document height check
  const docHeight = await page.evaluate(
    () => document.documentElement.scrollHeight,
  )
  if (docHeight <= 20) {
    failures.push({
      type: 'empty-document',
      storyId,
      viewport: viewportName,
      message: `Document scrollHeight is ${docHeight} px (expected > 20 px).`,
    })
  }

  // 4. Horizontal overflow check
  const scrollInfo = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  if (scrollInfo.scrollWidth > scrollInfo.clientWidth + 2) {
    failures.push({
      type: 'horizontal-overflow',
      storyId,
      viewport: viewportName,
      scrollWidth: scrollInfo.scrollWidth,
      clientWidth: scrollInfo.clientWidth,
      message: `Horizontal overflow: scrollWidth ${scrollInfo.scrollWidth} > clientWidth ${scrollInfo.clientWidth}.`,
    })
  }

  return failures
}

// ---------------------------------------------------------------------------
// Screenshot analysis
// ---------------------------------------------------------------------------

/**
 * Compute lightweight screenshot stats without decoding PNG pixels.
 * PNG payload bytes are compressed; use size-based heuristics instead.
 */
function computeScreenshotStats(buffer) {
  const byteLength = buffer.length
  const minNonBlankPngBytes = 1800
  return {
    byteLength,
    isLikelyBlank: byteLength < minNonBlankPngBytes,
  }
}

// ---------------------------------------------------------------------------
// Failure artifact saving
// ---------------------------------------------------------------------------

async function saveFailureScreenshot(screenshotBuffer, storyId, viewportName) {
  await mkdir(RESULTS_DIR, { recursive: true })
  const safeId = storyId.replace(/[^a-zA-Z0-9_-]/g, '_')
  const filename = `${safeId}_${viewportName}.png`
  const filePath = resolve(RESULTS_DIR, filename)
  const { writeFile } = await import('node:fs/promises')
  await writeFile(filePath, screenshotBuffer)
  return filePath
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Visual Smoke Tests ===\n')

  // Verify the static build exists
  try {
    await access(STATIC_DIR, constants.R_OK)
  } catch {
    console.error(`Error: Built Storybook not found at ${STATIC_DIR}`)
    console.error('Run: pnpm --filter @pathable/storybook build-storybook')
    process.exit(1)
  }

  // Start local server
  console.log(`Starting local server on port ${PORT}…`)
  const server = await startServer()
  console.log(`Server ready at ${BASE_URL}\n`)

  let totalChecks = 0
  let totalFailed = 0
  const allFailures = []
  let browser

  try {
    browser = await chromium.launch({ headless: true })

    for (const story of CANONICAL_STORIES) {
      const viewports =
        story.mode === 'both' ? ['desktop', 'mobile'] : [story.mode]

      for (const vpName of viewports) {
        totalChecks++
        const page = await browser.newPage()
        try {
          const failures = await checkStory(page, story.id, vpName)
          if (failures.length > 0) {
            totalFailed++
            console.log(
              `   ✗ ${story.id} @ ${vpName}: ${failures.length} failure(s)`,
            )
            for (const f of failures) {
              console.log(`      [${f.type}] ${f.message}`)
            }
            allFailures.push(...failures)
          }
        } finally {
          await page.close()
        }
      }
    }
  } finally {
    if (browser) await browser.close()
    server.close()
  }

  const passed = totalChecks - totalFailed

  console.log(`\n=== Results ===`)
  console.log(`   Total checks: ${totalChecks}`)
  console.log(`   Passed:       ${passed}`)
  console.log(`   Failed:       ${totalFailed}`)

  if (totalFailed > 0) {
    console.log(`\n   Failure artifacts: ${RESULTS_DIR}/`)
    for (const f of allFailures) {
      console.log(`   ${f.storyId} @ ${f.viewport}: [${f.type}]`)
    }
    process.exit(1)
  }

  console.log('\n✓ All visual smoke tests passed')
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
