#!/usr/bin/env node

/**
 * Storybook Quality Gates
 *
 * Lightweight automated checks that prevent the most severe Storybook
 * regressions identified in tmp/storybook-brand-accessibility-review.md:
 *
 *   1. Missing expected story IDs in the built Storybook index.json.
 *   2. Horizontal overflow (scrollWidth > clientWidth) for canonical stories.
 *   3. Unnamed interactive controls (no accessible name) in canonical stories.
 *   4. Sub-44px visible action targets on mobile/touch canonical stories.
 *
 * Usage:
 *   node packages/styles/scripts/quality-gates.mjs
 *
 * Requires a built Storybook at apps/storybook/storybook-static/.
 * Serves it on a local port, runs Playwright checks, and exits with a
 * non-zero code on failure.
 *
 * Allowlists are embedded below with comments. Keep them explicit and small.
 */

import { createServer } from 'node:http'
import { readFile, access } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { constants } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

export {
  CANONICAL_STORIES,
  VIEWPORTS,
  visualViewportNames,
  STORY_CHECK_CONCURRENCY,
  mapWithConcurrency,
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const STATIC_DIR = resolve('apps/storybook/storybook-static')
const PORT = parseInt(process.env.QUALITY_GATES_PORT || '6012', 10)
const BASE_URL = `http://127.0.0.1:${PORT}`

/**
 * How many story pages the Playwright checks (here and in test-visual.mjs)
 * load at once. Each check is mostly waiting (networkidle plus a fixed
 * settle delay), so a few pages in parallel cut the run time several-fold.
 * Every check opens its own page and browser context, so they share no state.
 */
const STORY_CHECK_CONCURRENCY = Math.max(
  1,
  parseInt(process.env.STORY_CHECK_CONCURRENCY || '4', 10) || 1,
)

/**
 * Map `items` through async `worker` with at most `limit` in flight, and
 * return the results in input order so the report stays deterministic.
 */
async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length)
  let next = 0
  async function run() {
    while (next < items.length) {
      const index = next++
      results[index] = await worker(items[index], index)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run))
  return results
}

/**
 * Canonical stories to audit at the specified viewport(s).
 *
 * mode: 'desktop' | 'mobile' | 'both'
 *   - desktop: check at 1280px (no touch-target enforcement)
 *   - mobile:  check at 375px (touch-target enforcement applies)
 *   - both:    check at both viewports
 */
const CANONICAL_STORIES = []

/**
 * Expected story IDs in the built Storybook index.json.
 */
const EXPECTED_STORIES = [
  // Canonical stories (checked via Playwright)
  ...CANONICAL_STORIES.map((s) => ({ id: s.id })),
]

const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 812 },
}

/**
 * Viewports at which the visual checks (the `test:visual` smoke test and the
 * pixel visual-regression suites) capture a canonical story. A `both` story is
 * captured at every viewport, including tablet; the DOM audit below checks
 * `both` stories at desktop and mobile only.
 */
function visualViewportNames(mode) {
  return mode === 'both' ? ['desktop', 'tablet', 'mobile'] : [mode]
}

// ---------------------------------------------------------------------------
// Allowlists
//
// Every entry MUST have a comment explaining why the item is allowed.
// Keep these lists small. Remove entries when the underlying issue is fixed.
// ---------------------------------------------------------------------------

/**
 * Horizontal overflow: stories where scrollWidth > clientWidth is a known,
 * pre-existing issue tracked for a future fix wave.
 *
 * Format: { [storyId]: { [viewport]: 'explanation' } }
 */
const HORIZONTAL_OVERFLOW_ALLOWLIST = {}

/**
 * Unnamed controls: visible interactive elements without an accessible name
 * that are known and accepted (e.g. decorative icon buttons that have an
 * accessible name provided by an adjacent element in a real application).
 *
 * Format: { [storyId]: [{ selector: 'css', reason: 'explanation' }] }
 *
 * Keep this empty by default. Only add entries after careful review.
 */
const UNNAMED_CONTROLS_ALLOWLIST = {
  // Add entries only after manual review:
  // { selector: 'button.close-dialog', reason: '...' }
}

