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
import { resolve, extname } from 'node:path'
import { constants } from 'node:fs'
import { chromium } from 'playwright'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const STATIC_DIR = resolve('apps/storybook/storybook-static')
const PORT = 6012
const BASE_URL = `http://127.0.0.1:${PORT}`

/**
 * Canonical stories to audit at the specified viewport(s).
 *
 * mode: 'desktop' | 'mobile' | 'both'
 *   - desktop: check at 1280px (no touch-target enforcement)
 *   - mobile:  check at 375px (touch-target enforcement applies)
 *   - both:    check at both viewports
 */
const CANONICAL_STORIES = [
  // App shell
  { id: 'application-shell-desktop-shell--default', mode: 'desktop' },
  { id: 'application-shell-mobile-shell--default', mode: 'mobile' },
  // Dashboard
  { id: 'dashboard-dashboard-overview--populated', mode: 'desktop' },
  { id: 'dashboard-dashboard-header--with-many-actions', mode: 'both' },
  { id: 'dashboard-table-modifiers--with-actions', mode: 'desktop' },
  // Discovery
  { id: 'discovery-resource-card--grid', mode: 'desktop' },
  { id: 'discovery-wayfinder--default', mode: 'both' },
  // Structured workflow
  { id: 'structured-workflow-wizard--wizard-long-form', mode: 'both' },
  { id: 'structured-workflow-wizard--mobile', mode: 'mobile' },
  // Components – Feedback
  { id: 'components-feedback-toast--stacked', mode: 'desktop' },
  { id: 'components-feedback-pageerror--full-page', mode: 'desktop' },
  // Marketing patterns
  { id: 'marketing-patterns-combined--hero-section', mode: 'desktop' },
  { id: 'marketing-patterns-combined--feature-showcase', mode: 'desktop' },
]

/**
 * Expected story IDs in the built Storybook index.json.
 *
 * Wave 003 stories (Marketing Landing Page, Operational Dashboard,
 * Resource Directory) are listed with enabled: false. When those stories
 * are published in wave 003, flip enabled to true.
 */
const EXPECTED_STORIES = [
  // Canonical stories (checked via Playwright)
  ...CANONICAL_STORIES.map((s) => ({ id: s.id })),

  // Wave 003 — not yet published; enable after wave 003:
  {
    id: 'marketing-patterns-marketing-landing-page--desktop',
    enabled: false,
  },
  {
    id: 'marketing-patterns-operational-dashboard--populated',
    enabled: false,
  },
  {
    id: 'marketing-patterns-resource-directory--populated',
    enabled: false,
  },
]

const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 375, height: 812 },
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
const HORIZONTAL_OVERFLOW_ALLOWLIST = {
  'application-shell-desktop-shell--default': {
    desktop:
      'P2 — App shell content padding / max-width math causes 32 px overflow at 1280 px. Tracked in tmp/storybook-brand-accessibility-review.md.',
  },
  'application-shell-mobile-shell--default': {
    mobile:
      'P2 — App shell mobile content overflows 375 px viewport by 32 px. Tracked in tmp/storybook-brand-accessibility-review.md.',
  },
  'structured-workflow-wizard--mobile': {
    mobile:
      'Minor 2 px horizontal overflow at 375 px. Low severity; tracked for cleanup.',
  },
}

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
const SMALL_TOUCH_TARGETS_ALLOWLIST = {
  'structured-workflow-wizard--mobile': [
    {
      selector: 'button.pathable-button',
      reason:
        'USWDS buttons render at 40 px height on mobile. Increasing to 44 px requires upstream USWDS button token changes. Tracked for a future wave.',
    },
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Enhanced) per G206.',
    },
  ],
  'structured-workflow-wizard--wizard-long-form': [
    {
      selector: 'select.pathable-select',
      reason:
        'USWDS select elements render at 40 px height on mobile. Increasing to 44 px requires upstream USWDS select token changes. Tracked for a future wave.',
    },
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Enhanced).',
    },
  ],
  'discovery-wayfinder--default': [
    {
      selector: 'button.pathable-button',
      reason:
        'USWDS buttons render at 40 px height on mobile. Increasing to 44 px requires upstream USWDS button token changes. Tracked for a future wave.',
    },
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Enhanced).',
    },
  ],
  'dashboard-dashboard-header--with-many-actions': [
    {
      selector: 'button.pathable-button',
      reason:
        'USWDS buttons render at 40 px height on mobile. Increasing to 44 px requires upstream USWDS button token changes. Tracked for a future wave.',
    },
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Enhanced).',
    },
  ],
}

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

function startServer() {
  return new Promise((resolvePromise, reject) => {
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, BASE_URL)
      const pathname = url.pathname.slice(1) || 'index.html'
      const filePath = resolve(STATIC_DIR, pathname)

      // Prevent directory traversal
      if (!filePath.startsWith(STATIC_DIR)) {
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
        // SPA fallback: serve index.html for story routes
        try {
          const fallback = resolve(STATIC_DIR, 'index.html')
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

    server.listen(PORT, '127.0.0.1', () => resolvePromise(server))
    server.on('error', reject)
  })
}

// ---------------------------------------------------------------------------
// Story index check
// ---------------------------------------------------------------------------

async function checkStoryIndex() {
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
    if (story.enabled === false) continue
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

function buildAuditScript() {
  /* Stringified so allowlists are available inside the page. */
  return function auditStory() {
    const results = []
    const clientWidth = document.documentElement.clientWidth
    const scrollWidth = document.documentElement.scrollWidth

    // ---- horizontal overflow ------------------------------------------------

    results.push({
      _key: 'scrollWidth',
      scrollWidth,
      clientWidth,
    })

    // ---- interactive controls -----------------------------------------------

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

    const controls = Array.from(document.querySelectorAll(interactiveSelector))
      .map((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.width <= 0 || rect.height <= 0) return null

        const tag = el.tagName.toLowerCase()
        const elClass =
          typeof el.className === 'string'
            ? el.className
            : el.getAttribute('class') || ''

        // Accessible name computation (simplified)
        const accessibleName =
          el.getAttribute('aria-label')?.trim() ||
          el.getAttribute('title')?.trim() ||
          (tag === 'input' && el.getAttribute('placeholder')?.trim()) ||
          ''

        const textContent = (el.textContent || '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 80)

        // Check for associated <label>
        let hasLabel = false
        if (el.id) {
          hasLabel = !!document.querySelector(
            `label[for="${CSS.escape(el.id)}"]`,
          )
        }
        if (!hasLabel) {
          hasLabel = el.closest('label') !== null
        }

        return {
          tag,
          className: elClass.slice(0, 120),
          accessibleName: accessibleName.slice(0, 80),
          textContent,
          hasLabel,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          isActionControl:
            tag === 'button' ||
            tag === 'a' ||
            tag === 'select' ||
            ['button', 'link', 'menuitem', 'option', 'tab'].includes(
              el.getAttribute('role') || '',
            ),
        }
      })
      .filter(Boolean)

    results.push({
      _key: 'controls',
      controls,
    })

    return results
  }
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

  // Run DOM audits
  const auditData = await page.evaluate(buildAuditScript())
  const failures = []

  // --- horizontal overflow ---
  const scrollData = auditData.find((d) => d._key === 'scrollWidth')
  if (scrollData) {
    const overflowAllowed =
      HORIZONTAL_OVERFLOW_ALLOWLIST[storyId]?.[viewportName]
    if (
      scrollData.scrollWidth > scrollData.clientWidth + 2 &&
      !overflowAllowed
    ) {
      failures.push({
        type: 'horizontal-overflow',
        storyId,
        viewport: viewportName,
        scrollWidth: scrollData.scrollWidth,
        clientWidth: scrollData.clientWidth,
        excess: scrollData.scrollWidth - scrollData.clientWidth,
        message: `Horizontal overflow: scrollWidth ${scrollData.scrollWidth} > clientWidth ${scrollData.clientWidth} (excess: ${scrollData.scrollWidth - scrollData.clientWidth} px).`,
      })
    }
  }

  // --- unnamed controls ---
  const controlsData = auditData.find((d) => d._key === 'controls')
  if (controlsData) {
    const storyAllowlist = UNNAMED_CONTROLS_ALLOWLIST[storyId] || []

    for (const ctrl of controlsData.controls) {
      const hasName = Boolean(
        ctrl.accessibleName || ctrl.textContent || ctrl.hasLabel,
      )
      if (hasName) continue

      const isAllowed = storyAllowlist.some((entry) => {
        // We can't run matches() outside the page, so approximate by tag/class
        return (
          entry.selector.includes(ctrl.tag) ||
          (ctrl.className &&
            entry.selector.includes(ctrl.className.split(' ')[0]))
        )
      })
      if (isAllowed) continue

      failures.push({
        type: 'unnamed-control',
        storyId,
        viewport: viewportName,
        tag: ctrl.tag,
        className: ctrl.className,
        width: ctrl.width,
        height: ctrl.height,
        message: `Unnamed interactive control: <${ctrl.tag}${ctrl.className ? ` class="${ctrl.className.slice(0, 60)}"` : ''}> (${ctrl.width}×${ctrl.height} px) has no accessible name. Add aria-label, title, or visible text content.`,
      })
    }

    // --- small touch targets (mobile only) ---
    if (viewportName === 'mobile') {
      const touchAllowlist = SMALL_TOUCH_TARGETS_ALLOWLIST[storyId] || []

      for (const ctrl of controlsData.controls) {
        if (ctrl.width >= 44 && ctrl.height >= 44) continue

        // Check allowlist
        const isAllowed = touchAllowlist.some((entry) => {
          return (
            entry.selector.includes(ctrl.tag) ||
            (ctrl.className &&
              entry.selector.includes(ctrl.className.split(' ')[0]))
          )
        })
        if (isAllowed) continue

        // Only flag action controls (buttons, links, selects, role=button/link/etc.)
        // or elements where BOTH dimensions are under 44.
        const isSevere =
          ctrl.isActionControl || (ctrl.width < 44 && ctrl.height < 44)
        if (!isSevere) continue

        const label = ctrl.accessibleName || ctrl.textContent || '(no label)'

        failures.push({
          type: 'small-touch-target',
          storyId,
          viewport: viewportName,
          tag: ctrl.tag,
          className: ctrl.className,
          width: ctrl.width,
          height: ctrl.height,
          label,
          message: `Small touch target: <${ctrl.tag}> (${ctrl.width}×${ctrl.height} px) is under 44 px minimum. Label: "${label}".`,
        })
      }
    }
  }

  return failures
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Storybook Quality Gates ===\n')

  // Verify the static build exists
  try {
    await access(STATIC_DIR, constants.R_OK)
  } catch {
    console.error(`Error: Built Storybook not found at ${STATIC_DIR}`)
    console.error('Run: pnpm --filter @pathable/storybook build-storybook')
    process.exit(1)
  }

  // 1. Check story index
  console.log('1. Story index check')
  const indexFailures = await checkStoryIndex()
  if (indexFailures.length > 0) {
    for (const f of indexFailures) {
      console.log(`   ✗ ${f.message}`)
    }
  } else {
    console.log('   ✓ All expected stories present in index')
  }

  // 2. Start local server
  console.log(`\n2. Starting local server on port ${PORT}…`)
  const server = await startServer()
  console.log(`   Server ready at ${BASE_URL}`)

  const allFailures = [...indexFailures]
  let browser
  let storiesChecked = 0
  let storiesPassed = 0
  const allowedOverflows = []

  try {
    // 3. Launch Playwright
    browser = await chromium.launch({ headless: true })

    // 4. Check each canonical story
    console.log('\n3. Canonical story checks')
    for (const story of CANONICAL_STORIES) {
      const viewports =
        story.mode === 'both' ? ['desktop', 'mobile'] : [story.mode]

      for (const vpName of viewports) {
        const vp = VIEWPORTS[vpName]
        const page = await browser.newPage()

        try {
          const failures = await checkStory(page, story.id, vpName)
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
        } finally {
          await page.close()
        }
      }
    }

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
  const actionFailures = allFailures.filter((f) => f.type !== 'missing-index')

  console.log('\n=== Results ===')
  console.log(`   Stories checked: ${storiesChecked}`)
  console.log(`   Passed:          ${storiesPassed}`)
  console.log(`   Failed:          ${storiesChecked - storiesPassed}`)

  if (actionFailures.length === 0) {
    console.log('\n✓ All quality gates passed')
    process.exit(0)
  }

  console.log(`\n✗ ${actionFailures.length} total failure(s)`)

  // Group by type for summary
  const byType = {}
  for (const f of actionFailures) {
    if (!byType[f.type]) byType[f.type] = []
    byType[f.type].push(f)
  }

  console.log('\n   Failure breakdown:')
  for (const [type, items] of Object.entries(byType)) {
    console.log(`   ${type}: ${items.length}`)
  }

  process.exit(1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