/**
 * Sub-44 px touch targets: mobile-viewport stories where controls smaller
 * than 44 px in either dimension are acceptable.
 *
 * Native radio buttons, checkboxes, and file inputs at their natural size
 * are browser-rendered and have well-understood interaction models;
 * WCAG 2.2 Target Size (2.5.8) exempts these.
 *
 * Format: { [storyId]: [{ selector: 'css', reason: 'explanation' }] }
 */
const SMALL_TOUCH_TARGETS_ALLOWLIST = {}

// ---------------------------------------------------------------------------
// Static file server
// ---------------------------------------------------------------------------

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

/**
 * Serve a built Storybook from `staticDir` on 127.0.0.1:`port`. The defaults
 * serve the styles Storybook for the quality gates; the pixel
 * visual-regression harness passes each workspace's own directory and port.
 */
export function startServer({ staticDir = STATIC_DIR, port = PORT } = {}) {
  return new Promise((resolvePromise, reject) => {
    const server = createServer(async (req, res) => {
      // req.url is optional in Node's IncomingMessage — guard against
      // malformed requests that would cause URL parsing to throw.
      if (!req.url) {
        res.writeHead(400)
        res.end('Bad request')
        return
      }
      const url = new URL(req.url, `http://127.0.0.1:${port}`)
      const pathname = url.pathname.slice(1) || 'index.html'
      const filePath = resolve(staticDir, pathname)

      // Prevent directory traversal.  Resolve the absolute path and then
      // enforce that it stays inside staticDir by checking for a trailing
      // path separator (platform-aware), not just a string prefix.
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
        // Only apply SPA fallback for routes without a recognised file
        // extension.  Missing JS/CSS/font assets return 404 so broken
        // builds are not masked by accidentally serving index.html with
        // the wrong Content-Type.
        const ext = extname(filePath).toLowerCase()
        if (ext && MIME_TYPES[ext]) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        try {
          const fallback = resolve(staticDir, 'index.html')
          const data = await readFile(fallback)
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
          })
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

// ---------------------------------------------------------------------------
// Story index check
// ---------------------------------------------------------------------------

export async function checkStoryIndex() {
  const indexPath = resolve(STATIC_DIR, 'index.json')

  let index
  try {
    index = JSON.parse(await readFile(indexPath, 'utf-8'))
  } catch {
    return [
      {
        type: 'missing-index',
        message: `Storybook index.json not found at ${indexPath}. Build the Storybook first: pnpm --filter @pathable/storybook build-storybook`,
      },
    ]
  }

  const entries = index.entries || {}
  const failures = []

  for (const story of EXPECTED_STORIES) {
    if (!entries[story.id]) {
      failures.push({
        type: 'missing-story',
        storyId: story.id,
        message: `Expected story "${story.id}" not found in Storybook index. The story file may be missing, incorrectly named, or excluded from the build.`,
      })
    }
  }

  return failures
}

// ---------------------------------------------------------------------------
// Story-level DOM audits (runs inside Playwright page context)
// ---------------------------------------------------------------------------

/**
 * DOM audit function.  Executed inside the browser via page.evaluate so
 * that CSS selector matching (el.matches()) works on live DOM nodes.
 *
 * All inputs are passed as separate arguments to page.evaluate():
 *   unnamedSelectors – CSS selector strings for the unnamed-controls allowlist
 *   touchSelectors   – CSS selector strings for the touch-target allowlist
 */
const auditScript = function auditStory(opts) {
  const unnamedSelectors = opts.unnamed || []
  const touchSelectors = opts.touch || []
  const viewportName = opts.viewport || 'desktop'
  const failures = []

  const interactiveSelector = [
    'button',
    'a[href]',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="combobox"]',
    '[role="listbox"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[role="switch"]',
    '[role="tab"]',
    '[role="treeitem"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  /** Returns true if el matches any of the given CSS selectors. */
  function matchesAnySelector(el, selectors) {
    if (!selectors || selectors.length === 0) return false
    return selectors.some((sel) => {
      try {
        return el.matches(sel)
      } catch {
        return false
      }
    })
  }

  const controls = Array.from(document.querySelectorAll(interactiveSelector))
    .map((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return null

      const tag = el.tagName.toLowerCase()
      const elClass =
        typeof el.className === 'string'
          ? el.className
          : el.getAttribute('class') || ''

      // Accessible name computation (simplified).
      // Placeholder is NOT an accessible name (per WCAG); it is
      // supplementary hint text only.  Rely on aria-label,
      // aria-labelledby, or associated <label> elements.
      let accessibleName =
        el.getAttribute('aria-label')?.trim() ||
        el.getAttribute('title')?.trim() ||
        ''

      // aria-labelledby references one or more element IDs whose
      // text content forms the accessible name.
      if (!accessibleName) {
        const labelledBy = el.getAttribute('aria-labelledby')
        if (labelledBy) {
          const texts = labelledBy
            .split(/\s+/)
            .map((id) => {
              const ref = document.getElementById(id)
              return ref ? (ref.textContent || '').trim() : ''
            })
            .filter(Boolean)
          if (texts.length > 0) accessibleName = texts.join(' ')
        }
      }

      const textContent = (el.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80)

      // Check for associated <label>
      // Only labelable form elements get their accessible name from
      // a wrapping <label>; buttons, links, and other elements do not.
      const labelableTags = new Set([
        'input',
        'select',
        'textarea',
        'meter',
        'output',
        'progress',
      ])
      let labelElement = null
      if (el.id && labelableTags.has(tag)) {
        labelElement = document.querySelector(
          `label[for="${CSS.escape(el.id)}"]`,
        )
      }
      if (!labelElement && labelableTags.has(tag)) {
        labelElement = el.closest('label')
      }

      const hasLabel = labelElement !== null
      if (!accessibleName && labelElement) {
        accessibleName = (labelElement.textContent || '')
          .replace(/\s+/g, ' ')
          .trim()
      }

      const hasName = Boolean(accessibleName || textContent || hasLabel)

      const style = getComputedStyle(el)
      const isVisuallyClipped =
        style.clipPath !== 'none' ||
        (style.clip !== 'auto' && style.clip !== '')
      const touchRect =
        isVisuallyClipped && labelElement
          ? labelElement.getBoundingClientRect()
          : rect
      const w = Math.round(touchRect.width)
      const h = Math.round(touchRect.height)
      const isActionControl =
        tag === 'button' ||
        tag === 'a' ||
        tag === 'select' ||
        (tag === 'input' &&
          ['checkbox', 'radio'].includes(el.getAttribute('type') || '')) ||
        ['button', 'link', 'menuitem', 'option', 'tab'].includes(
          el.getAttribute('role') || '',
        )

      return {
        tag,
        className: elClass.slice(0, 120),
        accessibleName: accessibleName.slice(0, 80),
        textContent,
        hasName,
        width: w,
        height: h,
        isActionControl,
        // Allowlist checks (using real CSS selector matching)
        unnamedAllowed: hasName
          ? true
          : matchesAnySelector(el, unnamedSelectors),
        touchAllowed: matchesAnySelector(el, touchSelectors),
      }
    })
    .filter(Boolean)

  for (const ctrl of controls) {
    // --- unnamed controls ---
    if (!ctrl.hasName && !ctrl.unnamedAllowed) {
      failures.push({
        type: 'unnamed-control',
        tag: ctrl.tag,
        className: ctrl.className,
        width: ctrl.width,
        height: ctrl.height,
        message:
          `Unnamed interactive control: <${ctrl.tag}${ctrl.className ? ` class="${ctrl.className.slice(0, 60)}"` : ''}> ` +
          `(${ctrl.width}×${ctrl.height} px) has no accessible name. ` +
          'Add aria-label, title, or visible text content.',
      })
    }

    // --- small touch targets (mobile only) ---
    if (viewportName !== 'mobile') continue
    if (ctrl.touchAllowed) continue
    if (ctrl.width >= 44 && ctrl.height >= 44) continue

    // Only flag action controls or elements where BOTH dimensions are <44.
    const isSevere =
      ctrl.isActionControl || (ctrl.width < 44 && ctrl.height < 44)
    if (!isSevere) continue

    const label = ctrl.accessibleName || ctrl.textContent || '(no label)'

    failures.push({
      type: 'small-touch-target',
      tag: ctrl.tag,
      className: ctrl.className,
      width: ctrl.width,
      height: ctrl.height,
      label,
      message: `Small touch target: <${ctrl.tag}> (${ctrl.width}×${ctrl.height} px) is under 44 px minimum. Label: "${label}".`,
    })
  }

  return failures
}

// ---------------------------------------------------------------------------
// Run checks for a single story at a single viewport
// ---------------------------------------------------------------------------

async function checkStory(page, storyId, viewportName) {
  const vp = VIEWPORTS[viewportName]
  await page.setViewportSize(vp)

  const url = `${BASE_URL}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    // Allow fonts and animations to settle
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

  // Detect broken stories: the Storybook-root element should contain
  // rendered story HTML, not just an error display.  The .sb-errordisplay
  // class exists in Storybook's shadow DOM even when stories render fine,
  // so we check for specific failure signals instead.
  const storyRendered = await page.evaluate(() => {
    const root = document.getElementById('storybook-root')
    if (!root) return false

    const html = root.innerHTML || ''
    if (!html.trim()) return false

    // The error display text when a story truly fails to render
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

  // Run DOM audits with allowlists injected into the page context
  // so that CSS selector matching (el.matches()) works correctly.
  const unnamedSelectors = UNNAMED_CONTROLS_ALLOWLIST[storyId] || []
  const unnamedSelectorList = Array.isArray(unnamedSelectors)
    ? unnamedSelectors.map((e) => e.selector)
    : []

  const touchSelectors = SMALL_TOUCH_TARGETS_ALLOWLIST[storyId] || []
  const touchSelectorList = Array.isArray(touchSelectors)
    ? touchSelectors.map((e) => e.selector)
    : []

  const domFailures = await page.evaluate(auditScript, {
    unnamed: unnamedSelectorList,
    touch: touchSelectorList,
    viewport: viewportName,
  })

  // --- horizontal overflow (checked outside page.evaluate so we can
  //     use the HORIZONTAL_OVERFLOW_ALLOWLIST which is structured
  //     differently) ---
  const scrollInfo = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  const failures = []

  if (scrollInfo.scrollWidth > scrollInfo.clientWidth + 2) {
    const overflowAllowed =
      HORIZONTAL_OVERFLOW_ALLOWLIST[storyId]?.[viewportName]
    if (!overflowAllowed) {
      failures.push({
        type: 'horizontal-overflow',
        storyId,
        viewport: viewportName,
        scrollWidth: scrollInfo.scrollWidth,
        clientWidth: scrollInfo.clientWidth,
        excess: scrollInfo.scrollWidth - scrollInfo.clientWidth,
        message: `Horizontal overflow: scrollWidth ${scrollInfo.scrollWidth} > clientWidth ${scrollInfo.clientWidth} (excess: ${scrollInfo.scrollWidth - scrollInfo.clientWidth} px).`,
      })
    }
  }

  // Annotate DOM-originated failures with story/viewport metadata
  for (const f of domFailures) {
    f.storyId = storyId
    f.viewport = viewportName
  }
  failures.push(...domFailures)

  return failures
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(checkMode = 'all') {
  console.log('=== Storybook Quality Gates ===\n')

  // Verify the static build exists
  try {
    await access(STATIC_DIR, constants.R_OK)
  } catch {
    console.error(`Error: Built Storybook not found at ${STATIC_DIR}`)
    console.error('Run: pnpm --filter @pathable/storybook build-storybook')
    process.exit(1)
  }

  const allFailures = []

  // 1. Check story index (for 'all' and 'story-index' modes)
  if (checkMode === 'all' || checkMode === 'story-index') {
    console.log('1. Story index check')
    const indexFailures = await checkStoryIndex()
    if (indexFailures.length > 0) {
      for (const f of indexFailures) {
        console.log(`   ✗ ${f.message}`)
      }

      const hasCriticalIndexFailure = indexFailures.some(
        (f) => f.type === 'missing-index',
      )
      if (hasCriticalIndexFailure) {
        console.error('\n✗ Critical index failure — aborting')
        process.exit(1)
      }
      allFailures.push(...indexFailures)
    } else {
      console.log('   ✓ All expected stories present in index')
    }
  }

  // If story-index-only mode, stop here
  if (checkMode === 'story-index') {
    if (allFailures.length === 0) {
      console.log('\n✓ Story index check passed')
      process.exit(0)
    }
    console.log(`\n✗ ${allFailures.length} story index failure(s)`)
    process.exit(1)
  }

  // 2. Start local server (for 'all' and 'dom-audit')
  console.log(`\n2. Starting local server on port ${PORT}…`)
  const server = await startServer()
  console.log(`   Server ready at ${BASE_URL}`)

  let browser
  let storiesChecked = 0
  let storiesPassed = 0
  const allowedOverflows = []

  try {
    // 3. Launch Playwright
    browser = await chromium.launch({ headless: true })

    // 4. Check each canonical story
    console.log('\n3. Canonical story checks')
    const checks = CANONICAL_STORIES.flatMap((story) =>
      (story.mode === 'both' ? ['desktop', 'mobile'] : [story.mode]).map(
        (vpName) => ({ story, vpName }),
      ),
    )
    const results = await mapWithConcurrency(
      checks,
      STORY_CHECK_CONCURRENCY,
      async ({ story, vpName }) => {
        const page = await browser.newPage()
        try {
          if (story.id.endsWith('--forced-colors')) {
            await page.emulateMedia({ forcedColors: 'active' })
          }
          return await checkStory(page, story.id, vpName)
        } finally {
          await page.close()
        }
      },
    )

    checks.forEach(({ story, vpName }, index) => {
      const vp = VIEWPORTS[vpName]
      const failures = results[index]
      storiesChecked++

      // Log allowlisted overflows for visibility
      const overflowNote = HORIZONTAL_OVERFLOW_ALLOWLIST[story.id]?.[vpName]
      if (
        overflowNote &&
        !failures.some((f) => f.type === 'horizontal-overflow')
      ) {
        allowedOverflows.push(
          `   ~ ${story.id} @ ${vpName} (${vp.width} px): allowlisted overflow`,
        )
      }

      if (failures.length === 0) {
        storiesPassed++
      } else {
        console.log(
          `   ✗ ${story.id} @ ${vpName} (${vp.width} px): ${failures.length} failure(s)`,
        )
        for (const f of failures) {
          console.log(`      [${f.type}] ${f.message}`)
        }
        allFailures.push(...failures)
      }
    })

    // Print allowlisted overflows (informational)
    if (allowedOverflows.length > 0) {
      console.log('\n   Allowlisted overflows (informational):')
      for (const msg of allowedOverflows) {
        console.log(msg)
      }
    }
  } finally {
    if (browser) await browser.close()
    server.close()
  }

  // 5. Report
  // Count all tracked failures (including missing-index).
  const actionFailures = allFailures.filter((f) => f.type !== 'missing-index')
  const criticalFailures = allFailures.filter((f) => f.type === 'missing-index')

  console.log('\n=== Results ===')
  console.log(`   Stories checked: ${storiesChecked}`)
  console.log(`   Passed:          ${storiesPassed}`)
  console.log(`   Failed:          ${storiesChecked - storiesPassed}`)

  if (actionFailures.length === 0 && criticalFailures.length === 0) {
    console.log('\n✓ All quality gates passed')
    process.exit(0)
  }

  const total = actionFailures.length + criticalFailures.length
  console.log(`\n✗ ${total} total failure(s)`)

  // Group by type for summary
  const byType = {}
  for (const f of actionFailures) {
    if (!byType[f.type]) byType[f.type] = []
    byType[f.type].push(f)
  }
  for (const f of criticalFailures) {
    if (!byType[f.type]) byType[f.type] = []
    byType[f.type].push(f)
  }

  console.log('\n   Failure breakdown:')
  for (const [type, items] of Object.entries(byType)) {
    console.log(`   ${type}: ${items.length}`)
  }

  process.exit(1)
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

const isMainModule =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  const args = process.argv.slice(2)
  const checkArg = args.find((a) => a.startsWith('--check='))
  const checkMode = checkArg ? checkArg.split('=')[1] : 'all'

  if (!['all', 'story-index', 'dom-audit'].includes(checkMode)) {
    console.error(
      `Unknown --check value: "${checkMode}". Supported: all, story-index, dom-audit`,
    )
    process.exit(1)
  }

  main(checkMode).catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
}
